import type { PrismaClient } from '@prisma/client';

import { authMapper } from '../domain/mapper.js';
import type { AuthRepository } from '../domain/repository.contract.js';
import type { AuthUser, OtpRecord } from '../domain/types.js';

export class AuthPrismaRepository implements AuthRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findUserByMobile(mobile: string): Promise<AuthUser | null> {
    const user = await this.prisma.user.findUnique({ where: { mobile } });
    return user ? authMapper.toAuthUser(user) : null;
  }

  async findUserById(id: string): Promise<AuthUser | null> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    return user ? authMapper.toAuthUser(user) : null;
  }

  async createUser(mobile: string, hashedPassword: string): Promise<AuthUser> {
    const user = await this.prisma.user.create({
      data: { mobile, password: hashedPassword },
    });
    return authMapper.toAuthUser(user);
  }

  async updatePassword(mobile: string, hashedPassword: string): Promise<void> {
    await this.prisma.user.update({
      where: { mobile },
      data: { password: hashedPassword },
    });
  }

  async getUserPasswordHash(mobile: string): Promise<string | null> {
    const user = await this.prisma.user.findUnique({
      where: { mobile },
      select: { password: true },
    });
    return user?.password ?? null;
  }

  async createOtp(mobile: string, code: string, expiresAt: Date): Promise<OtpRecord> {
    const otp = await this.prisma.otp.create({
      data: { mobile, code, expiresAt },
    });
    return authMapper.toOtpRecord(otp);
  }

  async findValidOtp(mobile: string, code: string): Promise<OtpRecord | null> {
    const otp = await this.prisma.otp.findFirst({
      where: {
        mobile,
        code,
        verified: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });
    return otp ? authMapper.toOtpRecord(otp) : null;
  }

  async markOtpVerified(id: string): Promise<void> {
    await this.prisma.otp.update({
      where: { id },
      data: { verified: true },
    });
  }

  async incrementOtpAttempts(id: string): Promise<void> {
    await this.prisma.otp.update({
      where: { id },
      data: { attempts: { increment: 1 } },
    });
  }

  async invalidateOtps(mobile: string): Promise<void> {
    await this.prisma.otp.updateMany({
      where: { mobile, verified: false },
      data: { expiresAt: new Date() },
    });
  }

  async getFailedLoginAttempts(mobile: string): Promise<number> {
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
    return this.prisma.loginAttempt.count({
      where: {
        mobile,
        success: false,
        createdAt: { gt: fifteenMinutesAgo },
      },
    });
  }

  async getLastFailedLoginTime(mobile: string): Promise<Date | null> {
    const attempt = await this.prisma.loginAttempt.findFirst({
      where: { mobile, success: false },
      orderBy: { createdAt: 'desc' },
      select: { createdAt: true },
    });
    return attempt?.createdAt ?? null;
  }

  async recordFailedLoginAttempt(mobile: string, ipAddress?: string): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { mobile },
      select: { id: true },
    });
    await this.prisma.loginAttempt.create({
      data: {
        mobile,
        success: false,
        ...(user?.id ? { userId: user.id } : {}),
        ...(ipAddress ? { ipAddress } : {}),
      },
    });
  }

  async resetFailedLoginAttempts(mobile: string): Promise<void> {
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
    await this.prisma.loginAttempt.deleteMany({
      where: {
        mobile,
        success: false,
        createdAt: { gt: fifteenMinutesAgo },
      },
    });
  }
}
