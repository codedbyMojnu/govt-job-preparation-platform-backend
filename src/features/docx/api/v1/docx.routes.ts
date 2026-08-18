import type { PrismaClient } from '@prisma/client';
import type { AwilixContainer } from 'awilix';
import type { Queue } from 'bullmq';
import { Router } from 'express';
import type { Client as MinioClient } from 'minio';

import { minioConfig } from '../../../../config/minio.js';
import { authenticate, authorize } from '../../../../infrastructure/middleware/authenticate.js';
import { validate } from '../../../../infrastructure/middleware/validate.js';
import { asyncHandler } from '../../../../shared/utils/async-handler.js';
import { DocxService } from '../../domain/docx.service.js';
import type { DocxGenerationJobData } from '../../infra/docx-queue.js';
import { DocxStorageService } from '../../infra/docx-storage.service.js';
import { DocxPrismaRepository } from '../../infra/docx.prisma-repository.js';
import {
  documentIdParamsSchema,
  generateDocxSchema,
  jobIdParamsSchema,
} from '../validation.js';

import { DocxController } from './docx.controller.js';

export function createDocxRoutes(container: AwilixContainer): Router {
  const router = Router();

  const prisma = container.resolve<PrismaClient>('prismaClient');
  const minioClient = container.resolve<MinioClient>('minioClient');
  const docxQueue = container.resolve<Queue<DocxGenerationJobData>>('docxQueue');

  const repository = new DocxPrismaRepository(prisma);
  const storage = new DocxStorageService(minioClient, minioConfig.bucket);
  const service = new DocxService(repository, docxQueue, storage);
  const controller = new DocxController(service);

  router.use(authenticate);

  router.post(
    '/generate',
    authorize('ADMIN'),
    validate({ body: generateDocxSchema }),
    asyncHandler((req, res) => controller.generate(req, res)),
  );

  router.get(
    '/jobs/:jobId',
    authorize('ADMIN'),
    validate({ params: jobIdParamsSchema }),
    asyncHandler((req, res) => controller.getJobStatus(req, res)),
  );

  router.get(
    '/exports/:documentId/download',
    authorize('ADMIN'),
    validate({ params: documentIdParamsSchema }),
    asyncHandler((req, res) => controller.download(req, res)),
  );

  router.get(
    '/exports/:documentId',
    authorize('ADMIN'),
    validate({ params: documentIdParamsSchema }),
    asyncHandler((req, res) => controller.getExport(req, res)),
  );

  router.delete(
    '/exports/:documentId',
    authorize('ADMIN'),
    validate({ params: documentIdParamsSchema }),
    asyncHandler((req, res) => controller.deleteExport(req, res)),
  );

  return router;
}
