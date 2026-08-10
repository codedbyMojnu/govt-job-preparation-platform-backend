import type { PrismaClient } from '@prisma/client';
import type { AwilixContainer } from 'awilix';
import { Router } from 'express';

import { authenticate, authorize } from '../../../../infrastructure/middleware/authenticate.js';
import { requireInternalService } from '../../../../infrastructure/middleware/internal-service.js';
import { validate } from '../../../../infrastructure/middleware/validate.js';
import { asyncHandler } from '../../../../shared/utils/async-handler.js';
import {
  IntegrationCredentialService,
} from '../../domain/integration-credential.service.js';
import {
  IntegrationCredentialPrismaRepository,
} from '../../infra/broadcast.prisma-repository.js';
import {
  createIntegrationCredentialSchema,
  updateIntegrationCredentialSchema,
} from '../validation.js';

import { IntegrationCredentialController } from './integration-credential.controller.js';

export function createIntegrationCredentialRoutes(container: AwilixContainer): Router {
  const router = Router();

  const prisma = container.resolve<PrismaClient>('prismaClient');
  const repository = new IntegrationCredentialPrismaRepository(prisma);
  const service = new IntegrationCredentialService(repository);
  const controller = new IntegrationCredentialController(service);

  router.get(
    '/resolve',
    requireInternalService,
    asyncHandler(async (req, res) => controller.resolve(req, res)),
  );

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
    validate({ body: createIntegrationCredentialSchema }),
    asyncHandler(async (req, res) => controller.create(req, res)),
  );

  router.patch(
    '/:id',
    authenticate,
    authorize('ADMIN'),
    validate({ body: updateIntegrationCredentialSchema }),
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
