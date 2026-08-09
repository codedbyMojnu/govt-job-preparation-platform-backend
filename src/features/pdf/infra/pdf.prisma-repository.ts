import type { PdfDocType, Prisma, PrismaClient } from '@prisma/client';

import { pdfCommentMapper, pdfMapper } from '../domain/mapper.js';
import type { PdfRepository } from '../domain/repository.contract.js';
import type {
  CreateCommentInput,
  CreatePdfInput,
  PaginatedPdfComments,
  PaginatedPdfs,
  PdfCommentDto,
  PdfDto,
  PdfFilter,
  UpdatePdfInput,
} from '../domain/types.js';

function orderByForSort(sort?: PdfFilter['sort']): Prisma.PdfDocumentOrderByWithRelationInput[] {
  switch (sort) {
    case 'most_downloaded':
      return [{ downloadCount: 'desc' }, { createdAt: 'desc' }];
    case 'most_viewed':
      return [{ viewCount: 'desc' }, { createdAt: 'desc' }];
    case 'popular':
      return [{ likeCount: 'desc' }, { createdAt: 'desc' }];
    case 'newest':
    default:
      return [{ createdAt: 'desc' }];
  }
}

export class PdfPrismaRepository implements PdfRepository {
  constructor(private readonly prisma: PrismaClient) {}

  private async likedPdfIds(userId: string | undefined, pdfIds: string[]): Promise<Set<string>> {
    if (!userId || pdfIds.length === 0) return new Set();
    const likes = await this.prisma.pdfLike.findMany({
      where: { userId, pdfId: { in: pdfIds } },
      select: { pdfId: true },
    });
    return new Set(likes.map((l) => l.pdfId));
  }

  async findAll(filter: PdfFilter, userId?: string): Promise<PaginatedPdfs> {
    const page = Math.max(1, filter.page ?? 1);
    const limit = Math.min(48, Math.max(1, filter.limit ?? 12));
    const skip = (page - 1) * limit;

    const where: Prisma.PdfDocumentWhereInput = {};
    if (!filter.includeInactive) where.isActive = true;
    if (filter.docType) where.docType = filter.docType as PdfDocType;
    if (filter.subExamCategoryId) where.subExamCategoryId = filter.subExamCategoryId;
    if (filter.freeOnly) where.isFree = true;
    if (filter.featured === true) where.isFeatured = true;
    if (filter.search?.trim()) {
      const q = filter.search.trim();
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
        { subject: { contains: q, mode: 'insensitive' } },
        { tags: { has: q } },
      ];
    }

    const [total, rows] = await Promise.all([
      this.prisma.pdfDocument.count({ where }),
      this.prisma.pdfDocument.findMany({
        where,
        orderBy: orderByForSort(filter.sort),
        skip,
        take: limit,
      }),
    ]);

    const liked = await this.likedPdfIds(
      userId,
      rows.map((r) => r.id),
    );

