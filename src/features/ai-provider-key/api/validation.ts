import { z } from 'zod';

export const aiProviderEnum = z.enum(['MISTRAL', 'ANTHROPIC', 'GEMINI', 'OPENAI', 'OMNIROUTE']);

export const createAiProviderKeySchema = z.object({
  provider: aiProviderEnum,
  key: z.string().min(8, 'API key looks too short').max(500),
  label: z.string().max(100).optional(),
});

export const updateAiProviderKeySchema = z.object({
  label: z.string().max(100).optional(),
  isActive: z.boolean().optional(),
});
