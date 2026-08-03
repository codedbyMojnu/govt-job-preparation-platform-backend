import type { PrismaClient } from '@prisma/client';
import type { AwilixContainer } from 'awilix';
import { Router } from 'express';

import { authenticate, authorize, optionalAuthenticate } from '../../../../infrastructure/middleware/authenticate.js';
import { validate } from '../../../../infrastructure/middleware/validate.js';
import { asyncHandler } from '../../../../shared/utils/async-handler.js';
import { VideoService } from '../../domain/video.service.js';
import { VideoPrismaRepository } from '../../infra/video.prisma-repository.js';
import {
  commentIdParamsSchema,
  commentListQuerySchema,
  createCommentSchema,
  createVideoSchema,
  parseYoutubeSchema,
  updateVideoSchema,
  videoFilterSchema,
  videoIdParamsSchema,
} from '../validation.js';

import { VideoController } from './video.controller.js';

export function createVideoRoutes(container: AwilixContainer): Router {
  const router = Router();

  const prisma = container.resolve<PrismaClient>('prismaClient');
  const repository = new VideoPrismaRepository(prisma);
  const service = new VideoService(repository);
  const controller = new VideoController(service);

  // ── Admin (must be before /:videoId) ────────────────────────────────

  router.get(
    '/admin/list',
    authenticate,
    authorize('ADMIN'),
    validate({ query: videoFilterSchema }),
    asyncHandler((req, res) => controller.adminList(req, res)),
  );

  router.get(
    '/admin/stats',
    authenticate,
    authorize('ADMIN'),
    asyncHandler((req, res) => controller.stats(req, res)),
  );

  router.post(
    '/admin/parse-youtube',
    authenticate,
    authorize('ADMIN'),
    validate({ body: parseYoutubeSchema }),
    asyncHandler((req, res) => controller.parseYoutube(req, res)),
  );

  router.post(
    '/admin/import-channel',
    authenticate,
    authorize('ADMIN'),
    asyncHandler((req, res) => controller.importChannel(req, res)),
  );

  router.post(
    '/admin',
    authenticate,
    authorize('ADMIN'),
    validate({ body: createVideoSchema }),
    asyncHandler((req, res) => controller.create(req, res)),
  );

  router.patch(
    '/admin/:videoId',
    authenticate,
    authorize('ADMIN'),
    validate({ params: videoIdParamsSchema, body: updateVideoSchema }),
    asyncHandler((req, res) => controller.update(req, res)),
  );

  router.delete(
    '/admin/:videoId',
    authenticate,
    authorize('ADMIN'),
    validate({ params: videoIdParamsSchema }),
    asyncHandler((req, res) => controller.delete(req, res)),
  );

  // ── Public / optional-auth browse ───────────────────────────────────

  router.get(
    '/featured',
    asyncHandler((req, res) => controller.listFeatured(req, res)),
  );

  router.get(
    '/',
    optionalAuthenticate,
    validate({ query: videoFilterSchema }),
    asyncHandler((req, res) => controller.list(req, res)),
  );

  router.get(
    '/:videoId/comments',
    validate({ params: videoIdParamsSchema, query: commentListQuerySchema }),
    asyncHandler((req, res) => controller.listComments(req, res)),
  );

  router.get(
    '/:videoId',
    optionalAuthenticate,
    validate({ params: videoIdParamsSchema }),
    asyncHandler((req, res) => controller.getById(req, res)),
  );

  router.post(
    '/:videoId/view',
    validate({ params: videoIdParamsSchema }),
    asyncHandler((req, res) => controller.recordView(req, res)),
  );

  // ── Member interactions ─────────────────────────────────────────────

  router.post(
    '/:videoId/like',
    authenticate,
    validate({ params: videoIdParamsSchema }),
    asyncHandler((req, res) => controller.toggleLike(req, res)),
  );

  router.post(
    '/:videoId/comments',
    authenticate,
    validate({ params: videoIdParamsSchema, body: createCommentSchema }),
    asyncHandler((req, res) => controller.addComment(req, res)),
  );

  router.delete(
    '/:videoId/comments/:commentId',
    authenticate,
    validate({ params: commentIdParamsSchema }),
    asyncHandler((req, res) => controller.deleteComment(req, res)),
  );

  return router;
}
