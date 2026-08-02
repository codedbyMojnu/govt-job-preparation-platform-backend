/** Quick visual check: Bengali glyphs render with registered fonts. */
import { writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';

import { composeGroupedScene } from '../src/features/slide/domain/render/grouped.js';
import { renderSceneToPng } from '../src/features/slide/domain/render/paint.js';
import { registerFonts } from '../src/features/slide/domain/render/fonts.js';

registerFonts();

const scene = composeGroupedScene(
  [
    {
      id: 'test-q1',
      questionText: 'বাংলাদেশের রাজধানীর নাম কী?',
      optionA: 'ঢাকা',
      optionB: 'কলকাতা',
      optionC: 'চট্টগ্রাম',
      optionD: 'খুলনা',
      correctAnswer: 'A',
      explanation: 'ঢাকা বাংলাদেশের রাজধানী। &quot;Dhaka&quot; ইংরেজি নাম।',
    },
  ],
  {
    mode: 'GROUPED',
    questionsPerSlide: 1,
    slideWidth: 1080,
    slideHeight: 1080,
    bgColor: '#ffffff',
    bgGradient: null,
    textColor: '#0a1a2e',
    textSize: 28,
    showOptions: true,
    showAnswer: true,
    showExplanation: true,
  },
  { slideIndex: 1, totalSlides: 1 },
);

const buffer = await renderSceneToPng(scene);
const outDir = path.join(process.cwd(), 'tmp', 'slide-preview');
mkdirSync(outDir, { recursive: true });
const outPath = path.join(outDir, 'bengali-font-test.png');
writeFileSync(outPath, buffer);
console.log('Wrote', outPath, `(${(buffer.length / 1024).toFixed(1)} KB)`);
