import type { PrismaClient } from '@prisma/client';
import { Worker } from 'bullmq';
import type { AwilixContainer } from 'awilix';
import type { Redis } from 'ioredis';
import type { Client as MinioClient } from 'minio';
import type { Logger } from 'pino';

import { minioConfig } from '../config/minio.js';
import { registerFonts } from '../features/slide/domain/render/index.js';
import { SLIDE_QUEUE_NAME } from '../features/slide/infra/slide-queue.js';
import { SlideStorageService } from '../features/slide/infra/slide-storage.service.js';
import { SlidePrismaRepository } from '../features/slide/infra/slide.prisma-repository.js';
import { ensureBucket } from '../infrastructure/storage/ensure-bucket.js';

import { createSlideJobProcessor } from './slide-job-processor.js';

export async function startSlideWorker(
  container: AwilixContainer,
  logger: Logger,
): Promise<Worker> {
  const prisma = container.resolve<PrismaClient>('prismaClient');
  const minio = container.resolve<MinioClient>('minioClient');
  const bullmqConnection = container.resolve<Redis>('bullmqClient');

  await ensureBucket(minio, minioConfig.bucket, logger);
  registerFonts();

  const repository = new SlidePrismaRepository(prisma);
  const storage = new SlideStorageService(minio, minioConfig.bucket);
  const processor = createSlideJobProcessor(repository, storage, logger);

  const worker = new Worker(SLIDE_QUEUE_NAME, processor, {
    connection: bullmqConnection,
    concurrency: 1,
  });

  worker.on('failed', (job, err) => {
    logger.error({ jobId: job?.id, err }, 'Slide generation job failed (BullMQ)');
  });

  logger.info({ bucket: minioConfig.bucket }, 'Slide worker ready');
  return worker;
}
