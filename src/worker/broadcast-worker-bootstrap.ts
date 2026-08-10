import type { PrismaClient } from '@prisma/client';
import type { AwilixContainer } from 'awilix';
import { Worker } from 'bullmq';
import type { Queue } from 'bullmq';
import type { Logger } from 'pino';

import { BroadcastAutomationService } from '../features/broadcast/domain/broadcast-automation.service.js';
import { IntegrationCredentialService } from '../features/broadcast/domain/integration-credential.service.js';
import {
  BROADCAST_QUEUE_NAME,
  BROADCAST_RUN_JOB_NAME,
  type BroadcastAutomationJobData,
} from '../features/broadcast/infra/broadcast-queue.js';
import {
  AutomationRulePrismaRepository,
  BroadcastLogPrismaRepository,
  IntegrationCredentialPrismaRepository,
} from '../features/broadcast/infra/broadcast.prisma-repository.js';

import { processBroadcastAutomationJob } from './broadcast-job-processor.js';

export async function startBroadcastWorker(
  container: AwilixContainer,
  logger: Logger,
): Promise<Worker<BroadcastAutomationJobData>> {
  const prisma = container.resolve<PrismaClient>('prismaClient');
  const connection = container.resolve('bullmqClient');
  const queue = container.resolve<Queue<BroadcastAutomationJobData>>('broadcastQueue');

  const ruleRepo = new AutomationRulePrismaRepository(prisma);
  const logRepo = new BroadcastLogPrismaRepository(prisma);
  const credRepo = new IntegrationCredentialPrismaRepository(prisma);
  const credService = new IntegrationCredentialService(credRepo);
  const automation = new BroadcastAutomationService(ruleRepo, logRepo, credService, queue);

  const activeRules = await ruleRepo.findAll();
  for (const rule of activeRules.filter((r) => r.isActive)) {
    try {
      await automation.syncRepeatableJob(rule);
      logger.info({ ruleId: rule.id }, 'Synced broadcast repeatable job on boot');
    } catch (err) {
      logger.error({ err, ruleId: rule.id }, 'Failed to sync broadcast rule on boot');
    }
  }

  const worker = new Worker<BroadcastAutomationJobData>(
    BROADCAST_QUEUE_NAME,
    async (job) => {
      if (job.name !== BROADCAST_RUN_JOB_NAME) {
        logger.warn({ name: job.name }, 'Unknown broadcast job name');
      }
      await processBroadcastAutomationJob(job, {
        ruleRepository: ruleRepo,
        automation,
        logger,
      });
    },
    { connection, concurrency: 1 },
  );

  worker.on('failed', (job, err) => {
    logger.error({ err, jobId: job?.id, ruleId: job?.data.ruleId }, 'Broadcast job failed');
  });

  logger.info('Broadcast automation worker started');
  return worker;
}
