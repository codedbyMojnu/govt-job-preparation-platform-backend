import { BadRequestError, NotFoundError } from '../../../shared/errors/http-errors.js';

import type { PackageRepository } from './repository.contract.js';
import type {
  CreatePackageInput,
  PackageDto,
  PaymentTransactionDto,
  ReviewTransactionInput,
  SubmitPaymentInput,
  UpdatePackageInput,
  UpdateProfileInput,
  UserPackageDto,
  UserProfileDto,
} from './types.js';

export class PackageService {
  constructor(private readonly repository: PackageRepository) {}

  // --- Package CRUD (admin) ---

  async getAllPackages(activeOnly = true): Promise<PackageDto[]> {
    return this.repository.findAllPackages(activeOnly);
  }

  async getPackageById(id: string): Promise<PackageDto> {
    const pkg = await this.repository.findPackageById(id);
    if (!pkg) {
      throw new NotFoundError('Package not found');
    }
    return pkg;
  }

  async createPackage(input: CreatePackageInput): Promise<PackageDto> {
    return this.repository.createPackage(input);
  }

  async updatePackage(id: string, input: UpdatePackageInput): Promise<PackageDto> {
    await this.getPackageById(id);
    return this.repository.updatePackage(id, input);
  }

  async deletePackage(id: string): Promise<void> {
    await this.getPackageById(id);
    return this.repository.deletePackage(id);
  }

  // --- Payment transactions ---

  async submitPayment(userId: string, input: SubmitPaymentInput): Promise<PaymentTransactionDto> {
    const pkg = await this.repository.findPackageById(input.packageId);
    if (!pkg) {
      throw new NotFoundError('Package not found');
    }
    if (!pkg.isActive) {
      throw new BadRequestError('This package is no longer available');
    }
    return this.repository.submitPayment(userId, input);
  }

  async getUserTransactions(userId: string): Promise<PaymentTransactionDto[]> {
    return this.repository.getUserTransactions(userId);
  }

  async getAllTransactions(status?: string): Promise<PaymentTransactionDto[]> {
    return this.repository.getAllTransactions(status);
  }

  async approveTransaction(
    transactionId: string,
    reviewedBy: string,
    input: ReviewTransactionInput,
  ): Promise<PaymentTransactionDto> {
    const txn = await this.repository.getTransactionById(transactionId);
    if (!txn) {
      throw new NotFoundError('Transaction not found');
    }
    if (txn.status !== 'PENDING') {
      throw new BadRequestError('Transaction is already reviewed');
    }

    // Approve the transaction
    const approved = await this.repository.approveTransaction(transactionId, reviewedBy, input);

    return approved;
  }

  async rejectTransaction(
    transactionId: string,
    reviewedBy: string,
    input: ReviewTransactionInput,
  ): Promise<PaymentTransactionDto> {
    const txn = await this.repository.getTransactionById(transactionId);
    if (!txn) {
      throw new NotFoundError('Transaction not found');
    }
    if (txn.status !== 'PENDING') {
      throw new BadRequestError('Transaction is already reviewed');
    }
    return this.repository.rejectTransaction(transactionId, reviewedBy, input);
  }

  async deleteTransaction(transactionId: string, userId: string): Promise<void> {
    const txn = await this.repository.getTransactionById(transactionId);
    if (!txn) {
      throw new NotFoundError('Transaction not found');
    }
    if (txn.userId !== userId) {
      throw new BadRequestError('You can only delete your own transactions');
    }
    if (txn.status !== 'PENDING') {
      throw new BadRequestError('Only pending transactions can be deleted');
    }
    return this.repository.deleteTransaction(transactionId);
  }

  // --- User packages ---

  async getActiveUserPackage(userId: string): Promise<UserPackageDto | null> {
    return this.repository.getActiveUserPackage(userId);
  }

  async getUserPackages(userId: string): Promise<UserPackageDto[]> {
    return this.repository.getUserPackages(userId);
  }

  async hasActivePackage(userId: string): Promise<boolean> {
    const pkg = await this.repository.getActiveUserPackage(userId);
    return pkg !== null;
  }

  // --- Profile ---

  async getUserProfile(userId: string): Promise<UserProfileDto> {
    const profile = await this.repository.getUserProfile(userId);
    if (!profile) {
      throw new NotFoundError('User not found');
    }
    return profile;
  }

  async updateUserProfile(userId: string, input: UpdateProfileInput): Promise<UserProfileDto> {
    return this.repository.updateUserProfile(userId, input);
  }
}
