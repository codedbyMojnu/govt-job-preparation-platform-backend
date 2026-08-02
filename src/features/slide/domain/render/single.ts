import { FONT_FAMILY } from './fonts.js';
import { createMeasurementContext } from './paint.js';
import { fitWrappedText, OPTION_LABELS, toBengaliDigits, wrapText } from './text-utils.js';
import type {
  Scene,
  SceneNode,
  SlideQuestionInput,
  SlideRenderContext,
  SlideStyleConfigInput,
} from './types.js';

const BRAND_NAVY = '#0f1b35';
const PANEL_BG = 'rgba(255,255,255,0.92)';
const CORRECT_BG = '#e8f5ee';
const CORRECT_TEXT = '#0a2210';
const EXPLANATION_BG = 'rgba(240,250,244,0.95)';
const EXPLANATION_TEXT = '#2d4a35';
const BRAND_BAR_HEIGHT = 54;
const BOX_X = 42;

// One question, large text — reuses dream-bot-post's shrink-to-fit font sizing algorithm.
// The canvas size is the member's chosen preset (slideWidth × slideHeight) but grows
// vertically if the content (options/explanation) doesn't fit, same as rezwansGk.js.
export function composeSingleScene(
  question: SlideQuestionInput,
  styleConfig: SlideStyleConfigInput,
  context: SlideRenderContext,
): Scene {
  const ctx = createMeasurementContext();
  const width = styleConfig.slideWidth;
  const boxWidth = width - BOX_X * 2;
  const innerWidth = boxWidth - 76;
  const nodes: SceneNode[] = [];

  let cursor = BRAND_BAR_HEIGHT + 24;

  nodes.push(...buildBrandBar(width, context));

  const fontSizes = [1, 0.88, 0.78, 0.68, 0.58].map((f) => Math.round(styleConfig.textSize * f));
  const fitted = fitWrappedText(
    ctx,
    question.questionText,
    innerWidth,
    fontSizes,
    6,
    FONT_FAMILY,
    'bold',
  );
  const qLineHeight = fitted.size + 14;
  const boxHeight = 62 + fitted.lines.length * qLineHeight;

  nodes.push({
    id: 'question-panel',
    type: 'rect',
    x: BOX_X,
    y: cursor,
    width: boxWidth,
    height: boxHeight,
    cornerRadius: 30,
    fill: PANEL_BG,
  });
  nodes.push({
    id: 'question-text',
    type: 'text',
    x: BOX_X + 38,
    y: cursor + 46 + fitted.size,
    text: fitted.lines.join('\n'),
    fontSize: fitted.size,
    fontFamily: FONT_FAMILY,
    fontStyle: 'bold',
    align: 'left',
    lineHeight: qLineHeight,
    fill: styleConfig.textColor,
  });
  cursor += boxHeight + 24;

  if (styleConfig.showOptions) {
    cursor = drawOptionsStacked(nodes, ctx, question, styleConfig, cursor, boxWidth);
  }

  if (styleConfig.showExplanation && question.explanation?.trim()) {
    cursor = drawExplanation(nodes, ctx, question.explanation, styleConfig, cursor, boxWidth);
  }

  const footerHeight = 46;
  const contentHeight = cursor + footerHeight + 20;
  const height = Math.max(styleConfig.slideHeight, contentHeight);
  nodes.push(...buildFooter(width, height, footerHeight));

  return {
    width,
    height,
    background: {
      color: styleConfig.bgColor ?? '#ffffff',
      gradient: styleConfig.bgGradient ?? null,
    },
    nodes,
  };
}

function buildBrandBar(width: number, context: SlideRenderContext): SceneNode[] {
  return [
    {
      id: 'brand-bar',
      type: 'rect',
      x: 0,
      y: 0,
      width,
      height: BRAND_BAR_HEIGHT,
      fill: BRAND_NAVY,
    },
    {
      id: 'brand-title',
      type: 'text',
      x: 28,
      y: 35,
      text: 'Farhan MCQ',
      fontSize: 20,
      fontFamily: FONT_FAMILY,
      fontStyle: 'bold',
      align: 'left',
      fill: '#ffffff',
    },
    {
      id: 'brand-count',
      type: 'text',
      x: width - 28,
      y: 35,
      text: `প্রশ্ন ${toBengaliDigits(context.slideIndex)}/${toBengaliDigits(context.totalSlides)}`,
      fontSize: 16,
      fontFamily: FONT_FAMILY,
      align: 'right',
      fill: '#ffffff',
    },
  ];
}

