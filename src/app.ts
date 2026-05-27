import type { AwilixContainer } from 'awilix';
import compression from 'compression';
import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import type { Logger } from 'pino';

import { config } from './config/index.js';
import { createAuthRoutes } from './features/auth/index.js';
import { createExamCategoryRoutes } from './features/exam-category/index.js';
import { createJobCircularRoutes } from './features/job-circular/index.js';
import { createNotificationRoutes } from './features/notification/index.js';
import { createPackageRoutes } from './features/package/index.js';
import { createQuestionSetRoutes } from './features/question-set/index.js';
import { createRoutineRoutes } from './features/routine/index.js';
import { createSubExamCategoryRoutes } from './features/sub-exam-category/index.js';
import { createSyllabusRoutes } from './features/syllabus/index.js';
import { correlationIdMiddleware } from './infrastructure/middleware/correlation-id.js';
import { errorHandler } from './infrastructure/middleware/error-handler.js';
import { notFoundHandler } from './infrastructure/middleware/not-found.js';
import { createRequestContextMiddleware } from './infrastructure/middleware/request-context.js';
import { createRequestLoggerMiddleware } from './infrastructure/middleware/request-logger.js';

export function createApp(container: AwilixContainer) {
  const app = express();
  const logger = container.resolve<Logger>('logger');

  // Security
  app.use(helmet());
  app.use(
    cors({
      origin: config.CORS_ORIGINS === '*' ? '*' : config.CORS_ORIGINS.split(','),
      credentials: true,
    }),
  );

  // Enable ETag support
  app.set('etag', 'strong');

  // Response compression (gzip/brotli) — skip for small responses
  app.use(compression({ threshold: 1024 }));

  // Per-user rate limiting: 200 req/min on API routes
  const apiLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => (req.headers['x-user-id'] as string) || req.ip || 'unknown',
    message: { error: 'Too many requests, please try again later.' },
    skip: (req) => req.path === '/api/health',
  });
  app.use('/api/', apiLimiter);

  // Body parsing
  app.use(express.json({ limit: '1mb' }));

  // Middleware pipeline (order matters)
  app.use(correlationIdMiddleware);
  app.use(createRequestLoggerMiddleware(logger));
  app.use(createRequestContextMiddleware(container));

  // Health check
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // API routes
  app.use('/api/v1/auth', createAuthRoutes(container));
  app.use('/api/v1/exam-categories', createExamCategoryRoutes(container));
  app.use('/api/v1/sub-exam-categories', createSubExamCategoryRoutes(container));
  app.use('/api/v1/notifications', createNotificationRoutes(container));
  app.use('/api/v1/packages', createPackageRoutes(container));
  app.use('/api/v1/question-sets', createQuestionSetRoutes(container));
  app.use('/api/v1/routines', createRoutineRoutes(container));
  app.use('/api/v1/syllabuses', createSyllabusRoutes(container));
  app.use('/api/v1/job-circulars', createJobCircularRoutes(container));

  // Terminal middleware
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
