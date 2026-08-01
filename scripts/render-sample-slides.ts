// Manual visual smoke test for the slide rendering engine (Phase 2) — not part of the app,
// run ad-hoc with `npx tsx scripts/render-sample-slides.ts` to eyeball output in tmp/slide-preview/.
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';

import {
  registerFonts,
  renderAllSlides,
  type SlideQuestionInput,
  type SlideStyleConfigInput,
} from '../src/features/slide/domain/render/index.js';

const OUT_DIR = path.join(process.cwd(), 'tmp', 'slide-preview');

const fixtureQuestions: SlideQuestionInput[] = [
  {
    id: 'q1',
    questionText: 'বাংলাদেশের জাতীয় সংসদ ভবনের স্থপতি কে?',
    optionA: 'লুই কান',
    optionB: 'এফ আর খান',
    optionC: 'মাজহারুল ইসলাম',
    optionD: 'নভেরা আহমেদ',
    correctAnswer: 'A',
    explanation:
      'বাংলাদেশের জাতীয় সংসদ ভবন (জাতীয় সংসদ ভবন, ঢাকা) বিশ্বখ্যাত স্থপতি লুই আই কান কর্তৃক নকশাকৃত। এটি বিশ্বের বৃহত্তম আইনসভা ভবনগুলোর একটি এবং আধুনিক স্থাপত্যের অন্যতম শ্রেষ্ঠ নিদর্শন হিসেবে বিবেচিত।',
  },
  {
    id: 'q2',
    questionText: 'মুক্তিযুদ্ধের সময় বাংলাদেশের অস্থায়ী রাজধানী কোথায় ছিল?',
    optionA: 'কলকাতা',
    optionB: 'মুজিবনগর',
    optionC: 'আগরতলা',
    optionD: 'দিল্লি',
    correctAnswer: 'B',
    explanation:
      '১৯৭১ সালের ১৭ এপ্রিল মেহেরপুর জেলার বৈদ্যনাথতলায় (মুজিবনগর) বাংলাদেশের অস্থায়ী সরকার শপথ গ্রহণ করে এবং এই স্থানের নাম পরিবর্তন করে মুজিবনগর রাখা হয়।',
  },
  {
    id: 'q3',
    questionText: 'বাংলাদেশের সর্বোচ্চ পর্বতশৃঙ্গের নাম কী?',
    optionA: 'কেওক্রাডং',
    optionB: 'তাজিং ডং',
    optionC: 'মোদক মুয়াল',
    optionD: 'সাকা হাফং',
    correctAnswer: 'D',
    explanation: null,
  },
];

const groupedStyle: SlideStyleConfigInput = {
  mode: 'GROUPED',
  questionsPerSlide: 2,
  slideWidth: 1080,
  slideHeight: 1080,
  bgColor: '#ffffff',
  bgGradient: null,
  textColor: '#0a1a2e',
  textSize: 30,
  showOptions: true,
  showAnswer: true,
  showExplanation: true,
};

const singleStyle: SlideStyleConfigInput = {
  mode: 'SINGLE',
  questionsPerSlide: 1,
  slideWidth: 1080,
  slideHeight: 1080,
  bgColor: null,
  bgGradient: {
    type: 'linear',
    angle: 135,
    stops: [
      { color: '#1a1a2e', offset: 0 },
      { color: '#16213e', offset: 1 },
    ],
  },
  textColor: '#ffffff',
  textSize: 44,
  showOptions: true,
  showAnswer: true,
  showExplanation: true,
};

async function main() {
  registerFonts();
  mkdirSync(OUT_DIR, { recursive: true });

  const groupedSlides = await renderAllSlides(fixtureQuestions, groupedStyle);
  groupedSlides.forEach((slide, i) => {
    writeFileSync(path.join(OUT_DIR, `grouped-${i + 1}.png`), slide.buffer);
  });

  const singleSlides = await renderAllSlides(fixtureQuestions, singleStyle);
  singleSlides.forEach((slide, i) => {
    writeFileSync(path.join(OUT_DIR, `single-${i + 1}.png`), slide.buffer);
  });

  console.log(
    `Rendered ${groupedSlides.length} grouped + ${singleSlides.length} single slides to ${OUT_DIR}`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
