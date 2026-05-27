import type { PrismaClient } from '@prisma/client';
import type { AwilixContainer } from 'awilix';
import { Router } from 'express';

import type { CacheService } from '../../../../infrastructure/cache/cache.service.js';
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

const CACHE_TTL = 600; // 10 minutes

export function createRoutineRoutes(container: AwilixContainer): Router {
  const router = Router();

  const prisma = container.resolve<PrismaClient>('prismaClient');
  const cacheService = container.resolve<CacheService>('cacheService');
  const repository = new RoutinePrismaRepository(prisma);
  const questionSetRepository = new QuestionSetPrismaRepository(prisma);
  const routineQuestionSetService = new RoutineQuestionSetService(
    repository,
    questionSetRepository,
  );
  const service = new RoutineService(repository);
  const controller = new RoutineController(service);

  async function invalidateCache() {
    await cacheService.invalidatePattern('routines:*');
  }

  // Public: Get all active routines
  router.get(
    '/',
    asyncHandler(async (_req, res) => {
      const data = await cacheService.getOrSet(
        'routines:all',
        () => service.getAll(true),
        CACHE_TTL,
      );
      res.json({ data });
    }),
  );

  // Public: Get routines by sub-category slug
  router.get(
    '/by-sub-category/:subCategorySlug',
    asyncHandler(async (req, res) => {
      const slug = req.params.subCategorySlug!;
      const sub = await prisma.subExamCategory.findUnique({
        where: { slug },
        select: { id: true },
      });
      if (!sub) {
        throw new NotFoundError('Sub exam category not found');
      }
      const data = await cacheService.getOrSet(
        `routines:sub:${slug}`,
        () => service.getBySubCategoryId(sub.id, true),
        CACHE_TTL,
      );
      res.json({ data });
    }),
  );

  // Admin: CRUD
  router.post(
    '/',
    authenticate,
    authorize('ADMIN'),
    validate({ body: createRoutineSchema }),
    asyncHandler(async (req, res) => {
      await controller.create(req, res);
      await invalidateCache();
    }),
  );

  router.patch(
    '/:id',
    authenticate,
    authorize('ADMIN'),
    validate({ body: updateRoutineSchema }),
    asyncHandler(async (req, res) => {
      await controller.update(req, res);
      await invalidateCache();
    }),
  );

  router.delete(
    '/:id',
    authenticate,
    authorize('ADMIN'),
    asyncHandler(async (req, res) => {
      await controller.delete(req, res);
      await invalidateCache();
    }),
  );

  // Admin: Bulk operations
  router.post(
    '/bulk-upsert',
    authenticate,
    authorize('ADMIN'),
    validate({ body: bulkUpsertRoutinesSchema }),
    asyncHandler(async (req, res) => {
      await controller.bulkUpsert(req, res);
      await invalidateCache();
    }),
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
    asyncHandler(async (req, res) => {
      await controller.bulkDelete(req, res);
      await invalidateCache();
    }),
  );

  return router;
}
