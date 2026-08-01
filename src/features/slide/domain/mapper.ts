import type { Slide, SlideGenerationJob, SlideStyleConfig } from '@prisma/client';

import type { BgGradient, Scene } from './render/types.js';
import type { SlideDto, SlideGenerationJobDto, SlideStyleConfigDto } from './types.js';

export const slideStyleConfigMapper = {
  toDto(entity: SlideStyleConfig): SlideStyleConfigDto {
    return {
      id: entity.id,
      mode: entity.mode,
      questionsPerSlide: entity.questionsPerSlide,
      slideWidth: entity.slideWidth,
      slideHeight: entity.slideHeight,
      bgColor: entity.bgColor,
      bgGradient: entity.bgGradient as unknown as BgGradient | null,
      textColor: entity.textColor,
      textSize: entity.textSize,
      showOptions: entity.showOptions,
      showAnswer: entity.showAnswer,
      showExplanation: entity.showExplanation,
      configHash: entity.configHash,
      createdBy: entity.createdBy,
      createdAt: entity.createdAt,
    };
  },
};

export const slideMapper = {
  toDto(entity: Slide): SlideDto {
    return {
      id: entity.id,
      questionSetId: entity.questionSetId,
      order: entity.order,
      imageUrl: entity.imageUrl,
      sceneJson: entity.sceneJson as unknown as Scene,
      questionIds: entity.questionIds,
      styleConfigId: entity.styleConfigId,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  },
};

export const slideJobMapper = {
  toDto(entity: SlideGenerationJob): SlideGenerationJobDto {
    return {
      id: entity.id,
      questionSetId: entity.questionSetId,
      status: entity.status,
      progress: entity.progress,
      styleConfigId: entity.styleConfigId,
      errorMessage: entity.errorMessage,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  },
};
