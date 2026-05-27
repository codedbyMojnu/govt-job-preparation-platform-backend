import type { PrismaClient } from '@prisma/client';
import type { AwilixContainer } from 'awilix';
import { Router } from 'express';

import type { CacheService } from '../../../../infrastructure/cache/cache.service.js';
import { authenticate, authorize } from '../../../../infrastructure/middleware/authenticate.js';
import { validate } from '../../../../infrastructure/middleware/validate.js';
import { asyncHandler } from '../../../../shared/utils/async-handler.js';
import { ExamCategoryService } from '../../domain/exam-category.service.js';
import { ExamCategoryPrismaRepository } from '../../infra/exam-category.prisma-repository.js';
import {
  bulkDeleteExamCategoriesSchema,
  bulkUpsertExamCategoriesSchema,
  createExamCategorySchema,
  updateExamCategorySchema,
} from '../validation.js';

import { ExamCategoryController } from './exam-category.controller.js';

const CACHE_KEY_ALL = 'exam-categories:all';
const CACHE_TTL = 600; // 10 minutes

export function createExamCategoryRoutes(container: AwilixContainer): Router {
  const router = Router();

  const prisma = container.resolve<PrismaClient>('prismaClient');
  const cacheService = container.resolve<CacheService>('cacheService');
  const repository = new ExamCategoryPrismaRepository(prisma);
  const service = new ExamCategoryService(repository);
  const controller = new ExamCategoryController(service);

  async function invalidateCache() {
    await cacheService.invalidatePattern('exam-categories:*');
  }

  // Public routes
  router.get(
    '/',
    asyncHandler(async (req, res) => {
      const activeOnly = req.query.activeOnly !== 'false';
      const cacheKey = activeOnly ? CACHE_KEY_ALL : 'exam-categories:all:inactive';
      const data = await cacheService.getOrSet(
        cacheKey,
        () => service.getAll(activeOnly),
        CACHE_TTL,
      );
      res.json({ data });
    }),
  );

  router.get(
    '/:slug',
    asyncHandler(async (req, res) => {
      const slug = req.params.slug!;
      const data = await cacheService.getOrSet(
        `exam-categories:slug:${slug}`,
        () => service.getBySlug(slug),
        CACHE_TTL,
      );
      res.json({ data });
    }),
  );

  // Admin routes
  router.post(
    '/bulk-upsert',
    authenticate,
    authorize('ADMIN'),
    validate({ body: bulkUpsertExamCategoriesSchema }),
    asyncHandler(async (req, res) => {
      await controller.bulkUpsert(req, res);
      await invalidateCache();
    }),
  );

  router.delete(
    '/bulk-delete',
    authenticate,
    authorize('ADMIN'),
    validate({ body: bulkDeleteExamCategoriesSchema }),
    asyncHandler(async (req, res) => {
      await controller.bulkDelete(req, res);
      await invalidateCache();
    }),
  );

  router.post(
    '/',
    authenticate,
    authorize('ADMIN'),
    validate({ body: createExamCategorySchema }),
    asyncHandler(async (req, res) => {
      await controller.create(req, res);
      await invalidateCache();
    }),
  );

  router.patch(
    '/:id',
    authenticate,
    authorize('ADMIN'),
    validate({ body: updateExamCategorySchema }),
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

  return router;
}
