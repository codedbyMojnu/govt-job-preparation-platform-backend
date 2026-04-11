import type { PaymentMethod, PrismaClient } from '@prisma/client';

import { packageMapper } from '../domain/mapper.js';
import type { PackageRepository } from '../domain/repository.contract.js';
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
} from '../domain/types.js';

export class PackagePrismaRepository implements PackageRepository {
  constructor(private readonly prisma: PrismaClient) {}

  // --- Package CRUD ---

  async findAllPackages(activeOnly: boolean): Promise<PackageDto[]> {
    const packages = await this.prisma.package.findMany({
      ...(activeOnly && { where: { isActive: true } }),
      orderBy: { sortOrder: 'asc' },
    });
    return packages.map(packageMapper.toDto);
  }

  async findPackageById(id: string): Promise<PackageDto | null> {
    const pkg = await this.prisma.package.findUnique({ where: { id } });
    return pkg ? packageMapper.toDto(pkg) : null;
  }

  async createPackage(input: CreatePackageInput): Promise<PackageDto> {
    const pkg = await this.prisma.package.create({
      data: {
        name: input.name,
        durationDays: input.durationDays,
        price: input.price,
        discount: input.discount ?? 0,
        description: input.description ?? null,
        liveQuota: input.liveQuota ?? null,
        archiveQuota: input.archiveQuota ?? null,
        sortOrder: input.sortOrder ?? 0,
      },
    });
    return packageMapper.toDto(pkg);
  }

  async updatePackage(id: string, input: UpdatePackageInput): Promise<PackageDto> {
    const pkg = await this.prisma.package.update({
      where: { id },
      data: {
        ...(input.name !== undefined && { name: input.name }),
        ...(input.durationDays !== undefined && { durationDays: input.durationDays }),
        ...(input.price !== undefined && { price: input.price }),
        ...(input.discount !== undefined && { discount: input.discount }),
        ...(input.description !== undefined && { description: input.description ?? null }),
        ...(input.liveQuota !== undefined && { liveQuota: input.liveQuota ?? null }),
        ...(input.archiveQuota !== undefined && { archiveQuota: input.archiveQuota ?? null }),
        ...(input.sortOrder !== undefined && { sortOrder: input.sortOrder }),
        ...(input.isActive !== undefined && { isActive: input.isActive }),
      },
    });
    return packageMapper.toDto(pkg);
  }

  async deletePackage(id: string): Promise<void> {
    await this.prisma.package.delete({ where: { id } });
  }

  // --- Payment transactions ---

  async submitPayment(userId: string, input: SubmitPaymentInput): Promise<PaymentTransactionDto> {
    const txn = await this.prisma.paymentTransaction.create({
      data: {
        userId,
        packageId: input.packageId,
        amount: input.amount,
        paymentMethod: input.paymentMethod as PaymentMethod,
        mobileNumber: input.mobileNumber,
        transactionId: input.transactionId,
      },
      include: { package: true, user: true },
    });
    return this.mapTransactionToDto(txn);
  }

  async getUserTransactions(userId: string): Promise<PaymentTransactionDto[]> {
    const txns = await this.prisma.paymentTransaction.findMany({
      where: { userId },
      include: { package: true, user: true },
      orderBy: { createdAt: 'desc' },
    });
    return txns.map((t) => this.mapTransactionToDto(t));
  }

  async getAllTransactions(status?: string): Promise<PaymentTransactionDto[]> {
    const txns = await this.prisma.paymentTransaction.findMany({
      ...(status !== undefined && { where: { status: status as any } }),
      include: { package: true, user: true },
      orderBy: { createdAt: 'desc' },
    });
    return txns.map((t) => this.mapTransactionToDto(t));
  }

  async getTransactionById(id: string): Promise<PaymentTransactionDto | null> {
    const txn = await this.prisma.paymentTransaction.findUnique({
      where: { id },
      include: { package: true, user: true },
    });
    return txn ? this.mapTransactionToDto(txn) : null;
  }

