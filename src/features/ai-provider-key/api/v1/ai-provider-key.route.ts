import type { PrismaClient } from '@prisma/client';
import type { AwilixContainer } from 'awilix';
import { Router } from 'express';

import { authenticate, authorize } from '../../../../infrastructure/middleware/authenticate.js';
import { requireInternalService } from '../../../../infrastructure/middleware/internal-service.js';
import { validate } from '../../../../infrastructure/middleware/validate.js';
import { asyncHandler } from '../../../../shared/utils/async-handler.js';
import { AiProviderKeyService } from '../../domain/ai-provider-key.service.js';
import { AiProviderKeyPrismaRepository } from '../../infra/ai-provider-key.prisma-repository.js';
import { createAiProviderKeySchema, updateAiProviderKeySchema } from '../validation.js';

import { AiProviderKeyController } from './ai-provider-key.controller.js';

export function createAiProviderKeyRoutes(container: AwilixContainer): Router {
  const router = Router();

  const prisma = container.resolve<PrismaClient>('prismaClient');
  const repository = new AiProviderKeyPrismaRepository(prisma);
  const service = new AiProviderKeyService(repository);
  const controller = new AiProviderKeyController(service);

  // ─── Internal service-to-service ONLY — কখনো browser থেকে reachable না ───
  // /:id এর সাথে collide এড়াতে সবার আগে register করো।
  router.get(
    '/resolve',
    requireInternalService,
    asyncHandler(async (req, res) => controller.resolve(req, res)),
  );

  // ─── Admin-only management ───────────────────────────────────────────────
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
    validate({ body: createAiProviderKeySchema }),
    asyncHandler(async (req, res) => controller.create(req, res)),
  );

  router.patch(
    '/:id',
    authenticate,
    authorize('ADMIN'),
    validate({ body: updateAiProviderKeySchema }),
    asyncHandler(async (req, res) => controller.update(req, res)),
  );

  router.delete(
    '/:id',
    authenticate,
    authorize('ADMIN'),
    asyncHandler(async (req, res) => controller.delete(req, res)),
  );

  return router;
}
