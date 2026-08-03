import type { Video, VideoComment } from '@prisma/client';

import type { VideoCommentDto, VideoDto } from './types.js';

export const videoMapper = {
  toDto(row: Video, likedByMe = false): VideoDto {
    return {
      id: row.id,
      title: row.title,
      description: row.description,
      youtubeUrl: row.youtubeUrl,
      youtubeVideoId: row.youtubeVideoId,
      thumbnailUrl: row.thumbnailUrl,
      category: row.category,
      tags: row.tags,
      durationSec: row.durationSec,
      viewCount: row.viewCount,
      likeCount: row.likeCount,
      commentCount: row.commentCount,
      isFeatured: row.isFeatured,
      isActive: row.isActive,
      publishedAt: row.publishedAt,
      channelVideoId: row.channelVideoId,
      createdBy: row.createdBy,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      ...(likedByMe ? { likedByMe: true } : {}),
    };
  },
};

export const videoCommentMapper = {
  toDto(row: VideoComment & { user: { name: string | null } }): VideoCommentDto {
    return {
      id: row.id,
      videoId: row.videoId,
      userId: row.userId,
      userName: row.user.name,
      content: row.content,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  },
};
