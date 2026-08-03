import type {
  CreateCommentInput,
  CreateVideoInput,
  PaginatedVideoComments,
  PaginatedVideos,
  UpdateVideoInput,
  VideoCommentDto,
  VideoDto,
  VideoFilter,
} from './types.js';

export interface VideoRepository {
  findAll(filter: VideoFilter, userId?: string): Promise<PaginatedVideos>;
  findFeatured(limit: number): Promise<VideoDto[]>;
  findById(id: string, userId?: string): Promise<VideoDto | null>;
  findByYoutubeVideoId(youtubeVideoId: string): Promise<VideoDto | null>;
  create(input: CreateVideoInput & { youtubeVideoId: string; thumbnailUrl: string }, createdBy: string): Promise<VideoDto>;
  update(id: string, input: UpdateVideoInput & Partial<{ youtubeVideoId: string; thumbnailUrl: string }>): Promise<VideoDto>;
  delete(id: string): Promise<void>;
  incrementViewCount(id: string): Promise<void>;
  toggleLike(videoId: string, userId: string): Promise<{ liked: boolean; likeCount: number }>;
  findComments(videoId: string, page: number, limit: number): Promise<PaginatedVideoComments>;
  createComment(videoId: string, userId: string, input: CreateCommentInput): Promise<VideoCommentDto>;
  findCommentById(commentId: string): Promise<VideoCommentDto | null>;
  deleteComment(commentId: string): Promise<void>;
  countAll(): Promise<number>;
}
