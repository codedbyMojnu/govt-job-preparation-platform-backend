import type { SKRSContext2D } from '@napi-rs/canvas';

const BN_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

export function toBengaliDigits(n: number | string): string {
  return String(n).replace(/\d/g, (d) => BN_DIGITS[Number(d)] ?? d);
}

export const OPTION_LABELS: Record<string, string> = { A: 'ক', B: 'খ', C: 'গ', D: 'ঘ' };

// Greedy word-wrap using actual glyph measurement — ported from farhan-mcq-slide-updated/utils/textUtils.js.
export function wrapText(ctx: SKRSContext2D, text: string, maxWidth: number): string[] {
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
      if (ctx.measureText(test).width > maxWidth && cur) {
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

// Shrinks the font until the text wraps within maxLines, truncating with "…" as a last resort.
// Ported from dream-bot-post/services/slide-generator.service.js `fitWrappedText`.
export function fitWrappedText(
  ctx: SKRSContext2D,
  text: string,
  maxWidth: number,
  fontSizes: number[],
  maxLines: number,
  fontFamily: string,
  weight: 'normal' | 'bold' = 'bold',
): FittedText {
  for (const size of fontSizes) {
    ctx.font = `${weight} ${size}px ${fontFamily}`;
    const lines = wrapText(ctx, text, maxWidth);
    if (lines.length <= maxLines) return { size, lines };
  }

  const size = fontSizes[fontSizes.length - 1] ?? 16;
  ctx.font = `${weight} ${size}px ${fontFamily}`;
  const lines = wrapText(ctx, text, maxWidth);
  const trimmed = lines.slice(0, maxLines);

  if (lines.length > maxLines && trimmed.length > 0) {
    let last = trimmed[maxLines - 1] ?? '';
    while (last.length > 1 && ctx.measureText(`${last}…`).width > maxWidth) {
      last = last.slice(0, -1);
    }
    trimmed[maxLines - 1] = `${last}…`;
  }
  return { size, lines: trimmed };
}
