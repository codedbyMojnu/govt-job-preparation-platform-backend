import type { Request, Response } from 'express';

import { HttpStatus } from '../../../../shared/constants/http-status.js';
import type { PackageService } from '../../domain/package.service.js';
import type {
  BulkUpsertPackageItem,
  CreatePackageInput,
  ReviewTransactionInput,
  SubmitPaymentInput,
  UpdatePackageInput,
  UpdateProfileInput,
} from '../../domain/types.js';

export class PackageController {
  constructor(private readonly service: PackageService) {}

  // --- Package CRUD (admin) ---

  async getAllPackages(req: Request, res: Response): Promise<void> {
    const activeOnly = req.query.activeOnly !== 'false';
    const packages = await this.service.getAllPackages(activeOnly);
    res.status(HttpStatus.OK).json({ data: packages });
  }

  async getPackageById(req: Request, res: Response): Promise<void> {
    const pkg = await this.service.getPackageById(req.params.id!);
    res.status(HttpStatus.OK).json({ data: pkg });
  }

  async createPackage(req: Request, res: Response): Promise<void> {
    const input: CreatePackageInput = req.body;
    const pkg = await this.service.createPackage(input);
    res.status(HttpStatus.CREATED).json({ data: pkg });
  }

  async updatePackage(req: Request, res: Response): Promise<void> {
    const input: UpdatePackageInput = req.body;
    const pkg = await this.service.updatePackage(req.params.id!, input);
    res.status(HttpStatus.OK).json({ data: pkg });
  }

  async deletePackage(req: Request, res: Response): Promise<void> {
    await this.service.deletePackage(req.params.id!);
    res.status(HttpStatus.NO_CONTENT).send();
  }

  // --- Payment transactions (member) ---

  async submitPayment(req: Request, res: Response): Promise<void> {
    const userId = req.userId!;
    const input: SubmitPaymentInput = req.body;
    const txn = await this.service.submitPayment(userId, input);
    res.status(HttpStatus.CREATED).json({ data: txn });
  }

  async getUserTransactions(req: Request, res: Response): Promise<void> {
    const userId = req.userId!;
    const txns = await this.service.getUserTransactions(userId);
    res.status(HttpStatus.OK).json({ data: txns });
  }

  async deleteTransaction(req: Request, res: Response): Promise<void> {
    const userId = req.userId!;
    await this.service.deleteTransaction(req.params.id!, userId);
    res.status(HttpStatus.NO_CONTENT).send();
  }

  // --- Payment transactions (admin) ---

  async getAllTransactions(req: Request, res: Response): Promise<void> {
    const status = req.query.status as string | undefined;
    const txns = await this.service.getAllTransactions(status);
    res.status(HttpStatus.OK).json({ data: txns });
  }

  async approveTransaction(req: Request, res: Response): Promise<void> {
    const reviewedBy = req.userId!;
    const input: ReviewTransactionInput = req.body;
    const txn = await this.service.approveTransaction(req.params.id!, reviewedBy, input);
    res.status(HttpStatus.OK).json({ data: txn });
  }

  async rejectTransaction(req: Request, res: Response): Promise<void> {
    const reviewedBy = req.userId!;
    const input: ReviewTransactionInput = req.body;
    const txn = await this.service.rejectTransaction(req.params.id!, reviewedBy, input);
    res.status(HttpStatus.OK).json({ data: txn });
  }

  // --- User packages ---

  async getMyPackage(req: Request, res: Response): Promise<void> {
    const userId = req.userId!;
    const pkg = await this.service.getActiveUserPackage(userId);
    res.status(HttpStatus.OK).json({ data: pkg });
  }

  async getMyPackageHistory(req: Request, res: Response): Promise<void> {
    const userId = req.userId!;
    const pkgs = await this.service.getUserPackages(userId);
    res.status(HttpStatus.OK).json({ data: pkgs });
  }

  // --- Profile ---

  async getProfile(req: Request, res: Response): Promise<void> {
    const userId = req.userId!;
    const profile = await this.service.getUserProfile(userId);
    res.status(HttpStatus.OK).json({ data: profile });
  }

  async updateProfile(req: Request, res: Response): Promise<void> {
    const userId = req.userId!;
    const input: UpdateProfileInput = req.body;
    const profile = await this.service.updateUserProfile(userId, input);
    res.status(HttpStatus.OK).json({ data: profile });
  }

  async bulkUpsertPackages(req: Request, res: Response): Promise<void> {
    const items: BulkUpsertPackageItem[] = req.body.items;
    const result = await this.service.bulkUpsertPackages(items);
    res.status(HttpStatus.OK).json({ data: result });
  }

  async bulkDeletePackages(req: Request, res: Response): Promise<void> {
    const ids: string[] = req.body.ids;
    await this.service.bulkDeletePackages(ids);
    res.status(HttpStatus.NO_CONTENT).send();
  }
}
