import { z } from 'zod';

export const createPackageSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  durationDays: z.number().int().positive('Duration must be positive'),
  price: z.number().min(0, 'Price must be non-negative'),
  discount: z.number().min(0).optional(),
  description: z.string().max(2000).optional(),
  liveQuota: z.number().int().positive().optional(),
  archiveQuota: z.number().int().positive().optional(),
  sortOrder: z.number().int().min(0).optional(),
});

export const updatePackageSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  durationDays: z.number().int().positive().optional(),
  price: z.number().min(0).optional(),
  discount: z.number().min(0).optional(),
  description: z.string().max(2000).optional(),
  liveQuota: z.number().int().positive().nullable().optional(),
  archiveQuota: z.number().int().positive().nullable().optional(),
  sortOrder: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
});

export const submitPaymentSchema = z.object({
  packageId: z.string().min(1, 'Package ID is required'),
  amount: z.number().positive('Amount must be positive'),
  paymentMethod: z.enum(['BKASH', 'NAGAD', 'ROCKET']),
  mobileNumber: z.string().min(11, 'Valid mobile number is required').max(20),
  transactionId: z.string().min(1, 'Transaction ID is required').max(50),
});

export const reviewTransactionSchema = z.object({
  adminNote: z.string().max(1000).optional(),
});

export const updateProfileSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  photo: z.string().max(500).optional(),
});

export const bulkUpsertPackagesSchema = z.object({
  items: z
    .array(
      z.object({
        id: z.string().optional(),
        name: z.string().min(1).max(200),
        durationDays: z.number().int().positive(),
        price: z.number().min(0),
        discount: z.number().min(0).optional(),
        description: z.string().max(2000).optional(),
        liveQuota: z.number().int().positive().nullable().optional(),
        archiveQuota: z.number().int().positive().nullable().optional(),
        sortOrder: z.number().int().min(0).optional(),
        isActive: z.boolean().optional(),
      }),
    )
    .min(1),
});

export const bulkDeletePackagesSchema = z.object({
  ids: z.array(z.string().min(1)).min(1),
});
