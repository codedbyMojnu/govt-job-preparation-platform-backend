import type {
  DocxDocumentDto,
  DocxGenerationJobDto,
  DocxJobStatusValue,
  DocxStyleConfigDto,
  DocxStyleConfigFields,
  QuestionForDocx,
} from './types.js';

export interface CreateDocxStyleConfigInput extends DocxStyleConfigFields {
  configHash: string;
  createdBy: string;
}

export interface CreateDocxJobInput {
  questionSetIds: string[];
  setsHash: string;
  styleConfigId: string;
}

export interface CreateDocxDocumentInput {
  questionSetIds: string[];
  setsHash: string;
  setCount: number;
  fileUrl: string;
  questionCount: number;
  styleConfigId: string;
}

export interface DocxRepository {
  countQuestionSets(questionSetIds: string[]): Promise<number>;
  getQuestionsForSet(questionSetId: string): Promise<QuestionForDocx[]>;
  getQuestionSetMeta(
    questionSetId: string,
  ): Promise<{ title: string; subject: string; date: Date } | null>;

  findStyleConfigByHash(hash: string): Promise<DocxStyleConfigDto | null>;
  findStyleConfigById(id: string): Promise<DocxStyleConfigDto | null>;
  createStyleConfig(input: CreateDocxStyleConfigInput): Promise<DocxStyleConfigDto>;

  findDocumentBySetsAndStyle(
    setsHash: string,
    styleConfigId: string,
  ): Promise<DocxDocumentDto | null>;
  findDocumentById(documentId: string): Promise<DocxDocumentDto | null>;
  findExportById(
    documentId: string,
  ): Promise<{ styleConfig: DocxStyleConfigDto; document: DocxDocumentDto } | null>;
  upsertDocument(input: CreateDocxDocumentInput): Promise<DocxDocumentDto>;
  deleteDocumentById(documentId: string): Promise<boolean>;

  createJob(input: CreateDocxJobInput): Promise<DocxGenerationJobDto>;
  findJobById(jobId: string): Promise<DocxGenerationJobDto | null>;
  findActiveJobForExport(
    setsHash: string,
    styleConfigId: string,
  ): Promise<DocxGenerationJobDto | null>;
  updateJobStatus(
    jobId: string,
    status: DocxJobStatusValue,
    errorMessage?: string,
  ): Promise<void>;
  updateJobProgress(jobId: string, progress: number): Promise<void>;
}
