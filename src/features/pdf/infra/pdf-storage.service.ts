import type { Readable } from 'node:stream';

import type { Client as MinioClient } from 'minio';

export class PdfStorageService {
  constructor(
    private readonly client: MinioClient,
    private readonly bucket: string,
  ) {}

  // bucket layout: pdfs/{pdfId}/{timestamp}-{sanitizedFilename}
  buildObjectKey(pdfId: string, filename: string): string {
    const safe = filename.replace(/[^a-zA-Z0-9._-]/g, '_').slice(-150);
    return `pdfs/${pdfId}/${Date.now()}-${safe}`;
  }

  async putPdf(key: string, buffer: Buffer): Promise<void> {
    await this.client.putObject(this.bucket, key, buffer, buffer.length, {
      'Content-Type': 'application/pdf',
    });
  }

  async getObjectStream(key: string): Promise<Readable> {
    return this.client.getObject(this.bucket, key);
  }

  async removeObject(key: string): Promise<void> {
    await this.client.removeObject(this.bucket, key).catch(() => {
      // best-effort cleanup; don't fail the request if the old object is already gone
    });
  }
}
