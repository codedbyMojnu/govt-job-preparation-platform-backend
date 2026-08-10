import type { Readable } from 'node:stream';

import { PDFDocument as PdfLibDocument } from 'pdf-lib';

import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
} from '../../../shared/errors/http-errors.js';
import type { PdfStorageService } from '../infra/pdf-storage.service.js';

import type { PdfRepository } from './repository.contract.js';
import type {
  CreateCommentInput,
  CreatePdfInput,
  PaginatedPdfComments,
  PaginatedPdfs,
  PdfCommentDto,
  PdfDto,
  PdfFilter,
  UpdatePdfInput,
  UploadedPdfFile,
} from './types.js';

const MAX_PDF_BYTES = 20 * 1024 * 1024; // 20MB

export class PdfService {
  constructor(
    private readonly repository: PdfRepository,
    private readonly storage: PdfStorageService,
  ) {}

  private async annotateAccess(pdf: PdfDto, userId?: string): Promise<PdfDto> {
    if (pdf.isFree) return { ...pdf, canDownload: true };
    if (!userId) return { ...pdf, canDownload: false };
    const hasPkg = await this.repository.hasActivePackage(userId);
    return { ...pdf, canDownload: hasPkg };
  }

  async getAll(filter: PdfFilter, userId?: string): Promise<PaginatedPdfs> {
    const result = await this.repository.findAll(filter, userId);
    const data = await Promise.all(result.data.map((p) => this.annotateAccess(p, userId)));
    return { ...result, data };
  }

  async getFeatured(userId?: string, limit = 6): Promise<PdfDto[]> {
    const rows = await this.repository.findFeatured(limit);
    return Promise.all(rows.map((p) => this.annotateAccess(p, userId)));
  }

  async getById(id: string, userId?: string, allowInactive = false): Promise<PdfDto> {
    const pdf = await this.repository.findById(id, userId);
    if (!pdf || (!pdf.isActive && !allowInactive)) {
      throw new NotFoundError('PDF not found');
    }
    return this.annotateAccess(pdf, userId);
  }

  async adminGetAll(filter: PdfFilter): Promise<PaginatedPdfs> {
    return this.repository.findAll({ ...filter, includeInactive: true }, undefined);
  }

  async recordView(id: string): Promise<void> {
    const raw = await this.repository.findRawById(id);
    if (!raw?.isActive) throw new NotFoundError('PDF not found');
    await this.repository.incrementViewCount(id);
  }

  async create(input: CreatePdfInput, file: UploadedPdfFile, adminUserId: string): Promise<PdfDto> {
    this.assertValidFile(file);
    const detectedPageCount = await this.detectPageCount(file.buffer);

    // id আগে থেকে জানার জন্য: খালি title-only row বানিয়ে id নিই, তারপর সেই id দিয়ে object key বানাই।
    const draft = await this.repository.create(
      {
        ...input,
        pageCount: input.pageCount ?? detectedPageCount,
        fileKey: 'pending',
        fileName: file.originalName,
        fileSizeKb: Math.ceil(file.sizeBytes / 1024),
      },
      adminUserId,
    );

    const key = this.storage.buildObjectKey(draft.id, file.originalName);
    await this.storage.putPdf(key, file.buffer);

    return this.repository.update(draft.id, { fileKey: key });
  }

  async update(id: string, input: UpdatePdfInput, file?: UploadedPdfFile): Promise<PdfDto> {
    await this.getById(id, undefined, true);

    if (!file) {
      return this.repository.update(id, input);
    }

    this.assertValidFile(file);
    const detectedPageCount = await this.detectPageCount(file.buffer);
    const raw = await this.repository.findRawById(id);
    const key = this.storage.buildObjectKey(id, file.originalName);
    await this.storage.putPdf(key, file.buffer);
    if (raw?.fileKey && raw.fileKey !== 'pending') {
      await this.storage.removeObject(raw.fileKey);
    }

    return this.repository.update(id, {
      ...input,
      pageCount: input.pageCount ?? detectedPageCount,
      fileKey: key,
      fileName: file.originalName,
      fileSizeKb: Math.ceil(file.sizeBytes / 1024),
    });
  }

  async delete(id: string): Promise<void> {
    const raw = await this.repository.findRawById(id);
    if (!raw) throw new NotFoundError('PDF not found');
    await this.repository.delete(id);
    if (raw.fileKey && raw.fileKey !== 'pending') {
      await this.storage.removeObject(raw.fileKey);
    }
  }

  /** Gated file stream for the download endpoint. Admins bypass subscription checks (broadcast). */
  async getDownloadStream(
    id: string,
    userId?: string,
    isAdmin = false,
  ): Promise<{ stream: Readable; fileName: string }> {
    const raw = await this.repository.findRawById(id);
    if (!raw?.isActive) throw new NotFoundError('PDF not found');

    if (!isAdmin && !raw.isFree) {
      if (!userId) throw new UnauthorizedError('ডাউনলোড করতে লগইন করুন');
      const hasPkg = await this.repository.hasActivePackage(userId);
      if (!hasPkg) {
        throw new ForbiddenError('এই পিডিএফ ডাউনলোড করতে সাবস্ক্রিপশন প্রয়োজন');
      }
    }

    await this.repository.incrementDownloadCount(id);
    const stream = await this.storage.getObjectStream(raw.fileKey);
    return { stream, fileName: raw.fileName };
  }

  async toggleLike(pdfId: string, userId: string): Promise<{ liked: boolean; likeCount: number }> {
    const raw = await this.repository.findRawById(pdfId);
    if (!raw?.isActive) throw new NotFoundError('PDF not found');
    return this.repository.toggleLike(pdfId, userId);
  }

  async getComments(pdfId: string, page = 1, limit = 20): Promise<PaginatedPdfComments> {
    const raw = await this.repository.findRawById(pdfId);
    if (!raw?.isActive) throw new NotFoundError('PDF not found');
    return this.repository.findComments(pdfId, page, limit);
  }

  async addComment(
    pdfId: string,
    userId: string,
    input: CreateCommentInput,
  ): Promise<PdfCommentDto> {
    const content = input.content?.trim();
    if (!content || content.length < 2) throw new BadRequestError('মন্তব্য খুব ছোট');
    const raw = await this.repository.findRawById(pdfId);
    if (!raw?.isActive) throw new NotFoundError('PDF not found');
    return this.repository.createComment(pdfId, userId, { content });
  }

  async deleteComment(commentId: string, userId: string, isAdmin: boolean): Promise<void> {
    const comment = await this.repository.findCommentById(commentId);
    if (!comment) throw new NotFoundError('Comment not found');
    if (!isAdmin && comment.userId !== userId) {
      throw new ForbiddenError('নিজের মন্তব্যই শুধু মুছতে পারবেন');
    }
    await this.repository.deleteComment(commentId);
  }

  async getStats(): Promise<{ total: number; free: number; featured: number; downloads: number }> {
    return this.repository.getStats();
  }

  private assertValidFile(file: UploadedPdfFile): void {
    if (file.sizeBytes > MAX_PDF_BYTES) {
      throw new BadRequestError('ফাইল সাইজ ২০MB-এর বেশি হতে পারবে না');
    }
  }

  private async detectPageCount(buffer: Buffer): Promise<number | undefined> {
    try {
      const doc = await PdfLibDocument.load(buffer, { ignoreEncryption: true });
      return doc.getPageCount();
    } catch {
      return undefined; // corrupt/encrypted PDF হলে চুপচাপ skip, upload block করবে না
    }
  }
}
