import {
  AlignmentType,
  BorderStyle,
  Document,
  ExternalHyperlink,
  Footer,
  Header,
  PageBreak,
  Paragraph,
  ShadingType,
  TabStopType,
  TextRun,
  UnderlineType,
} from 'docx';

import type { DocxBuildOptions, DocxSetInput, QuestionForDocx } from '../types.js';

import { optionLetterFor, toBengaliNumber } from './bengali-utils.js';
import { buildTheme } from './theme.js';

const PAGE = {
  width: 11906,
  height: 16838,
  margins: { top: 720, bottom: 720, left: 900, right: 900 },
};
export const CONTENT_WIDTH = PAGE.width - PAGE.margins.left - PAGE.margins.right;
const COLUMN_SPACE = 400;

export function contentWidthFor(columnCount: number): number {
  if (columnCount <= 1) return CONTENT_WIDTH;
  return Math.floor((CONTENT_WIDTH - COLUMN_SPACE * (columnCount - 1)) / columnCount);
}

function shadingIfAny(fill: string | null | undefined) {
  return fill ? { shading: { type: ShadingType.CLEAR, fill } } : {};
}

function buildHeader(
  theme: ReturnType<typeof buildTheme>,
  opts: Pick<DocxBuildOptions, 'brandName' | 'brandSubtitle'>,
) {
  const children = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 20 },
      children: [
        new TextRun({
          text: opts.brandName,
          bold: true,
          color: theme.colors.brand ?? undefined,
          font: theme.fontBn,
          size: theme.sizes.brandTitle,
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 80 },
      children: [
        new TextRun({
          text: opts.brandSubtitle,
          color: theme.colors.metaText ?? undefined,
          font: theme.fontBn,
          size: theme.sizes.brandSubtitle,
        }),
      ],
    }),
    new Paragraph({
      spacing: { after: 40 },
      border: {
        bottom: {
          style: BorderStyle.THICK,
          size: 12,
          color: theme.colors.ruleLine ?? undefined,
          space: 2,
        },
      },
      children: [new TextRun({ text: '', size: 2 })],
    }),
    new Paragraph({
      spacing: { after: 0 },
      border: {
        bottom: {
          style: BorderStyle.SINGLE,
          size: 4,
          color: theme.colors.ruleLine ?? undefined,
          space: 1,
        },
      },
      children: [new TextRun({ text: '', size: 2 })],
    }),
  ];

  return new Header({ children });
}

function buildFooter(theme: ReturnType<typeof buildTheme>, footerText: string) {
  return new Footer({
    children: [
      new Paragraph({
        spacing: { before: 40 },
        border: {
          top: {
            style: BorderStyle.SINGLE,
            size: 4,
            color: theme.colors.footerRule ?? undefined,
            space: 4,
          },
        },
        children: [new TextRun({ text: '', size: 2 })],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: footerText,
            italics: true,
            bold: true,
            color: theme.colors.footerText ?? undefined,
            font: theme.fontBn,
            size: theme.sizes.footer,
          }),
        ],
      }),
    ],
  });
}

function sectionTitleBar(theme: ReturnType<typeof buildTheme>, title: string) {
  const frame = theme.colors.sectionBg
    ? shadingIfAny(theme.colors.sectionBg)
    : {
        border: {
          top: { style: BorderStyle.SINGLE, size: 6, color: theme.colors.brand ?? undefined, space: 4 },
          bottom: {
            style: BorderStyle.SINGLE,
            size: 6,
            color: theme.colors.brand ?? undefined,
            space: 4,
          },
        },
      };

  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 120, after: 240 },
    ...frame,
    children: [
      new TextRun({
        text: title,
        bold: true,
        color: theme.colors.sectionText ?? undefined,
        font: theme.fontBn,
        size: theme.sizes.sectionTitle,
      }),
    ],
  });
}

