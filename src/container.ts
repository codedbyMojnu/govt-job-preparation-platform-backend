import { asFunction, asValue, createContainer } from 'awilix';

import { databaseConfig } from './config/database.js';
import { config } from './config/index.js';
import { loggerConfig } from './config/logger.js';
import { minioConfig } from './config/minio.js';
import { queueConfig } from './config/queue.js';
import { redisConfig } from './config/redis.js';
import { createSlideQueue } from './features/slide/infra/slide-queue.js';
import { createDocxQueue } from './features/docx/infra/docx-queue.js';
import { createBroadcastQueue } from './features/broadcast/infra/broadcast-queue.js';
import { createCacheService } from './infrastructure/cache/cache.service.js';
import { createRedisClient } from './infrastructure/cache/redis-client.js';
import { createPrismaClient } from './infrastructure/database/prisma-client.js';
import { createLogger } from './infrastructure/observability/logger.js';
import { createBullMQClient } from './infrastructure/queue/bullmq-client.js';
import { createMinioClient } from './infrastructure/storage/minio-client.js';

export function createAppContainer() {
  const container = createContainer();

  container.register({
    config: asValue(config),
    logger: asFunction(() => createLogger(loggerConfig)).singleton(),
    prismaClient: asFunction(() => createPrismaClient(databaseConfig.url)).singleton(),
    redisClient: asFunction(() => createRedisClient(redisConfig.url)).singleton(),
    cacheService: asFunction(() => {
      const redis = container.resolve('redisClient');
      return createCacheService(redis);
    }).singleton(),
    bullmqClient: asFunction(() => createBullMQClient(queueConfig.url)).singleton(),
    minioClient: asFunction(() => createMinioClient(minioConfig)).singleton(),
    slideQueue: asFunction(() => createSlideQueue(container.resolve('bullmqClient'))).singleton(),
    docxQueue: asFunction(() => createDocxQueue(container.resolve('bullmqClient'))).singleton(),
    broadcastQueue: asFunction(() =>
      createBroadcastQueue(container.resolve('bullmqClient')),
    ).singleton(),
  });

  return container;
}
