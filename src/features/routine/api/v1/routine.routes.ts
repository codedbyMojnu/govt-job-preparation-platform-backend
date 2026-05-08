import type { PrismaClient } from '@prisma/client';
import type { AwilixContainer } from 'awilix';
import { Router } from 'express';

import { authenticate, authorize } from '../../../../infrastructure/middleware/authenticate.js';
import { validate } from '../../../../infrastructure/middleware/validate.js';
import { HttpStatus } from '../../../../shared/constants/http-status.js';
import { NotFoundError } from '../../../../shared/errors/http-errors.js';
import { asyncHandler } from '../../../../shared/utils/async-handler.js';
import { QuestionSetPrismaRepository } from '../../../question-set/infra/question-set.prisma-repository.js';
import { RoutineQuestionSetService } from '../../domain/routine-question-set.service.js';
import { RoutineService } from '../../domain/routine.service.js';
import { RoutinePrismaRepository } from '../../infra/routine.prisma-repository.js';
import {
  autoCreateQuestionSetsSchema,
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
  const questionSetRepository = new QuestionSetPrismaRepository(prisma);
  const routineQuestionSetService = new RoutineQuestionSetService(
    repository,
    questionSetRepository,
  );
  const service = new RoutineService(repository);
  const controller = new RoutineController(service);

  // Public: Get all active routines
  router.get(
    '/',
    asyncHandler((req, res) => controller.getAll(req, res)),
  );

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

  router.post(
    '/auto-create-question-sets',
    authenticate,
    authorize('ADMIN'),
    validate({ body: autoCreateQuestionSetsSchema }),
    asyncHandler(async (req, res) => {
      const createdSets = await routineQuestionSetService.createQuestionSetsForDate(req.body.date);
      res.status(HttpStatus.OK).json({ data: createdSets });
    }),
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
