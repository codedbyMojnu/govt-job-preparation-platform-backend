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
}
