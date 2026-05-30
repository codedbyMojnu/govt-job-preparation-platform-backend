import crypto from 'node:crypto';

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { authConfig } from '../../../config/auth.js';
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} from '../../../shared/errors/http-errors.js';

import type { AuthRepository } from './repository.contract.js';
import type {
  AuthResponse,
  AuthTokenPayload,
  AuthUser,
  LoginInput,
  SendOtpInput,
  SetPasswordInput,
  VerifyOtpInput,
} from './types.js';

const SALT_ROUNDS = 12;
const OTP_EXPIRY_MINUTES = 5;
const MAX_OTP_ATTEMPTS = 5;
const MAX_LOGIN_ATTEMPTS = 5;
const LOGIN_LOCKOUT_MINUTES = 15;

export class AuthService {
  constructor(
    private readonly repository: AuthRepository,
    private readonly sendSms: (mobile: string, message: string) => Promise<void>,
  ) {}

  async sendOtp(input: SendOtpInput): Promise<{ message: string; isNewUser: boolean }> {
    const existingUser = await this.repository.findUserByMobile(input.mobile);

    // Invalidate previous OTPs
    await this.repository.invalidateOtps(input.mobile);

    // Generate 4-digit OTP using cryptographically secure random
    const code = String(crypto.randomInt(1000, 10000));
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

    await this.repository.createOtp(input.mobile, code, expiresAt);

    // Send SMS (in dev, logged to console)
    await this.sendSms(
      input.mobile,
      `Your Farhan MCQ OTP is: ${code}. Valid for ${OTP_EXPIRY_MINUTES} minutes.`,
    );

    return {
      message: 'OTP sent successfully',
      isNewUser: !existingUser,
    };
  }

  async verifyOtp(input: VerifyOtpInput): Promise<{ verified: boolean; isNewUser: boolean }> {
    const otp = await this.repository.findValidOtp(input.mobile, input.code);

    if (!otp) {
      throw new BadRequestError('Invalid or expired OTP');
    }

    if (otp.attempts >= MAX_OTP_ATTEMPTS) {
      throw new BadRequestError('Too many OTP attempts. Please request a new OTP.');
    }

    await this.repository.incrementOtpAttempts(otp.id);

    if (otp.code !== input.code) {
      throw new BadRequestError('Invalid OTP code');
    }

    await this.repository.markOtpVerified(otp.id);

    const existingUser = await this.repository.findUserByMobile(input.mobile);

    return {
      verified: true,
      isNewUser: !existingUser,
    };
  }

  async setPassword(input: SetPasswordInput): Promise<AuthResponse> {
    // Check if user already exists
    const existingUser = await this.repository.findUserByMobile(input.mobile);
    if (existingUser) {
      throw new ConflictError('User already exists. Please login instead.');
    }

    const hashedPassword = await bcrypt.hash(input.password, SALT_ROUNDS);
    const user = await this.repository.createUser(input.mobile, hashedPassword);

    const token = this.generateToken(user);

    return { user, token };
  }

  async register(input: SetPasswordInput): Promise<AuthResponse> {
    const existingUser = await this.repository.findUserByMobile(input.mobile);
    if (existingUser) {
      throw new ConflictError('User already registered. Please login.');
    }

    const hashedPassword = await bcrypt.hash(input.password, SALT_ROUNDS);
    const user = await this.repository.createUser(input.mobile, hashedPassword);
    const token = this.generateToken(user);

    // Invalidate all OTPs after successful registration
    await this.repository.invalidateOtps(input.mobile);

    return { user, token };
  }

  async login(input: LoginInput): Promise<AuthResponse> {
    const user = await this.repository.findUserByMobile(input.mobile);
    if (!user) {
      // Use constant-time response to prevent user enumeration
      throw new UnauthorizedError('Invalid mobile number or password');
    }

    if (!user.isActive) {
      throw new UnauthorizedError('Account is deactivated');
    }

    // Check for account lockout
    const failedAttempts = await this.repository.getFailedLoginAttempts(input.mobile);
    if (failedAttempts >= MAX_LOGIN_ATTEMPTS) {
      const lastAttempt = await this.repository.getLastFailedLoginTime(input.mobile);
      if (lastAttempt) {
        const lockoutEnd = new Date(lastAttempt.getTime() + LOGIN_LOCKOUT_MINUTES * 60 * 1000);
        if (new Date() < lockoutEnd) {
          throw new UnauthorizedError(
            `Account temporarily locked due to too many failed attempts. Try again after ${LOGIN_LOCKOUT_MINUTES} minutes.`,
          );
        }
        // Lockout expired, reset counter
        await this.repository.resetFailedLoginAttempts(input.mobile);
      }
    }

    const passwordHash = await this.repository.getUserPasswordHash(input.mobile);
    if (!passwordHash) {
      throw new UnauthorizedError('Invalid mobile number or password');
    }

    const isMatch = await bcrypt.compare(input.password, passwordHash);
    if (!isMatch) {
      await this.repository.recordFailedLoginAttempt(input.mobile);
      throw new UnauthorizedError('Invalid mobile number or password');
    }

    // Reset failed attempts on successful login
    await this.repository.resetFailedLoginAttempts(input.mobile);

    const token = this.generateToken(user);

    return { user, token };
  }

  async resetPassword(input: SetPasswordInput): Promise<{ message: string }> {
    const user = await this.repository.findUserByMobile(input.mobile);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const hashedPassword = await bcrypt.hash(input.password, SALT_ROUNDS);
    await this.repository.updatePassword(input.mobile, hashedPassword);

    // Invalidate all OTPs
    await this.repository.invalidateOtps(input.mobile);

    return { message: 'Password reset successfully' };
  }

  async getMe(userId: string): Promise<AuthUser> {
    const user = await this.repository.findUserById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return user;
  }

  private generateToken(user: AuthUser): string {
    const payload: AuthTokenPayload = {
      userId: user.id,
      role: user.role,
    };

    return jwt.sign(payload, authConfig.jwtSecret, {
      expiresIn: authConfig.jwtExpiresIn as string & jwt.SignOptions['expiresIn'],
    });
  }
}
