import { BadRequestError, ConflictError, ForbiddenError, NotFoundError } from '../../../shared/errors/http-errors.js';

import type { VideoRepository } from './repository.contract.js';
import type {
  CreateCommentInput,
  CreateVideoInput,
  PaginatedVideoComments,
  PaginatedVideos,
  ParsedYoutubeUrl,
  UpdateVideoInput,
  VideoCommentDto,
  VideoDto,
  VideoFilter,
} from './types.js';
import { parseYoutubeUrl } from './youtube.utils.js';

export class VideoService {
  constructor(private readonly repository: VideoRepository) {}

  parseYoutubeUrl(url: string): ParsedYoutubeUrl {
    return parseYoutubeUrl(url);
  }

  async getAll(filter: VideoFilter, userId?: string): Promise<PaginatedVideos> {
    return this.repository.findAll(filter, userId);
  }

  async getFeatured(limit = 6): Promise<VideoDto[]> {
    return this.repository.findFeatured(limit);
  }

  async getById(id: string, userId?: string, allowInactive = false): Promise<VideoDto> {
    const video = await this.repository.findById(id, userId);
    if (!video || (!video.isActive && !allowInactive)) {
      throw new NotFoundError('Video not found');
    }
    return video;
  }

  async adminGetAll(filter: VideoFilter): Promise<PaginatedVideos> {
    return this.repository.findAll({ ...filter, includeInactive: true }, undefined);
  }

  async recordView(id: string): Promise<void> {
    const video = await this.repository.findById(id);
    if (!video?.isActive) throw new NotFoundError('Video not found');
    await this.repository.incrementViewCount(id);
  }

  async create(input: CreateVideoInput, adminUserId: string): Promise<VideoDto> {
    const meta = parseYoutubeUrl(input.youtubeUrl);
    const existing = await this.repository.findByYoutubeVideoId(meta.youtubeVideoId);
    if (existing) {
      throw new ConflictError('This YouTube video is already in the library');
    }
    return this.repository.create(
      {
        ...input,
        youtubeUrl: meta.youtubeUrl,
        youtubeVideoId: meta.youtubeVideoId,
        thumbnailUrl: meta.thumbnailUrl,
      },
      adminUserId,
    );
  }

  async update(id: string, input: UpdateVideoInput): Promise<VideoDto> {
    await this.getById(id, undefined, true);
    let extra: Partial<{ youtubeVideoId: string; thumbnailUrl: string; youtubeUrl: string }> = {};
    if (input.youtubeUrl) {
      const meta = parseYoutubeUrl(input.youtubeUrl);
      const existing = await this.repository.findByYoutubeVideoId(meta.youtubeVideoId);
      if (existing && existing.id !== id) {
        throw new ConflictError('This YouTube video is already in the library');
      }
      extra = {
        youtubeUrl: meta.youtubeUrl,
        youtubeVideoId: meta.youtubeVideoId,
        thumbnailUrl: meta.thumbnailUrl,
      };
    }
    return this.repository.update(id, { ...input, ...extra });
  }

  async delete(id: string): Promise<void> {
    await this.getById(id, undefined, true);
    await this.repository.delete(id);
  }

  async toggleLike(videoId: string, userId: string): Promise<{ liked: boolean; likeCount: number }> {
    const video = await this.repository.findById(videoId);
    if (!video?.isActive) throw new NotFoundError('Video not found');
    return this.repository.toggleLike(videoId, userId);
  }

  async getComments(videoId: string, page = 1, limit = 20): Promise<PaginatedVideoComments> {
    const video = await this.repository.findById(videoId);
    if (!video?.isActive) throw new NotFoundError('Video not found');
    return this.repository.findComments(videoId, page, limit);
  }

  async addComment(videoId: string, userId: string, input: CreateCommentInput): Promise<VideoCommentDto> {
    const content = input.content?.trim();
    if (!content || content.length < 2) {
      throw new BadRequestError('Comment is too short');
    }
    const video = await this.repository.findById(videoId);
    if (!video?.isActive) throw new NotFoundError('Video not found');
    return this.repository.createComment(videoId, userId, { content });
  }

  async deleteComment(commentId: string, userId: string, isAdmin: boolean): Promise<void> {
    const comment = await this.repository.findCommentById(commentId);
    if (!comment) throw new NotFoundError('Comment not found');
    if (!isAdmin && comment.userId !== userId) {
      throw new ForbiddenError('You can only delete your own comments');
    }
    await this.repository.deleteComment(commentId);
  }

  async getStats(): Promise<{ total: number }> {
    const total = await this.repository.countAll();
    return { total };
  }

  /** Placeholder for future Farhan MCQ YouTube channel one-click import */
  importFromChannel(): never {
    throw new BadRequestError(
      'YouTube channel import is coming soon. Add videos manually with a YouTube link for now.',
    );
  }
}
