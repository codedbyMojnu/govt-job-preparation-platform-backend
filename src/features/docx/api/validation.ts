import { z } from 'zod';

export const docxStyleConfigSchema = z.object({
  templateStyle: z.enum(['COLORFUL', 'PLAIN']).default('COLORFUL'),
  columnCount: z.union([z.literal(1), z.literal(2)]).default(1),
  fontSizePt: z.number().min(6).max(36).nullable().default(null),
  fontBn: z.string().min(1).max(100).default('Kalpurush'),
  brandName: z.string().min(1).max(200).default('Farhan MCQ'),
  brandSubtitle: z.string().min(1).max(200).default('farhanmcq.com'),
  footerText: z
    .string()
    .min(1)
    .max(2000)
    .default('নিয়মিত অনুশীলন করতে ফলো করুন — Farhan MCQ'),
  showExplanation: z.boolean().default(false),
  explanationMaxChars: z.number().int().min(20).max(2000).default(400),
  siteBaseUrl: z.string().url().default('https://farhanmcq.com'),
});

export const generateDocxSchema = z.object({
  questionSetIds: z.array(z.string().min(1)).min(1, 'Select at least one question set'),
  styleConfig: docxStyleConfigSchema,
});

export const jobIdParamsSchema = z.object({
  jobId: z.string().min(1),
});

export const documentIdParamsSchema = z.object({
  documentId: z.string().min(1),
});
