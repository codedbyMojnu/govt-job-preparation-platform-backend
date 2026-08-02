import type { PrismaClient } from '@prisma/client';
import type { Worker } from 'bullmq';
import type { Redis } from 'ioredis';
import type { Logger } from 'pino';

import { createAppContainer } from '../container.js';
import { SHUTDOWN_TIMEOUT_MS } from '../shared/constants/app.constants.js';

import { startSlideWorker } from './slide-worker-bootstrap.js';

const container = createAppContainer();
const logger = container.resolve<Logger>('logger');

let slideWorker: Worker | undefined;

async function bootstrap() {
  const prisma = container.resolve<PrismaClient>('prismaClient');
  const redis = container.resolve<Redis>('redisClient');

  await prisma.$queryRaw`SELECT 1`;
  await redis.ping();

  slideWorker = await startSlideWorker(container, logger);
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
