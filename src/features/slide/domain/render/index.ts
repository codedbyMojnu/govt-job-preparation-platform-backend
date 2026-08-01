import { composeGroupedScene } from './grouped.js';
import { renderSceneToPng } from './paint.js';
import { composeSingleScene } from './single.js';
import { splitQuestionsIntoSlides } from './slide-splitter.js';
import type {
  RenderedSlide,
  SlideQuestionInput,
  SlideRenderContext,
  SlideStyleConfigInput,
} from './types.js';

export { registerFonts } from './fonts.js';
export { renderSceneToPng } from './paint.js';
export { splitQuestionsIntoSlides } from './slide-splitter.js';
export * from './types.js';

// Called by the worker for initial batch generation. Re-render after edits (Phase 7) instead
// calls `renderSceneToPng` directly on the (possibly member-edited) sceneJson, so both paths
// share the exact same paint code — the editor preview and the downloaded file always match.
export async function renderGroupedSlide(
  questions: SlideQuestionInput[],
  styleConfig: SlideStyleConfigInput,
  context: SlideRenderContext,
): Promise<RenderedSlide> {
  const sceneJson = composeGroupedScene(questions, styleConfig, context);
  const buffer = await renderSceneToPng(sceneJson);
  return {
    width: sceneJson.width,
    height: sceneJson.height,
    buffer,
    sceneJson,
    questionIds: questions.map((q) => q.id),
  };
}

export async function renderSingleQuestionSlide(
  question: SlideQuestionInput,
  styleConfig: SlideStyleConfigInput,
  context: SlideRenderContext,
): Promise<RenderedSlide> {
  const sceneJson = composeSingleScene(question, styleConfig, context);
  const buffer = await renderSceneToPng(sceneJson);
  return {
    width: sceneJson.width,
    height: sceneJson.height,
    buffer,
    sceneJson,
    questionIds: [question.id],
  };
}

// Renders every slide for a question set: splits questions per styleConfig.mode, then
// dispatches each group to the grouped or single renderer. `onSlideRendered` lets the worker
// report per-slide progress (e.g. into SlideGenerationJob.progress) without this module
// needing to know anything about jobs/queues.
export async function renderAllSlides(
  questions: SlideQuestionInput[],
  styleConfig: SlideStyleConfigInput,
  onSlideRendered?: (index: number, total: number) => void | Promise<void>,
): Promise<RenderedSlide[]> {
  const groups = splitQuestionsIntoSlides(questions, styleConfig);
  const totalSlides = groups.length;

  const slides: RenderedSlide[] = [];
  for (const [i, group] of groups.entries()) {
    const context: SlideRenderContext = { slideIndex: i + 1, totalSlides };
    const [firstQuestion] = group;
    const slide =
      styleConfig.mode === 'SINGLE' && firstQuestion
        ? await renderSingleQuestionSlide(firstQuestion, styleConfig, context)
        : await renderGroupedSlide(group, styleConfig, context);
    slides.push(slide);
    await onSlideRendered?.(i + 1, totalSlides);
  }
  return slides;
}
