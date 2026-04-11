import type { ExamCategory } from '@prisma/client';

import type { ExamCategoryDto } from './types.js';

export const examCategoryMapper = {
  toDto(entity: ExamCategory): ExamCategoryDto {
    return {
      id: entity.id,
      name: entity.name,
      slug: entity.slug,
      icon: entity.icon,
      sortOrder: entity.sortOrder,
      isActive: entity.isActive,
      createdAt: entity.createdAt,
    };
  },
};
