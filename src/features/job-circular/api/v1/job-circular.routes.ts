import type { PrismaClient } from '@prisma/client';
import type { AwilixContainer } from 'awilix';
import { Router } from 'express';

import type { CacheService } from '../../../../infrastructure/cache/cache.service.js';
import { authenticate, authorize } from '../../../../infrastructure/middleware/authenticate.js';
import { validate } from '../../../../infrastructure/middleware/validate.js';
import { asyncHandler } from '../../../../shared/utils/async-handler.js';
import { JobCircularService } from '../../domain/job-circular.service.js';
import { JobCircularPrismaRepository } from '../../infra/job-circular.prisma-repository.js';
import {
  bulkDeleteJobCircularSchema,
  bulkUpsertJobCircularSchema,
  createJobCircularSchema,
  jobCircularFilterSchema,
  updateJobCircularSchema,
} from '../validation.js';

import { JobCircularController } from './job-circular.controller.js';

const CACHE_TTL = 120; // 2 minutes — short TTL for live job data

export function createJobCircularRoutes(container: AwilixContainer): Router {
  const router = Router();

  const prisma = container.resolve<PrismaClient>('prismaClient');
  const cacheService = container.resolve<CacheService>('cacheService');
  const repository = new JobCircularPrismaRepository(prisma);
  const service = new JobCircularService(repository);
  const controller = new JobCircularController(service);

  async function invalidateCache() {
    await cacheService.invalidatePattern('job-circulars:*');
  }

  // ── Public routes ──────────────────────────────────────────────────

  // GET /  — paginated + filtered list
  router.get(
    '/',
    validate(jobCircularFilterSchema, 'query'),
    asyncHandler(async (req, res) => {
      // Build a stable cache key from the query params
      const cacheKey = `job-circulars:list:${new URLSearchParams(req.query as Record<string, string>).toString()}`;
      const result = await cacheService.getOrSet(
        cacheKey,
        () =>
          service.getAll({
            orgType: req.query.orgType as string | undefined,
            status: req.query.status as string | undefined,
            category: req.query.category as string | undefined,
            ministry: req.query.ministry as string | undefined,
            search: req.query.search as string | undefined,
            deadlineFrom: req.query.deadlineFrom as string | undefined,
            deadlineTo: req.query.deadlineTo as string | undefined,
            page: req.query.page ? Number(req.query.page) : undefined,
            limit: req.query.limit ? Number(req.query.limit) : undefined,
          }),
        CACHE_TTL,
      );
      res.json(result);
    }),
  );

  // GET /filter-options — distinct categories, ministries, orgs
  router.get(
    '/filter-options',
    asyncHandler(async (_req, res) => {
      const data = await cacheService.getOrSet(
        'job-circulars:filter-options',
        () => service.getFilterOptions(),
        600, // 10 minutes
      );
      res.json({ data });
    }),
  );

  // GET /:id — single circular detail
  router.get(
    '/:id',
    asyncHandler(async (req, res) => {
      const data = await cacheService.getOrSet(
        `job-circulars:detail:${req.params.id}`,
        () => service.getById(req.params.id!),
        CACHE_TTL,
      );
      res.json({ data });
    }),
  );

  // POST /:id/view — increment view count (fire-and-forget style)
  router.post(
    '/:id/view',
    asyncHandler(async (req, res) => {
      await controller.recordView(req, res);
    }),
  );

  // ── Admin routes (authenticate + admin role) ───────────────────────

  router.post(
    '/',
    authenticate,
    authorize('ADMIN'),
    validate(createJobCircularSchema),
    asyncHandler(async (req, res) => {
      await controller.create(req, res);
      await invalidateCache();
    }),
  );

  router.patch(
    '/:id',
    authenticate,
    authorize('ADMIN'),
    validate(updateJobCircularSchema),
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

  router.post(
    '/bulk-upsert',
    authenticate,
    authorize('ADMIN'),
    validate(bulkUpsertJobCircularSchema),
    asyncHandler(async (req, res) => {
      await controller.bulkUpsert(req, res);
      await invalidateCache();
    }),
  );

  router.post(
    '/bulk-delete',
    authenticate,
    authorize('ADMIN'),
    validate(bulkDeleteJobCircularSchema),
    asyncHandler(async (req, res) => {
      await controller.bulkDelete(req, res);
      await invalidateCache();
    }),
  );

  return router;
}
