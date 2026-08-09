export type { PdfDocType } from '@prisma/client';

export interface PdfDto {
  id: string;
  title: string;
  description: string | null;
  fileName: string;
  fileSizeKb: number | null;
  pageCount: number | null;
  docType: string;
  subExamCategoryId: string | null;
  subject: string | null;
  examName: string | null;
  tags: string[];
  downloadCount: number;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  isFeatured: boolean;
  isActive: boolean;
  isFree: boolean;
  createdBy: string | null;
  createdAt: Date;
  updatedAt: Date;
  likedByMe?: boolean;
  /** Set only when the caller is currently allowed to download (free, or has an active package). */
  canDownload?: boolean;
}

export interface PdfCommentDto {
  id: string;
  pdfId: string;
  userId: string;
  userName: string | null;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePdfInput {
  title: string;
  description?: string;
  docType?: string;
  subExamCategoryId?: string;
  subject?: string;
  examName?: string;
  tags?: string[];
  pageCount?: number;
  isFeatured?: boolean;
  isActive?: boolean;
  isFree?: boolean;
}

export interface UpdatePdfInput extends Partial<CreatePdfInput> {}

export interface PdfFilter {
  docType?: string;
  subExamCategoryId?: string;
  search?: string;
  sort?: 'newest' | 'popular' | 'most_downloaded' | 'most_viewed';
  freeOnly?: boolean;
  featured?: boolean;
  includeInactive?: boolean;
  page?: number;
  limit?: number;
}

export interface PaginatedPdfs {
  data: PdfDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedPdfComments {
  data: PdfCommentDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreateCommentInput {
  content: string;
}

export interface UploadedPdfFile {
  buffer: Buffer;
  originalName: string;
  sizeBytes: number;
}
