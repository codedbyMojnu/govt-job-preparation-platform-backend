import type { BgGradient, Scene, SlideMode } from './render/types.js';

export interface StyleConfigFields {
  mode: SlideMode;
  questionsPerSlide: number;
  slideWidth: number;
  slideHeight: number;
  bgColor: string | null;
  bgGradient: BgGradient | null;
  textColor: string;
  textSize: number;
  showOptions: boolean;
  showAnswer: boolean;
  showExplanation: boolean;
}

export interface GenerateSlidesInput {
  questionSetId: string;
  styleConfig: StyleConfigFields;
}

export interface SlideStyleConfigDto extends StyleConfigFields {
  id: string;
  configHash: string;
  createdBy: string;
  createdAt: Date;
}

export type SlideJobStatusValue = 'QUEUED' | 'PROCESSING' | 'DONE' | 'FAILED';

export interface SlideGenerationJobDto {
  id: string;
  questionSetId: string;
  status: SlideJobStatusValue;
  progress: number;
  styleConfigId: string;
  errorMessage: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface SlideDto {
  id: string;
  questionSetId: string;
  order: number;
  imageUrl: string;
  sceneJson: Scene;
  questionIds: string[];
  styleConfigId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface GenerateSlidesResult {
  cached: boolean;
  styleConfigId: string;
  slides?: SlideDto[];
  jobId?: string;
}

export interface JobStatusResult extends SlideGenerationJobDto {
  slides?: SlideDto[];
}

export interface QuestionSetSlidesResult {
  styleConfig: SlideStyleConfigDto;
  slides: SlideDto[];
}

// Minimal question shape the render engine needs, sourced from the Question model.
export interface QuestionForSlide {
  id: string;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: string;
  explanation: string | null;
  sortOrder: number;
}

export interface QuestionSetPathInfo {
  examCategoryId: string;
  subExamCategoryId: string;
}

export interface UploadedImageInput {
  buffer: Buffer;
  mimetype: string;
}
