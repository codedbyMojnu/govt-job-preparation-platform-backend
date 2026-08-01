import type { PrismaClient } from '@prisma/client';
import type { AwilixContainer } from 'awilix';
import type { Queue } from 'bullmq';
import { Router } from 'express';
import type { Client as MinioClient } from 'minio';
import multer from 'multer';

import { minioConfig } from '../../../../config/minio.js';
import { authenticate } from '../../../../infrastructure/middleware/authenticate.js';
import { validate } from '../../../../infrastructure/middleware/validate.js';
import { BadRequestError } from '../../../../shared/errors/http-errors.js';
import { asyncHandler } from '../../../../shared/utils/async-handler.js';
import { SlideService } from '../../domain/slide.service.js';
import type { SlideGenerationJobData } from '../../infra/slide-queue.js';
import { SlideStorageService } from '../../infra/slide-storage.service.js';
import { SlidePrismaRepository } from '../../infra/slide.prisma-repository.js';
import {
  generateSlidesSchema,
  jobIdParamsSchema,
  patchSceneSchema,
  questionSetIdParamsSchema,
  slideIdParamsSchema,
  zipQuerySchema,
} from '../validation.js';

import { SlideController } from './slide.controller.js';

const MAX_UPLOAD_BYTES = 8 * 1024 * 1024; // 8MB

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_UPLOAD_BYTES },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      cb(new BadRequestError('Only image uploads are allowed'));
      return;
    }
    cb(null, true);
  },
});

export function createSlideRoutes(container: AwilixContainer): Router {
  const router = Router();

  const prisma = container.resolve<PrismaClient>('prismaClient');
  const minioClient = container.resolve<MinioClient>('minioClient');
  const slideQueue = container.resolve<Queue<SlideGenerationJobData>>('slideQueue');

  const repository = new SlidePrismaRepository(prisma);
  const storage = new SlideStorageService(minioClient, minioConfig.bucket);
  const service = new SlideService(repository, slideQueue, storage);
  const controller = new SlideController(service);

  router.use(authenticate);

  router.post(
    '/generate',
    validate({ body: generateSlidesSchema }),
    asyncHandler((req, res) => controller.generate(req, res)),
  );

  router.get(
    '/jobs/:jobId',
    validate({ params: jobIdParamsSchema }),
    asyncHandler((req, res) => controller.getJobStatus(req, res)),
  );

  router.patch(
    '/:slideId',
    validate({ params: slideIdParamsSchema, body: patchSceneSchema }),
    asyncHandler((req, res) => controller.patchScene(req, res)),
  );

  router.post(
    '/:slideId/render',
    validate({ params: slideIdParamsSchema }),
    asyncHandler((req, res) => controller.reRender(req, res)),
  );

  router.post(
    '/:slideId/upload-image',
    validate({ params: slideIdParamsSchema }),
    upload.single('image'),
    asyncHandler((req, res) => controller.uploadImage(req, res)),
  );

  router.get(
    '/:slideId/download',
    validate({ params: slideIdParamsSchema }),
    asyncHandler((req, res) => controller.download(req, res)),
  );

  router.get(
    '/:questionSetId/zip',
    validate({ params: questionSetIdParamsSchema, query: zipQuerySchema }),
    asyncHandler((req, res) => controller.zip(req, res)),
  );

  router.get(
    '/:questionSetId',
    validate({ params: questionSetIdParamsSchema }),
    asyncHandler((req, res) => controller.listByQuestionSet(req, res)),
  );

  return router;
}
