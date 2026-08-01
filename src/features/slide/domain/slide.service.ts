import type { Queue } from 'bullmq';

import { BadRequestError, NotFoundError } from '../../../shared/errors/http-errors.js';
import type { SlideGenerationJobData } from '../infra/slide-queue.js';
import { SLIDE_GENERATE_JOB_NAME } from '../infra/slide-queue.js';
import type { SlideStorageService } from '../infra/slide-storage.service.js';

import { renderSceneToPng } from './render/index.js';
import type { Scene } from './render/types.js';
import type { SlideRepository } from './repository.contract.js';
import { hashStyleConfig } from './style-hash.js';
import type {
  GenerateSlidesInput,
  GenerateSlidesResult,
  JobStatusResult,
  QuestionSetSlidesResult,
  SlideDto,
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
      return { cached: true, styleConfigId: styleConfig.id, slides: existingSlides };
    }

    // Avoid double-enqueueing if a job for this exact combo is already in flight.
    const activeJob = await this.repository.findActiveJobForStyle(
      input.questionSetId,
      styleConfig.id,
    );
    if (activeJob) {
      return { cached: false, styleConfigId: styleConfig.id, jobId: activeJob.id };
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
    if (job.status !== 'DONE') {
      return job;
    }
    const slides = await this.repository.findSlidesByQuestionSetAndStyle(
      job.questionSetId,
      job.styleConfigId,
    );
    return { ...job, slides };
  }

  async listSlidesForQuestionSet(questionSetId: string): Promise<QuestionSetSlidesResult | null> {
    return this.repository.findLatestSlidesByQuestionSet(questionSetId);
  }

  async patchSlideScene(slideId: string, sceneJson: Scene): Promise<SlideDto> {
    await this.getSlideOrThrow(slideId);
    return this.repository.updateSlideScene(slideId, sceneJson);
  }

  // Re-renders the PNG from whatever sceneJson is currently stored (i.e. the member's edits)
  // and overwrites the same object key — the same paint function used for initial generation.
  async reRenderSlide(slideId: string): Promise<SlideDto> {
    const slide = await this.getSlideOrThrow(slideId);
    const buffer = await renderSceneToPng(slide.sceneJson);
    await this.storage.putPng(slide.imageUrl, buffer);
    return this.repository.touchSlideUpdatedAt(slideId);
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
