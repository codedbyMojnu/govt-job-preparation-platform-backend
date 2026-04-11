import type { Syllabus } from '@prisma/client';

import type { SyllabusDto } from './types.js';

export const syllabusMapper = {
  toDto(entity: Syllabus): SyllabusDto {
    return {
      id: entity.id,
      subExamCategoryId: entity.subExamCategoryId,
      title: entity.title,
      slug: entity.slug,
      content: entity.content,
      sortOrder: entity.sortOrder,
      isActive: entity.isActive,
      createdAt: entity.createdAt,
    };
  },
};
