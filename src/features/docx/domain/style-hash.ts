import { createHash } from 'node:crypto';

import type { DocxStyleConfigFields } from './types.js';

export function hashDocxStyleConfig(styleConfig: DocxStyleConfigFields): string {
  const normalized = {
    templateStyle: styleConfig.templateStyle,
    columnCount: styleConfig.columnCount,
    fontSizePt: styleConfig.fontSizePt,
    fontBn: styleConfig.fontBn,
    brandName: styleConfig.brandName,
    brandSubtitle: styleConfig.brandSubtitle,
    footerText: styleConfig.footerText,
    showExplanation: styleConfig.showExplanation,
    explanationMaxChars: styleConfig.explanationMaxChars,
    siteBaseUrl: styleConfig.siteBaseUrl,
  };
  return createHash('sha256').update(JSON.stringify(normalized)).digest('hex');
}

/** Stable hash of question set IDs in selection order (order affects page layout). */
export function hashQuestionSetIds(questionSetIds: string[]): string {
  if (questionSetIds.length === 0) {
    throw new Error('questionSetIds must not be empty');
  }
  return createHash('sha256').update(JSON.stringify(questionSetIds)).digest('hex');
}
