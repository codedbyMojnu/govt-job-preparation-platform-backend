import type { SKRSContext2D } from '@napi-rs/canvas';

import { FONT_FAMILY_BENGALI, FONT_FAMILY_LATIN } from './fonts.js';

export type FontWeight = 'normal' | 'bold';

/** Devanagari danda/double-danda — Bengali punctuation outside the Bengali block. */
export const INDIC_DANDA = '\u0964';
export const INDIC_DOUBLE_DANDA = '\u0965';

const INDIC_PUNCTUATION = new Set<number>([0x0964, 0x0965]);

/** Bengali script block + shared Indic danda used after question numbers (২।). */
export function usesBengaliFont(code: number): boolean {
  if (code >= 0x0980 && code <= 0x09ff) return true;
  if (INDIC_PUNCTUATION.has(code)) return true;
  return false;
}

export function fontFamilyForChar(char: string): string {
  const code = char.codePointAt(0) ?? 0;
  return usesBengaliFont(code) ? FONT_FAMILY_BENGALI : FONT_FAMILY_LATIN;
}

/** Bold Bengali files often omit danda glyphs — always draw danda with regular weight. */
export function effectiveWeightForCode(code: number, weight: FontWeight): FontWeight {
  if (weight === 'bold' && INDIC_PUNCTUATION.has(code)) return 'normal';
  return weight;
}

export interface ShapedRun {
  text: string;
  family: string;
  weight: FontWeight;
}

export function splitIntoShapedRuns(text: string, weight: FontWeight): ShapedRun[] {
  if (!text) return [];

  const runs: ShapedRun[] = [];
  let i = 0;

  while (i < text.length) {
    const code = text.codePointAt(i)!;
    const ch = String.fromCodePoint(code);
    const family = fontFamilyForChar(ch);
    const runWeight = effectiveWeightForCode(code, weight);
    const last = runs[runs.length - 1];

    if (last && last.family === family && last.weight === runWeight) {
      last.text += ch;
    } else {
      runs.push({ text: ch, family, weight: runWeight });
    }

    i += ch.length;
  }

  return runs;
}

/** @deprecated Use splitIntoShapedRuns */
export function splitIntoFontRuns(text: string): Array<{ text: string; family: string }> {
  return splitIntoShapedRuns(text, 'normal').map(({ text: t, family }) => ({
    text: t,
    family,
  }));
}

export function setCanvasFont(
  ctx: SKRSContext2D,
  weight: FontWeight,
  fontSize: number,
  family: string,
): void {
  ctx.font = `${weight} ${fontSize}px ${family}`;
}

export function measureMixedTextWidth(
  ctx: SKRSContext2D,
  text: string,
  weight: FontWeight,
  fontSize: number,
): number {
  let width = 0;
  for (const run of splitIntoShapedRuns(text, weight)) {
    setCanvasFont(ctx, run.weight, fontSize, run.family);
    width += ctx.measureText(run.text).width;
  }
  return width;
}

export function fillMixedText(
  ctx: SKRSContext2D,
  text: string,
  x: number,
  y: number,
  weight: FontWeight,
  fontSize: number,
): number {
  let cursorX = x;
  for (const run of splitIntoShapedRuns(text, weight)) {
    setCanvasFont(ctx, run.weight, fontSize, run.family);
    ctx.fillText(run.text, cursorX, y);
    cursorX += ctx.measureText(run.text).width;
  }
  return cursorX - x;
}
