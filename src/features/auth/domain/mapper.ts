import type { Otp, User } from '@prisma/client';

import type { AuthUser, OtpRecord } from './types.js';

export const authMapper = {
  toAuthUser(user: User): AuthUser {
    return {
      id: user.id,
      mobile: user.mobile,
      name: user.name,
      photo: user.photo,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
    };
  },

  toOtpRecord(otp: Otp): OtpRecord {
    return {
      id: otp.id,
      mobile: otp.mobile,
      code: otp.code,
      expiresAt: otp.expiresAt,
      verified: otp.verified,
      attempts: otp.attempts,
    };
  },
};
