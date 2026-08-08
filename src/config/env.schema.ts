import { z } from 'zod';

const MAX_JWT_EXPIRY = '30d';
const MAX_JWT_HOURS = 30 * 24; // 30 days in hours
const KNOWN_WEAK_SECRETS = ['secret', 'password', '12345678', 'qwerty', 'changeme'];

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().int().min(1).max(65535).default(3002),
  DATABASE_URL: z
    .string()
    .url()
    .refine((val) => val.startsWith('postgresql://') || val.startsWith('postgres://'), {
      message: 'DATABASE_URL must use postgresql:// or postgres:// scheme',
    }),
  REDIS_URL: z
    .string()
    .url()
    .refine((val) => val.startsWith('redis://') || val.startsWith('rediss://'), {
      message: 'REDIS_URL must use redis:// or rediss:// scheme',
    }),
  JWT_SECRET: z
    .string()
    .min(32)
    .refine((val) => new Set(val).size >= 8, {
      message:
        'JWT_SECRET has insufficient character diversity; use a cryptographically random value (e.g. openssl rand -hex 32)',
    })
    .refine(
      (val) => {
        if (process.env.NODE_ENV !== 'production') return true;
        return !KNOWN_WEAK_SECRETS.some((s) => val.toLowerCase().includes(s));
      },
      { message: 'JWT_SECRET appears weak; use a cryptographically random value' },
    ),
  JWT_EXPIRES_IN: z
    .string()
    .regex(/^\d+[smhd]$/, {
      message: 'JWT_EXPIRES_IN must match format: number + unit (s, m, h, d)',
    })
    .refine(
      (val) => {
        const unit = val.slice(-1);
        const num = parseInt(val.slice(0, -1), 10);
        const maxHours = { s: num / 3600, m: num / 60, h: num, d: num * 24 };
        return maxHours[unit as keyof typeof maxHours] <= MAX_JWT_HOURS;
      },
      { message: `JWT_EXPIRES_IN cannot exceed ${MAX_JWT_EXPIRY}` },
    )
    .default('15m'),
  AI_KEY_ENCRYPTION_SECRET: z
    .string()
    .length(
      64,
      'AI_KEY_ENCRYPTION_SECRET must be 64 hex chars — generate with: openssl rand -hex 32',
    )
    .regex(/^[0-9a-f]+$/i, 'AI_KEY_ENCRYPTION_SECRET must be hex'),
  INTERNAL_API_SECRET: z
    .string()
    .min(
      32,
      'INTERNAL_API_SECRET should be at least 32 chars — generate with: openssl rand -hex 32',
    ),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent']).default('info'),
  CORS_ORIGINS: z
    .string()
    .default('*')
    .superRefine((val, ctx) => {
      if (process.env.NODE_ENV === 'production' && val === '*') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'CORS wildcard (*) not allowed in production',
        });
      }
    }),
  MIMSMS_API_KEY: z.string().min(1),
  MIMSMS_USER_NAME: z.string().min(1),
  MIMSMS_SENDER_NAME: z.string().min(1),
  MINIO_ENDPOINT: z.string().min(1).default('localhost'),
  MINIO_PORT: z.coerce.number().int().min(1).max(65535).default(9000),
  // NOTE: z.coerce.boolean() would turn the string "false" into `true` (any non-empty string is
  // truthy) — parse explicitly instead.
  MINIO_USE_SSL: z
    .string()
    .default('false')
    .transform((val) => val === 'true'),
  MINIO_ACCESS_KEY: z.string().min(1),
  MINIO_SECRET_KEY: z.string().min(1),
  MINIO_BUCKET: z.string().min(1).default('farhan-slides'),
  // When unset, embeds in development only. Set explicitly in production if the API should
  // also process slide jobs (normally the dedicated worker container handles them).
  EMBED_SLIDE_WORKER: z
    .string()
    .optional()
    .transform((val) => {
      if (val === 'true') return true;
      if (val === 'false') return false;
      return process.env.NODE_ENV === 'development';
    }),
});

export type Env = z.infer<typeof envSchema>;
