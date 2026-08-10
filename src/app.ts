import type { AwilixContainer } from 'awilix';
import compression from 'compression';
import cors from 'cors';
import express from 'express';
import rateLimit, { ipKeyGenerator } from 'express-rate-limit';
import helmet from 'helmet';
import type { Logger } from 'pino';

import { config } from './config/index.js';
import { createAiProviderKeyRoutes } from './features/ai-provider-key/index.js';
import {
  createBroadcastLogRoutes,
  createIntegrationCredentialRoutes,
  createAutomationRuleRoutes,
} from './features/broadcast/index.js';
import { createAuthRoutes } from './features/auth/index.js';
import { createExamCategoryRoutes } from './features/exam-category/index.js';
import { createJobCircularRoutes } from './features/job-circular/index.js';
import { createNotificationRoutes } from './features/notification/index.js';
import { createPackageRoutes } from './features/package/index.js';
import { createPdfRoutes } from './features/pdf/index.js';
import { createQuestionSetRoutes } from './features/question-set/index.js';
import { createRoutineRoutes } from './features/routine/index.js';
import { createSlideRoutes } from './features/slide/index.js';
import { createSubExamCategoryRoutes } from './features/sub-exam-category/index.js';
import { createSyllabusRoutes } from './features/syllabus/index.js';
import { createVideoRoutes } from './features/video/index.js';
import { correlationIdMiddleware } from './infrastructure/middleware/correlation-id.js';
import { errorHandler } from './infrastructure/middleware/error-handler.js';
import { hpp } from './infrastructure/middleware/hpp.js';
import { notFoundHandler } from './infrastructure/middleware/not-found.js';
import { createRequestContextMiddleware } from './infrastructure/middleware/request-context.js';
import { createRequestLoggerMiddleware } from './infrastructure/middleware/request-logger.js';
import { requestTimeout } from './infrastructure/middleware/request-timeout.js';
import { sanitizeInput } from './infrastructure/middleware/sanitize.js';
import { securityHeaders } from './infrastructure/middleware/security-headers.js';

export function createApp(container: AwilixContainer) {
  const app = express();
  const logger = container.resolve<Logger>('logger');

  // Disable 'X-Powered-By' header to reduce fingerprinting
  app.disable('x-powered-by');

  // Security headers (Helmet + custom)
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'none'"],
          scriptSrc: ["'none'"],
          styleSrc: ["'none'"],
          imgSrc: ["'none'"],
          connectSrc: ["'self'"],
          fontSrc: ["'none'"],
          objectSrc: ["'none'"],
          mediaSrc: ["'none'"],
          frameSrc: ["'none'"],
          formAction: ["'self'"],
          frameAncestors: ["'none'"],
          baseUri: ["'self'"],
          upgradeInsecureRequests: [],
        },
      },
      crossOriginEmbedderPolicy: true,
      crossOriginOpenerPolicy: { policy: 'same-origin' },
      crossOriginResourcePolicy: { policy: 'same-origin' },
      dnsPrefetchControl: { allow: false },
      hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
      ieNoOpen: true,
      noSniff: true,
      referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
      xssFilter: true,
    }),
  );
  app.use(securityHeaders);

  app.use(
    cors({
      origin: config.CORS_ORIGINS === '*' ? '*' : config.CORS_ORIGINS.split(','),
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Correlation-Id'],
      maxAge: 86400,
    }),
  );

  // Enable ETag support
  app.set('etag', 'strong');

  // Request timeout protection (30 seconds)
  app.use(requestTimeout(30_000));

  // Response compression (gzip/brotli) — skip for small responses
  app.use(compression({ threshold: 1024 }));

  // Global rate limiting: 200 req/min on API routes
  const apiLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => (req.headers['x-user-id'] as string) || ipKeyGenerator(req.ip),
    message: { error: 'Too many requests, please try again later.' },
    skip: (req) => req.path === '/api/health',
  });
  app.use('/api/', apiLimiter);

  // Stricter rate limiting on auth routes (brute force protection)
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => ipKeyGenerator(req.ip),
    message: {
      error: 'Too many authentication attempts. Please try again later.',
    },
  });

  if (config.NODE_ENV !== 'development') {
    app.use('/api/', apiLimiter);
    app.use('/api/v1/auth/', authLimiter);
  }

  // Body parsing with strict size limits
  app.use(express.json({ limit: '2mb' }));
  app.use(express.urlencoded({ extended: false, limit: '2mb' }));

  // HTTP Parameter Pollution protection
  app.use(hpp);

  // Input sanitization (XSS prevention)
  app.use(sanitizeInput);

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
  app.use('/api/v1/slides', createSlideRoutes(container));
  app.use('/api/v1/videos', createVideoRoutes(container));
  app.use('/api/v1/pdfs', createPdfRoutes(container));
  app.use('/api/v1/ai-provider-keys', createAiProviderKeyRoutes(container));
  app.use('/api/v1/integration-credentials', createIntegrationCredentialRoutes(container));
  app.use('/api/v1/broadcasts', createBroadcastLogRoutes(container));
  app.use('/api/v1/broadcast-automation/rules', createAutomationRuleRoutes(container));

  // Terminal middleware
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
