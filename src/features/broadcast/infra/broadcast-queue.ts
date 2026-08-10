import { Queue } from 'bullmq';
import type { Redis } from 'ioredis';

export const BROADCAST_QUEUE_NAME = 'broadcast-automation';
export const BROADCAST_RUN_JOB_NAME = 'run-rule';

export interface BroadcastAutomationJobData {
  ruleId: string;
}

export function createBroadcastQueue(connection: Redis): Queue<BroadcastAutomationJobData> {
  return new Queue<BroadcastAutomationJobData>(BROADCAST_QUEUE_NAME, { connection });
}
