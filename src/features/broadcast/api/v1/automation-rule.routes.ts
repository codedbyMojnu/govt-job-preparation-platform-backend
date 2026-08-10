import type { PrismaClient } from '@prisma/client';
import type { AwilixContainer } from 'awilix';
import type { Queue } from 'bullmq';
import { Router } from 'express';

import { authenticate, authorize } from '../../../../infrastructure/middleware/authenticate.js';
import { validate } from '../../../../infrastructure/middleware/validate.js';
import { asyncHandler } from '../../../../shared/utils/async-handler.js';
import {
  createAutomationRuleSchema,
  updateAutomationRuleSchema,
} from '../automation-validation.js';

import { AutomationRuleController } from './automation-rule.controller.js';
import { AutomationRuleService } from '../../domain/automation-rule.service.js';
import { BroadcastAutomationService } from '../../domain/broadcast-automation.service.js';
import { IntegrationCredentialService } from '../../domain/integration-credential.service.js';
import type { BroadcastAutomationJobData } from '../../infra/broadcast-queue.js';
import {
  AutomationRulePrismaRepository,
  BroadcastLogPrismaRepository,
  IntegrationCredentialPrismaRepository,
} from '../../infra/broadcast.prisma-repository.js';

export function createAutomationRuleRoutes(container: AwilixContainer): Router {
  const router = Router();

  const prisma = container.resolve<PrismaClient>('prismaClient');
  const queue = container.resolve<Queue<BroadcastAutomationJobData>>('broadcastQueue');

  const ruleRepo = new AutomationRulePrismaRepository(prisma);
  const logRepo = new BroadcastLogPrismaRepository(prisma);
  const credRepo = new IntegrationCredentialPrismaRepository(prisma);
  const credService = new IntegrationCredentialService(credRepo);
  const automation = new BroadcastAutomationService(ruleRepo, logRepo, credService, queue);
  const service = new AutomationRuleService(ruleRepo, automation);
  const controller = new AutomationRuleController(service);

  router.get(
    '/',
    authenticate,
    authorize('ADMIN'),
    asyncHandler(async (req, res) => controller.list(req, res)),
  );

  router.post(
    '/',
    authenticate,
    authorize('ADMIN'),
    validate({ body: createAutomationRuleSchema }),
    asyncHandler(async (req, res) => controller.create(req, res)),
  );

  router.patch(
    '/:id',
    authenticate,
    authorize('ADMIN'),
    validate({ body: updateAutomationRuleSchema }),
    asyncHandler(async (req, res) => controller.update(req, res)),
  );

  router.delete(
    '/:id',
    authenticate,
    authorize('ADMIN'),
    asyncHandler(async (req, res) => controller.delete(req, res)),
  );

  router.post(
    '/:id/run-now',
    authenticate,
    authorize('ADMIN'),
    asyncHandler(async (req, res) => controller.runNow(req, res)),
  );

  return router;
}