function metaLine(theme: ReturnType<typeof buildTheme>, meta: DocxSetInput['meta']) {
  const bits: string[] = [];
  if (meta.title) bits.push(meta.title);
  if (meta.subject) bits.push(meta.subject);
  if (meta.date) {
    const d = new Date(meta.date);
    if (!Number.isNaN(d.getTime())) bits.push(d.toLocaleDateString('en-GB'));
  }
  if (!bits.length) return null;

  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 160 },
    children: [
      new TextRun({
        text: bits.join('  •  '),
        color: theme.colors.metaText ?? undefined,
        font: theme.fontBn,
        size: theme.sizes.meta,
      }),
    ],
  });
}

function explanationBlock(
  theme: ReturnType<typeof buildTheme>,
  question: QuestionForDocx,
  opts: Pick<DocxBuildOptions, 'showExplanation' | 'explanationMaxChars' | 'siteBaseUrl'>,
) {
  if (!opts.showExplanation) return [];

  const text = (question.explanation || '').trim();
  if (!text) return [];

  const truncated = text.length > opts.explanationMaxChars;
  const shown = truncated ? text.slice(0, opts.explanationMaxChars).trimEnd() : text;

  const paragraphs = [
    new Paragraph({
      spacing: { before: 40, after: truncated ? 20 : 140 },
      children: [
        new TextRun({
          text: 'ব্যাখ্যা: ',
          bold: true,
          color: theme.colors.explanationLabel ?? undefined,
          font: theme.fontBn,
          size: theme.sizes.explanationLabel,
        }),
        new TextRun({
          text: truncated ? `${shown} ...` : shown,
          color: theme.colors.explanationText ?? undefined,
          font: theme.fontBn,
          size: theme.sizes.explanationText,
        }),
      ],
    }),
  ];

  if (truncated) {
    const url = question.slug ? `${opts.siteBaseUrl}/${question.slug}` : opts.siteBaseUrl;
    paragraphs.push(
      new Paragraph({
        spacing: { after: 140 },
        children: [
          new ExternalHyperlink({
            link: url,
            children: [
              new TextRun({
                text: 'বিস্তারিত পড়ুন Farhan MCQ তে',
                bold: true,
                underline: {
                  type: UnderlineType.SINGLE,
                  color: theme.colors.explanationLink ?? undefined,
                },
                color: theme.colors.explanationLink ?? undefined,
                font: theme.fontBn,
                size: theme.sizes.explanationLink,
              }),
            ],
          }),
        ],
      }),
    );
  }

  return paragraphs;
}

