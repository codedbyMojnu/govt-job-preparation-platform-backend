export type { VideoCategory } from '@prisma/client';

export interface VideoDto {
  id: string;
  title: string;
  description: string | null;
  youtubeUrl: string;
  youtubeVideoId: string;
  thumbnailUrl: string | null;
  category: string;
  tags: string[];
  durationSec: number | null;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  isFeatured: boolean;
  isActive: boolean;
  publishedAt: Date | null;
  channelVideoId: string | null;
  createdBy: string | null;
  createdAt: Date;
  updatedAt: Date;
  likedByMe?: boolean;
}

export interface VideoCommentDto {
  id: string;
  videoId: string;
  userId: string;
  userName: string | null;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateVideoInput {
  title: string;
  description?: string;
  youtubeUrl: string;
  category?: string;
  tags?: string[];
  durationSec?: number;
  isFeatured?: boolean;
  isActive?: boolean;
  publishedAt?: string;
}

export interface UpdateVideoInput extends Partial<CreateVideoInput> {}

export interface VideoFilter {
  category?: string;
  search?: string;
  sort?: 'newest' | 'popular' | 'most_liked';
  featured?: boolean;
  includeInactive?: boolean;
  page?: number;
  limit?: number;
}

export interface PaginatedVideos {
  data: VideoDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedVideoComments {
  data: VideoCommentDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ParsedYoutubeUrl {
  youtubeVideoId: string;
  youtubeUrl: string;
  thumbnailUrl: string;
  embedUrl: string;
}

export interface CreateCommentInput {
  content: string;
}
