import type {
  BulkUpsertPackageItem,
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

export interface PackageRepository {
  // Package CRUD
  findAllPackages(activeOnly: boolean): Promise<PackageDto[]>;
  findPackageById(id: string): Promise<PackageDto | null>;
  createPackage(input: CreatePackageInput): Promise<PackageDto>;
  updatePackage(id: string, input: UpdatePackageInput): Promise<PackageDto>;
  deletePackage(id: string): Promise<void>;

  // Payment transactions
  submitPayment(userId: string, input: SubmitPaymentInput): Promise<PaymentTransactionDto>;
  getUserTransactions(userId: string): Promise<PaymentTransactionDto[]>;
  getAllTransactions(status?: string): Promise<PaymentTransactionDto[]>;
  getTransactionById(id: string): Promise<PaymentTransactionDto | null>;
  approveTransaction(
    id: string,
    reviewedBy: string,
    input: ReviewTransactionInput,
  ): Promise<PaymentTransactionDto>;
  rejectTransaction(
    id: string,
    reviewedBy: string,
    input: ReviewTransactionInput,
  ): Promise<PaymentTransactionDto>;
  deleteTransaction(id: string): Promise<void>;

  // User packages
  getActiveUserPackage(userId: string): Promise<UserPackageDto | null>;
  getUserPackages(userId: string): Promise<UserPackageDto[]>;

  // Profile
  getUserProfile(userId: string): Promise<UserProfileDto | null>;
  updateUserProfile(userId: string, input: UpdateProfileInput): Promise<UserProfileDto>;

  // Bulk operations
  bulkUpsertPackages(items: BulkUpsertPackageItem[]): Promise<PackageDto[]>;
  bulkDeletePackages(ids: string[]): Promise<void>;
}
