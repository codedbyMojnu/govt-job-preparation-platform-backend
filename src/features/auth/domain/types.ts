export interface AuthUser {
  id: string;
  mobile: string;
  name: string | null;
  photo: string | null;
  role: 'USER' | 'ADMIN';
  isActive: boolean;
  createdAt: Date;
}

export interface CreateUserInput {
  mobile: string;
  password: string;
}

export interface LoginInput {
  mobile: string;
  password: string;
}

export interface SendOtpInput {
  mobile: string;
}

export interface VerifyOtpInput {
  mobile: string;
  code: string;
}

export interface SetPasswordInput {
  mobile: string;
  password: string;
}

export interface ResetPasswordInput {
  mobile: string;
  password: string;
}

export interface OtpRecord {
  id: string;
  mobile: string;
  code: string;
  expiresAt: Date;
  verified: boolean;
  attempts: number;
}

export interface AuthTokenPayload {
  userId: string;
  role: 'USER' | 'ADMIN';
}

export interface AuthResponse {
  user: AuthUser;
  token: string;
}
