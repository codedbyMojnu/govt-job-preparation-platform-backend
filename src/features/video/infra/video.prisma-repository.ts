import type { Prisma, PrismaClient, VideoCategory } from '@prisma/client';

import { videoCommentMapper, videoMapper } from '../domain/mapper.js';
import type { VideoRepository } from '../domain/repository.contract.js';
import type {
  CreateCommentInput,
  CreateVideoInput,
  PaginatedVideoComments,
  PaginatedVideos,
  UpdateVideoInput,
  VideoCommentDto,
  VideoDto,
  VideoFilter,
} from '../domain/types.js';

function orderByForSort(sort?: VideoFilter['sort']): Prisma.VideoOrderByWithRelationInput[] {
  switch (sort) {
    case 'popular':
      return [{ viewCount: 'desc' }, { publishedAt: 'desc' }];
    case 'most_liked':
      return [{ likeCount: 'desc' }, { publishedAt: 'desc' }];
    default:
      return [{ publishedAt: 'desc' }, { createdAt: 'desc' }];
  }
}

export class VideoPrismaRepository implements VideoRepository {
  constructor(private readonly prisma: PrismaClient) {}

  private async likedVideoIds(userId: string | undefined, videoIds: string[]): Promise<Set<string>> {
    if (!userId || videoIds.length === 0) return new Set();
    const likes = await this.prisma.videoLike.findMany({
      where: { userId, videoId: { in: videoIds } },
      select: { videoId: true },
    });
    return new Set(likes.map((l) => l.videoId));
  }

  async findAll(filter: VideoFilter, userId?: string): Promise<PaginatedVideos> {
    const page = Math.max(1, filter.page ?? 1);
    const limit = Math.min(48, Math.max(1, filter.limit ?? 12));
    const skip = (page - 1) * limit;

    const where: Prisma.VideoWhereInput = {};
    if (!filter.includeInactive) where.isActive = true;
    if (filter.category) where.category = filter.category as VideoCategory;
    if (filter.featured === true) where.isFeatured = true;
    if (filter.search?.trim()) {
      const q = filter.search.trim();
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
        { tags: { has: q } },
      ];
    }

    const [total, rows] = await Promise.all([
      this.prisma.video.count({ where }),
      this.prisma.video.findMany({
        where,
        orderBy: orderByForSort(filter.sort),
        skip,
        take: limit,
      }),
    ]);

    const liked = await this.likedVideoIds(
      userId,
      rows.map((r) => r.id),
    );

