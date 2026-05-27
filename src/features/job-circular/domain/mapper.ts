import type { JobCircular } from '@prisma/client';

import type { JobCircularDto } from './types.js';

export const jobCircularMapper = {
  toDto(entity: JobCircular): JobCircularDto {
    return {
      id: entity.id,
      gjobId: entity.gjobId,
      organizationName: entity.organizationName,
      organizationSlug: entity.organizationSlug,
      orgType: entity.orgType,
      logoUrl: entity.logoUrl,
      title: entity.title,
      totalPosts: entity.totalPosts,
      applicationUrl: entity.applicationUrl,
      publishDate: entity.publishDate,
      deadline: entity.deadline,
      examDate: entity.examDate,
      description: entity.description,
      eligibility: entity.eligibility,
      salary: entity.salary,
      experience: entity.experience,
      location: entity.location,
      source: entity.source,
      category: entity.category,
      ministry: entity.ministry,
      status: entity.status,
      isActive: entity.isActive,
      viewCount: entity.viewCount,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  },
};
