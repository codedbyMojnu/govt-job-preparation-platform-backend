import type { PrismaClient } from '@prisma/client';
import type { AwilixContainer } from 'awilix';
import { Router } from 'express';

import type { CacheService } from '../../../../infrastructure/cache/cache.service.js';
import { authenticate, authorize } from '../../../../infrastructure/middleware/authenticate.js';
import { validate } from '../../../../infrastructure/middleware/validate.js';
import { NotFoundError } from '../../../../shared/errors/http-errors.js';
import { asyncHandler } from '../../../../shared/utils/async-handler.js';
import { SyllabusService } from '../../domain/syllabus.service.js';
import { SyllabusPrismaRepository } from '../../infra/syllabus.prisma-repository.js';
import { createSyllabusSchema, updateSyllabusSchema } from '../validation.js';

import { SyllabusController } from './syllabus.controller.js';

const CACHE_TTL = 1800; // 30 minutes

export function createSyllabusRoutes(container: AwilixContainer): Router {
  const router = Router();

  const prisma = container.resolve<PrismaClient>('prismaClient');
  const cacheService = container.resolve<CacheService>('cacheService');
  const repository = new SyllabusPrismaRepository(prisma);
  const service = new SyllabusService(repository);
  const controller = new SyllabusController(service);

  async function invalidateCache() {
    await cacheService.invalidatePattern('syllabuses:*');
  }

  // Public: Get all syllabuses
  router.get(
    '/',
    asyncHandler(async (_req, res) => {
      const data = await cacheService.getOrSet(
        'syllabuses:all',
        () => service.getAll(true),
        CACHE_TTL,
      );
      res.json({ data });
    }),
  );

  // Public: Get syllabuses by sub-category slug
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
        `syllabuses:sub:${slug}`,
        () => service.getBySubCategoryId(sub.id, true),
        CACHE_TTL,
      );
      res.json({ data });
    }),
  );

  // Public: Get single syllabus by slug
  router.get(
    '/detail/:slug',
    asyncHandler(async (req, res) => {
      const slug = req.params.slug!;
      const data = await cacheService.getOrSet(
        `syllabuses:detail:${slug}`,
        () => service.getBySlug(slug),
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
    validate({ body: createSyllabusSchema }),
    asyncHandler(async (req, res) => {
      await controller.create(req, res);
      await invalidateCache();
    }),
  );

  router.patch(
    '/:id',
    authenticate,
    authorize('ADMIN'),
    validate({ body: updateSyllabusSchema }),
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
