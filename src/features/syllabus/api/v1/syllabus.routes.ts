import type { PrismaClient } from '@prisma/client';
import type { AwilixContainer } from 'awilix';
import { Router } from 'express';

import { authenticate, authorize } from '../../../../infrastructure/middleware/authenticate.js';
import { validate } from '../../../../infrastructure/middleware/validate.js';
import { NotFoundError } from '../../../../shared/errors/http-errors.js';
import { asyncHandler } from '../../../../shared/utils/async-handler.js';
import { SyllabusService } from '../../domain/syllabus.service.js';
import { SyllabusPrismaRepository } from '../../infra/syllabus.prisma-repository.js';
import { createSyllabusSchema, updateSyllabusSchema } from '../validation.js';

import { SyllabusController } from './syllabus.controller.js';

export function createSyllabusRoutes(container: AwilixContainer): Router {
  const router = Router();

  const prisma = container.resolve<PrismaClient>('prismaClient');
  const repository = new SyllabusPrismaRepository(prisma);
  const service = new SyllabusService(repository);
  const controller = new SyllabusController(service);

  // Public: Get all syllabuses
  router.get(
    '/',
    asyncHandler((req, res) => controller.getAll(req, res)),
  );

  // Public: Get syllabuses by sub-category slug
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

  // Public: Get single syllabus by slug
  router.get(
    '/detail/:slug',
    asyncHandler((req, res) => controller.getBySlug(req, res)),
  );

  // Admin: CRUD
  router.post(
    '/',
    authenticate,
    authorize('ADMIN'),
    validate({ body: createSyllabusSchema }),
    asyncHandler((req, res) => controller.create(req, res)),
  );

  router.patch(
    '/:id',
    authenticate,
    authorize('ADMIN'),
    validate({ body: updateSyllabusSchema }),
    asyncHandler((req, res) => controller.update(req, res)),
  );

  router.delete(
    '/:id',
    authenticate,
    authorize('ADMIN'),
    asyncHandler((req, res) => controller.delete(req, res)),
  );

  return router;
}
