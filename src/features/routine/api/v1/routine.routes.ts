import type { PrismaClient } from '@prisma/client';
import type { AwilixContainer } from 'awilix';
import { Router } from 'express';

import { authenticate, authorize } from '../../../../infrastructure/middleware/authenticate.js';
import { validate } from '../../../../infrastructure/middleware/validate.js';
import { NotFoundError } from '../../../../shared/errors/http-errors.js';
import { asyncHandler } from '../../../../shared/utils/async-handler.js';
import { RoutineService } from '../../domain/routine.service.js';
import { RoutinePrismaRepository } from '../../infra/routine.prisma-repository.js';
import {
  bulkDeleteRoutinesSchema,
  bulkUpsertRoutinesSchema,
  createRoutineSchema,
  updateRoutineSchema,
} from '../validation.js';

import { RoutineController } from './routine.controller.js';

export function createRoutineRoutes(container: AwilixContainer): Router {
  const router = Router();

  const prisma = container.resolve<PrismaClient>('prismaClient');
  const repository = new RoutinePrismaRepository(prisma);
  const service = new RoutineService(repository);
  const controller = new RoutineController(service);

  // Public: Get routines by sub-category slug
  router.get(
    '/by-sub-category/:subCategorySlug',
    asyncHandler(async (req, res) => {
      const sub = await prisma.subExamCategory.findUnique({
        where: { slug: req.params.subCategorySlug! },
        select: { id: true },
      });
      if (!sub) {
        throw new NotFoundError('Sub exam category not found');
      }
      req.params.subCategoryId = sub.id;
      return controller.getBySubCategory(req, res);
    }),
  );

  // Admin: CRUD
  router.post(
    '/',
    authenticate,
    authorize('ADMIN'),
    validate({ body: createRoutineSchema }),
    asyncHandler((req, res) => controller.create(req, res)),
  );

  router.patch(
    '/:id',
    authenticate,
    authorize('ADMIN'),
    validate({ body: updateRoutineSchema }),
    asyncHandler((req, res) => controller.update(req, res)),
  );

  router.delete(
    '/:id',
    authenticate,
    authorize('ADMIN'),
    asyncHandler((req, res) => controller.delete(req, res)),
  );

  // Admin: Bulk operations
  router.post(
    '/bulk-upsert',
    authenticate,
    authorize('ADMIN'),
    validate({ body: bulkUpsertRoutinesSchema }),
    asyncHandler((req, res) => controller.bulkUpsert(req, res)),
  );

  router.delete(
    '/bulk-delete',
    authenticate,
    authorize('ADMIN'),
    validate({ body: bulkDeleteRoutinesSchema }),
    asyncHandler((req, res) => controller.bulkDelete(req, res)),
  );

  return router;
}
