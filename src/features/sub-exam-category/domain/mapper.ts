import type { SubExamCategory } from '@prisma/client';

import type { SubExamCategoryDto } from './types.js';

export const subExamCategoryMapper = {
  toDto(entity: SubExamCategory): SubExamCategoryDto {
    return {
      id: entity.id,
      examCategoryId: entity.examCategoryId,
      name: entity.name,
      slug: entity.slug,
      description: entity.description,
      sortOrder: entity.sortOrder,
      isActive: entity.isActive,
      createdAt: entity.createdAt,
    };
  },
};
