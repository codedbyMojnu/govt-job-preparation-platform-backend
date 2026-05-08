import { z } from 'zod';

export const createRoutineSchema = z.object({
  subExamCategoryId: z.string().min(1, 'Sub exam category ID is required'),
  date: z.string().min(1, 'Date is required'),
  title: z.string().min(1, 'Title is required').max(500),
  totalMarks: z.number().positive('Total marks must be positive'),
  duration: z.number().int().positive('Duration must be a positive integer'),
  subject: z.string().min(1, 'Subject is required').max(200),
  topics: z.string().max(2000).optional(),
  sourceMaterial: z.string().max(500).optional(),
  description: z.string().max(5000).optional(),
});

export const updateRoutineSchema = z.object({
  date: z.string().min(1).optional(),
  title: z.string().min(1).max(500).optional(),
  totalMarks: z.number().positive().optional(),
  duration: z.number().int().positive().optional(),
  subject: z.string().min(1).max(200).optional(),
  topics: z.string().max(2000).optional(),
  sourceMaterial: z.string().max(500).optional(),
  description: z.string().max(5000).optional(),
  isActive: z.boolean().optional(),
});

const bulkUpsertRoutineItemSchema = z.object({
  id: z.string().optional(),
  subExamCategoryId: z.string().min(1),
  date: z.string().min(1),
  title: z.string().min(1).max(500),
  totalMarks: z.number().positive(),
  duration: z.number().int().positive(),
  subject: z.string().min(1).max(200),
  topics: z.string().max(2000).optional(),
  sourceMaterial: z.string().max(500).optional(),
  description: z.string().max(5000).optional(),
  isActive: z.boolean().optional(),
});

export const autoCreateQuestionSetsSchema = z.object({
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD')
    .optional(),
});

export const bulkUpsertRoutinesSchema = z.object({
  routines: z.array(bulkUpsertRoutineItemSchema).min(1).max(200),
});

export const bulkDeleteRoutinesSchema = z.object({
  ids: z.array(z.string().min(1)).min(1).max(200),
});