  async approveTransaction(
    id: string,
    reviewedBy: string,
    input: ReviewTransactionInput,
  ): Promise<PaymentTransactionDto> {
    // Use a transaction to approve payment and create user package
    const result = await this.prisma.$transaction(async (tx) => {
      const txn = await tx.paymentTransaction.update({
        where: { id },
        data: {
          status: 'APPROVED',
          adminNote: input.adminNote ?? null,
          reviewedAt: new Date(),
          reviewedBy,
        },
        include: { package: true, user: true },
      });

      // Deactivate any existing active package for this user
      await tx.userPackage.updateMany({
        where: { userId: txn.userId, isActive: true },
        data: { isActive: false },
      });

      // Create new user package
      const now = new Date();
      const endDate = new Date(now);
      endDate.setDate(endDate.getDate() + txn.package.durationDays);

      await tx.userPackage.create({
        data: {
          userId: txn.userId,
          packageId: txn.packageId,
          startDate: now,
          endDate,
          isActive: true,
        },
      });

      return txn;
    });

    return this.mapTransactionToDto(result);
  }

  async rejectTransaction(
    id: string,
    reviewedBy: string,
    input: ReviewTransactionInput,
  ): Promise<PaymentTransactionDto> {
    const txn = await this.prisma.paymentTransaction.update({
      where: { id },
      data: {
        status: 'REJECTED',
        adminNote: input.adminNote ?? null,
        reviewedAt: new Date(),
        reviewedBy,
      },
      include: { package: true, user: true },
    });
    return this.mapTransactionToDto(txn);
  }

  async deleteTransaction(id: string): Promise<void> {
    await this.prisma.paymentTransaction.delete({ where: { id } });
  }

  // --- User packages ---

  async getActiveUserPackage(userId: string): Promise<UserPackageDto | null> {
    const pkg = await this.prisma.userPackage.findFirst({
      where: {
        userId,
        isActive: true,
        endDate: { gte: new Date() },
      },
      include: { package: true },
      orderBy: { endDate: 'desc' },
    });
    return pkg ? this.mapUserPackageToDto(pkg) : null;
  }

  async getUserPackages(userId: string): Promise<UserPackageDto[]> {
    const pkgs = await this.prisma.userPackage.findMany({
      where: { userId },
      include: { package: true },
      orderBy: { createdAt: 'desc' },
    });
    return pkgs.map((p) => this.mapUserPackageToDto(p));
  }

  // --- Profile ---

  async getUserProfile(userId: string): Promise<UserProfileDto | null> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) return null;

    const activePackage = await this.getActiveUserPackage(userId);

    return {
      id: user.id,
      mobile: user.mobile,
      name: user.name,
      photo: user.photo,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
      activePackage,
    };
  }

  async updateUserProfile(userId: string, input: UpdateProfileInput): Promise<UserProfileDto> {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...(input.name !== undefined && { name: input.name }),
        ...(input.photo !== undefined && { photo: input.photo ?? null }),
      },
    });
    return this.getUserProfile(userId) as Promise<UserProfileDto>;
  }

  // --- Private helpers ---

  private mapTransactionToDto(txn: {
    id: string;
    userId: string;
    packageId: string;
    amount: number;
    paymentMethod: string;
    mobileNumber: string;
    transactionId: string;
    status: string;
    adminNote: string | null;
    reviewedAt: Date | null;
    reviewedBy: string | null;
    createdAt: Date;
    package: { name: string };
    user: { name: string | null; mobile: string };
  }): PaymentTransactionDto {
    return {
      id: txn.id,
      userId: txn.userId,
      packageId: txn.packageId,
      amount: txn.amount,
      paymentMethod: txn.paymentMethod,
      mobileNumber: txn.mobileNumber,
      transactionId: txn.transactionId,
      status: txn.status,
      adminNote: txn.adminNote,
      reviewedAt: txn.reviewedAt,
      reviewedBy: txn.reviewedBy,
      createdAt: txn.createdAt,
      packageName: txn.package.name,
      userName: txn.user.name,
      userMobile: txn.user.mobile,
    };
  }

  private mapUserPackageToDto(pkg: {
    id: string;
    userId: string;
    packageId: string;
    startDate: Date;
    endDate: Date;
    liveUsed: number;
    archiveUsed: number;
    isActive: boolean;
    createdAt: Date;
    package: { name: string; liveQuota: number | null; archiveQuota: number | null };
  }): UserPackageDto {
    return {
      id: pkg.id,
      userId: pkg.userId,
      packageId: pkg.packageId,
      startDate: pkg.startDate,
      endDate: pkg.endDate,
      liveUsed: pkg.liveUsed,
      archiveUsed: pkg.archiveUsed,
      isActive: pkg.isActive,
      createdAt: pkg.createdAt,
      packageName: pkg.package.name,
      packageLiveQuota: pkg.package.liveQuota,
      packageArchiveQuota: pkg.package.archiveQuota,
    };
  }
}
