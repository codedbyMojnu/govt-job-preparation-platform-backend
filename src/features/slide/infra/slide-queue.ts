import { Queue } from 'bullmq';
import type { Redis } from 'ioredis';

export const SLIDE_QUEUE_NAME = 'slide-generation';
export const SLIDE_GENERATE_JOB_NAME = 'generate';

export interface SlideGenerationJobData {
  jobId: string;
  questionSetId: string;
  styleConfigId: string;
}

export function createSlideQueue(connection: Redis): Queue<SlideGenerationJobData> {
  return new Queue<SlideGenerationJobData>(SLIDE_QUEUE_NAME, { connection });
}
