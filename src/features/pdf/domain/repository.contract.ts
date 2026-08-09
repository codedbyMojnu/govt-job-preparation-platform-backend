import type {
  CreateCommentInput,
  CreatePdfInput,
  PaginatedPdfComments,
  PaginatedPdfs,
  PdfCommentDto,
  PdfDto,
  PdfFilter,
  UpdatePdfInput,
} from './types.js';

export interface PdfRepository {
  findAll(filter: PdfFilter, userId?: string): Promise<PaginatedPdfs>;
  findFeatured(limit: number): Promise<PdfDto[]>;
  findById(id: string, userId?: string): Promise<PdfDto | null>;
  /** Raw row is needed internally (to read fileKey) — service.ts uses this, never exposed via mapper. */
  findRawById(id: string): Promise<{
    id: string;
    fileKey: string;
    fileName: string;
    isFree: boolean;
    isActive: boolean;
  } | null>;
  create(
    input: CreatePdfInput & { fileKey: string; fileName: string; fileSizeKb: number },
    createdBy: string,
  ): Promise<PdfDto>;
  update(
    id: string,
    input: UpdatePdfInput & Partial<{ fileKey: string; fileName: string; fileSizeKb: number }>,
  ): Promise<PdfDto>;
  delete(id: string): Promise<void>;
  incrementViewCount(id: string): Promise<void>;
  incrementDownloadCount(id: string): Promise<void>;
  toggleLike(pdfId: string, userId: string): Promise<{ liked: boolean; likeCount: number }>;
  findComments(pdfId: string, page: number, limit: number): Promise<PaginatedPdfComments>;
  createComment(pdfId: string, userId: string, input: CreateCommentInput): Promise<PdfCommentDto>;
  findCommentById(commentId: string): Promise<PdfCommentDto | null>;
  deleteComment(commentId: string): Promise<void>;
  getStats(): Promise<{ total: number; free: number; featured: number; downloads: number }>;
  hasActivePackage(userId: string): Promise<boolean>;
}
