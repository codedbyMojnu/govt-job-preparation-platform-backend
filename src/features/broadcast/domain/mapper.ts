import type { BroadcastAutomationRule, BroadcastLog, IntegrationCredential } from '@prisma/client';

import type { AutomationRuleDto, BroadcastLogDto, IntegrationCredentialDto } from './types.js';

export const integrationCredentialMapper = {
  toDto(entity: IntegrationCredential): IntegrationCredentialDto {
    return {
      id: entity.id,
      platform: entity.platform,
      label: entity.label,
      configPreview: entity.configPreview,
      isActive: entity.isActive,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  },
};

export const broadcastLogMapper = {
  toDto(entity: BroadcastLog): BroadcastLogDto {
    return {
      id: entity.id,
      contentType: entity.contentType,
      platforms: entity.platforms,
      questionIds: entity.questionIds,
      questionSetId: entity.questionSetId,
      pdfId: entity.pdfId,
      jobCircularIds: entity.jobCircularIds,
      aiProvider: entity.aiProvider,
      aiModel: entity.aiModel,
      contentText: entity.contentText,
      mediaUrl: entity.mediaUrl,
      status: entity.status,
      errorMessage: entity.errorMessage,
      createdBy: entity.createdBy,
      createdAt: entity.createdAt,
      sentAt: entity.sentAt,
    };
  },
};

export const automationRuleMapper = {
  toDto(entity: BroadcastAutomationRule): AutomationRuleDto {
    return {
      id: entity.id,
      name: entity.name,
      kind: entity.kind,
      platforms: entity.platforms,
      questionCount: entity.questionCount,
      intervalMinutes: entity.intervalMinutes,
      isActive: entity.isActive,
      repeatJobKey: entity.repeatJobKey,
      lastRunAt: entity.lastRunAt,
      createdBy: entity.createdBy,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  },
};
