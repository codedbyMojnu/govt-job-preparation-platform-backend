import type { PrismaClient } from '@prisma/client';
import type { Redis } from 'ioredis';
import type { Logger } from 'pino';

import { createApp } from './app.js';
import { config } from './config/index.js';
import { createAppContainer } from './container.js';
import { SHUTDOWN_TIMEOUT_MS } from './shared/constants/app.constants.js';

const container = createAppContainer();
const logger = container.resolve<Logger>('logger');
const app = createApp(container);

const server = app.listen(config.PORT, '0.0.0.0', () => {
  logger.info({ port: config.PORT, env: config.NODE_ENV }, 'Server started');
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
    const prisma = container.resolve<PrismaClient>('prismaClient');
    await prisma.$disconnect();
    logger.info('Prisma disconnected');

    const redis = container.resolve<Redis>('redisClient');
    redis.disconnect();
    logger.info('Redis disconnected');
  } catch (err) {
    logger.error({ err }, 'Error during shutdown');
  }

  clearTimeout(timer);
  process.exit(0);
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
