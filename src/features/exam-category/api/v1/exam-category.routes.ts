import type { PrismaClient } from '@prisma/client';
import type { AwilixContainer } from 'awilix';
import { Router } from 'express';

import { authenticate, authorize } from '../../../../infrastructure/middleware/authenticate.js';
import { validate } from '../../../../infrastructure/middleware/validate.js';
import { asyncHandler } from '../../../../shared/utils/async-handler.js';
import { ExamCategoryService } from '../../domain/exam-category.service.js';
import { ExamCategoryPrismaRepository } from '../../infra/exam-category.prisma-repository.js';
import { createExamCategorySchema, updateExamCategorySchema } from '../validation.js';

import { ExamCategoryController } from './exam-category.controller.js';

export function createExamCategoryRoutes(container: AwilixContainer): Router {
  const router = Router();

  const prisma = container.resolve<PrismaClient>('prismaClient');
  const repository = new ExamCategoryPrismaRepository(prisma);
  const service = new ExamCategoryService(repository);
  const controller = new ExamCategoryController(service);

  // Public routes
  router.get(
    '/',
    asyncHandler((req, res) => controller.getAll(req, res)),
  );

  router.get(
    '/:slug',
    asyncHandler((req, res) => controller.getBySlug(req, res)),
  );

  // Admin routes
  router.post(
    '/',
    authenticate,
    authorize('ADMIN'),
    validate({ body: createExamCategorySchema }),
    asyncHandler((req, res) => controller.create(req, res)),
  );

  router.patch(
    '/:id',
    authenticate,
    authorize('ADMIN'),
    validate({ body: updateExamCategorySchema }),
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
