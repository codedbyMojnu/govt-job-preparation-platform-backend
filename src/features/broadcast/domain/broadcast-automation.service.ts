import type { Queue } from 'bullmq';

import { NotFoundError } from '../../../shared/errors/http-errors.js';

import { BROADCAST_RUN_JOB_NAME } from '../infra/broadcast-queue.js';

import type {
  AutomationRuleRepository,
  BroadcastLogRepository,
} from './repository.contract.js';
import {
  buildFacebookQuestionCaption,
  buildTelegramQuestionCaption,
  sendQuestionToPlatform,
  sleep,
} from './social-dispatch.js';
import type { IntegrationCredentialService } from './integration-credential.service.js';
import type { AutomationRuleDto, BroadcastPlatformName } from './types.js';

export class BroadcastAutomationService {
  constructor(
    private readonly ruleRepository: AutomationRuleRepository,
    private readonly logRepository: BroadcastLogRepository,
    private readonly credentialService: IntegrationCredentialService,
    private readonly queue: Queue<{ ruleId: string }>,
  ) {}

  async syncRepeatableJob(rule: AutomationRuleDto): Promise<void> {
    await this.removeRepeatableJob(rule);

    if (!rule.isActive) return;

    const everyMs = rule.intervalMinutes * 60 * 1000;
    const job = await this.queue.add(
      BROADCAST_RUN_JOB_NAME,
      { ruleId: rule.id },
      {
        repeat: { every: everyMs },
        jobId: `broadcast-rule-${rule.id}`,
      },
    );

    const repeatKey = job.repeatJobKey ?? null;
    await this.ruleRepository.updateMeta(rule.id, { repeatJobKey: repeatKey });
  }

  async removeRepeatableJob(rule: AutomationRuleDto): Promise<void> {
    if (rule.repeatJobKey) {
      try {
        await this.queue.removeRepeatableByKey(rule.repeatJobKey);
      } catch {
        // stale key — ignore
      }
    }

    const repeatables = await this.queue.getRepeatableJobs();
    for (const entry of repeatables) {
      if (entry.id === `broadcast-rule-${rule.id}` || entry.name === 'run-rule') {
        if (entry.key.includes(rule.id)) {
          await this.queue.removeRepeatableByKey(entry.key);
        }
      }
    }

    await this.ruleRepository.updateMeta(rule.id, { repeatJobKey: null });
  }

  async runRuleNow(ruleId: string): Promise<{ sent: number; failed: number }> {
    const rule = await this.ruleRepository.findById(ruleId);
    if (!rule) throw new NotFoundError('Automation rule not found');
    return this.executeRule(rule, { force: true });
  }

  async executeRule(
    rule: AutomationRuleDto,
    options?: { force?: boolean },
  ): Promise<{ sent: number; failed: number }> {
    if (!rule.isActive && !options?.force) {
      return { sent: 0, failed: 0 };
    }

    const questions = await this.ruleRepository.findRandomQuestions(rule.questionCount);
    if (questions.length === 0) {
      throw new Error('No questions available for broadcast');
    }

    const configs = await this.credentialService.resolveActiveConfigsGrouped();
    let sent = 0;
    let failed = 0;

    for (const question of questions) {
      for (const platform of rule.platforms) {
        await sleep(2500);

        const platformConfigs = configs[platform as BroadcastPlatformName];
        if (!platformConfigs?.length) {
          failed++;
          await this.logRepository.create({
            contentType: 'QUESTION',
            platforms: [platform as BroadcastPlatformName],
            questionIds: [question.id],
            contentText: buildTelegramQuestionCaption(question).slice(0, 500),
            status: 'FAILED',
            errorMessage: `No active credential for ${platform}`,
            createdBy: rule.createdBy,
          });
          continue;
        }

        const log = await this.logRepository.create({
          contentType: 'QUESTION',
          platforms: [platform as BroadcastPlatformName],
          questionIds: [question.id],
          contentText:
            platform === 'FACEBOOK_PAGE'
              ? buildFacebookQuestionCaption(question).slice(0, 500)
              : buildTelegramQuestionCaption(question).slice(0, 500),
          status: 'SENDING',
          createdBy: rule.createdBy,
        });

        try {
          const externalId = await sendQuestionToPlatform(
            platform as BroadcastPlatformName,
            platformConfigs[0]!,
            question,
          );
          await this.logRepository.update(log.id, {
            status: 'SENT',
            sentAt: new Date(),
            errorMessage: null,
          });
          sent++;
          void externalId;
        } catch (err) {
          failed++;
          await this.logRepository.update(log.id, {
            status: 'FAILED',
            errorMessage: err instanceof Error ? err.message : String(err),
          });
        }
      }
    }

    await this.ruleRepository.updateMeta(rule.id, { lastRunAt: new Date() });
    return { sent, failed };
  }
}