function questionBlock(
  theme: ReturnType<typeof buildTheme>,
  question: QuestionForDocx,
  index: number,
  contentWidth: number,
  explanationOpts: Pick<DocxBuildOptions, 'showExplanation' | 'explanationMaxChars' | 'siteBaseUrl'>,
) {
  const accent = theme.questionAccents[index % theme.questionAccents.length]!;
  const number = toBengaliNumber(index + 1);

  const questionParagraph = new Paragraph({
    spacing: { before: 160, after: 60 },
    children: [
      new TextRun({
        text: ` ${number}. `,
        bold: true,
        color: theme.colors.numberChipText ?? undefined,
        font: theme.fontBn,
        size: theme.sizes.questionNumber,
        ...shadingIfAny(theme.colors.numberChip),
      }),
      new TextRun({ text: '  ', size: theme.sizes.questionNumber }),
      new TextRun({
        text: question.questionText,
        bold: true,
        color: accent,
        font: theme.fontBn,
        size: theme.sizes.questionText,
      }),
    ],
  });

  const letter = optionLetterFor(question.correctAnswer);
  const options: Array<[string, string]> = [
    ['ক', question.optionA],
    ['খ', question.optionB],
    ['গ', question.optionC],
    ['ঘ', question.optionD],
  ];

  const totalLen = options.reduce((sum, [, text]) => sum + (text?.length ?? 0), 0);
  const widthRatio = contentWidth / CONTENT_WIDTH;
  const fontRatio = theme.sizes.questionText! / 24;
  const gridThreshold = Math.max(16, Math.round(44 * (widthRatio / fontRatio)));
  const useGrid = totalLen > gridThreshold;

  const optionRuns = (pairs: Array<[string, string]>) =>
    pairs.flatMap(([letterCh, text], i) => {
      const runs: TextRun[] = [];
      if (i > 0) runs.push(new TextRun({ text: '\t' }));
      runs.push(
        new TextRun({
          text: `(${letterCh}) ${text}`,
          color: theme.colors.optionText ?? undefined,
          font: theme.fontBn,
          size: theme.sizes.optionText,
        }),
      );
      return runs;
    });

  const badgeRightEdge = contentWidth - 140;
  const badgeRun = new TextRun({
    text: ` উত্তর: ${letter}`,
    bold: true,
    color: theme.colors.answerBadgeText ?? undefined,
    font: theme.fontBn,
    size: theme.sizes.answerBadge,
    ...shadingIfAny(theme.colors.answerBadgeBg),
  });

  const paragraphs: Paragraph[] = [];

  if (!useGrid) {
    paragraphs.push(
      new Paragraph({
        spacing: { after: 120 },
        tabStops: [
          { type: TabStopType.LEFT, position: Math.round(contentWidth * 0.24) },
          { type: TabStopType.LEFT, position: Math.round(contentWidth * 0.48) },
          { type: TabStopType.LEFT, position: Math.round(contentWidth * 0.72) },
          { type: TabStopType.RIGHT, position: badgeRightEdge },
        ],
        children: [...optionRuns(options), new TextRun({ text: '\t' }), badgeRun],
      }),
    );
  } else {
    paragraphs.push(
      new Paragraph({
        spacing: { after: 40 },
        tabStops: [{ type: TabStopType.LEFT, position: Math.round(contentWidth * 0.5) }],
        children: optionRuns(options.slice(0, 2)),
      }),
      new Paragraph({
        spacing: { after: 120 },
        tabStops: [
          { type: TabStopType.LEFT, position: Math.round(contentWidth * 0.5) },
          { type: TabStopType.RIGHT, position: badgeRightEdge },
        ],
        children: [...optionRuns(options.slice(2, 4)), new TextRun({ text: '\t' }), badgeRun],
      }),
    );
  }

  paragraphs.push(...explanationBlock(theme, question, explanationOpts));

  return [questionParagraph, ...paragraphs];
}

export function buildDocument(sets: DocxSetInput[], opts: DocxBuildOptions): Document {
  const theme = buildTheme({
    fontBn: opts.fontBn,
    fontSizePt: opts.fontSizePt ?? null,
    templateStyle: opts.templateStyle,
  });
  const columnCount = opts.columnCount ?? 1;
  const contentWidth = contentWidthFor(columnCount);
  const explanationOpts = {
    showExplanation: Boolean(opts.showExplanation),
    explanationMaxChars: opts.explanationMaxChars ?? 400,
    siteBaseUrl: opts.siteBaseUrl ?? 'https://farhanmcq.com',
  };

  const body: Paragraph[] = [];

  sets.forEach((set, setIndex) => {
    if (setIndex > 0) {
      body.push(new Paragraph({ children: [new PageBreak()] }));
    }

    body.push(sectionTitleBar(theme, set.meta.subject || set.meta.title || 'প্রশ্নব্যাংক'));

    const meta = metaLine(theme, set.meta);
    if (meta) body.push(meta);

    set.questions.forEach((q, i) => {
      body.push(...questionBlock(theme, q, i, contentWidth, explanationOpts));
    });
  });

  return new Document({
    sections: [
      {
        properties: {
          page: {
            size: { width: PAGE.width, height: PAGE.height },
            margin: PAGE.margins,
          },
          ...(columnCount > 1 ? { column: { count: columnCount, space: COLUMN_SPACE } } : {}),
        },
        headers: {
          default: buildHeader(theme, {
            brandName: opts.brandName,
            brandSubtitle: opts.brandSubtitle,
          }),
        },
        footers: { default: buildFooter(theme, opts.footerText) },
        children: body,
      },
    ],
  });
}
