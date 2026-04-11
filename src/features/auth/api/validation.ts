import { z } from 'zod';

const bdMobileRegex = /^01[3-9]\d{8}$/;

export const sendOtpSchema = z.object({
  mobile: z
    .string()
    .length(11, 'Mobile number must be 11 digits')
    .regex(bdMobileRegex, 'Invalid Bangladeshi mobile number'),
});

export const verifyOtpSchema = z.object({
  mobile: z
    .string()
    .length(11, 'Mobile number must be 11 digits')
    .regex(bdMobileRegex, 'Invalid Bangladeshi mobile number'),
  code: z
    .string()
    .length(4, 'OTP must be 4 digits')
    .regex(/^\d{4}$/, 'OTP must be numeric'),
});

export const setPasswordSchema = z.object({
  mobile: z
    .string()
    .length(11, 'Mobile number must be 11 digits')
    .regex(bdMobileRegex, 'Invalid Bangladeshi mobile number'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password too long'),
});

export const loginSchema = z.object({
  mobile: z
    .string()
    .length(11, 'Mobile number must be 11 digits')
    .regex(bdMobileRegex, 'Invalid Bangladeshi mobile number'),
  password: z.string().min(1, 'Password is required'),
});
