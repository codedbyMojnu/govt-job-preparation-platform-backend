import { z } from 'zod';

export const broadcastPlatformEnum = z.enum([
  'TELEGRAM_GROUP',
  'TELEGRAM_CHANNEL',
  'FACEBOOK_PAGE',
  'WHATSAPP',
]);

export const createAutomationRuleSchema = z.object({
  name: z.string().min(1).max(120),
  platforms: z.array(broadcastPlatformEnum).min(1),
  questionCount: z.number().int().min(1).max(4).optional(),
  intervalMinutes: z.number().int().min(2).max(10_080).optional(),
  isActive: z.boolean().optional(),
});

export const updateAutomationRuleSchema = createAutomationRuleSchema.partial();
