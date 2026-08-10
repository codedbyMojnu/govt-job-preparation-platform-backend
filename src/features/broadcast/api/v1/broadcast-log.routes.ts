import type { PrismaClient } from '@prisma/client';
import type { AwilixContainer } from 'awilix';
import { Router } from 'express';

import { authenticate, authorize } from '../../../../infrastructure/middleware/authenticate.js';
import { requireInternalService } from '../../../../infrastructure/middleware/internal-service.js';
import { validate } from '../../../../infrastructure/middleware/validate.js';
import { asyncHandler } from '../../../../shared/utils/async-handler.js';
import { BroadcastLogService } from '../../domain/integration-credential.service.js';
import { BroadcastLogPrismaRepository } from '../../infra/broadcast.prisma-repository.js';
import {
  broadcastLogFilterSchema,
  createBroadcastLogSchema,
  updateBroadcastLogSchema,
} from '../validation.js';

import { BroadcastLogController } from './broadcast-log.controller.js';

export function createBroadcastLogRoutes(container: AwilixContainer): Router {
  const router = Router();

  const prisma = container.resolve<PrismaClient>('prismaClient');
  const repository = new BroadcastLogPrismaRepository(prisma);
  const service = new BroadcastLogService(repository);
  const controller = new BroadcastLogController(service);

  router.get(
    '/',
    authenticate,
    authorize('ADMIN'),
    validate({ query: broadcastLogFilterSchema }),
    asyncHandler(async (req, res) => controller.list(req, res)),
  );

  router.post(
    '/',
    authenticate,
    authorize('ADMIN'),
    validate({ body: createBroadcastLogSchema }),
    asyncHandler(async (req, res) => controller.create(req, res)),
  );

  // Internal service can update status after send completes (Next.js automation route)
  router.patch(
    '/:id',
    requireInternalService,
    validate({ body: updateBroadcastLogSchema }),
    asyncHandler(async (req, res) => controller.update(req, res)),
  );

  return router;
}
