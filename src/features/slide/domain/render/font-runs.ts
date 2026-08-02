import type { SKRSContext2D } from '@napi-rs/canvas';

import { FONT_FAMILY_BENGALI, FONT_FAMILY_LATIN } from './fonts.js';

export type FontWeight = 'normal' | 'bold';

/** Devanagari danda — used as Bengali 'dari' (২।) but lives outside the Bengali block. */
const BENGALI_DARI = 0x0964;
const BENGALI_DOUBLE_DARI = 0x0965;

/** Characters that must render with NotoSansBengali even outside U+0980–U+09FF. */
function usesBengaliFont(code: number): boolean {
  if (code >= 0x0980 && code <= 0x09ff) return true;
  // Shared Indic punctuation (। ॥) — NotoSans Latin shows tofu; Bengali font has these glyphs.
  if (code === BENGALI_DARI || code === BENGALI_DOUBLE_DARI) return true;
  return false;
}

export function fontFamilyForChar(char: string): string {
  const code = char.codePointAt(0) ?? 0;
  if (usesBengaliFont(code)) return FONT_FAMILY_BENGALI;
  return FONT_FAMILY_LATIN;
}

export interface FontRun {
  text: string;
  family: string;
}

export function splitIntoFontRuns(text: string): FontRun[] {
  if (!text) return [];

  const runs: FontRun[] = [];
  let i = 0;

  while (i < text.length) {
    const code = text.codePointAt(i)!;
    const ch = String.fromCodePoint(code);
    const family = fontFamilyForChar(ch);
    const last = runs[runs.length - 1];

    if (last && last.family === family) {
      last.text += ch;
    } else {
      runs.push({ text: ch, family });
    }

    i += ch.length;
  }

  return runs;
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
  for (const run of splitIntoFontRuns(text)) {
    setCanvasFont(ctx, weight, fontSize, run.family);
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
  for (const run of splitIntoFontRuns(text)) {
    setCanvasFont(ctx, weight, fontSize, run.family);
    ctx.fillText(run.text, cursorX, y);
    cursorX += ctx.measureText(run.text).width;
  }
  return cursorX - x;
}
