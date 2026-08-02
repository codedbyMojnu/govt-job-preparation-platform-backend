import type { Queue } from 'bullmq';

import { BadRequestError, NotFoundError } from '../../../shared/errors/http-errors.js';
import {
  SLIDE_JOB_STALE_MESSAGE,
  SLIDE_JOB_STALE_MS,
} from '../../../shared/constants/slide.constants.js';
import type { SlideGenerationJobData } from '../infra/slide-queue.js';
import { SLIDE_GENERATE_JOB_NAME } from '../infra/slide-queue.js';
import type { SlideStorageService } from '../infra/slide-storage.service.js';

import { renderSceneToPng, renderGroupedSlide, renderSingleQuestionSlide } from './render/index.js';
import { applySceneEditsToQuestions } from './render/scene-edits.js';
import type { Scene } from './render/types.js';
import type { SlideQuestionInput } from './render/types.js';
import type { SlideRepository } from './repository.contract.js';
import { hashStyleConfig } from './style-hash.js';
import type {
  GenerateSlidesInput,
  GenerateSlidesResult,
  JobStatusResult,
  QuestionSetSlidesResult,
  SlideDto,
  SlideGenerationJobDto,
  UploadedImageInput,
} from './types.js';

const MAX_TEXT_SIZE = 80;
const MIN_TEXT_SIZE = 10;
const MAX_QUESTIONS_PER_SLIDE = 10;
const MAX_SLIDE_DIMENSION = 4000;
const MIN_SLIDE_DIMENSION = 200;

export class SlideService {
  constructor(
    private readonly repository: SlideRepository,
    private readonly queue: Queue<SlideGenerationJobData>,
    private readonly storage: SlideStorageService,
  ) {}

  async generate(userId: string, input: GenerateSlidesInput): Promise<GenerateSlidesResult> {
    this.assertStyleConfigInBounds(input.styleConfig);

    const exists = await this.repository.questionSetExists(input.questionSetId);
    if (!exists) {
      throw new NotFoundError('Question set not found');
    }

    const configHash = hashStyleConfig(input.styleConfig);
    const styleConfig =
      (await this.repository.findStyleConfigByHash(configHash)) ??
      (await this.repository.createStyleConfig({
        ...input.styleConfig,
        configHash,
        createdBy: userId,
      }));

    // Cache hit: identical (questionSetId, styleConfig) already generated — never regenerate.
    const existingSlides = await this.repository.findSlidesByQuestionSetAndStyle(
      input.questionSetId,
      styleConfig.id,
    );
    if (existingSlides.length > 0) {
      // Phase 8 cache hit — no worker job, no render cost
      if (process.env.NODE_ENV !== 'test') {
        process.stdout.write(
          JSON.stringify({
            event: 'slide_cache_hit',
            questionSetId: input.questionSetId,
            styleConfigId: styleConfig.id,
            slideCount: existingSlides.length,
          }) + '\n',
        );
      }
      return { cached: true, styleConfigId: styleConfig.id, slides: existingSlides };
    }

    // Avoid double-enqueueing if a job for this exact combo is already in flight.
    const activeJob = await this.repository.findActiveJobForStyle(
      input.questionSetId,
      styleConfig.id,
    );
    if (activeJob) {
      const reconciled = await this.reconcileStaleJob(activeJob);
      if (reconciled.status === 'QUEUED' || reconciled.status === 'PROCESSING') {
        return { cached: false, styleConfigId: styleConfig.id, jobId: reconciled.id };
      }
    }

    const job = await this.repository.createJob({
      questionSetId: input.questionSetId,
      styleConfigId: styleConfig.id,
    });
    await this.queue.add(
      SLIDE_GENERATE_JOB_NAME,
      { jobId: job.id, questionSetId: input.questionSetId, styleConfigId: styleConfig.id },
      { jobId: job.id },
    );

    return { cached: false, styleConfigId: styleConfig.id, jobId: job.id };
  }

  async getJobStatus(jobId: string): Promise<JobStatusResult> {
    const job = await this.repository.findJobById(jobId);
    if (!job) {
      throw new NotFoundError('Slide generation job not found');
    }

    const reconciled = await this.reconcileStaleJob(job);
    if (reconciled.status !== 'DONE') {
      return reconciled;
    }

    const slides = await this.repository.findSlidesByQuestionSetAndStyle(
      reconciled.questionSetId,
      reconciled.styleConfigId,
    );
    return { ...reconciled, slides };
  }

  async listSlidesForQuestionSet(questionSetId: string): Promise<QuestionSetSlidesResult | null> {
    return this.repository.findLatestSlidesByQuestionSet(questionSetId);
  }

  async patchSlideScene(slideId: string, sceneJson: Scene): Promise<SlideDto> {
    await this.getSlideOrThrow(slideId);
    return this.repository.updateSlideScene(slideId, sceneJson);
  }

