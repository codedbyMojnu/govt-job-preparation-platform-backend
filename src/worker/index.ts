import type { PrismaClient } from '@prisma/client';
import { Worker } from 'bullmq';
import type { Redis } from 'ioredis';
import type { Client as MinioClient } from 'minio';
import type { Logger } from 'pino';

import { minioConfig } from '../config/minio.js';
import { createAppContainer } from '../container.js';
import { registerFonts } from '../features/slide/domain/render/index.js';
import { SLIDE_QUEUE_NAME } from '../features/slide/infra/slide-queue.js';
import { SlideStorageService } from '../features/slide/infra/slide-storage.service.js';
import { SlidePrismaRepository } from '../features/slide/infra/slide.prisma-repository.js';
import { ensureBucket } from '../infrastructure/storage/ensure-bucket.js';
import { SHUTDOWN_TIMEOUT_MS } from '../shared/constants/app.constants.js';

import { createSlideJobProcessor } from './slide-job-processor.js';

const container = createAppContainer();
const logger = container.resolve<Logger>('logger');

let slideWorker: Worker | undefined;

async function bootstrap() {
  const prisma = container.resolve<PrismaClient>('prismaClient');
  const redis = container.resolve<Redis>('redisClient');
  const minio = container.resolve<MinioClient>('minioClient');
  const bullmqConnection = container.resolve<Redis>('bullmqClient');

  await prisma.$queryRaw`SELECT 1`;
  await redis.ping();
  await ensureBucket(minio, minioConfig.bucket, logger);
  registerFonts();

  const repository = new SlidePrismaRepository(prisma);
  const storage = new SlideStorageService(minio, minioConfig.bucket);
  const processor = createSlideJobProcessor(repository, storage, logger);

  slideWorker = new Worker(SLIDE_QUEUE_NAME, processor, {
    connection: bullmqConnection,
    concurrency: 1,
  });
  slideWorker.on('failed', (job, err) => {
    logger.error({ jobId: job?.id, err }, 'Slide generation job failed (BullMQ)');
  });

  logger.info({ bucket: minioConfig.bucket }, 'Slide worker ready');
}

let isShuttingDown = false;

async function shutdown(signal: string) {
  if (isShuttingDown) {
    logger.warn('Forced shutdown');
    process.exit(1);
  }
  isShuttingDown = true;
  logger.info({ signal }, 'Slide worker shutting down gracefully...');

  const timer = setTimeout(() => {
    logger.error('Slide worker shutdown timed out, forcing exit');
    process.exit(1);
  }, SHUTDOWN_TIMEOUT_MS);

  try {
    await slideWorker?.close();
    await container.resolve<PrismaClient>('prismaClient').$disconnect();
    await container.resolve<Redis>('redisClient').quit();
  } catch (err) {
    logger.error({ err }, 'Error during slide worker shutdown');
  }

  clearTimeout(timer);
  process.exit(0);
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

bootstrap().catch((err) => {
  logger.error({ err }, 'Slide worker failed to start');
  process.exit(1);
});
