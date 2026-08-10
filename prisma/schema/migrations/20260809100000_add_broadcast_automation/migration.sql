-- Broadcast automation: integration credentials + broadcast logs

CREATE TYPE "BroadcastPlatform" AS ENUM (
  'TELEGRAM_GROUP',
  'TELEGRAM_CHANNEL',
  'FACEBOOK_PAGE',
  'WHATSAPP'
);

CREATE TYPE "BroadcastContentType" AS ENUM (
  'QUESTION',
  'QUESTION_SET',
  'PDF',
  'JOB_CIRCULAR',
  'SLIDE_IMAGE',
  'MOTIVATIONAL',
  'STUDY_TIP',
  'NOTICE',
  'OFFER',
  'CUSTOM'
);

CREATE TYPE "BroadcastStatus" AS ENUM (
  'DRAFT',
  'SENDING',
  'SENT',
  'FAILED'
);

CREATE TABLE "integration_credentials" (
  "id" TEXT NOT NULL,
  "platform" "BroadcastPlatform" NOT NULL,
  "label" VARCHAR(100),
  "encrypted_config" TEXT NOT NULL,
  "config_preview" VARCHAR(120) NOT NULL,
  "is_active" BOOLEAN NOT NULL DEFAULT true,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "integration_credentials_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "broadcast_logs" (
  "id" TEXT NOT NULL,
  "content_type" "BroadcastContentType" NOT NULL,
  "platforms" "BroadcastPlatform"[],
  "question_ids" TEXT[] DEFAULT ARRAY[]::TEXT[],
  "question_set_id" TEXT,
  "pdf_id" TEXT,
  "job_circular_ids" TEXT[] DEFAULT ARRAY[]::TEXT[],
  "ai_provider" VARCHAR(50),
  "ai_model" VARCHAR(100),
  "content_text" TEXT,
  "media_url" VARCHAR(2000),
  "status" "BroadcastStatus" NOT NULL DEFAULT 'DRAFT',
  "error_message" TEXT,
  "created_by" TEXT NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "sent_at" TIMESTAMP(3),

  CONSTRAINT "broadcast_logs_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "integration_credentials_platform_is_active_idx" ON "integration_credentials"("platform", "is_active");
CREATE INDEX "broadcast_logs_content_type_status_idx" ON "broadcast_logs"("content_type", "status");
CREATE INDEX "broadcast_logs_created_by_created_at_idx" ON "broadcast_logs"("created_by", "created_at");
