import type { Readable } from 'node:stream';

import type { Client as MinioClient } from 'minio';

const ORDER_PAD_LENGTH = 4;

export class SlideStorageService {
  constructor(
    private readonly client: MinioClient,
    private readonly bucket: string,
  ) {}

  // bucket layout: slides/{examCategoryId}/{subExamCategoryId}/{questionSetId}/{styleConfigId}/NNNN.ext
  buildObjectKey(
    parts: {
      examCategoryId: string;
      subExamCategoryId: string;
      questionSetId: string;
      styleConfigId: string;
    },
    order: number,
    ext: 'png' | 'scene.json',
  ): string {
    const orderStr = String(order).padStart(ORDER_PAD_LENGTH, '0');
    return `slides/${parts.examCategoryId}/${parts.subExamCategoryId}/${parts.questionSetId}/${parts.styleConfigId}/${orderStr}.${ext}`;
  }

  buildUploadKey(slideId: string, filename: string): string {
    return `uploads/${slideId}/${Date.now()}-${filename}`;
  }

  async putPng(key: string, buffer: Buffer): Promise<void> {
    await this.client.putObject(this.bucket, key, buffer, buffer.length, {
      'Content-Type': 'image/png',
    });
  }

  async putJson(key: string, data: unknown): Promise<void> {
    const buffer = Buffer.from(JSON.stringify(data));
    await this.client.putObject(this.bucket, key, buffer, buffer.length, {
      'Content-Type': 'application/json',
    });
  }

  async putImage(key: string, buffer: Buffer, contentType: string): Promise<void> {
    await this.client.putObject(this.bucket, key, buffer, buffer.length, {
      'Content-Type': contentType,
    });
  }

  async getObjectStream(key: string): Promise<Readable> {
    return this.client.getObject(this.bucket, key);
  }
}
