import type { Job } from 'bullmq';
import type { Logger } from 'pino';

import { renderAllSlides } from '../features/slide/domain/render/index.js';
import type {
  SlideQuestionInput,
  SlideStyleConfigInput,
} from '../features/slide/domain/render/types.js';
import type { SlideRepository } from '../features/slide/domain/repository.contract.js';
import type { SlideGenerationJobData } from '../features/slide/infra/slide-queue.js';
import type { SlideStorageService } from '../features/slide/infra/slide-storage.service.js';

export function createSlideJobProcessor(
  repository: SlideRepository,
  storage: SlideStorageService,
  logger: Logger,
) {
  return async function processSlideGenerationJob(job: Job<SlideGenerationJobData>): Promise<void> {
    const { jobId, questionSetId, styleConfigId } = job.data;
    logger.info({ jobId, questionSetId, styleConfigId }, 'Slide generation job started');

    try {
      await repository.updateJobStatus(jobId, 'PROCESSING');

      const [styleConfig, questions, pathInfo] = await Promise.all([
        repository.findStyleConfigById(styleConfigId),
        repository.getQuestionsForSet(questionSetId),
        repository.getQuestionSetPathInfo(questionSetId),
      ]);

      if (!styleConfig) throw new Error(`Style config ${styleConfigId} not found`);
      if (!pathInfo) throw new Error(`Question set ${questionSetId} not found`);
      if (questions.length === 0) throw new Error(`Question set ${questionSetId} has no questions`);

      const renderInput: SlideQuestionInput[] = questions.map((q) => ({
        id: q.id,
        questionText: q.questionText,
        optionA: q.optionA,
        optionB: q.optionB,
        optionC: q.optionC,
        optionD: q.optionD,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
      }));
      const styleConfigInput: SlideStyleConfigInput = styleConfig;

      const rendered = await renderAllSlides(
        renderInput,
        styleConfigInput,
        async (index, total) => {
          const progress = Math.round((index / total) * 90); // reserve the last 10% for the DB write
          await repository.updateJobProgress(jobId, progress);
          await job.updateProgress(progress);
        },
      );

      const slideInputs = await Promise.all(
        rendered.map(async (slide, i) => {
          const order = i + 1;
          const pngKey = storage.buildObjectKey(
            { ...pathInfo, questionSetId, styleConfigId },
            order,
            'png',
          );
          const sceneKey = storage.buildObjectKey(
            { ...pathInfo, questionSetId, styleConfigId },
            order,
            'scene.json',
          );
          await storage.putPng(pngKey, slide.buffer);
          await storage.putJson(sceneKey, slide.sceneJson);
          return {
            questionSetId,
            order,
            imageUrl: pngKey,
            sceneJson: slide.sceneJson,
            questionIds: slide.questionIds,
            styleConfigId,
          };
        }),
      );

      await repository.createSlides(slideInputs);
      await repository.updateJobProgress(jobId, 100);
      await repository.updateJobStatus(jobId, 'DONE');

      logger.info({ jobId, slideCount: slideInputs.length }, 'Slide generation job completed');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      logger.error({ jobId, err }, 'Slide generation job failed');
      await repository.updateJobStatus(jobId, 'FAILED', message);
      throw err;
    }
  };
}