function buildFooter(width: number, height: number, footerHeight: number): SceneNode[] {
  const y = height - footerHeight;
  return [
    { id: 'footer-bg', type: 'rect', x: 0, y, width, height: footerHeight, fill: BRAND_NAVY },
    {
      id: 'footer-text',
      type: 'text',
      x: width / 2,
      y: y + footerHeight / 2 + 6,
      text: 'সরকারি চাকরি প্রস্তুতি — Farhan MCQ',
      fontSize: 15,
      fontFamily: FONT_FAMILY,
      align: 'center',
      fill: '#ffffff',
    },
  ];
}

function drawOptionsStacked(
  nodes: SceneNode[],
  ctx: ReturnType<typeof createMeasurementContext>,
  question: SlideQuestionInput,
  styleConfig: SlideStyleConfigInput,
  y: number,
  boxWidth: number,
): number {
  const optSize = Math.round(styleConfig.textSize * 0.62);
  const lineHeight = optSize * 1.5;
  let cursor = y;

  for (const key of ['A', 'B', 'C', 'D'] as const) {
    const optionText = question[`option${key}` as 'optionA' | 'optionB' | 'optionC' | 'optionD'];
    const isCorrect = styleConfig.showAnswer && question.correctAnswer === key;
    const label = OPTION_LABELS[key];

    ctx.font = `${isCorrect ? 'bold' : 'normal'} ${optSize}px ${FONT_FAMILY}`;
    const lines = wrapText(ctx, `(${label}) ${optionText}`, boxWidth - 40, {
      weight: isCorrect ? 'bold' : 'normal',
      fontSize: optSize,
    });
    const blockHeight = lines.length * lineHeight;

    if (isCorrect) {
      nodes.push({
        id: `single-opt-bg-${key}`,
        type: 'rect',
        x: BOX_X - 10,
        y: cursor - 6,
        width: boxWidth + 20,
        height: blockHeight + 14,
        cornerRadius: 10,
        fill: CORRECT_BG,
      });
    }

    nodes.push({
      id: `single-opt-${key}`,
      type: 'text',
      x: BOX_X,
      y: cursor + optSize,
      text: lines.join('\n'),
      fontSize: optSize,
      fontFamily: FONT_FAMILY,
      fontStyle: isCorrect ? 'bold' : 'normal',
      align: 'left',
      lineHeight,
      fill: isCorrect ? CORRECT_TEXT : styleConfig.textColor,
    });

    cursor += blockHeight + 14;
  }

  return cursor + 8;
}

function drawExplanation(
  nodes: SceneNode[],
  ctx: ReturnType<typeof createMeasurementContext>,
  explanation: string,
  styleConfig: SlideStyleConfigInput,
  y: number,
  boxWidth: number,
): number {
  const expSize = Math.round(styleConfig.textSize * 0.56);
  const padding = 18;
  const lines = wrapText(ctx, `ব্যাখ্যা: ${explanation}`, boxWidth - padding * 2, {
    weight: 'normal',
    fontSize: expSize,
  });
  const lineHeight = expSize * 1.55;
  const blockHeight = lines.length * lineHeight + padding * 2;

  nodes.push({
    id: 'single-exp-bg',
    type: 'rect',
    x: BOX_X,
    y,
    width: boxWidth,
    height: blockHeight,
    cornerRadius: 12,
    fill: EXPLANATION_BG,
  });
  nodes.push({
    id: 'single-exp-text',
    type: 'text',
    x: BOX_X + padding,
    y: y + padding + expSize,
    text: lines.join('\n'),
    fontSize: expSize,
    fontFamily: FONT_FAMILY,
    align: 'left',
    lineHeight,
    fill: EXPLANATION_TEXT,
  });

  return y + blockHeight + 14;
}
