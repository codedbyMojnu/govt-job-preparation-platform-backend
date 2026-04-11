import type { PrismaClient } from '@prisma/client';
import type { AwilixContainer } from 'awilix';
import { Router } from 'express';

import { authenticate, authorize } from '../../../../infrastructure/middleware/authenticate.js';
import { validate } from '../../../../infrastructure/middleware/validate.js';
import { NotFoundError } from '../../../../shared/errors/http-errors.js';
import { asyncHandler } from '../../../../shared/utils/async-handler.js';
import { SubExamCategoryService } from '../../domain/sub-exam-category.service.js';
import { SubExamCategoryPrismaRepository } from '../../infra/sub-exam-category.prisma-repository.js';
import { createSubExamCategorySchema, updateSubExamCategorySchema } from '../validation.js';

import { SubExamCategoryController } from './sub-exam-category.controller.js';

export function createSubExamCategoryRoutes(container: AwilixContainer): Router {
  const router = Router();

  const prisma = container.resolve<PrismaClient>('prismaClient');
  const repository = new SubExamCategoryPrismaRepository(prisma);
  const service = new SubExamCategoryService(repository);
  const controller = new SubExamCategoryController(service);

  // Public: Get sub-categories by parent category slug
  router.get(
    '/by-category/:categorySlug',
    asyncHandler(async (req, res) => {
      const category = await prisma.examCategory.findUnique({
        where: { slug: req.params.categorySlug! },
        select: { id: true },
      });
      if (!category) {
        throw new NotFoundError('Exam category not found');
      }
      req.params.categoryId = category.id;
      return controller.getByCategorySlug(req, res);
    }),
  );

  // Authenticated: Get user's summary for a category
  router.get(
    '/summary/:categorySlug',
    authenticate,
    asyncHandler(async (req, res) => {
      const category = await prisma.examCategory.findUnique({
        where: { slug: req.params.categorySlug! },
        select: { id: true },
      });
      if (!category) {
        throw new NotFoundError('Exam category not found');
      }
      req.params.categoryId = category.id;
      return controller.getUserSummary(req, res);
    }),
  );

  // Admin: CRUD
  router.post(
    '/',
    authenticate,
    authorize('ADMIN'),
    validate({ body: createSubExamCategorySchema }),
    asyncHandler((req, res) => controller.create(req, res)),
  );

  router.patch(
    '/:id',
    authenticate,
    authorize('ADMIN'),
    validate({ body: updateSubExamCategorySchema }),
    asyncHandler((req, res) => controller.update(req, res)),
  );

  router.delete(
    '/:id',
    authenticate,
    authorize('ADMIN'),
    asyncHandler((req, res) => controller.delete(req, res)),
  );

  // Public: Merit list for a sub-category
  router.get(
    '/merit-list/:subCategorySlug',
    asyncHandler(async (req, res) => {
      const sub = await prisma.subExamCategory.findUnique({
        where: { slug: req.params.subCategorySlug! },
        select: { id: true },
      });
      if (!sub) {
        throw new NotFoundError('Sub exam category not found');
      }
      req.params.subCategoryId = sub.id;
      return controller.getMeritList(req, res);
    }),
  );

  return router;
}
