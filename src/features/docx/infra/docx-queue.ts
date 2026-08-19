import { Queue } from 'bullmq';
import type { Redis } from 'ioredis';

export const DOCX_QUEUE_NAME = 'docx-generation';
export const DOCX_GENERATE_JOB_NAME = 'generate';

export interface DocxGenerationJobData {
  jobId: string;
  questionSetIds: string[];
  setsHash: string;
  styleConfigId: string;
}

export function createDocxQueue(connection: Redis): Queue<DocxGenerationJobData> {
  return new Queue<DocxGenerationJobData>(DOCX_QUEUE_NAME, { connection });
}
