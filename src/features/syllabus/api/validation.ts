import { z } from 'zod';

export const createSyllabusSchema = z.object({
  subExamCategoryId: z.string().min(1, 'Sub exam category ID is required'),
  title: z.string().min(1, 'Title is required').max(500),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .max(300)
    .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  content: z.string().min(1, 'Content is required'),
  sortOrder: z.number().int().min(0).optional(),
});

export const updateSyllabusSchema = z.object({
  title: z.string().min(1).max(500).optional(),
  slug: z
    .string()
    .min(1)
    .max(300)
    .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens')
    .optional(),
  content: z.string().min(1).optional(),
  sortOrder: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
});
