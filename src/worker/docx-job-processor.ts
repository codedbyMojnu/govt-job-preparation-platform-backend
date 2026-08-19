import type { Job } from 'bullmq';
import type { Logger } from 'pino';

import { DocxService } from '../features/docx/domain/docx.service.js';
import type { DocxGenerationJobData } from '../features/docx/infra/docx-queue.js';

export function createDocxJobProcessor(service: DocxService, logger: Logger) {
  return async function processDocxGenerationJob(job: Job<DocxGenerationJobData>): Promise<void> {
    const { jobId, questionSetIds, setsHash, styleConfigId } = job.data;
    logger.info({ jobId, setCount: questionSetIds.length, styleConfigId }, 'Docx generation started');

    const repository = service.getRepository();
    const storage = service.getStorage();

    try {
      await repository.updateJobStatus(jobId, 'PROCESSING');
      await repository.updateJobProgress(jobId, 10);
      await job.updateProgress(10);

      const { buffer, questionCount, fileKey } = await service.buildDocxBuffer(
        questionSetIds,
        styleConfigId,
      );

      await repository.updateJobProgress(jobId, 85);
      await job.updateProgress(85);

      await storage.putDocx(fileKey, buffer);

      await repository.upsertDocument({
        questionSetIds,
        setsHash,
        setCount: questionSetIds.length,
        fileUrl: fileKey,
        questionCount,
        styleConfigId,
      });

      await repository.updateJobProgress(jobId, 100);
      await repository.updateJobStatus(jobId, 'DONE');
      await job.updateProgress(100);

      logger.info(
        { jobId, setCount: questionSetIds.length, questionCount },
        'Docx generation completed',
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      logger.error({ jobId, err }, 'Docx generation failed');
      await repository.updateJobStatus(jobId, 'FAILED', message);
      throw err;
    }
  };
}
