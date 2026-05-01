import type { PrismaClient } from '@prisma/client';
import type { AwilixContainer } from 'awilix';
import { Router } from 'express';

import { authenticate, authorize } from '../../../../infrastructure/middleware/authenticate.js';
import { validate } from '../../../../infrastructure/middleware/validate.js';
import { NotFoundError } from '../../../../shared/errors/http-errors.js';
import { asyncHandler } from '../../../../shared/utils/async-handler.js';
import { QuestionSetService } from '../../domain/question-set.service.js';
import { QuestionSetPrismaRepository } from '../../infra/question-set.prisma-repository.js';
import {
  answerQuestionSchema,
  bulkDeleteQuestionsSchema,
  bulkUpsertQuestionsSchema,
  createQuestionSchema,
  createQuestionSetSchema,
  startExamSchema,
  updateAppSettingsSchema,
  updateQuestionSchema,
  updateQuestionSetSchema,
} from '../validation.js';

import { QuestionSetController } from './question-set.controller.js';

export function createQuestionSetRoutes(container: AwilixContainer): Router {
  const router = Router();

  const prisma = container.resolve<PrismaClient>('prismaClient');
  const repository = new QuestionSetPrismaRepository(prisma);
  const service = new QuestionSetService(repository);
  const controller = new QuestionSetController(service);

  // Helper: resolve sub-category ID from slug
  async function resolveSubCategoryId(slug: string): Promise<string> {
    const sub = await prisma.subExamCategory.findUnique({
      where: { slug },
      select: { id: true },
    });
    if (!sub) {
      throw new NotFoundError('Sub exam category not found');
    }
    return sub.id;
  }

  // Public: Get live question set by sub-category slug
  router.get(
    '/live/:subCategorySlug',
    asyncHandler(async (req, res) => {
      const subCategoryId = await resolveSubCategoryId(req.params.subCategorySlug!);
      req.params.subCategoryId = subCategoryId;
      return controller.getLive(req, res);
    }),
  );

  // Public: Get single question by slug (SEO page data)
  router.get(
    '/public/question/:slug',
    asyncHandler((req, res) => controller.getPublicQuestion(req, res)),
  );

  // Public: Get archive question sets by sub-category slug
  router.get(
    '/archive/:subCategorySlug',
    asyncHandler(async (req, res) => {
      const subCategoryId = await resolveSubCategoryId(req.params.subCategorySlug!);
      req.params.subCategoryId = subCategoryId;
      return controller.getArchive(req, res);
    }),
  );

  // Admin: Get all question sets by sub-category slug (with optional isLive filter)
  router.get(
    '/by-sub-category/:subCategorySlug',
    authenticate,
    authorize('ADMIN'),
    asyncHandler(async (req, res) => {
      const subCategoryId = await resolveSubCategoryId(req.params.subCategorySlug!);
      req.params.subCategoryId = subCategoryId;
      return controller.getAllBySubCategory(req, res);
    }),
  );

  // Auth: Get marksheet by attempt ID
  router.get(
    '/marksheet/:attemptId',
    authenticate,
    asyncHandler((req, res) => controller.getMarksheet(req, res)),
  );

  // Auth: Get user attempt for a question set
  router.get(
    '/user-attempt/:questionSetId',
    authenticate,
    asyncHandler((req, res) => controller.getUserAttempt(req, res)),
  );

  // --- Question CRUD (admin) ---

  // Admin: Get questions for a question set
  router.get(
    '/questions/:questionSetId',
    authenticate,
    authorize('ADMIN'),
    asyncHandler((req, res) => controller.getQuestions(req, res)),
  );

  // Admin: Get single question
  router.get(
    '/question/:id',
    authenticate,
    authorize('ADMIN'),
    asyncHandler((req, res) => controller.getQuestion(req, res)),
  );

  // Admin: Create question
  router.post(
    '/questions',
    authenticate,
    authorize('ADMIN'),
    validate({ body: createQuestionSchema }),
    asyncHandler((req, res) => controller.createQuestion(req, res)),
  );

  // Admin: Update question
  router.patch(
    '/question/:id',
    authenticate,
    authorize('ADMIN'),
    validate({ body: updateQuestionSchema }),
    asyncHandler((req, res) => controller.updateQuestion(req, res)),
  );

  // Admin: Delete question
  router.delete(
    '/question/:id',
    authenticate,
    authorize('ADMIN'),
    asyncHandler((req, res) => controller.deleteQuestion(req, res)),
  );

  // Admin: Bulk upsert (create + update) questions in one call
  router.post(
    '/questions/bulk-upsert',
    authenticate,
    authorize('ADMIN'),
    validate({ body: bulkUpsertQuestionsSchema }),
    asyncHandler((req, res) => controller.bulkUpsertQuestions(req, res)),
  );

  // Admin: Bulk delete questions by IDs
  router.delete(
    '/questions/bulk-delete',
    authenticate,
    authorize('ADMIN'),
    validate({ body: bulkDeleteQuestionsSchema }),
    asyncHandler((req, res) => controller.bulkDeleteQuestions(req, res)),
  );

  // --- Exam flow ---

  // Auth: Get exam questions (hides answers)
  router.get(
    '/exam-questions/:questionSetId',
    authenticate,
    asyncHandler((req, res) => controller.getExamQuestions(req, res)),
  );

  // Auth: Start exam attempt
  router.post(
    '/start-exam',
    authenticate,
    validate({ body: startExamSchema }),
    asyncHandler((req, res) => controller.startExam(req, res)),
  );

  // Auth: Answer a question during exam
  router.post(
    '/answer/:attemptId',
    authenticate,
    validate({ body: answerQuestionSchema }),
    asyncHandler((req, res) => controller.answerQuestion(req, res)),
  );

  // Auth: Submit exam
  router.post(
    '/submit-exam/:attemptId',
    authenticate,
    asyncHandler((req, res) => controller.submitExam(req, res)),
  );

  // --- Review & stats ---

  // Auth: Get review questions (after exam)
  router.get(
    '/review/:attemptId',
    authenticate,
    asyncHandler((req, res) => controller.getReviewQuestions(req, res)),
  );

  // Auth: Get questions for review (without taking exam - "see answers")
  router.get(
    '/review-questions/:questionSetId',
    authenticate,
    asyncHandler((req, res) => controller.getQuestionsForReview(req, res)),
  );

  // Auth: Get question stats
  router.get(
    '/question-stats/:questionId',
    authenticate,
    asyncHandler((req, res) => controller.getQuestionStats(req, res)),
  );

  // --- Favorites ---

  // Auth: Toggle favorite
  router.post(
    '/favorite/:questionId',
    authenticate,
    asyncHandler((req, res) => controller.toggleFavorite(req, res)),
  );

  // --- App settings (admin) ---

  // Admin: Get app settings
  router.get(
    '/settings/free-tier',
    authenticate,
    authorize('ADMIN'),
    asyncHandler((req, res) => controller.getAppSettings(req, res)),
  );

  // Admin: Update app settings
  router.patch(
    '/settings/free-tier',
    authenticate,
    authorize('ADMIN'),
    validate({ body: updateAppSettingsSchema }),
    asyncHandler((req, res) => controller.updateAppSettings(req, res)),
  );

  // Admin: Toggle isFree on a question set
  router.patch(
    '/:id/toggle-free',
    authenticate,
    authorize('ADMIN'),
    asyncHandler((req, res) => controller.toggleFree(req, res)),
  );

  // Auth: Get single question set (members need this for exam page)
  router.get(
    '/:id',
    authenticate,
    asyncHandler((req, res) => controller.getById(req, res)),
  );

  // Admin: Create
  router.post(
    '/',
    authenticate,
    authorize('ADMIN'),
    validate({ body: createQuestionSetSchema }),
    asyncHandler((req, res) => controller.create(req, res)),
  );

  // Admin: Update
  router.patch(
    '/:id',
    authenticate,
    authorize('ADMIN'),
    validate({ body: updateQuestionSetSchema }),
    asyncHandler((req, res) => controller.update(req, res)),
  );

  // Admin: Toggle live/archive status
  router.patch(
    '/:id/toggle-status',
    authenticate,
    authorize('ADMIN'),
    asyncHandler((req, res) => controller.toggleStatus(req, res)),
  );

  // Admin: Delete
  router.delete(
    '/:id',
    authenticate,
    authorize('ADMIN'),
    asyncHandler((req, res) => controller.delete(req, res)),
  );

  return router;
}
