import type { PrismaClient } from '@prisma/client';
import type { Worker } from 'bullmq';
import type { Redis } from 'ioredis';
import type { Logger } from 'pino';

import { createApp } from './app.js';
import { config } from './config/index.js';
import { createAppContainer } from './container.js';
import { SHUTDOWN_TIMEOUT_MS } from './shared/constants/app.constants.js';
import { startSlideWorker } from './worker/slide-worker-bootstrap.js';

const container = createAppContainer();
const logger = container.resolve<Logger>('logger');
const app = createApp(container);

let slideWorker: Worker | undefined;

const server = app.listen(config.PORT, '0.0.0.0', () => {
  logger.info({ port: config.PORT, env: config.NODE_ENV }, 'Server started');

  if (config.EMBED_SLIDE_WORKER) {
    startSlideWorker(container, logger)
      .then((worker) => {
        slideWorker = worker;
        logger.info('Embedded slide worker started (EMBED_SLIDE_WORKER)');
      })
      .catch((err) => {
        logger.error(
          { err },
          'Embedded slide worker failed to start — slide generation jobs will stay queued until worker is running',
        );
      });
  }
});

// Graceful shutdown
let isShuttingDown = false;

async function shutdown(signal: string) {
  if (isShuttingDown) {
    logger.warn('Forced shutdown');
    process.exit(1);
  }
  isShuttingDown = true;
  logger.info({ signal }, 'Shutting down gracefully...');

  // Stop accepting new connections
  server.close(() => {
    logger.info('HTTP server closed');
  });

  // Drain timeout
  const timer = setTimeout(() => {
    logger.error('Shutdown timed out, forcing exit');
    process.exit(1);
  }, SHUTDOWN_TIMEOUT_MS);

  try {
    await slideWorker?.close();
    logger.info('Slide worker closed');

    const prisma = container.resolve<PrismaClient>('prismaClient');
    await prisma.$disconnect();
    logger.info('Prisma disconnected');

    const redis = container.resolve<Redis>('redisClient');
    await redis.quit();
    logger.info('Redis disconnected');
  } catch (err) {
    logger.error({ err }, 'Error during shutdown');
  }

  clearTimeout(timer);
  process.exit(0);
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
