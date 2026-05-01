import { z } from 'zod';

export const createQuestionSetSchema = z.object({
  subExamCategoryId: z.string().min(1, 'Sub exam category ID is required'),
  title: z.string().min(1, 'Title is required').max(500),
  date: z.string().min(1, 'Date is required'),
  totalMarks: z.number().positive('Total marks must be positive'),
  duration: z.number().int().positive('Duration must be a positive integer'),
  subject: z.string().min(1, 'Subject is required').max(200),
  topics: z.string().max(2000).optional(),
  sourceMaterial: z.string().max(500).optional(),
  markPerQuestion: z.number().positive().optional(),
  negativeMark: z.number().min(0).optional(),
  isFree: z.boolean().optional(),
  isLive: z.boolean().optional(),
});

export const updateQuestionSetSchema = z.object({
  title: z.string().min(1).max(500).optional(),
  date: z.string().min(1).optional(),
  totalMarks: z.number().positive().optional(),
  duration: z.number().int().positive().optional(),
  subject: z.string().min(1).max(200).optional(),
  topics: z.string().max(2000).optional(),
  sourceMaterial: z.string().max(500).optional(),
  markPerQuestion: z.number().positive().optional(),
  negativeMark: z.number().min(0).optional(),
  isFree: z.boolean().optional(),
  isLive: z.boolean().optional(),
  isActive: z.boolean().optional(),
});

const answerEnum = z.enum(['A', 'B', 'C', 'D']);

export const createQuestionSchema = z.object({
  questionSetId: z.string().min(1, 'Question set ID is required'),
  questionText: z.string().min(1, 'Question text is required'),
  optionA: z.string().min(1, 'Option A is required'),
  optionB: z.string().min(1, 'Option B is required'),
  optionC: z.string().min(1, 'Option C is required'),
  optionD: z.string().min(1, 'Option D is required'),
  correctAnswer: answerEnum,
  explanation: z.string().optional(),
  subject: z.string().max(200).optional(),
  topic: z.string().max(200).optional(),
  subTopic: z.string().max(200).optional(),
  slug: z.string().max(600).optional(),
  frequencyTag: z.string().max(200).optional(),
  sortOrder: z.number().int().min(0).optional(),
});

export const updateQuestionSchema = z.object({
  questionText: z.string().min(1).optional(),
  optionA: z.string().min(1).optional(),
  optionB: z.string().min(1).optional(),
  optionC: z.string().min(1).optional(),
  optionD: z.string().min(1).optional(),
  correctAnswer: answerEnum.optional(),
  explanation: z.string().optional(),
  subject: z.string().max(200).optional(),
  topic: z.string().max(200).optional(),
  subTopic: z.string().max(200).optional(),
  slug: z.string().max(600).optional(),
  frequencyTag: z.string().max(200).optional(),
  sortOrder: z.number().int().min(0).optional(),
});

export const answerQuestionSchema = z.object({
  questionId: z.string().min(1, 'Question ID is required'),
  selectedAnswer: answerEnum,
});

export const startExamSchema = z.object({
  questionSetId: z.string().min(1, 'Question set ID is required'),
});

export const updateAppSettingsSchema = z.object({
  freeLiveLimit: z.number().int().min(0).optional(),
  freeArchiveLimit: z.number().int().min(0).optional(),
});
