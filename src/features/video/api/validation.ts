import { z } from 'zod';

const videoCategoryEnum = z.enum([
  'BCS',
  'PRIMARY',
  'BANK',
  'SCHOOL',
  'COLLEGE',
  'NTRCA',
  'SOMAJSEBA',
  'COMPUTER_OPERATOR',
  'POLICE',
  'DEFENCE',
  'RAILWAY',
  'HEALTH',
  'OTHER',
]);

export const createVideoSchema = z.object({
  title: z.string().min(2, 'Title is required').max(500),
  description: z.string().max(10000).optional(),
  youtubeUrl: z.string().min(5, 'YouTube URL is required').max(500),
  category: videoCategoryEnum.optional(),
  tags: z.array(z.string().max(50)).max(20).optional(),
  durationSec: z.number().int().min(0).max(86400).optional(),
  isFeatured: z.boolean().optional(),
  isActive: z.boolean().optional(),
  publishedAt: z.string().optional(),
});

export const updateVideoSchema = createVideoSchema.partial();

export const videoFilterSchema = z.object({
  category: videoCategoryEnum.optional(),
  search: z.string().max(200).optional(),
  sort: z.enum(['newest', 'popular', 'most_liked']).optional(),
  featured: z
    .enum(['true', 'false'])
    .optional()
    .transform((v) => (v === 'true' ? true : v === 'false' ? false : undefined)),
  includeInactive: z
    .enum(['true', 'false'])
    .optional()
    .transform((v) => v === 'true'),
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(48).optional(),
});

export const parseYoutubeSchema = z.object({
  url: z.string().min(5).max(500),
});

export const createCommentSchema = z.object({
  content: z.string().min(2).max(2000),
});

export const videoIdParamsSchema = z.object({
  videoId: z.string().min(1),
});

export const commentIdParamsSchema = z.object({
  videoId: z.string().min(1),
  commentId: z.string().min(1),
});

export const commentListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(50).optional(),
});
