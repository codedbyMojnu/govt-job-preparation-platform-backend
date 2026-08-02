import type { SKRSContext2D } from '@napi-rs/canvas';

import { measureMixedTextWidth, type FontWeight } from './font-runs.js';

const BN_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

export function toBengaliDigits(n: number | string): string {
  return String(n).replace(/\d/g, (d) => BN_DIGITS[Number(d)] ?? d);
}

export const OPTION_LABELS: Record<string, string> = { A: 'ক', B: 'খ', C: 'গ', D: 'ঘ' };

/** Bengali question separator (Devanagari danda U+0964 — standard in BN typography). */
export const BN_DARI = '\u0964';

export interface WrapTextOptions {
  weight?: FontWeight;
  fontSize?: number;
}

function lineWidth(
  ctx: SKRSContext2D,
  text: string,
  weight: FontWeight,
  fontSize: number,
): number {
  return measureMixedTextWidth(ctx, text, weight, fontSize);
}

// Greedy word-wrap — measures mixed Bengali + Latin runs for accurate line breaks.
export function wrapText(
  ctx: SKRSContext2D,
  text: string,
  maxWidth: number,
  options: WrapTextOptions = {},
): string[] {
  const weight = options.weight ?? 'normal';
  const fontSize = options.fontSize ?? 16;

  const paragraphs = String(text || '').split(/\n/);
  const lines: string[] = [];
  for (const para of paragraphs) {
    if (!para.trim()) {
      lines.push('');
      continue;
    }
    const words = para.split(/\s+/);
    let cur = '';
    for (const word of words) {
      const test = cur ? `${cur} ${word}` : word;
      if (lineWidth(ctx, test, weight, fontSize) > maxWidth && cur) {
        lines.push(cur);
        cur = word;
      } else {
        cur = test;
      }
    }
    if (cur) lines.push(cur);
  }
  return lines;
}

export interface FittedText {
  size: number;
  lines: string[];
}

export function fitWrappedText(
  ctx: SKRSContext2D,
  text: string,
  maxWidth: number,
  fontSizes: number[],
  maxLines: number,
  _fontFamily: string,
  weight: FontWeight = 'bold',
): FittedText {
  for (const size of fontSizes) {
    const lines = wrapText(ctx, text, maxWidth, { weight, fontSize: size });
    if (lines.length <= maxLines) return { size, lines };
  }

  const size = fontSizes[fontSizes.length - 1] ?? 16;
  const lines = wrapText(ctx, text, maxWidth, { weight, fontSize: size });
  const trimmed = lines.slice(0, maxLines);

  if (lines.length > maxLines && trimmed.length > 0) {
    let last = trimmed[maxLines - 1] ?? '';
    while (last.length > 1 && lineWidth(ctx, `${last}…`, weight, size) > maxWidth) {
      last = last.slice(0, -1);
    }
    trimmed[maxLines - 1] = `${last}…`;
  }
  return { size, lines: trimmed };
}
