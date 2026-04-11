import type { Routine } from '@prisma/client';

import type { RoutineDto } from './types.js';

export const routineMapper = {
  toDto(entity: Routine): RoutineDto {
    return {
      id: entity.id,
      subExamCategoryId: entity.subExamCategoryId,
      date: entity.date,
      title: entity.title,
      totalMarks: entity.totalMarks,
      duration: entity.duration,
      subject: entity.subject,
      topics: entity.topics,
      sourceMaterial: entity.sourceMaterial,
      description: entity.description,
      isActive: entity.isActive,
      createdAt: entity.createdAt,
    };
  },
};
