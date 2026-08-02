import type { PrismaClient } from '@prisma/client';
import { Prisma } from '@prisma/client';

import { slideJobMapper, slideMapper, slideStyleConfigMapper } from '../domain/mapper.js';
import type { Scene } from '../domain/render/types.js';
import type {
  CreateJobInput,
  CreateSlideInput,
  CreateStyleConfigInput,
  SlideRepository,
} from '../domain/repository.contract.js';
import type {
  QuestionForSlide,
  QuestionSetPathInfo,
  SlideDto,
  SlideGenerationJobDto,
  SlideJobStatusValue,
  SlideStyleConfigDto,
} from '../domain/types.js';

const ACTIVE_JOB_STATUSES: SlideJobStatusValue[] = ['QUEUED', 'PROCESSING'];

export class SlidePrismaRepository implements SlideRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async questionSetExists(questionSetId: string): Promise<boolean> {
    const set = await this.prisma.questionSet.findUnique({
      where: { id: questionSetId },
      select: { id: true },
    });
    return set !== null;
  }

  async getQuestionsForSet(questionSetId: string): Promise<QuestionForSlide[]> {
    const questions = await this.prisma.question.findMany({
      where: { questionSetId },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
    });
    return questions.map((q) => ({
      id: q.id,
      questionText: q.questionText,
      optionA: q.optionA,
      optionB: q.optionB,
      optionC: q.optionC,
      optionD: q.optionD,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
      sortOrder: q.sortOrder,
    }));
  }

  async getQuestionSetPathInfo(questionSetId: string): Promise<QuestionSetPathInfo | null> {
    const set = await this.prisma.questionSet.findUnique({
      where: { id: questionSetId },
      select: { subExamCategoryId: true, subExamCategory: { select: { examCategoryId: true } } },
    });
    if (!set) return null;
    return {
      examCategoryId: set.subExamCategory.examCategoryId,
      subExamCategoryId: set.subExamCategoryId,
    };
  }

  async findStyleConfigByHash(hash: string): Promise<SlideStyleConfigDto | null> {
    const config = await this.prisma.slideStyleConfig.findUnique({ where: { configHash: hash } });
    return config ? slideStyleConfigMapper.toDto(config) : null;
  }

  async findStyleConfigById(id: string): Promise<SlideStyleConfigDto | null> {
    const config = await this.prisma.slideStyleConfig.findUnique({ where: { id } });
    return config ? slideStyleConfigMapper.toDto(config) : null;
  }

  async createStyleConfig(input: CreateStyleConfigInput): Promise<SlideStyleConfigDto> {
    const config = await this.prisma.slideStyleConfig.create({
      data: {
        mode: input.mode,
        questionsPerSlide: input.questionsPerSlide,
        slideWidth: input.slideWidth,
        slideHeight: input.slideHeight,
        bgColor: input.bgColor,
        bgGradient: (input.bgGradient ?? Prisma.JsonNull) as unknown as Prisma.InputJsonValue,
        textColor: input.textColor,
        textSize: input.textSize,
        showOptions: input.showOptions,
        showAnswer: input.showAnswer,
        showExplanation: input.showExplanation,
        configHash: input.configHash,
        createdBy: input.createdBy,
      },
    });
    return slideStyleConfigMapper.toDto(config);
  }

  async findSlidesByQuestionSetAndStyle(
    questionSetId: string,
    styleConfigId: string,
  ): Promise<SlideDto[]> {
    const slides = await this.prisma.slide.findMany({
      where: { questionSetId, styleConfigId },
      orderBy: { order: 'asc' },
    });
    return slides.map(slideMapper.toDto);
  }

  async findLatestSlidesByQuestionSet(
    questionSetId: string,
  ): Promise<{ styleConfig: SlideStyleConfigDto; slides: SlideDto[] } | null> {
    const latest = await this.prisma.slide.findFirst({
      where: { questionSetId },
      orderBy: { createdAt: 'desc' },
    });
    if (!latest) return null;

    const styleConfig = await this.prisma.slideStyleConfig.findUnique({
      where: { id: latest.styleConfigId },
    });
    if (!styleConfig) return null;

    const slides = await this.prisma.slide.findMany({
      where: { questionSetId, styleConfigId: latest.styleConfigId },
      orderBy: { order: 'asc' },
    });

    return {
      styleConfig: slideStyleConfigMapper.toDto(styleConfig),
      slides: slides.map(slideMapper.toDto),
    };
  }

  async createSlides(slides: CreateSlideInput[]): Promise<SlideDto[]> {
    if (slides.length === 0) return [];
    const created = await this.prisma.slide.createManyAndReturn({
      data: slides.map((slide) => ({
        questionSetId: slide.questionSetId,
        order: slide.order,
        imageUrl: slide.imageUrl,
        sceneJson: slide.sceneJson as unknown as Prisma.InputJsonValue,
        questionIds: slide.questionIds,
        styleConfigId: slide.styleConfigId,
      })),
    });
    return created.map(slideMapper.toDto);
  }

  async findSlideById(id: string): Promise<SlideDto | null> {
    const slide = await this.prisma.slide.findUnique({ where: { id } });
    return slide ? slideMapper.toDto(slide) : null;
  }

  async updateSlideScene(id: string, sceneJson: Scene): Promise<SlideDto> {
    const slide = await this.prisma.slide.update({
      where: { id },
      data: { sceneJson: sceneJson as unknown as Prisma.InputJsonValue },
    });
    return slideMapper.toDto(slide);
  }

  async touchSlideUpdatedAt(id: string): Promise<SlideDto> {
    const slide = await this.prisma.slide.update({
      where: { id },
      data: { updatedAt: new Date() },
    });
    return slideMapper.toDto(slide);
  }

  async createJob(input: CreateJobInput): Promise<SlideGenerationJobDto> {
    const job = await this.prisma.slideGenerationJob.create({
      data: { questionSetId: input.questionSetId, styleConfigId: input.styleConfigId },
    });
    return slideJobMapper.toDto(job);
  }

  async findJobById(id: string): Promise<SlideGenerationJobDto | null> {
    const job = await this.prisma.slideGenerationJob.findUnique({ where: { id } });
    return job ? slideJobMapper.toDto(job) : null;
  }

  async findActiveJobForStyle(
    questionSetId: string,
    styleConfigId: string,
  ): Promise<SlideGenerationJobDto | null> {
    const job = await this.prisma.slideGenerationJob.findFirst({
      where: { questionSetId, styleConfigId, status: { in: ACTIVE_JOB_STATUSES } },
      orderBy: { createdAt: 'desc' },
    });
    return job ? slideJobMapper.toDto(job) : null;
  }

  async updateJobProgress(id: string, progress: number): Promise<void> {
    await this.prisma.slideGenerationJob.update({ where: { id }, data: { progress } });
  }

  async updateJobStatus(
    id: string,
    status: SlideJobStatusValue,
    errorMessage?: string | null,
  ): Promise<void> {
    await this.prisma.slideGenerationJob.update({
      where: { id },
      data: { status, errorMessage: errorMessage ?? null },
    });
  }

  async findAllSlidesByQuestionSet(questionSetId: string): Promise<SlideDto[]> {
    const slides = await this.prisma.slide.findMany({
      where: { questionSetId },
      orderBy: [{ styleConfigId: 'asc' }, { order: 'asc' }],
    });
    return slides.map(slideMapper.toDto);
  }

  async deleteSlidesByQuestionSet(questionSetId: string): Promise<number> {
    const result = await this.prisma.slide.deleteMany({ where: { questionSetId } });
    return result.count;
  }

  async deleteJobsByQuestionSet(questionSetId: string): Promise<void> {
    await this.prisma.slideGenerationJob.deleteMany({ where: { questionSetId } });
  }
}
