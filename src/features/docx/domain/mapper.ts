import type { DocxDocument, DocxGenerationJob, DocxStyleConfig } from '@prisma/client';

import type {
  DocxDocumentDto,
  DocxGenerationJobDto,
  DocxStyleConfigDto,
} from './types.js';

export const docxStyleConfigMapper = {
  toDto(entity: DocxStyleConfig): DocxStyleConfigDto {
    return {
      id: entity.id,
      templateStyle: entity.templateStyle,
      columnCount: entity.columnCount as 1 | 2,
      fontSizePt: entity.fontSizePt,
      fontBn: entity.fontBn,
      brandName: entity.brandName,
      brandSubtitle: entity.brandSubtitle,
      footerText: entity.footerText,
      showExplanation: entity.showExplanation,
      explanationMaxChars: entity.explanationMaxChars,
      siteBaseUrl: entity.siteBaseUrl,
      configHash: entity.configHash,
      createdBy: entity.createdBy,
      createdAt: entity.createdAt,
    };
  },
};

export const docxDocumentMapper = {
  toDto(entity: DocxDocument): DocxDocumentDto {
    return {
      id: entity.id,
      questionSetIds: entity.questionSetIds,
      setsHash: entity.setsHash,
      setCount: entity.setCount,
      fileUrl: entity.fileUrl,
      questionCount: entity.questionCount,
      styleConfigId: entity.styleConfigId,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  },
};

export const docxJobMapper = {
  toDto(entity: DocxGenerationJob): DocxGenerationJobDto {
    return {
      id: entity.id,
      questionSetIds: entity.questionSetIds,
      setsHash: entity.setsHash,
      status: entity.status,
      progress: entity.progress,
      styleConfigId: entity.styleConfigId,
      errorMessage: entity.errorMessage,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  },
};
