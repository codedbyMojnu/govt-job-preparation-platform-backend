import type { Package } from '@prisma/client';

import type { PackageDto } from './types.js';

export const packageMapper = {
  toDto(entity: Package): PackageDto {
    return {
      id: entity.id,
      name: entity.name,
      durationDays: entity.durationDays,
      price: entity.price,
      discount: entity.discount,
      description: entity.description,
      liveQuota: entity.liveQuota,
      archiveQuota: entity.archiveQuota,
      sortOrder: entity.sortOrder,
      isActive: entity.isActive,
      createdAt: entity.createdAt,
    };
  },
};
