import type { PrismaClient } from '@prisma/client';

import { docxDocumentMapper, docxJobMapper, docxStyleConfigMapper } from '../domain/mapper.js';
import type {
  CreateDocxDocumentInput,
  CreateDocxJobInput,
  CreateDocxStyleConfigInput,
  DocxRepository,
} from '../domain/repository.contract.js';
import type {
  DocxDocumentDto,
  DocxGenerationJobDto,
  DocxJobStatusValue,
  DocxStyleConfigDto,
  QuestionForDocx,
} from '../domain/types.js';

const ACTIVE_JOB_STATUSES: DocxJobStatusValue[] = ['QUEUED', 'PROCESSING'];

export class DocxPrismaRepository implements DocxRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async countQuestionSets(questionSetIds: string[]): Promise<number> {
    const count = await this.prisma.questionSet.count({
      where: { id: { in: questionSetIds } },
    });
    return count;
  }

  async getQuestionsForSet(questionSetId: string): Promise<QuestionForDocx[]> {
    const questions = await this.prisma.question.findMany({
      where: { questionSetId },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
    });
    return questions.map((q) => ({
      id: q.id,
      questionText: q.questionText,
      optionA: q.optionA,
      optionB: q.optionB,
      optionC: q.optionC,
      optionD: q.optionD,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
      slug: q.slug,
      sortOrder: q.sortOrder,
    }));
  }

  async getQuestionSetMeta(
    questionSetId: string,
  ): Promise<{ title: string; subject: string; date: Date } | null> {
    return this.prisma.questionSet.findUnique({
      where: { id: questionSetId },
      select: { title: true, subject: true, date: true },
    });
  }

  async findStyleConfigByHash(hash: string): Promise<DocxStyleConfigDto | null> {
    const config = await this.prisma.docxStyleConfig.findUnique({ where: { configHash: hash } });
    return config ? docxStyleConfigMapper.toDto(config) : null;
  }

  async findStyleConfigById(id: string): Promise<DocxStyleConfigDto | null> {
    const config = await this.prisma.docxStyleConfig.findUnique({ where: { id } });
    return config ? docxStyleConfigMapper.toDto(config) : null;
  }

  async createStyleConfig(input: CreateDocxStyleConfigInput): Promise<DocxStyleConfigDto> {
    const config = await this.prisma.docxStyleConfig.create({
      data: {
        templateStyle: input.templateStyle,
        columnCount: input.columnCount,
        fontSizePt: input.fontSizePt,
        fontBn: input.fontBn,
        brandName: input.brandName,
        brandSubtitle: input.brandSubtitle,
        footerText: input.footerText,
        showExplanation: input.showExplanation,
        explanationMaxChars: input.explanationMaxChars,
        siteBaseUrl: input.siteBaseUrl,
        configHash: input.configHash,
        createdBy: input.createdBy,
      },
    });
    return docxStyleConfigMapper.toDto(config);
  }

  async findDocumentBySetsAndStyle(
    setsHash: string,
    styleConfigId: string,
  ): Promise<DocxDocumentDto | null> {
    const doc = await this.prisma.docxDocument.findUnique({
      where: { setsHash_styleConfigId: { setsHash, styleConfigId } },
    });
    return doc ? docxDocumentMapper.toDto(doc) : null;
  }

  async findDocumentById(documentId: string): Promise<DocxDocumentDto | null> {
    const doc = await this.prisma.docxDocument.findUnique({ where: { id: documentId } });
    return doc ? docxDocumentMapper.toDto(doc) : null;
  }

  async findExportById(
    documentId: string,
  ): Promise<{ styleConfig: DocxStyleConfigDto; document: DocxDocumentDto } | null> {
    const document = await this.prisma.docxDocument.findUnique({ where: { id: documentId } });
    if (!document) return null;

    const styleConfig = await this.prisma.docxStyleConfig.findUnique({
      where: { id: document.styleConfigId },
    });
    if (!styleConfig) return null;

    return {
      styleConfig: docxStyleConfigMapper.toDto(styleConfig),
      document: docxDocumentMapper.toDto(document),
    };
  }

  async upsertDocument(input: CreateDocxDocumentInput): Promise<DocxDocumentDto> {
    const doc = await this.prisma.docxDocument.upsert({
      where: {
        setsHash_styleConfigId: {
          setsHash: input.setsHash,
          styleConfigId: input.styleConfigId,
        },
      },
      create: {
        questionSetIds: input.questionSetIds,
        setsHash: input.setsHash,
        setCount: input.setCount,
        fileUrl: input.fileUrl,
        questionCount: input.questionCount,
        styleConfigId: input.styleConfigId,
      },
      update: {
        questionSetIds: input.questionSetIds,
        setCount: input.setCount,
        fileUrl: input.fileUrl,
        questionCount: input.questionCount,
        updatedAt: new Date(),
      },
    });
    return docxDocumentMapper.toDto(doc);
  }

  async deleteDocumentById(documentId: string): Promise<boolean> {
    try {
      await this.prisma.docxDocument.delete({ where: { id: documentId } });
      return true;
    } catch {
      return false;
    }
  }

  async createJob(input: CreateDocxJobInput): Promise<DocxGenerationJobDto> {
    const job = await this.prisma.docxGenerationJob.create({
      data: {
        questionSetIds: input.questionSetIds,
        setsHash: input.setsHash,
        styleConfigId: input.styleConfigId,
      },
    });
    return docxJobMapper.toDto(job);
  }

  async findJobById(id: string): Promise<DocxGenerationJobDto | null> {
    const job = await this.prisma.docxGenerationJob.findUnique({ where: { id } });
    return job ? docxJobMapper.toDto(job) : null;
  }

  async findActiveJobForExport(
    setsHash: string,
    styleConfigId: string,
  ): Promise<DocxGenerationJobDto | null> {
    const job = await this.prisma.docxGenerationJob.findFirst({
      where: { setsHash, styleConfigId, status: { in: ACTIVE_JOB_STATUSES } },
      orderBy: { createdAt: 'desc' },
    });
    return job ? docxJobMapper.toDto(job) : null;
  }

  async updateJobProgress(id: string, progress: number): Promise<void> {
    await this.prisma.docxGenerationJob.update({ where: { id }, data: { progress } });
  }

  async updateJobStatus(
    id: string,
    status: DocxJobStatusValue,
    errorMessage?: string | null,
  ): Promise<void> {
    await this.prisma.docxGenerationJob.update({
      where: { id },
      data: { status, errorMessage: errorMessage ?? null },
    });
  }
}
