import type { Readable } from 'node:stream';

import type { Client as MinioClient } from 'minio';

export class DocxStorageService {
  constructor(
    private readonly client: MinioClient,
    private readonly bucket: string,
  ) {}

  buildObjectKey(setsHash: string, styleConfigId: string): string {
    return `docs/exports/${setsHash}/${styleConfigId}/questions.docx`;
  }

  async putDocx(key: string, buffer: Buffer): Promise<void> {
    await this.client.putObject(this.bucket, key, buffer, buffer.length, {
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    });
  }

  async getObjectStream(key: string): Promise<Readable> {
    return this.client.getObject(this.bucket, key);
  }

  async removeObject(key: string): Promise<void> {
    await this.client.removeObject(this.bucket, key);
  }
}