  /** Save edited scene text, re-compose layout (fixes whitespace), render fresh PNG. */
  async saveEditsAndReRender(slideId: string, sceneJson: Scene): Promise<SlideDto> {
    await this.getSlideOrThrow(slideId);
    await this.repository.updateSlideScene(slideId, sceneJson);
    return this.reRenderSlide(slideId);
  }

  // Re-composes layout from edited text (fixes whitespace) then renders a fresh PNG.
  async reRenderSlide(slideId: string): Promise<SlideDto> {
    const slide = await this.getSlideOrThrow(slideId);

    const styleConfig = await this.repository.findStyleConfigById(slide.styleConfigId);
    if (!styleConfig) {
      throw new NotFoundError('Style config not found for slide');
    }

    const allQuestions = await this.repository.getQuestionsForSet(slide.questionSetId);
    const ordered: SlideQuestionInput[] = slide.questionIds
      .map((id) => allQuestions.find((q) => q.id === id))
      .filter((q): q is (typeof allQuestions)[number] => q !== undefined);

    const merged = applySceneEditsToQuestions(slide.sceneJson, ordered);

    const siblings = await this.repository.findSlidesByQuestionSetAndStyle(
      slide.questionSetId,
      slide.styleConfigId,
    );
    const context = { slideIndex: slide.order, totalSlides: siblings.length };

    const rendered =
      styleConfig.mode === 'SINGLE' && merged.length === 1
        ? await renderSingleQuestionSlide(merged[0]!, styleConfig, context)
        : await renderGroupedSlide(merged, styleConfig, context);

    await this.storage.putPng(slide.imageUrl, rendered.buffer);
    return this.repository.updateSlideScene(slideId, rendered.sceneJson);
  }

  async uploadSlideImage(slideId: string, file: UploadedImageInput): Promise<{ url: string }> {
    await this.getSlideOrThrow(slideId);
    const ext = file.mimetype.split('/')[1] ?? 'bin';
    const key = this.storage.buildUploadKey(slideId, `image.${ext}`);
    await this.storage.putImage(key, file.buffer, file.mimetype);
    return { url: key };
  }

  async getSlideForDownload(
    slideId: string,
  ): Promise<{
    slide: SlideDto;
    stream: Awaited<ReturnType<SlideStorageService['getObjectStream']>>;
  }> {
    const slide = await this.getSlideOrThrow(slideId);
    const stream = await this.storage.getObjectStream(slide.imageUrl);
    return { slide, stream };
  }

  async getSlidesForZip(questionSetId: string, styleConfigId?: string): Promise<SlideDto[]> {
    if (styleConfigId) {
      return this.repository.findSlidesByQuestionSetAndStyle(questionSetId, styleConfigId);
    }
    const latest = await this.repository.findLatestSlidesByQuestionSet(questionSetId);
    return latest?.slides ?? [];
  }

  getStorage(): SlideStorageService {
    return this.storage;
  }

  private async reconcileStaleJob(
    job: SlideGenerationJobDto,
  ): Promise<SlideGenerationJobDto> {
    if (job.status === 'DONE' || job.status === 'FAILED') {
      return job;
    }

    const ageMs = Date.now() - job.updatedAt.getTime();
    if (ageMs <= SLIDE_JOB_STALE_MS) {
      return job;
    }

    await this.repository.updateJobStatus(job.id, 'FAILED', SLIDE_JOB_STALE_MESSAGE);
    return { ...job, status: 'FAILED', errorMessage: SLIDE_JOB_STALE_MESSAGE };
  }

  private async getSlideOrThrow(slideId: string): Promise<SlideDto> {
    const slide = await this.repository.findSlideById(slideId);
    if (!slide) {
      throw new NotFoundError('Slide not found');
    }
    return slide;
  }

  private assertStyleConfigInBounds(styleConfig: GenerateSlidesInput['styleConfig']): void {
    if (styleConfig.textSize < MIN_TEXT_SIZE || styleConfig.textSize > MAX_TEXT_SIZE) {
      throw new BadRequestError(`textSize must be between ${MIN_TEXT_SIZE} and ${MAX_TEXT_SIZE}`);
    }
    if (
      styleConfig.questionsPerSlide < 1 ||
      styleConfig.questionsPerSlide > MAX_QUESTIONS_PER_SLIDE
    ) {
      throw new BadRequestError(
        `questionsPerSlide must be between 1 and ${MAX_QUESTIONS_PER_SLIDE}`,
      );
    }
    if (
      styleConfig.slideWidth < MIN_SLIDE_DIMENSION ||
      styleConfig.slideWidth > MAX_SLIDE_DIMENSION ||
      styleConfig.slideHeight < MIN_SLIDE_DIMENSION ||
      styleConfig.slideHeight > MAX_SLIDE_DIMENSION
    ) {
      throw new BadRequestError(
        `slide dimensions must be between ${MIN_SLIDE_DIMENSION} and ${MAX_SLIDE_DIMENSION}px`,
      );
    }
  }
}
