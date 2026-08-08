import type { AiProviderKey } from '@prisma/client';

import type { AiProviderKeyDto } from './types.js';

export const aiProviderKeyMapper = {
  toDto(entity: AiProviderKey): AiProviderKeyDto {
    return {
      id: entity.id,
      provider: entity.provider,
      label: entity.label,
      keyPreview: entity.keyPreview,
      isActive: entity.isActive,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  },
};
