/** Verify danda (U+0964) renders with bold question prefix — not tofu. */
import { writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';

import { createCanvas } from '@napi-rs/canvas';

import { fillMixedText, measureMixedTextWidth } from '../src/features/slide/domain/render/font-runs.js';
import { registerFonts } from '../src/features/slide/domain/render/fonts.js';
import { BN_DARI, toBengaliDigits } from '../src/features/slide/domain/render/text-utils.js';

registerFonts();

const canvas = createCanvas(400, 120);
const ctx = canvas.getContext('2d');
ctx.fillStyle = '#ffffff';
ctx.fillRect(0, 0, 400, 120);
ctx.fillStyle = '#0a1a2e';

const samples = [
  `${toBengaliDigits(2)}${BN_DARI} AIDS Acquired Immune Deficiency Syndrome`,
  `${toBengaliDigits(1)}${BN_DARI} বাংলা প্রশ্ন`,
  `✗ wrong ✓ right`,
];

let y = 36;
for (const text of samples) {
  const w = measureMixedTextWidth(ctx, text, 'bold', 28);
  fillMixedText(ctx, text, 20, y, 'bold', 28);
  console.log(JSON.stringify(text), 'width=', Math.round(w));
  y += 40;
}

const outDir = path.join(process.cwd(), 'tmp', 'slide-preview');
mkdirSync(outDir, { recursive: true });
const outPath = path.join(outDir, 'danda-test.png');
writeFileSync(outPath, canvas.encode('png'));
console.log('Wrote', outPath);
