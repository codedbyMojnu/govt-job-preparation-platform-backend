import type { Queue } from 'bullmq';
import { Packer } from 'docx';

import {
  DOCX_JOB_STALE_MESSAGE,
  DOCX_JOB_STALE_MS,
} from '../../../shared/constants/docx.constants.js';
import { BadRequestError, NotFoundError } from '../../../shared/errors/http-errors.js';
import type { DocxGenerationJobData } from '../infra/docx-queue.js';
import { DOCX_GENERATE_JOB_NAME } from '../infra/docx-queue.js';
import type { DocxStorageService } from '../infra/docx-storage.service.js';

import { buildDocument } from './render/build-docx.js';
import type { DocxRepository } from './repository.contract.js';
import { hashDocxStyleConfig, hashQuestionSetIds } from './style-hash.js';
import type {
  DocxDocumentDto,
  DocxGenerationJobDto,
  DocxJobStatusResult,
  DocxExportResult,
  DocxSetInput,
  GenerateDocxInput,
  GenerateDocxResult,
} from './types.js';

export class DocxService {
  constructor(
    private readonly repository: DocxRepository,
    private readonly queue: Queue<DocxGenerationJobData>,
    private readonly storage: DocxStorageService,
  ) {}

  async generate(userId: string, input: GenerateDocxInput): Promise<GenerateDocxResult> {
    const questionSetIds = [...new Set(input.questionSetIds)];
    if (questionSetIds.length === 0) {
      throw new BadRequestError('Select at least one question set');
    }

    const foundCount = await this.repository.countQuestionSets(questionSetIds);
    if (foundCount !== questionSetIds.length) {
      throw new NotFoundError('One or more question sets were not found');
    }

    const setsHash = hashQuestionSetIds(questionSetIds);
    const configHash = hashDocxStyleConfig(input.styleConfig);
    const styleConfig =
      (await this.repository.findStyleConfigByHash(configHash)) ??
      (await this.repository.createStyleConfig({
        ...input.styleConfig,
        configHash,
        createdBy: userId,
      }));

    const existingDoc = await this.repository.findDocumentBySetsAndStyle(
      setsHash,
      styleConfig.id,
    );
    if (existingDoc) {
      return { cached: true, styleConfigId: styleConfig.id, document: existingDoc };
    }

    const activeJob = await this.repository.findActiveJobForExport(setsHash, styleConfig.id);
    if (activeJob) {
      const reconciled = await this.reconcileStaleJob(activeJob);
      if (reconciled.status === 'QUEUED' || reconciled.status === 'PROCESSING') {
        return { cached: false, styleConfigId: styleConfig.id, jobId: reconciled.id };
      }
    }

    const job = await this.repository.createJob({
      questionSetIds,
      setsHash,
      styleConfigId: styleConfig.id,
    });
    await this.queue.add(
      DOCX_GENERATE_JOB_NAME,
      { jobId: job.id, questionSetIds, setsHash, styleConfigId: styleConfig.id },
      { jobId: job.id },
    );

    return { cached: false, styleConfigId: styleConfig.id, jobId: job.id };
  }

  async getJobStatus(jobId: string): Promise<DocxJobStatusResult> {
    const job = await this.repository.findJobById(jobId);
    if (!job) {
      throw new NotFoundError('Docx generation job not found');
    }

    const reconciled = await this.reconcileStaleJob(job);
    if (reconciled.status !== 'DONE') {
      return reconciled;
    }

    const document = await this.repository.findDocumentBySetsAndStyle(
      reconciled.setsHash,
      reconciled.styleConfigId,
    );
    return { ...reconciled, document: document ?? undefined };
  }

  async getExport(documentId: string): Promise<DocxExportResult | null> {
    return this.repository.findExportById(documentId);
  }

  async deleteExport(documentId: string): Promise<{ deleted: boolean }> {
    const document = await this.repository.findDocumentById(documentId);
    if (!document) {
      throw new NotFoundError('Docx export not found');
    }

    try {
      await this.storage.removeObject(document.fileUrl);
    } catch {
      // File may already be missing.
    }

    const deleted = await this.repository.deleteDocumentById(documentId);
    return { deleted };
  }

  async getDocumentForDownload(documentId: string): Promise<{
    document: DocxDocumentDto;
    stream: Awaited<ReturnType<DocxStorageService['getObjectStream']>>;
  }> {
    const document = await this.repository.findDocumentById(documentId);
    if (!document) {
      throw new NotFoundError('Docx export not found');
    }
    const stream = await this.storage.getObjectStream(document.fileUrl);
    return { document, stream };
  }

  /** Used by worker — builds docx buffer from DB data for all selected sets. */
  async buildDocxBuffer(
    questionSetIds: string[],
    styleConfigId: string,
  ): Promise<{ buffer: Buffer; questionCount: number; fileKey: string; setsHash: string }> {
    const setsHash = hashQuestionSetIds(questionSetIds);
    const styleConfig = await this.repository.findStyleConfigById(styleConfigId);
    if (!styleConfig) throw new Error(`Style config ${styleConfigId} not found`);

    const sets: DocxSetInput[] = [];
    let questionCount = 0;

    for (let i = 0; i < questionSetIds.length; i++) {
      const questionSetId = questionSetIds[i]!;
      const [questions, meta] = await Promise.all([
        this.repository.getQuestionsForSet(questionSetId),
        this.repository.getQuestionSetMeta(questionSetId),
      ]);

      if (!meta) throw new Error(`Question set ${questionSetId} not found`);
      if (questions.length === 0) {
        throw new Error(`Question set ${questionSetId} has no questions`);
      }

      sets.push({ meta, questions });
      questionCount += questions.length;

      const progress = Math.round(((i + 1) / questionSetIds.length) * 80);
      void progress;
    }

    const doc = buildDocument(sets, {
      templateStyle: styleConfig.templateStyle,
      columnCount: styleConfig.columnCount,
      fontSizePt: styleConfig.fontSizePt,
      fontBn: styleConfig.fontBn,
      brandName: styleConfig.brandName,
      brandSubtitle: styleConfig.brandSubtitle,
      footerText: styleConfig.footerText,
      showExplanation: styleConfig.showExplanation,
      explanationMaxChars: styleConfig.explanationMaxChars,
      siteBaseUrl: styleConfig.siteBaseUrl,
    });

    const buffer = await Packer.toBuffer(doc);
    const fileKey = this.storage.buildObjectKey(setsHash, styleConfigId);

    return { buffer, questionCount, fileKey, setsHash };
  }

  getStorage(): DocxStorageService {
    return this.storage;
  }

  getRepository(): DocxRepository {
    return this.repository;
  }

  private async reconcileStaleJob(job: DocxGenerationJobDto): Promise<DocxGenerationJobDto> {
    if (job.status === 'DONE' || job.status === 'FAILED') {
      return job;
    }

    const ageMs = Date.now() - job.updatedAt.getTime();
    if (ageMs <= DOCX_JOB_STALE_MS) {
      return job;
    }

    await this.repository.updateJobStatus(job.id, 'FAILED', DOCX_JOB_STALE_MESSAGE);
    return { ...job, status: 'FAILED', errorMessage: DOCX_JOB_STALE_MESSAGE };
  }
}
