import { FONT_FAMILY } from './fonts.js';
import { decodeHtmlEntities } from './html-decode.js';
import { createMeasurementContext } from './paint.js';
import { OPTION_LABELS, toBengaliDigits, wrapText, BN_DARI } from './text-utils.js';
import type {
  Scene,
  SceneNode,
  SlideQuestionInput,
  SlideRenderContext,
  SlideStyleConfigInput,
} from './types.js';

const MARGIN = 56;
const HEADER_HEIGHT = 70;
const FOOTER_HEIGHT = 40;
const BRAND_NAVY = '#0f1b35';
const BRAND_GOLD = '#c8a84b';
const CORRECT_BG = '#e8f5ee';
const CORRECT_TEXT = '#0a2210';
const EXPLANATION_BG = '#f0faf4';
const EXPLANATION_TEXT = '#2d4a35';
const DIVIDER_COLOR = '#c8cdd6';

// Stacks N questions in a single column; slide height grows with the actual measured content
// instead of a fixed pixel budget per question — this is what makes "questions-per-slide"
// increase the slide height rather than cramming text.
export function composeGroupedScene(
  questions: SlideQuestionInput[],
  styleConfig: SlideStyleConfigInput,
  context: SlideRenderContext,
): Scene {
  const ctx = createMeasurementContext();
  const width = styleConfig.slideWidth;
  const contentWidth = width - MARGIN * 2;
  const nodes: SceneNode[] = [];

  let cursor = HEADER_HEIGHT + 24;

  questions.forEach((question, index) => {
    cursor = drawQuestionBlock(
      nodes,
      ctx,
      question,
      index,
      styleConfig,
      MARGIN,
      cursor,
      contentWidth,
    );
    if (index < questions.length - 1) {
      nodes.push({
        id: `divider-${question.id}`,
        type: 'line',
        x: MARGIN,
        y: cursor,
        points: [MARGIN, cursor, MARGIN + contentWidth, cursor],
        stroke: DIVIDER_COLOR,
        strokeWidth: 1,
        dash: [4, 4],
      });
      cursor += 20;
    }
  });

  const contentHeight = cursor + FOOTER_HEIGHT + 16;
  const height = Math.max(styleConfig.slideHeight, contentHeight);

  nodes.unshift(...buildHeaderNodes(width, context));
  nodes.push(...buildFooterNodes(width, height));

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

function buildHeaderNodes(width: number, context: SlideRenderContext): SceneNode[] {
  return [
    { id: 'header-bg', type: 'rect', x: 0, y: 0, width, height: HEADER_HEIGHT, fill: BRAND_NAVY },
    {
      id: 'header-title',
      type: 'text',
      x: width / 2,
      y: HEADER_HEIGHT / 2 + 8,
      text: 'Farhan MCQ',
      fontSize: 26,
      fontFamily: FONT_FAMILY,
      fontStyle: 'bold',
      align: 'center',
      fill: '#ffffff',
    },
    {
      id: 'header-slide-count',
      type: 'text',
      x: width - MARGIN,
      y: HEADER_HEIGHT / 2 + 6,
      text: `স্লাইড ${toBengaliDigits(context.slideIndex)}/${toBengaliDigits(context.totalSlides)}`,
      fontSize: 14,
      fontFamily: FONT_FAMILY,
      align: 'right',
      fill: BRAND_GOLD,
    },
  ];
}

function buildFooterNodes(width: number, height: number): SceneNode[] {
  const y = height - FOOTER_HEIGHT;
  return [
    { id: 'footer-bg', type: 'rect', x: 0, y, width, height: FOOTER_HEIGHT, fill: BRAND_NAVY },
    {
      id: 'footer-text',
      type: 'text',
      x: width / 2,
      y: y + FOOTER_HEIGHT / 2 + 5,
      text: 'সরকারি চাকরি প্রস্তুতি — Farhan MCQ',
      fontSize: 13,
      fontFamily: FONT_FAMILY,
      align: 'center',
      fill: '#ffffff',
    },
  ];
}

function drawQuestionBlock(
  nodes: SceneNode[],
  ctx: ReturnType<typeof createMeasurementContext>,
  question: SlideQuestionInput,
  index: number,
  styleConfig: SlideStyleConfigInput,
  x: number,
  y: number,
  contentWidth: number,
): number {
  let cursor = y;
  const { textColor, textSize } = styleConfig;

  // Question number + text as a single wrapped block
  const qFontSize = textSize;
  const qText = decodeHtmlEntities(question.questionText);
  const qLines = wrapText(
    ctx,
    `${toBengaliDigits(index + 1)}${BN_DARI} ${qText}`,
    contentWidth,
    { weight: 'bold', fontSize: qFontSize },
  );
  const qLineHeight = qFontSize * 1.5;
  nodes.push({
    id: `q-${question.id}`,
    type: 'text',
    x,
    y: cursor + qFontSize,
    width: contentWidth,
    text: qLines.join('\n'),
    fontSize: qFontSize,
    fontFamily: FONT_FAMILY,
    fontStyle: 'bold',
    align: 'left',
    lineHeight: qLineHeight,
    fill: textColor,
  });
  cursor += qLines.length * qLineHeight + 14;

  if (styleConfig.showOptions) {
    cursor = drawOptions(nodes, ctx, question, styleConfig, x, cursor, contentWidth);
  }

  if (styleConfig.showExplanation && question.explanation?.trim()) {
    cursor = drawExplanation(
      nodes,
      ctx,
      question.id,
      question.explanation,
      styleConfig,
      x,
      cursor,
      contentWidth,
    );
  }

  return cursor;
}

function drawOptions(
  nodes: SceneNode[],
  ctx: ReturnType<typeof createMeasurementContext>,
  question: SlideQuestionInput,
  styleConfig: SlideStyleConfigInput,
  x: number,
  y: number,
  contentWidth: number,
): number {
  const optSize = Math.round(styleConfig.textSize * 0.82);
  const colGap = 24;
  const colWidth = (contentWidth - colGap) / 2;
  const lineHeight = optSize * 1.5;
  let cursor = y;

  const rows: Array<['A', 'B'] | ['C', 'D']> = [
    ['A', 'B'],
    ['C', 'D'],
  ];

  for (const row of rows) {
    let rowHeight = 0;
    row.forEach((key, col) => {
      const optionText = decodeHtmlEntities(
        question[`option${key}` as 'optionA' | 'optionB' | 'optionC' | 'optionD'],
      );
      const isCorrect = styleConfig.showAnswer && question.correctAnswer === key;
      const ox = x + col * (colWidth + colGap);
      const label = OPTION_LABELS[key];

      ctx.font = `${isCorrect ? 'bold' : 'normal'} ${optSize}px ${FONT_FAMILY}`;
      const lines = wrapText(ctx, `(${label}) ${optionText}`, colWidth - 20, {
        weight: isCorrect ? 'bold' : 'normal',
        fontSize: optSize,
      });
      const blockHeight = lines.length * lineHeight;
      rowHeight = Math.max(rowHeight, blockHeight);

      if (isCorrect) {
        nodes.push({
          id: `opt-bg-${question.id}-${key}`,
          type: 'rect',
          x: ox - 10,
          y: cursor - 6,
          width: colWidth + 4,
          height: blockHeight + 14,
          cornerRadius: 8,
          fill: CORRECT_BG,
        });
      }

      nodes.push({
        id: `opt-${question.id}-${key}`,
        type: 'text',
        x: ox,
        y: cursor + optSize,
        text: lines.join('\n'),
        fontSize: optSize,
        fontFamily: FONT_FAMILY,
        fontStyle: isCorrect ? 'bold' : 'normal',
        align: 'left',
        lineHeight,
        fill: isCorrect ? CORRECT_TEXT : styleConfig.textColor,
      });
    });
    cursor += rowHeight + 16;
  }

  return cursor + 4;
}

function drawExplanation(
  nodes: SceneNode[],
  ctx: ReturnType<typeof createMeasurementContext>,
  questionId: string,
  explanation: string,
  styleConfig: SlideStyleConfigInput,
  x: number,
  y: number,
  contentWidth: number,
): number {
  const expSize = Math.round(styleConfig.textSize * 0.78);
  const padding = 16;
  const decoded = decodeHtmlEntities(explanation);
  const lines = wrapText(ctx, `ব্যাখ্যা: ${decoded}`, contentWidth - padding * 2, {
    weight: 'normal',
    fontSize: expSize,
  });
  const lineHeight = expSize * 1.55;
  const blockHeight = lines.length * lineHeight + padding * 2;

  nodes.push({
    id: `exp-bg-${questionId}`,
    type: 'rect',
    x,
    y,
    width: contentWidth,
    height: blockHeight,
    cornerRadius: 8,
    fill: EXPLANATION_BG,
  });
  nodes.push({
    id: `exp-text-${questionId}`,
    type: 'text',
    x: x + padding,
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
