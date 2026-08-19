import type { PrismaClient } from '@prisma/client';
import type { AwilixContainer } from 'awilix';
import { Router } from 'express';
import type { Logger } from 'pino';

import type { Env } from '../../../../config/env.schema.js';
import { authenticate } from '../../../../infrastructure/middleware/authenticate.js';
import { validate } from '../../../../infrastructure/middleware/validate.js';
import { asyncHandler } from '../../../../shared/utils/async-handler.js';
import { AuthService } from '../../domain/auth.service.js';
import { AuthPrismaRepository } from '../../infra/auth.prisma-repository.js';
import { createSmsService } from '../../infra/sms.service.js';
import { loginSchema, sendOtpSchema, setPasswordSchema, verifyOtpSchema } from '../validation.js';

import { AuthController } from './auth.controller.js';

export function createAuthRoutes(container: AwilixContainer): Router {
  const router = Router();

  const prisma = container.resolve<PrismaClient>('prismaClient');
  const logger = container.resolve<Logger>('logger');
  const appConfig = container.resolve<Env>('config');

  const repository = new AuthPrismaRepository(prisma);
  const smsService = createSmsService(logger, {
    nodeEnv: appConfig.NODE_ENV,
    apiKey: appConfig.MIMSMS_API_KEY,
    userName: appConfig.MIMSMS_USER_NAME,
    senderName: appConfig.MIMSMS_SENDER_NAME,
    nodeEnv: appConfig.NODE_ENV,
  });
  const authService = new AuthService(repository, smsService.send.bind(smsService));
  const controller = new AuthController(authService);

  // Public routes
  router.post(
    '/send-otp',
    validate({ body: sendOtpSchema }),
    asyncHandler((req, res) => controller.sendOtp(req, res)),
  );

  router.post(
    '/verify-otp',
    validate({ body: verifyOtpSchema }),
    asyncHandler((req, res) => controller.verifyOtp(req, res)),
  );

  router.post(
    '/register',
    validate({ body: setPasswordSchema }),
    asyncHandler((req, res) => controller.register(req, res)),
  );

  router.post(
    '/login',
    validate({ body: loginSchema }),
    asyncHandler((req, res) => controller.login(req, res)),
  );

  router.post(
    '/reset-password',
    validate({ body: setPasswordSchema }),
    asyncHandler((req, res) => controller.resetPassword(req, res)),
  );

  // Protected routes
  router.get(
    '/me',
    authenticate,
    asyncHandler((req, res) => controller.getMe(req, res)),
  );

  return router;
}
