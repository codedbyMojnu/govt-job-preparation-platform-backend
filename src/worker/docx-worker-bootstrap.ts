import type { PrismaClient } from '@prisma/client';
import type { Queue } from 'bullmq';
import { Worker } from 'bullmq';
import type { AwilixContainer } from 'awilix';
import type { Redis } from 'ioredis';
import type { Client as MinioClient } from 'minio';
import type { Logger } from 'pino';

import { minioConfig } from '../config/minio.js';
import { DocxService } from '../features/docx/domain/docx.service.js';
import { DOCX_QUEUE_NAME, type DocxGenerationJobData } from '../features/docx/infra/docx-queue.js';
import { DocxStorageService } from '../features/docx/infra/docx-storage.service.js';
import { DocxPrismaRepository } from '../features/docx/infra/docx.prisma-repository.js';
import { ensureBucket } from '../infrastructure/storage/ensure-bucket.js';

import { createDocxJobProcessor } from './docx-job-processor.js';

export async function startDocxWorker(
  container: AwilixContainer,
  logger: Logger,
): Promise<Worker> {
  const prisma = container.resolve<PrismaClient>('prismaClient');
  const minio = container.resolve<MinioClient>('minioClient');
  const bullmqConnection = container.resolve<Redis>('bullmqClient');
  const docxQueue = container.resolve<Queue<DocxGenerationJobData>>('docxQueue');

  await ensureBucket(minio, minioConfig.bucket, logger);

  const repository = new DocxPrismaRepository(prisma);
  const storage = new DocxStorageService(minio, minioConfig.bucket);
  const service = new DocxService(repository, docxQueue, storage);
  const processor = createDocxJobProcessor(service, logger);

  const worker = new Worker(DOCX_QUEUE_NAME, processor, {
    connection: bullmqConnection,
    concurrency: 1,
  });

  worker.on('failed', (job, err) => {
    logger.error({ jobId: job?.id, err }, 'Docx generation job failed (BullMQ)');
  });

  logger.info('Docx worker ready');
  return worker;
}
