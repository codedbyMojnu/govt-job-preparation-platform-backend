-- Video library: YouTube lectures, likes, comments

CREATE TYPE "video_category" AS ENUM (
  'BCS',
  'PRIMARY',
  'BANK',
  'SCHOOL',
  'COLLEGE',
  'NTRCA',
  'SOMAJSEBA',
  'COMPUTER_OPERATOR',
  'POLICE',
  'DEFENCE',
  'RAILWAY',
  'HEALTH',
  'OTHER'
);

CREATE TYPE "video_sort_hint" AS ENUM ('NEWEST', 'POPULAR', 'MOST_LIKED');

CREATE TABLE "videos" (
  "id" TEXT NOT NULL,
  "title" VARCHAR(500) NOT NULL,
  "description" TEXT,
  "youtube_url" VARCHAR(500) NOT NULL,
  "youtube_video_id" VARCHAR(20) NOT NULL,
  "thumbnail_url" VARCHAR(1000),
  "category" "video_category" NOT NULL DEFAULT 'OTHER',
  "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
  "duration_sec" INTEGER,
  "view_count" INTEGER NOT NULL DEFAULT 0,
  "like_count" INTEGER NOT NULL DEFAULT 0,
  "comment_count" INTEGER NOT NULL DEFAULT 0,
  "is_featured" BOOLEAN NOT NULL DEFAULT false,
  "is_active" BOOLEAN NOT NULL DEFAULT true,
  "published_at" TIMESTAMP(3),
  "channel_video_id" VARCHAR(20),
  "created_by" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "videos_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "video_likes" (
  "id" TEXT NOT NULL,
  "video_id" TEXT NOT NULL,
  "user_id" TEXT NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "video_likes_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "video_comments" (
  "id" TEXT NOT NULL,
  "video_id" TEXT NOT NULL,
  "user_id" TEXT NOT NULL,
  "content" VARCHAR(2000) NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "video_comments_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "videos_channel_video_id_key" ON "videos"("channel_video_id");
CREATE INDEX "videos_category_idx" ON "videos"("category");
CREATE INDEX "videos_is_active_is_featured_idx" ON "videos"("is_active", "is_featured");
CREATE INDEX "videos_published_at_idx" ON "videos"("published_at");
CREATE INDEX "videos_like_count_idx" ON "videos"("like_count");
CREATE INDEX "videos_view_count_idx" ON "videos"("view_count");

CREATE UNIQUE INDEX "video_likes_video_id_user_id_key" ON "video_likes"("video_id", "user_id");
CREATE INDEX "video_likes_user_id_idx" ON "video_likes"("user_id");

CREATE INDEX "video_comments_video_id_created_at_idx" ON "video_comments"("video_id", "created_at");

ALTER TABLE "videos" ADD CONSTRAINT "videos_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "video_likes" ADD CONSTRAINT "video_likes_video_id_fkey" FOREIGN KEY ("video_id") REFERENCES "videos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "video_likes" ADD CONSTRAINT "video_likes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "video_comments" ADD CONSTRAINT "video_comments_video_id_fkey" FOREIGN KEY ("video_id") REFERENCES "videos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "video_comments" ADD CONSTRAINT "video_comments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
