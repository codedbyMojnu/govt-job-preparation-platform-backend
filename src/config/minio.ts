import { config } from './index.js';

/** MinIO (S3-compatible) storage configuration derived from validated environment variables. */
export const minioConfig = Object.freeze({
  endPoint: config.MINIO_ENDPOINT,
  port: config.MINIO_PORT,
  useSSL: config.MINIO_USE_SSL,
  accessKey: config.MINIO_ACCESS_KEY,
  secretKey: config.MINIO_SECRET_KEY,
  bucket: config.MINIO_BUCKET,
});
