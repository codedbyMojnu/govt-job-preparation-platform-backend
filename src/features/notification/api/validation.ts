import { z } from 'zod';

export const createNotificationSchema = z.object({
  title: z.string().min(1, 'Title is required').max(300),
  content: z.string().min(1, 'Content is required'),
  type: z.enum(['PUBLIC', 'SPECIFIC']),
  targetUserId: z.string().optional(),
});

export const updateNotificationSchema = z.object({
  title: z.string().min(1).max(300).optional(),
  content: z.string().min(1).optional(),
  type: z.enum(['PUBLIC', 'SPECIFIC']).optional(),
  targetUserId: z.string().nullable().optional(),
  isActive: z.boolean().optional(),
});
