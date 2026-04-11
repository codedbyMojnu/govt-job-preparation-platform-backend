import { z } from 'zod';

export const createSubExamCategorySchema = z.object({
  examCategoryId: z.string().min(1, 'Exam category ID is required'),
  name: z.string().min(1, 'Name is required').max(300),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .max(300)
    .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  description: z.string().max(2000).optional(),
  sortOrder: z.number().int().min(0).optional(),
});

export const updateSubExamCategorySchema = z.object({
  name: z.string().min(1).max(300).optional(),
  slug: z
    .string()
    .min(1)
    .max(300)
    .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens')
    .optional(),
  description: z.string().max(2000).optional(),
  sortOrder: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
});
