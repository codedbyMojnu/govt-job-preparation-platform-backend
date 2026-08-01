import { createHash } from 'node:crypto';

import type { StyleConfigFields } from './types.js';

// Stable stringify (fixed key order) + sha256 — the cache key for "same question set + same
// style already generated" (Phase 8). Two members submitting an identical style must hash equal.
export function hashStyleConfig(styleConfig: StyleConfigFields): string {
  const normalized = {
    mode: styleConfig.mode,
    questionsPerSlide: styleConfig.questionsPerSlide,
    slideWidth: styleConfig.slideWidth,
    slideHeight: styleConfig.slideHeight,
    bgColor: styleConfig.bgColor,
    bgGradient: styleConfig.bgGradient,
    textColor: styleConfig.textColor,
    textSize: styleConfig.textSize,
    showOptions: styleConfig.showOptions,
    showAnswer: styleConfig.showAnswer,
    showExplanation: styleConfig.showExplanation,
  };
  return createHash('sha256').update(JSON.stringify(normalized)).digest('hex');
}
