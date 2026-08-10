import { z } from 'zod';

export const broadcastPlatformEnum = z.enum([
  'TELEGRAM_GROUP',
  'TELEGRAM_CHANNEL',
  'FACEBOOK_PAGE',
  'WHATSAPP',
]);

export const broadcastContentTypeEnum = z.enum([
  'QUESTION',
  'QUESTION_SET',
  'PDF',
  'JOB_CIRCULAR',
  'SLIDE_IMAGE',
  'MOTIVATIONAL',
  'STUDY_TIP',
  'NOTICE',
  'OFFER',
  'CUSTOM',
]);

export const broadcastStatusEnum = z.enum(['DRAFT', 'SENDING', 'SENT', 'FAILED']);

const telegramConfigSchema = z.object({
  botToken: z.string().min(10).max(200),
  chatId: z.string().min(1).max(50),
});

const facebookConfigSchema = z.object({
  pageId: z.string().min(1).max(50),
  pageAccessToken: z.string().min(10).max(500),
  appId: z.string().max(50).optional(),
  appSecret: z.string().max(200).optional(),
});

export const createIntegrationCredentialSchema = z
  .object({
    platform: broadcastPlatformEnum,
    label: z.string().max(100).optional(),
    config: z.union([telegramConfigSchema, facebookConfigSchema]),
  })
  .superRefine((data, ctx) => {
    const isTelegram =
      data.platform === 'TELEGRAM_GROUP' || data.platform === 'TELEGRAM_CHANNEL';
    const isFacebook = data.platform === 'FACEBOOK_PAGE';

    if (isTelegram) {
      const result = telegramConfigSchema.safeParse(data.config);
      if (!result.success) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Telegram config requires botToken and chatId',
          path: ['config'],
        });
      }
    } else if (isFacebook) {
      const result = facebookConfigSchema.safeParse(data.config);
      if (!result.success) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Facebook config requires pageId and pageAccessToken',
          path: ['config'],
        });
      }
    } else if (data.platform === 'WHATSAPP') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'WhatsApp integration is not yet supported',
        path: ['platform'],
      });
    }
  });

export const updateIntegrationCredentialSchema = z.object({
  label: z.string().max(100).optional(),
  isActive: z.boolean().optional(),
});

export const createBroadcastLogSchema = z.object({
  contentType: broadcastContentTypeEnum,
  platforms: z.array(broadcastPlatformEnum).min(1),
  questionIds: z.array(z.string()).optional(),
  questionSetId: z.string().optional(),
  pdfId: z.string().optional(),
  jobCircularIds: z.array(z.string()).optional(),
  aiProvider: z.string().max(50).optional(),
  aiModel: z.string().max(100).optional(),
  contentText: z.string().max(10000).optional(),
  mediaUrl: z.string().url().max(2000).optional().or(z.literal('')),
  status: broadcastStatusEnum.optional(),
  errorMessage: z.string().max(2000).optional(),
  sentAt: z.string().datetime().optional(),
});

export const updateBroadcastLogSchema = z.object({
  status: broadcastStatusEnum.optional(),
  errorMessage: z.string().max(2000).nullable().optional(),
  sentAt: z.string().datetime().nullable().optional(),
});

export const broadcastLogFilterSchema = z.object({
  contentType: broadcastContentTypeEnum.optional(),
  status: broadcastStatusEnum.optional(),
  platform: broadcastPlatformEnum.optional(),
  createdBy: z.string().optional(),
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(50).optional(),
});
