import { z } from 'zod';

const orgTypeEnum = z.enum(['GOVERNMENT', 'PRIVATE', 'AUTONOMOUS', 'NGO']);
const statusEnum = z.enum(['LIVE', 'UPCOMING', 'EXPIRED']);

export const createJobCircularSchema = z.object({
  gjobId: z.string().max(50).optional(),
  organizationName: z.string().min(1, 'Organization name is required').max(500),
  organizationSlug: z
    .string()
    .min(1, 'Organization slug is required')
    .max(500)
    .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase letters, numbers and hyphens'),
  orgType: orgTypeEnum.optional(),
  logoUrl: z.string().url().max(1000).optional().or(z.literal('')),
  title: z.string().min(1, 'Title is required').max(500),
  totalPosts: z.number().int().min(0).optional(),
  applicationUrl: z.string().url().max(1000).optional().or(z.literal('')),
  publishDate: z.string().optional(),
  deadline: z.string().optional(),
  examDate: z.string().optional(),
  description: z.string().optional(),
  eligibility: z.string().optional(),
  salary: z.string().max(500).optional(),
  experience: z.string().max(500).optional(),
  location: z.string().max(500).optional(),
  source: z.string().url().max(1000).optional().or(z.literal('')),
  category: z.string().max(200).optional(),
  ministry: z.string().max(500).optional(),
  status: statusEnum.optional(),
});

export const updateJobCircularSchema = createJobCircularSchema.partial().extend({
  isActive: z.boolean().optional(),
});

export const jobCircularFilterSchema = z.object({
  orgType: orgTypeEnum.optional(),
  status: statusEnum.optional(),
  category: z.string().optional(),
  ministry: z.string().optional(),
  search: z.string().max(200).optional(),
  deadlineFrom: z.string().optional(),
  deadlineTo: z.string().optional(),
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(50).optional(),
});

export const bulkUpsertJobCircularSchema = z.object({
  items: z
    .array(
      createJobCircularSchema.extend({
        id: z.string().uuid().optional(),
        isActive: z.boolean().optional(),
      }),
    )
    .min(1)
    .max(100),
});

export const bulkDeleteJobCircularSchema = z.object({
  ids: z.array(z.string().uuid()).min(1).max(100),
});