    return {
      data: rows.map((r) => videoMapper.toDto(r, liked.has(r.id))),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  async findFeatured(limit: number): Promise<VideoDto[]> {
    const rows = await this.prisma.video.findMany({
      where: { isActive: true, isFeatured: true },
      orderBy: [{ publishedAt: 'desc' }],
      take: limit,
    });
    return rows.map((r) => videoMapper.toDto(r));
  }

  async findById(id: string, userId?: string): Promise<VideoDto | null> {
    const row = await this.prisma.video.findUnique({ where: { id } });
    if (!row) return null;
    let likedByMe = false;
    if (userId) {
      const like = await this.prisma.videoLike.findUnique({
        where: { videoId_userId: { videoId: id, userId } },
      });
      likedByMe = like != null;
    }
    return videoMapper.toDto(row, likedByMe);
  }

  async findByYoutubeVideoId(youtubeVideoId: string): Promise<VideoDto | null> {
    const row = await this.prisma.video.findFirst({
      where: { OR: [{ youtubeVideoId }, { channelVideoId: youtubeVideoId }] },
    });
    return row ? videoMapper.toDto(row) : null;
  }

  async create(
    input: CreateVideoInput & { youtubeVideoId: string; thumbnailUrl: string },
    createdBy: string,
  ): Promise<VideoDto> {
    const row = await this.prisma.video.create({
      data: {
        title: input.title,
        description: input.description ?? null,
        youtubeUrl: input.youtubeUrl,
        youtubeVideoId: input.youtubeVideoId,
        thumbnailUrl: input.thumbnailUrl,
        channelVideoId: input.youtubeVideoId,
        category: (input.category ?? 'OTHER') as VideoCategory,
        tags: input.tags ?? [],
        durationSec: input.durationSec ?? null,
        isFeatured: input.isFeatured ?? false,
        isActive: input.isActive ?? true,
        publishedAt: input.publishedAt ? new Date(input.publishedAt) : new Date(),
        createdBy,
      },
    });
    return videoMapper.toDto(row);
  }

  async update(
    id: string,
    input: UpdateVideoInput & Partial<{ youtubeVideoId: string; thumbnailUrl: string }>,
  ): Promise<VideoDto> {
    const data: Prisma.VideoUpdateInput = {};
    if (input.title !== undefined) data.title = input.title;
    if (input.description !== undefined) data.description = input.description ?? null;
    if (input.youtubeUrl !== undefined) data.youtubeUrl = input.youtubeUrl;
    if (input.youtubeVideoId !== undefined) {
      data.youtubeVideoId = input.youtubeVideoId;
      data.channelVideoId = input.youtubeVideoId;
    }
    if (input.thumbnailUrl !== undefined) data.thumbnailUrl = input.thumbnailUrl;
    if (input.category !== undefined) data.category = input.category as VideoCategory;
    if (input.tags !== undefined) data.tags = input.tags;
    if (input.durationSec !== undefined) data.durationSec = input.durationSec ?? null;
    if (input.isFeatured !== undefined) data.isFeatured = input.isFeatured;
    if (input.isActive !== undefined) data.isActive = input.isActive;
    if (input.publishedAt !== undefined) {
      data.publishedAt = input.publishedAt ? new Date(input.publishedAt) : null;
    }

    const row = await this.prisma.video.update({ where: { id }, data });
    return videoMapper.toDto(row);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.video.delete({ where: { id } });
  }

  async incrementViewCount(id: string): Promise<void> {
    await this.prisma.video.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });
  }

  async toggleLike(
    videoId: string,
    userId: string,
  ): Promise<{ liked: boolean; likeCount: number }> {
    return this.prisma.$transaction(async (tx) => {
      const existing = await tx.videoLike.findUnique({
        where: { videoId_userId: { videoId, userId } },
      });

      if (existing) {
        await tx.videoLike.delete({ where: { id: existing.id } });
        const video = await tx.video.update({
          where: { id: videoId },
          data: { likeCount: { decrement: 1 } },
        });
        return { liked: false, likeCount: Math.max(0, video.likeCount) };
      }

      await tx.videoLike.create({ data: { videoId, userId } });
      const video = await tx.video.update({
        where: { id: videoId },
        data: { likeCount: { increment: 1 } },
      });
      return { liked: true, likeCount: video.likeCount };
    });
  }

  async findComments(videoId: string, page: number, limit: number): Promise<PaginatedVideoComments> {
    const safePage = Math.max(1, page);
    const safeLimit = Math.min(50, Math.max(1, limit));
    const skip = (safePage - 1) * safeLimit;

    const where = { videoId };
    const [total, rows] = await Promise.all([
      this.prisma.videoComment.count({ where }),
      this.prisma.videoComment.findMany({
        where,
        include: { user: { select: { name: true } } },
        orderBy: { createdAt: 'desc' },
        skip,
        take: safeLimit,
      }),
    ]);

    return {
      data: rows.map(videoCommentMapper.toDto),
      total,
      page: safePage,
      limit: safeLimit,
      totalPages: Math.ceil(total / safeLimit) || 1,
    };
  }

  async createComment(
    videoId: string,
    userId: string,
    input: CreateCommentInput,
  ): Promise<VideoCommentDto> {
    const row = await this.prisma.$transaction(async (tx) => {
      const comment = await tx.videoComment.create({
        data: { videoId, userId, content: input.content.trim() },
        include: { user: { select: { name: true } } },
      });
      await tx.video.update({
        where: { id: videoId },
        data: { commentCount: { increment: 1 } },
      });
      return comment;
    });
    return videoCommentMapper.toDto(row);
  }

  async deleteComment(commentId: string): Promise<void> {
    const comment = await this.prisma.videoComment.findUnique({ where: { id: commentId } });
    if (!comment) return;

    await this.prisma.$transaction(async (tx) => {
      await tx.videoComment.delete({ where: { id: commentId } });
      await tx.video.update({
        where: { id: comment.videoId },
        data: { commentCount: { decrement: 1 } },
      });
    });
  }

  async findCommentById(commentId: string): Promise<VideoCommentDto | null> {
    const row = await this.prisma.videoComment.findUnique({
      where: { id: commentId },
      include: { user: { select: { name: true } } },
    });
    return row ? videoCommentMapper.toDto(row) : null;
  }

  async countAll(): Promise<number> {
    return this.prisma.video.count();
  }
}
