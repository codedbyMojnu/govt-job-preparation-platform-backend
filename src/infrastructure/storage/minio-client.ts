import { Client } from 'minio';

export interface MinioClientOptions {
  endPoint: string;
  port: number;
  useSSL: boolean;
  accessKey: string;
  secretKey: string;
}

// Only this file (and features/*/infra/*.ts) may import from 'minio' directly.
export function createMinioClient(options: MinioClientOptions): Client {
  return new Client(options);
}

export type { Client as MinioClient };
