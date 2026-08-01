import type { SlideQuestionInput, SlideStyleConfigInput } from './types.js';

// grouped mode: chunk into groups of N (styleConfig.questionsPerSlide); single mode: 1 slide per question.
export function splitQuestionsIntoSlides(
  questions: SlideQuestionInput[],
  styleConfig: Pick<SlideStyleConfigInput, 'mode' | 'questionsPerSlide'>,
): SlideQuestionInput[][] {
  if (styleConfig.mode === 'SINGLE') {
    return questions.map((question) => [question]);
  }

  const perSlide = Math.max(1, styleConfig.questionsPerSlide);
  const groups: SlideQuestionInput[][] = [];
  for (let i = 0; i < questions.length; i += perSlide) {
    groups.push(questions.slice(i, i + perSlide));
  }
  return groups;
}
