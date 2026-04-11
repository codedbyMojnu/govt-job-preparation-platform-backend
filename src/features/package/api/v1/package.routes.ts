import type { PrismaClient } from '@prisma/client';
import type { AwilixContainer } from 'awilix';
import { Router } from 'express';

import { authenticate, authorize } from '../../../../infrastructure/middleware/authenticate.js';
import { validate } from '../../../../infrastructure/middleware/validate.js';
import { asyncHandler } from '../../../../shared/utils/async-handler.js';
import { PackageService } from '../../domain/package.service.js';
import { PackagePrismaRepository } from '../../infra/package.prisma-repository.js';
import {
  createPackageSchema,
  reviewTransactionSchema,
  submitPaymentSchema,
  updatePackageSchema,
  updateProfileSchema,
} from '../validation.js';

import { PackageController } from './package.controller.js';

export function createPackageRoutes(container: AwilixContainer): Router {
  const router = Router();

  const prisma = container.resolve<PrismaClient>('prismaClient');
  const repository = new PackagePrismaRepository(prisma);
  const service = new PackageService(repository);
  const controller = new PackageController(service);

  // --- Public: List active packages ---
  router.get(
    '/',
    asyncHandler((req, res) => controller.getAllPackages(req, res)),
  );

  // --- Member: Profile ---
  router.get(
    '/profile',
    authenticate,
    asyncHandler((req, res) => controller.getProfile(req, res)),
  );

  router.patch(
    '/profile',
    authenticate,
    validate({ body: updateProfileSchema }),
    asyncHandler((req, res) => controller.updateProfile(req, res)),
  );

  // --- Member: My active package ---
  router.get(
    '/my-package',
    authenticate,
    asyncHandler((req, res) => controller.getMyPackage(req, res)),
  );

  // --- Member: My package history ---
  router.get(
    '/my-packages',
    authenticate,
    asyncHandler((req, res) => controller.getMyPackageHistory(req, res)),
  );

  // --- Member: Submit payment ---
  router.post(
    '/payments',
    authenticate,
    validate({ body: submitPaymentSchema }),
    asyncHandler((req, res) => controller.submitPayment(req, res)),
  );

  // --- Member: Get my transactions ---
  router.get(
    '/payments',
    authenticate,
    asyncHandler((req, res) => controller.getUserTransactions(req, res)),
  );

  // --- Member: Delete pending transaction ---
  router.delete(
    '/payments/:id',
    authenticate,
    asyncHandler((req, res) => controller.deleteTransaction(req, res)),
  );

  // --- Admin: Package CRUD ---
  router.get(
    '/admin/list',
    authenticate,
    authorize('ADMIN'),
    asyncHandler((req, res) => controller.getAllPackages(req, res)),
  );

  router.post(
    '/admin',
    authenticate,
    authorize('ADMIN'),
    validate({ body: createPackageSchema }),
    asyncHandler((req, res) => controller.createPackage(req, res)),
  );

  router.patch(
    '/admin/:id',
    authenticate,
    authorize('ADMIN'),
    validate({ body: updatePackageSchema }),
    asyncHandler((req, res) => controller.updatePackage(req, res)),
  );

  router.delete(
    '/admin/:id',
    authenticate,
    authorize('ADMIN'),
    asyncHandler((req, res) => controller.deletePackage(req, res)),
  );

  // --- Admin: Transaction management ---
  router.get(
    '/admin/transactions',
    authenticate,
    authorize('ADMIN'),
    asyncHandler((req, res) => controller.getAllTransactions(req, res)),
  );

  router.post(
    '/admin/transactions/:id/approve',
    authenticate,
    authorize('ADMIN'),
    validate({ body: reviewTransactionSchema }),
    asyncHandler((req, res) => controller.approveTransaction(req, res)),
  );

  router.post(
    '/admin/transactions/:id/reject',
    authenticate,
    authorize('ADMIN'),
    validate({ body: reviewTransactionSchema }),
    asyncHandler((req, res) => controller.rejectTransaction(req, res)),
  );

  return router;
}
