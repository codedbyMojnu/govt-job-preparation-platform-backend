import type { PdfComment, PdfDocument } from '@prisma/client';

import type { PdfCommentDto, PdfDto } from './types.js';

export const pdfMapper = {
  // fileKey ইচ্ছাকৃতভাবে DTO-তে নেই — client কখনো raw storage key পাবে না।
  toDto(row: PdfDocument, extra?: { likedByMe?: boolean; canDownload?: boolean }): PdfDto {
    return {
      id: row.id,
      title: row.title,
      description: row.description,
      fileName: row.fileName,
      fileSizeKb: row.fileSizeKb,
      pageCount: row.pageCount,
      docType: row.docType,
      subExamCategoryId: row.subExamCategoryId,
      subject: row.subject,
      examName: row.examName,
      tags: row.tags,
      downloadCount: row.downloadCount,
      viewCount: row.viewCount,
      likeCount: row.likeCount,
      commentCount: row.commentCount,
      isFeatured: row.isFeatured,
      isActive: row.isActive,
      isFree: row.isFree,
      createdBy: row.createdBy,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      ...(extra?.likedByMe ? { likedByMe: true } : {}),
      ...(extra?.canDownload !== undefined ? { canDownload: extra.canDownload } : {}),
    };
  },
};

export const pdfCommentMapper = {
  toDto(row: PdfComment & { user: { name: string | null } }): PdfCommentDto {
    return {
      id: row.id,
      pdfId: row.pdfId,
      userId: row.userId,
      userName: row.user.name,
      content: row.content,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  },
};
