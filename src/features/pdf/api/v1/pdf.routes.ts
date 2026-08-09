import type { PrismaClient } from '@prisma/client';
import type { AwilixContainer } from 'awilix';
import { Router } from 'express';
import type { Client as MinioClient } from 'minio';
import multer from 'multer';

import { minioConfig } from '../../../../config/minio.js';
import {
  authenticate,
  authorize,
  optionalAuthenticate,
} from '../../../../infrastructure/middleware/authenticate.js';
import { validate } from '../../../../infrastructure/middleware/validate.js';
import { BadRequestError } from '../../../../shared/errors/http-errors.js';
import { asyncHandler } from '../../../../shared/utils/async-handler.js';
import { PdfService } from '../../domain/pdf.service.js';
import { PdfStorageService } from '../../infra/pdf-storage.service.js';
import { PdfPrismaRepository } from '../../infra/pdf.prisma-repository.js';
import {
  commentIdParamsSchema,
  commentListQuerySchema,
  createCommentSchema,
  createPdfFormSchema,
  pdfFilterSchema,
  pdfIdParamsSchema,
  updatePdfFormSchema,
} from '../validation.js';

import { PdfController } from './pdf.controller.js';

const MAX_UPLOAD_BYTES = 20 * 1024 * 1024; // 20MB — service.ts-এও একই লিমিট চেক হয়, defense-in-depth

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_UPLOAD_BYTES },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype !== 'application/pdf') {
      cb(new BadRequestError('শুধু PDF ফাইল আপলোড করা যাবে'));
      return;
    }
    cb(null, true);
  },
});

export function createPdfRoutes(container: AwilixContainer): Router {
  const router = Router();

  const prisma = container.resolve<PrismaClient>('prismaClient');
  const minioClient = container.resolve<MinioClient>('minioClient');

  const repository = new PdfPrismaRepository(prisma);
  const storage = new PdfStorageService(minioClient, minioConfig.bucket);
  const service = new PdfService(repository, storage);
  const controller = new PdfController(service);

  // ── Admin (must be before /:pdfId) ──────────────────────────────────

  router.get(
    '/admin/list',
    authenticate,
    authorize('ADMIN'),
    validate({ query: pdfFilterSchema }),
    asyncHandler((req, res) => controller.adminList(req, res)),
  );

  router.get(
    '/admin/stats',
    authenticate,
    authorize('ADMIN'),
    asyncHandler((req, res) => controller.stats(req, res)),
  );

  router.post(
    '/admin',
    authenticate,
    authorize('ADMIN'),
    upload.single('file'),
    validate({ body: createPdfFormSchema }),
    asyncHandler((req, res) => controller.create(req, res)),
  );

  router.patch(
    '/admin/:pdfId',
    authenticate,
    authorize('ADMIN'),
    upload.single('file'),
    validate({ params: pdfIdParamsSchema, body: updatePdfFormSchema }),
    asyncHandler((req, res) => controller.update(req, res)),
  );

  router.delete(
    '/admin/:pdfId',
    authenticate,
    authorize('ADMIN'),
    validate({ params: pdfIdParamsSchema }),
    asyncHandler((req, res) => controller.delete(req, res)),
  );

  // ── Public / optional-auth browse ───────────────────────────────────

  router.get(
    '/featured',
    optionalAuthenticate,
    asyncHandler((req, res) => controller.listFeatured(req, res)),
  );

  router.get(
    '/',
    optionalAuthenticate,
    validate({ query: pdfFilterSchema }),
    asyncHandler((req, res) => controller.list(req, res)),
  );

  router.get(
    '/:pdfId/comments',
    validate({ params: pdfIdParamsSchema, query: commentListQuerySchema }),
    asyncHandler((req, res) => controller.listComments(req, res)),
  );

  router.get(
    '/:pdfId/download',
    optionalAuthenticate, // free হলে anonymous ইউজারও নামাতে পারবে; paid হলে service.ts ভিতরে গেট করে
    validate({ params: pdfIdParamsSchema }),
    asyncHandler((req, res) => controller.download(req, res)),
  );

  router.get(
    '/:pdfId',
    optionalAuthenticate,
    validate({ params: pdfIdParamsSchema }),
    asyncHandler((req, res) => controller.getById(req, res)),
  );

  router.post(
    '/:pdfId/view',
    validate({ params: pdfIdParamsSchema }),
    asyncHandler((req, res) => controller.recordView(req, res)),
  );

  // ── Member interactions ─────────────────────────────────────────────

  router.post(
    '/:pdfId/like',
    authenticate,
    validate({ params: pdfIdParamsSchema }),
    asyncHandler((req, res) => controller.toggleLike(req, res)),
  );

  router.post(
    '/:pdfId/comments',
    authenticate,
    validate({ params: pdfIdParamsSchema, body: createCommentSchema }),
    asyncHandler((req, res) => controller.addComment(req, res)),
  );

  router.delete(
    '/:pdfId/comments/:commentId',
    authenticate,
    validate({ params: commentIdParamsSchema }),
    asyncHandler((req, res) => controller.deleteComment(req, res)),
  );

  return router;
}