    return {
      data: rows.map((r) => pdfMapper.toDto(r, { likedByMe: liked.has(r.id) })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  async findFeatured(limit: number): Promise<PdfDto[]> {
    const rows = await this.prisma.pdfDocument.findMany({
      where: { isActive: true, isFeatured: true },
      orderBy: [{ createdAt: 'desc' }],
      take: limit,
    });
    return rows.map((r) => pdfMapper.toDto(r));
  }

  async findById(id: string, userId?: string): Promise<PdfDto | null> {
    const row = await this.prisma.pdfDocument.findUnique({ where: { id } });
    if (!row) return null;
    let likedByMe = false;
    if (userId) {
      const like = await this.prisma.pdfLike.findUnique({
        where: { pdfId_userId: { pdfId: id, userId } },
      });
      likedByMe = like != null;
    }
    return pdfMapper.toDto(row, { likedByMe });
  }

  async findRawById(id: string) {
    const row = await this.prisma.pdfDocument.findUnique({
      where: { id },
      select: { id: true, fileKey: true, fileName: true, isFree: true, isActive: true },
    });
    return row;
  }

  async create(
    input: CreatePdfInput & { fileKey: string; fileName: string; fileSizeKb: number },
    createdBy: string,
  ): Promise<PdfDto> {
    const row = await this.prisma.pdfDocument.create({
      data: {
        title: input.title,
        description: input.description ?? null,
        fileKey: input.fileKey,
        fileName: input.fileName,
        fileSizeKb: input.fileSizeKb,
        pageCount: input.pageCount ?? null,
        docType: (input.docType ?? 'OTHER') as PdfDocType,
        subExamCategoryId: input.subExamCategoryId ?? null,
        subject: input.subject ?? null,
        examName: input.examName ?? null,
        tags: input.tags ?? [],
        isFeatured: input.isFeatured ?? false,
        isActive: input.isActive ?? true,
        isFree: input.isFree ?? false,
        createdBy,
      },
    });
    return pdfMapper.toDto(row);
  }

  async update(
    id: string,
    input: UpdatePdfInput & Partial<{ fileKey: string; fileName: string; fileSizeKb: number }>,
  ): Promise<PdfDto> {
    const data: Prisma.PdfDocumentUpdateInput = {};
    if (input.title !== undefined) data.title = input.title;
    if (input.description !== undefined) data.description = input.description ?? null;
    if (input.fileKey !== undefined) data.fileKey = input.fileKey;
    if (input.fileName !== undefined) data.fileName = input.fileName;
    if (input.fileSizeKb !== undefined) data.fileSizeKb = input.fileSizeKb;
    if (input.pageCount !== undefined) data.pageCount = input.pageCount ?? null;
    if (input.docType !== undefined) data.docType = input.docType as PdfDocType;
    if (input.subExamCategoryId !== undefined)
      data.subExamCategoryId = input.subExamCategoryId ?? null;
    if (input.subject !== undefined) data.subject = input.subject ?? null;
    if (input.examName !== undefined) data.examName = input.examName ?? null;
    if (input.tags !== undefined) data.tags = input.tags;
    if (input.isFeatured !== undefined) data.isFeatured = input.isFeatured;
    if (input.isActive !== undefined) data.isActive = input.isActive;
    if (input.isFree !== undefined) data.isFree = input.isFree;

    const row = await this.prisma.pdfDocument.update({ where: { id }, data });
    return pdfMapper.toDto(row);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.pdfDocument.delete({ where: { id } });
  }

  async incrementViewCount(id: string): Promise<void> {
    await this.prisma.pdfDocument.update({ where: { id }, data: { viewCount: { increment: 1 } } });
  }

  async incrementDownloadCount(id: string): Promise<void> {
    await this.prisma.pdfDocument.update({
      where: { id },
      data: { downloadCount: { increment: 1 } },
    });
  }

  async toggleLike(pdfId: string, userId: string): Promise<{ liked: boolean; likeCount: number }> {
    return this.prisma.$transaction(async (tx) => {
      const existing = await tx.pdfLike.findUnique({ where: { pdfId_userId: { pdfId, userId } } });
      if (existing) {
        await tx.pdfLike.delete({ where: { id: existing.id } });
        const pdf = await tx.pdfDocument.update({
          where: { id: pdfId },
          data: { likeCount: { decrement: 1 } },
        });
        return { liked: false, likeCount: Math.max(0, pdf.likeCount) };
      }
      await tx.pdfLike.create({ data: { pdfId, userId } });
      const pdf = await tx.pdfDocument.update({
        where: { id: pdfId },
        data: { likeCount: { increment: 1 } },
      });
      return { liked: true, likeCount: pdf.likeCount };
    });
  }

  async findComments(pdfId: string, page: number, limit: number): Promise<PaginatedPdfComments> {
    const safePage = Math.max(1, page);
    const safeLimit = Math.min(50, Math.max(1, limit));
    const skip = (safePage - 1) * safeLimit;
    const where = { pdfId };
    const [total, rows] = await Promise.all([
      this.prisma.pdfComment.count({ where }),
      this.prisma.pdfComment.findMany({
        where,
        include: { user: { select: { name: true } } },
        orderBy: { createdAt: 'desc' },
        skip,
        take: safeLimit,
      }),
    ]);
    return {
      data: rows.map(pdfCommentMapper.toDto),
      total,
      page: safePage,
      limit: safeLimit,
      totalPages: Math.ceil(total / safeLimit) || 1,
    };
  }

  async createComment(
    pdfId: string,
    userId: string,
    input: CreateCommentInput,
  ): Promise<PdfCommentDto> {
    const row = await this.prisma.$transaction(async (tx) => {
      const comment = await tx.pdfComment.create({
        data: { pdfId, userId, content: input.content.trim() },
        include: { user: { select: { name: true } } },
      });
      await tx.pdfDocument.update({
        where: { id: pdfId },
        data: { commentCount: { increment: 1 } },
      });
      return comment;
    });
    return pdfCommentMapper.toDto(row);
  }

  async deleteComment(commentId: string): Promise<void> {
    const comment = await this.prisma.pdfComment.findUnique({ where: { id: commentId } });
    if (!comment) return;
    await this.prisma.$transaction(async (tx) => {
      await tx.pdfComment.delete({ where: { id: commentId } });
      await tx.pdfDocument.update({
        where: { id: comment.pdfId },
        data: { commentCount: { decrement: 1 } },
      });
    });
  }

  async findCommentById(commentId: string): Promise<PdfCommentDto | null> {
    const row = await this.prisma.pdfComment.findUnique({
      where: { id: commentId },
      include: { user: { select: { name: true } } },
    });
    return row ? pdfCommentMapper.toDto(row) : null;
  }

  async getStats(): Promise<{ total: number; free: number; featured: number; downloads: number }> {
    const [total, free, featured, downloadAgg] = await Promise.all([
      this.prisma.pdfDocument.count(),
      this.prisma.pdfDocument.count({ where: { isFree: true } }),
      this.prisma.pdfDocument.count({ where: { isFeatured: true } }),
      this.prisma.pdfDocument.aggregate({ _sum: { downloadCount: true } }),
    ]);
    return { total, free, featured, downloads: downloadAgg._sum.downloadCount ?? 0 };
  }

  // question-set রিপোজিটরির hasActivePackage-এর সাথে হুবহু এক লজিক — একই "active subscription" নিয়ম
  // পুরো সাইটে যেখানেই paywall লাগে সবখানে কনসিস্টেন্ট থাকে।
  async hasActivePackage(userId: string): Promise<boolean> {
    const count = await this.prisma.userPackage.count({
      where: { userId, isActive: true, endDate: { gte: new Date() } },
    });
    return count > 0;
  }
}
