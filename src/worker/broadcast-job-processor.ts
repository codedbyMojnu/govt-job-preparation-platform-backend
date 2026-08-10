import type { Job } from 'bullmq';
import type { Logger } from 'pino';

import type { BroadcastAutomationService } from '../features/broadcast/domain/broadcast-automation.service.js';
import type { AutomationRuleRepository } from '../features/broadcast/domain/repository.contract.js';
import type { BroadcastAutomationJobData } from '../features/broadcast/infra/broadcast-queue.js';

export async function processBroadcastAutomationJob(
  job: Job<BroadcastAutomationJobData>,
  deps: {
    ruleRepository: AutomationRuleRepository;
    automation: BroadcastAutomationService;
    logger: Logger;
  },
): Promise<void> {
  const { ruleId } = job.data;
  const rule = await deps.ruleRepository.findById(ruleId);
  if (!rule) {
    deps.logger.warn({ ruleId }, 'Broadcast rule not found — skipping job');
    return;
  }
  if (!rule.isActive) {
    deps.logger.info({ ruleId }, 'Broadcast rule inactive — skipping');
    return;
  }

  deps.logger.info({ ruleId, jobId: job.id }, 'Running broadcast automation rule');
  const result = await deps.automation.executeRule(rule);
  deps.logger.info({ ruleId, ...result }, 'Broadcast automation rule finished');
}
