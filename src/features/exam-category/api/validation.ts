import { z } from 'zod';

export const createExamCategorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .max(200)
    .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  icon: z.string().optional(),
  sortOrder: z.number().int().min(0).optional(),
});

export const updateExamCategorySchema = z.object({
  name: z.string().min(1).max(200).optional(),
  slug: z
    .string()
    .min(1)
    .max(200)
    .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens')
    .optional(),
  icon: z.string().optional(),
  sortOrder: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
});

export const bulkUpsertExamCategoriesSchema = z.object({
  items: z
    .array(
      z.object({
        id: z.string().optional(),
        name: z.string().min(1).max(200),
        slug: z
          .string()
          .min(1)
          .max(200)
          .regex(/^[a-z0-9-]+$/),
        icon: z.string().optional(),
        sortOrder: z.number().int().min(0).optional(),
        isActive: z.boolean().optional(),
      }),
    )
    .min(1),
});

export const bulkDeleteExamCategoriesSchema = z.object({
  ids: z.array(z.string().min(1)).min(1),
});
