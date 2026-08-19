export type DocxTemplateStyle = 'COLORFUL' | 'PLAIN';

export interface DocxTheme {
  fontBn: string;
  plain: boolean;
  colors: Record<string, string | null>;
  questionAccents: string[];
  sizes: Record<string, number>;
}

const BASE_SIZES_HALF_PT = {
  brandTitle: 44,
  brandSubtitle: 20,
  sectionTitle: 26,
  questionNumber: 22,
  questionText: 24,
  optionText: 22,
  answerBadge: 20,
  footer: 18,
  meta: 18,
  explanationLabel: 20,
  explanationText: 20,
  explanationLink: 20,
};
const BASE_QUESTION_TEXT_PT = BASE_SIZES_HALF_PT.questionText / 2;

const COLORFUL_COLORS = {
  brand: '184A6B',
  ruleLine: '29ABE2',
  sectionBg: '184A6B',
  sectionText: 'FFFFFF',
  numberChip: 'E53935',
  numberChipText: 'FFFFFF',
  answerBadgeBg: '7B1FA2',
  answerBadgeText: 'FFFFFF',
  optionText: '222222',
  footerText: 'C62828',
  footerRule: '29ABE2',
  metaText: '666666',
  explanationLabel: '184A6B',
  explanationText: '333333',
  explanationLink: '1155CC',
};

const PLAIN_COLORS: Record<string, string | null> = {
  brand: '000000',
  ruleLine: '000000',
  sectionBg: null,
  sectionText: '000000',
  numberChip: null,
  numberChipText: '000000',
  answerBadgeBg: null,
  answerBadgeText: '000000',
  optionText: '000000',
  footerText: '000000',
  footerRule: '000000',
  metaText: '000000',
  explanationLabel: '000000',
  explanationText: '000000',
  explanationLink: '000000',
};

const COLORFUL_ACCENTS = ['0F6E5B', '2E5FA3', 'B5541A', '8E24AA', '2E7D32', 'AD1457'];
const PLAIN_ACCENTS = ['000000'];

export function buildTheme({
  fontBn = 'Kalpurush',
  fontSizePt = null,
  templateStyle = 'COLORFUL',
}: {
  fontBn?: string;
  fontSizePt?: number | null;
  templateStyle?: DocxTemplateStyle;
} = {}): DocxTheme {
  const plain = templateStyle === 'PLAIN';
  const scale = fontSizePt ? fontSizePt / BASE_QUESTION_TEXT_PT : 1;
  const scaled = (halfPt: number) => {
    const v = Math.round(halfPt * scale);
    return Math.max(12, v % 2 === 0 ? v : v + 1);
  };

  const sizes = Object.fromEntries(
    Object.entries(BASE_SIZES_HALF_PT).map(([key, v]) => [key, scaled(v)]),
  );

  return {
    fontBn,
    plain,
    colors: plain ? PLAIN_COLORS : COLORFUL_COLORS,
    questionAccents: plain ? PLAIN_ACCENTS : COLORFUL_ACCENTS,
    sizes,
  };
}
