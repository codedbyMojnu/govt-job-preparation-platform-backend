import type { AuthUser, OtpRecord } from './types.js';

export interface AuthRepository {
  findUserByMobile(mobile: string): Promise<AuthUser | null>;
  findUserById(id: string): Promise<AuthUser | null>;
  createUser(mobile: string, hashedPassword: string): Promise<AuthUser>;
  updatePassword(mobile: string, hashedPassword: string): Promise<void>;
  getUserPasswordHash(mobile: string): Promise<string | null>;

  createOtp(mobile: string, code: string, expiresAt: Date): Promise<OtpRecord>;
  findValidOtp(mobile: string, code: string): Promise<OtpRecord | null>;
  markOtpVerified(id: string): Promise<void>;
  incrementOtpAttempts(id: string): Promise<void>;
  invalidateOtps(mobile: string): Promise<void>;

  // Login attempt tracking for brute-force protection
  getFailedLoginAttempts(mobile: string): Promise<number>;
  getLastFailedLoginTime(mobile: string): Promise<Date | null>;
  recordFailedLoginAttempt(mobile: string): Promise<void>;
  resetFailedLoginAttempts(mobile: string): Promise<void>;
}
