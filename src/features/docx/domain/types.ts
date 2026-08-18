export type DocxTemplateStyle = 'COLORFUL' | 'PLAIN';

export interface DocxStyleConfigFields {
  templateStyle: DocxTemplateStyle;
  columnCount: 1 | 2;
  fontSizePt: number | null;
  fontBn: string;
  brandName: string;
  brandSubtitle: string;
  footerText: string;
  showExplanation: boolean;
  explanationMaxChars: number;
  siteBaseUrl: string;
}

export interface GenerateDocxInput {
  /** One or more question sets — each becomes a section (page break) in the docx. */
  questionSetIds: string[];
  styleConfig: DocxStyleConfigFields;
}

export interface DocxStyleConfigDto extends DocxStyleConfigFields {
  id: string;
  configHash: string;
  createdBy: string;
  createdAt: Date;
}

export type DocxJobStatusValue = 'QUEUED' | 'PROCESSING' | 'DONE' | 'FAILED';

export interface DocxGenerationJobDto {
  id: string;
  questionSetIds: string[];
  setsHash: string;
  status: DocxJobStatusValue;
  progress: number;
  styleConfigId: string;
  errorMessage: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface DocxDocumentDto {
  id: string;
  questionSetIds: string[];
  setsHash: string;
  setCount: number;
  fileUrl: string;
  questionCount: number;
  styleConfigId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface GenerateDocxResult {
  cached: boolean;
  styleConfigId: string;
  document?: DocxDocumentDto;
  jobId?: string;
}

export interface DocxJobStatusResult extends DocxGenerationJobDto {
  document?: DocxDocumentDto;
}

export interface DocxExportResult {
  styleConfig: DocxStyleConfigDto;
  document: DocxDocumentDto;
}

export interface QuestionForDocx {
  id: string;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: string;
  explanation: string | null;
  slug: string | null;
  sortOrder: number;
}

export interface QuestionSetMetaForDocx {
  title: string;
  subject: string;
  date: Date;
}

export interface DocxSetInput {
  meta: QuestionSetMetaForDocx;
  questions: QuestionForDocx[];
}

export interface DocxBuildOptions extends DocxStyleConfigFields {}
