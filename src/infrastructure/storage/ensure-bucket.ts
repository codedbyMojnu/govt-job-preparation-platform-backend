import type { Client } from 'minio';
import type { Logger } from 'pino';

// Idempotent: creates the bucket only if it doesn't already exist (safe to call on every boot).
export async function ensureBucket(client: Client, bucket: string, logger: Logger): Promise<void> {
  const exists = await client.bucketExists(bucket).catch(() => false);
  if (exists) return;

  await client.makeBucket(bucket);
  logger.info({ bucket }, 'MinIO bucket created');
}
