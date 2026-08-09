import { z } from 'zod';

const docTypeEnum = z.enum([
  'SYLLABUS',
  'ROUTINE',
  'QUESTION_BANK',
  'PREVIOUS_QUESTIONS',
  'BOOK_GUIDE',
  'NOTES',
  'MODEL_TEST',
  'OTHER',
]);

const boolFromForm = z
  .union([z.boolean(), z.enum(['true', 'false'])])
  .optional()
  .transform((v) => (v === undefined ? undefined : v === true || v === 'true'));

// multipart/form-data body — used on admin create/update (after multer.single('file') runs)
export const createPdfFormSchema = z.object({
  title: z.string().min(2, 'শিরোনাম প্রয়োজন').max(500),
  description: z.string().max(10000).optional(),
  docType: docTypeEnum.optional(),
  subExamCategoryId: z.string().optional(),
  subject: z.string().max(200).optional(),
  examName: z.string().max(200).optional(),
  tags: z.string().optional(), // comma-separated string from FormData; split in controller
  pageCount: z.coerce.number().int().min(0).optional(),
  isFeatured: boolFromForm,
  isActive: boolFromForm,
  isFree: boolFromForm,
});

export const updatePdfFormSchema = createPdfFormSchema.partial();

export const pdfFilterSchema = z.object({
  docType: docTypeEnum.optional(),
  subExamCategoryId: z.string().optional(),
  search: z.string().max(200).optional(),
  sort: z.enum(['newest', 'popular', 'most_downloaded', 'most_viewed']).optional(),
  freeOnly: z
    .enum(['true', 'false'])
    .optional()
    .transform((v) => v === 'true'),
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

export const createCommentSchema = z.object({
  content: z.string().min(2).max(2000),
});

export const pdfIdParamsSchema = z.object({
  pdfId: z.string().min(1),
});

export const commentIdParamsSchema = z.object({
  pdfId: z.string().min(1),
  commentId: z.string().min(1),
});

export const commentListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(50).optional(),
});
