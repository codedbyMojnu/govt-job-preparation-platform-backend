import type { Scene } from './render/types.js';
import type {
  QuestionForSlide,
  QuestionSetPathInfo,
  SlideDto,
  SlideGenerationJobDto,
  SlideJobStatusValue,
  SlideStyleConfigDto,
  StyleConfigFields,
} from './types.js';

export interface CreateStyleConfigInput extends StyleConfigFields {
  configHash: string;
  createdBy: string;
}

export interface CreateSlideInput {
  questionSetId: string;
  order: number;
  imageUrl: string;
  sceneJson: Scene;
  questionIds: string[];
  styleConfigId: string;
}

export interface CreateJobInput {
  questionSetId: string;
  styleConfigId: string;
}

export interface SlideRepository {
  questionSetExists(questionSetId: string): Promise<boolean>;
  getQuestionsForSet(questionSetId: string): Promise<QuestionForSlide[]>;
  getQuestionSetPathInfo(questionSetId: string): Promise<QuestionSetPathInfo | null>;

  findStyleConfigByHash(hash: string): Promise<SlideStyleConfigDto | null>;
  findStyleConfigById(id: string): Promise<SlideStyleConfigDto | null>;
  createStyleConfig(input: CreateStyleConfigInput): Promise<SlideStyleConfigDto>;

  findSlidesByQuestionSetAndStyle(
    questionSetId: string,
    styleConfigId: string,
  ): Promise<SlideDto[]>;
  findLatestSlidesByQuestionSet(
    questionSetId: string,
  ): Promise<{ styleConfig: SlideStyleConfigDto; slides: SlideDto[] } | null>;
  createSlides(slides: CreateSlideInput[]): Promise<SlideDto[]>;
  findSlideById(id: string): Promise<SlideDto | null>;
  updateSlideScene(id: string, sceneJson: Scene): Promise<SlideDto>;
  touchSlideUpdatedAt(id: string): Promise<SlideDto>;

  createJob(input: CreateJobInput): Promise<SlideGenerationJobDto>;
  findJobById(id: string): Promise<SlideGenerationJobDto | null>;
  findActiveJobForStyle(
    questionSetId: string,
    styleConfigId: string,
  ): Promise<SlideGenerationJobDto | null>;
  updateJobProgress(id: string, progress: number): Promise<void>;
  updateJobStatus(
    id: string,
    status: SlideJobStatusValue,
    errorMessage?: string | null,
  ): Promise<void>;

  findAllSlidesByQuestionSet(questionSetId: string): Promise<SlideDto[]>;
  deleteSlidesByQuestionSet(questionSetId: string): Promise<number>;
  deleteJobsByQuestionSet(questionSetId: string): Promise<void>;
}
