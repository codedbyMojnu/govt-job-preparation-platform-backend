import type { PrismaClient } from '@prisma/client';
import type { AwilixContainer } from 'awilix';
import { Router } from 'express';

import { authenticate, authorize } from '../../../../infrastructure/middleware/authenticate.js';
import { validate } from '../../../../infrastructure/middleware/validate.js';
import { asyncHandler } from '../../../../shared/utils/async-handler.js';
import { NotificationService } from '../../domain/notification.service.js';
import { NotificationPrismaRepository } from '../../infra/notification.prisma-repository.js';
import { createNotificationSchema, updateNotificationSchema } from '../validation.js';

import { NotificationController } from './notification.controller.js';

export function createNotificationRoutes(container: AwilixContainer): Router {
  const router = Router();

  const prisma = container.resolve<PrismaClient>('prismaClient');
  const repository = new NotificationPrismaRepository(prisma);
  const service = new NotificationService(repository);
  const controller = new NotificationController(service);

  // User routes (authenticated)
  router.get(
    '/',
    authenticate,
    asyncHandler((req, res) => controller.getForUser(req, res)),
  );

  router.get(
    '/unread-count',
    authenticate,
    asyncHandler((req, res) => controller.getUnreadCount(req, res)),
  );

  router.post(
    '/:id/read',
    authenticate,
    asyncHandler((req, res) => controller.markAsRead(req, res)),
  );

  // Admin routes
  router.get(
    '/admin',
    authenticate,
    authorize('ADMIN'),
    asyncHandler((_req, res) => controller.getAll(_req, res)),
  );

  router.post(
    '/admin',
    authenticate,
    authorize('ADMIN'),
    validate({ body: createNotificationSchema }),
    asyncHandler((req, res) => controller.create(req, res)),
  );

  router.patch(
    '/admin/:id',
    authenticate,
    authorize('ADMIN'),
    validate({ body: updateNotificationSchema }),
    asyncHandler((req, res) => controller.update(req, res)),
  );

  router.delete(
    '/admin/:id',
    authenticate,
    authorize('ADMIN'),
    asyncHandler((req, res) => controller.delete(req, res)),
  );

  return router;
}
