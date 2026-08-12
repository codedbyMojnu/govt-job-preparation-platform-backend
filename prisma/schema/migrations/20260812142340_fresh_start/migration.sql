-- CreateEnum
CREATE TYPE "AiProvider" AS ENUM ('MISTRAL', 'ANTHROPIC', 'GEMINI', 'OPENAI', 'OMNIROUTE');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "BroadcastPlatform" AS ENUM ('TELEGRAM_GROUP', 'TELEGRAM_CHANNEL', 'FACEBOOK_PAGE', 'WHATSAPP');

-- CreateEnum
CREATE TYPE "BroadcastContentType" AS ENUM ('QUESTION', 'QUESTION_SET', 'PDF', 'JOB_CIRCULAR', 'SLIDE_IMAGE', 'MOTIVATIONAL', 'STUDY_TIP', 'NOTICE', 'OFFER', 'CUSTOM');

-- CreateEnum
CREATE TYPE "BroadcastStatus" AS ENUM ('DRAFT', 'SENDING', 'SENT', 'FAILED');

-- CreateEnum
CREATE TYPE "AutomationRuleKind" AS ENUM ('RANDOM_QUESTIONS');

-- CreateEnum
CREATE TYPE "org_type" AS ENUM ('GOVERNMENT', 'PRIVATE', 'AUTONOMOUS', 'NGO');

-- CreateEnum
CREATE TYPE "circular_status" AS ENUM ('LIVE', 'UPCOMING', 'EXPIRED');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('PUBLIC', 'SPECIFIC');

-- CreateEnum
CREATE TYPE "pdf_doc_type" AS ENUM ('SYLLABUS', 'ROUTINE', 'QUESTION_BANK', 'PREVIOUS_QUESTIONS', 'BOOK_GUIDE', 'NOTES', 'MODEL_TEST', 'OTHER');

-- CreateEnum
CREATE TYPE "slide_mode" AS ENUM ('GROUPED', 'SINGLE');

-- CreateEnum
CREATE TYPE "slide_job_status" AS ENUM ('QUEUED', 'PROCESSING', 'DONE', 'FAILED');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('BKASH', 'NAGAD', 'ROCKET');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "video_category" AS ENUM ('BCS', 'PRIMARY', 'BANK', 'SCHOOL', 'COLLEGE', 'NTRCA', 'SOMAJSEBA', 'COMPUTER_OPERATOR', 'POLICE', 'DEFENCE', 'RAILWAY', 'HEALTH', 'OTHER');

-- CreateEnum
CREATE TYPE "video_sort_hint" AS ENUM ('NEWEST', 'POPULAR', 'MOST_LIKED');

-- CreateTable
CREATE TABLE "ai_provider_keys" (
    "id" TEXT NOT NULL,
    "provider" "AiProvider" NOT NULL,
    "label" VARCHAR(100),
    "encrypted_key" TEXT NOT NULL,
    "key_preview" VARCHAR(20) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ai_provider_keys_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "mobile" VARCHAR(11) NOT NULL,
    "password" TEXT NOT NULL,
    "name" VARCHAR(100),
    "photo" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "otps" (
    "id" TEXT NOT NULL,
    "mobile" VARCHAR(11) NOT NULL,
    "code" VARCHAR(4) NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT,

    CONSTRAINT "otps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "login_attempts" (
    "id" TEXT NOT NULL,
    "mobile" VARCHAR(11) NOT NULL,
    "success" BOOLEAN NOT NULL DEFAULT false,
    "ip_address" VARCHAR(45),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT,

    CONSTRAINT "login_attempts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
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

-- CreateTable
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

-- CreateTable
CREATE TABLE "broadcast_automation_rules" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "kind" "AutomationRuleKind" NOT NULL DEFAULT 'RANDOM_QUESTIONS',
    "platforms" "BroadcastPlatform"[],
    "question_count" INTEGER NOT NULL DEFAULT 3,
    "interval_minutes" INTEGER NOT NULL DEFAULT 120,
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "repeat_job_key" VARCHAR(200),
    "last_run_at" TIMESTAMP(3),
    "created_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "broadcast_automation_rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exam_categories" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "slug" VARCHAR(200) NOT NULL,
    "icon" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "exam_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sub_exam_categories" (
    "id" TEXT NOT NULL,
    "exam_category_id" TEXT NOT NULL,
    "name" VARCHAR(300) NOT NULL,
    "slug" VARCHAR(300) NOT NULL,
    "description" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sub_exam_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "question_sets" (
    "id" TEXT NOT NULL,
    "sub_exam_category_id" TEXT NOT NULL,
    "title" VARCHAR(500) NOT NULL,
    "date" DATE NOT NULL,
    "total_marks" DOUBLE PRECISION NOT NULL,
    "duration" INTEGER NOT NULL,
    "subject" VARCHAR(200) NOT NULL,
    "topics" TEXT,
    "source_material" VARCHAR(500),
    "mark_per_question" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "negative_mark" DOUBLE PRECISION NOT NULL DEFAULT 0.25,
    "is_free" BOOLEAN NOT NULL DEFAULT false,
    "is_live" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "question_sets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "questions" (
    "id" TEXT NOT NULL,
    "question_set_id" TEXT NOT NULL,
    "question_text" TEXT NOT NULL,
    "option_a" TEXT NOT NULL,
    "option_b" TEXT NOT NULL,
    "option_c" TEXT NOT NULL,
    "option_d" TEXT NOT NULL,
    "correct_answer" VARCHAR(1) NOT NULL,
    "explanation" TEXT,
    "exam_name" VARCHAR(200),
    "subject" VARCHAR(200),
    "topic" VARCHAR(200),
    "sub_topic" VARCHAR(200),
    "slug" VARCHAR(600),
    "frequency_tag" VARCHAR(200),
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exam_attempts" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "question_set_id" TEXT NOT NULL,
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "submitted_at" TIMESTAMP(3),
    "total_correct" INTEGER NOT NULL DEFAULT 0,
    "total_wrong" INTEGER NOT NULL DEFAULT 0,
    "total_unanswered" INTEGER NOT NULL DEFAULT 0,
    "total_marks" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "obtained_marks" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "is_completed" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "exam_attempts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_answers" (
    "id" TEXT NOT NULL,
    "exam_attempt_id" TEXT NOT NULL,
    "question_id" TEXT NOT NULL,
    "selected_answer" VARCHAR(1),
    "is_correct" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "user_answers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_favorites" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "question_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_favorites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "routines" (
    "id" TEXT NOT NULL,
    "sub_exam_category_id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "title" VARCHAR(500) NOT NULL,
    "total_marks" DOUBLE PRECISION NOT NULL,
    "duration" INTEGER NOT NULL,
    "subject" VARCHAR(200) NOT NULL,
    "topics" TEXT,
    "source_material" VARCHAR(500),
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "routines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "syllabuses" (
    "id" TEXT NOT NULL,
    "sub_exam_category_id" TEXT NOT NULL,
    "title" VARCHAR(500) NOT NULL,
    "slug" VARCHAR(300) NOT NULL,
    "content" TEXT NOT NULL,
    "content_type" VARCHAR(20) NOT NULL DEFAULT 'html',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "syllabuses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app_settings" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "free_live_limit" INTEGER NOT NULL DEFAULT 3,
    "free_archive_limit" INTEGER NOT NULL DEFAULT 3,

    CONSTRAINT "app_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_circulars" (
    "id" TEXT NOT NULL,
    "gjob_id" VARCHAR(50),
    "organization_name" VARCHAR(500) NOT NULL,
    "organization_slug" VARCHAR(500) NOT NULL,
    "org_type" "org_type" NOT NULL DEFAULT 'GOVERNMENT',
    "logo_url" VARCHAR(1000),
    "title" VARCHAR(500) NOT NULL,
    "total_posts" INTEGER NOT NULL DEFAULT 0,
    "application_url" VARCHAR(1000),
    "publish_date" DATE,
    "deadline" DATE,
    "exam_date" DATE,
    "description" TEXT,
    "eligibility" TEXT,
    "salary" VARCHAR(500),
    "experience" VARCHAR(500),
    "location" VARCHAR(500),
    "source" VARCHAR(1000),
    "category" VARCHAR(200),
    "ministry" VARCHAR(500),
    "status" "circular_status" NOT NULL DEFAULT 'LIVE',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "view_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "job_circulars_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(300) NOT NULL,
    "content" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL DEFAULT 'PUBLIC',
    "target_user_id" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_notification_reads" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "notification_id" TEXT NOT NULL,
    "read_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_notification_reads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pdf_documents" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(500) NOT NULL,
    "description" TEXT,
    "file_key" VARCHAR(1000) NOT NULL,
    "file_name" VARCHAR(300) NOT NULL,
    "file_size_kb" INTEGER,
    "page_count" INTEGER,
    "docType" "pdf_doc_type" NOT NULL DEFAULT 'OTHER',
    "sub_exam_category_id" TEXT,
    "subject" VARCHAR(200),
    "examName" VARCHAR(200),
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "download_count" INTEGER NOT NULL DEFAULT 0,
    "view_count" INTEGER NOT NULL DEFAULT 0,
    "like_count" INTEGER NOT NULL DEFAULT 0,
    "comment_count" INTEGER NOT NULL DEFAULT 0,
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "is_free" BOOLEAN NOT NULL DEFAULT false,
    "created_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pdf_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pdf_likes" (
    "id" TEXT NOT NULL,
    "pdf_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pdf_likes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pdf_comments" (
    "id" TEXT NOT NULL,
    "pdf_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "content" VARCHAR(2000) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pdf_comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "slide_style_configs" (
    "id" TEXT NOT NULL,
    "mode" "slide_mode" NOT NULL DEFAULT 'GROUPED',
    "questions_per_slide" INTEGER NOT NULL DEFAULT 1,
    "slide_width" INTEGER NOT NULL,
    "slide_height" INTEGER NOT NULL,
    "bg_color" VARCHAR(20),
    "bg_gradient" JSONB,
    "text_color" VARCHAR(20) NOT NULL,
    "text_size" INTEGER NOT NULL,
    "show_options" BOOLEAN NOT NULL DEFAULT true,
    "show_answer" BOOLEAN NOT NULL DEFAULT true,
    "show_explanation" BOOLEAN NOT NULL DEFAULT false,
    "config_hash" VARCHAR(64) NOT NULL,
    "created_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "slide_style_configs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "slide_generation_jobs" (
    "id" TEXT NOT NULL,
    "question_set_id" TEXT NOT NULL,
    "status" "slide_job_status" NOT NULL DEFAULT 'QUEUED',
    "progress" INTEGER NOT NULL DEFAULT 0,
    "style_config_id" TEXT NOT NULL,
    "error_message" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "slide_generation_jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "slides" (
    "id" TEXT NOT NULL,
    "question_set_id" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "image_url" VARCHAR(1000) NOT NULL,
    "scene_json" JSONB NOT NULL,
    "question_ids" TEXT[],
    "style_config_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "slides_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "packages" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "duration_days" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "discount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "description" TEXT,
    "live_quota" INTEGER,
    "archive_quota" INTEGER,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "packages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_packages" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "package_id" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "end_date" TIMESTAMP(3) NOT NULL,
    "live_used" INTEGER NOT NULL DEFAULT 0,
    "archive_used" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_packages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_transactions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "package_id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "payment_method" "PaymentMethod" NOT NULL,
    "mobile_number" VARCHAR(20) NOT NULL,
    "transaction_id" VARCHAR(50) NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "admin_note" TEXT,
    "reviewed_at" TIMESTAMP(3),
    "reviewed_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payment_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
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

-- CreateTable
CREATE TABLE "video_likes" (
    "id" TEXT NOT NULL,
    "video_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "video_likes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "video_comments" (
    "id" TEXT NOT NULL,
    "video_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "content" VARCHAR(2000) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "video_comments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ai_provider_keys_provider_is_active_idx" ON "ai_provider_keys"("provider", "is_active");

-- CreateIndex
CREATE UNIQUE INDEX "users_mobile_key" ON "users"("mobile");

-- CreateIndex
CREATE INDEX "otps_mobile_code_idx" ON "otps"("mobile", "code");

-- CreateIndex
CREATE INDEX "otps_mobile_expires_at_idx" ON "otps"("mobile", "expires_at");

-- CreateIndex
CREATE INDEX "login_attempts_mobile_created_at_idx" ON "login_attempts"("mobile", "created_at");

-- CreateIndex
CREATE INDEX "login_attempts_mobile_success_idx" ON "login_attempts"("mobile", "success");

-- CreateIndex
CREATE INDEX "integration_credentials_platform_is_active_idx" ON "integration_credentials"("platform", "is_active");

-- CreateIndex
CREATE INDEX "broadcast_logs_content_type_status_idx" ON "broadcast_logs"("content_type", "status");

-- CreateIndex
CREATE INDEX "broadcast_logs_created_by_created_at_idx" ON "broadcast_logs"("created_by", "created_at");

-- CreateIndex
CREATE INDEX "broadcast_automation_rules_is_active_kind_idx" ON "broadcast_automation_rules"("is_active", "kind");

-- CreateIndex
CREATE UNIQUE INDEX "exam_categories_slug_key" ON "exam_categories"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "sub_exam_categories_slug_key" ON "sub_exam_categories"("slug");

-- CreateIndex
CREATE INDEX "sub_exam_categories_exam_category_id_idx" ON "sub_exam_categories"("exam_category_id");

-- CreateIndex
CREATE INDEX "question_sets_sub_exam_category_id_idx" ON "question_sets"("sub_exam_category_id");

-- CreateIndex
CREATE INDEX "question_sets_date_idx" ON "question_sets"("date");

-- CreateIndex
CREATE UNIQUE INDEX "questions_slug_key" ON "questions"("slug");

-- CreateIndex
CREATE INDEX "questions_question_set_id_idx" ON "questions"("question_set_id");

-- CreateIndex
CREATE INDEX "exam_attempts_user_id_idx" ON "exam_attempts"("user_id");

-- CreateIndex
CREATE INDEX "exam_attempts_question_set_id_idx" ON "exam_attempts"("question_set_id");

-- CreateIndex
CREATE UNIQUE INDEX "exam_attempts_user_id_question_set_id_key" ON "exam_attempts"("user_id", "question_set_id");

-- CreateIndex
CREATE INDEX "user_answers_exam_attempt_id_idx" ON "user_answers"("exam_attempt_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_answers_exam_attempt_id_question_id_key" ON "user_answers"("exam_attempt_id", "question_id");

-- CreateIndex
CREATE INDEX "user_favorites_user_id_idx" ON "user_favorites"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_favorites_user_id_question_id_key" ON "user_favorites"("user_id", "question_id");

-- CreateIndex
CREATE INDEX "routines_sub_exam_category_id_idx" ON "routines"("sub_exam_category_id");

-- CreateIndex
CREATE INDEX "routines_date_idx" ON "routines"("date");

-- CreateIndex
CREATE UNIQUE INDEX "syllabuses_slug_key" ON "syllabuses"("slug");

-- CreateIndex
CREATE INDEX "syllabuses_sub_exam_category_id_idx" ON "syllabuses"("sub_exam_category_id");

-- CreateIndex
CREATE UNIQUE INDEX "job_circulars_gjob_id_key" ON "job_circulars"("gjob_id");

-- CreateIndex
CREATE INDEX "job_circulars_deadline_idx" ON "job_circulars"("deadline");

-- CreateIndex
CREATE INDEX "job_circulars_org_type_idx" ON "job_circulars"("org_type");

-- CreateIndex
CREATE INDEX "job_circulars_status_idx" ON "job_circulars"("status");

-- CreateIndex
CREATE INDEX "job_circulars_category_idx" ON "job_circulars"("category");

-- CreateIndex
CREATE INDEX "job_circulars_publish_date_idx" ON "job_circulars"("publish_date");

-- CreateIndex
CREATE INDEX "job_circulars_organization_slug_idx" ON "job_circulars"("organization_slug");

-- CreateIndex
CREATE INDEX "notifications_type_idx" ON "notifications"("type");

-- CreateIndex
CREATE INDEX "notifications_target_user_id_idx" ON "notifications"("target_user_id");

-- CreateIndex
CREATE INDEX "notifications_created_at_idx" ON "notifications"("created_at");

-- CreateIndex
CREATE INDEX "user_notification_reads_user_id_idx" ON "user_notification_reads"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_notification_reads_user_id_notification_id_key" ON "user_notification_reads"("user_id", "notification_id");

-- CreateIndex
CREATE INDEX "pdf_documents_docType_idx" ON "pdf_documents"("docType");

-- CreateIndex
CREATE INDEX "pdf_documents_sub_exam_category_id_idx" ON "pdf_documents"("sub_exam_category_id");

-- CreateIndex
CREATE INDEX "pdf_documents_is_active_is_featured_idx" ON "pdf_documents"("is_active", "is_featured");

-- CreateIndex
CREATE INDEX "pdf_documents_is_free_idx" ON "pdf_documents"("is_free");

-- CreateIndex
CREATE INDEX "pdf_documents_created_at_idx" ON "pdf_documents"("created_at");

-- CreateIndex
CREATE INDEX "pdf_documents_download_count_idx" ON "pdf_documents"("download_count");

-- CreateIndex
CREATE INDEX "pdf_documents_view_count_idx" ON "pdf_documents"("view_count");

-- CreateIndex
CREATE INDEX "pdf_likes_user_id_idx" ON "pdf_likes"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "pdf_likes_pdf_id_user_id_key" ON "pdf_likes"("pdf_id", "user_id");

-- CreateIndex
CREATE INDEX "pdf_comments_pdf_id_created_at_idx" ON "pdf_comments"("pdf_id", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "slide_style_configs_config_hash_key" ON "slide_style_configs"("config_hash");

-- CreateIndex
CREATE INDEX "slide_style_configs_created_by_idx" ON "slide_style_configs"("created_by");

-- CreateIndex
CREATE INDEX "slide_generation_jobs_question_set_id_idx" ON "slide_generation_jobs"("question_set_id");

-- CreateIndex
CREATE INDEX "slide_generation_jobs_status_idx" ON "slide_generation_jobs"("status");

-- CreateIndex
CREATE INDEX "slides_question_set_id_style_config_id_idx" ON "slides"("question_set_id", "style_config_id");

-- CreateIndex
CREATE UNIQUE INDEX "slides_question_set_id_style_config_id_order_key" ON "slides"("question_set_id", "style_config_id", "order");

-- CreateIndex
CREATE INDEX "user_packages_user_id_idx" ON "user_packages"("user_id");

-- CreateIndex
CREATE INDEX "user_packages_end_date_idx" ON "user_packages"("end_date");

-- CreateIndex
CREATE INDEX "payment_transactions_user_id_idx" ON "payment_transactions"("user_id");

-- CreateIndex
CREATE INDEX "payment_transactions_status_idx" ON "payment_transactions"("status");

-- CreateIndex
CREATE UNIQUE INDEX "videos_channel_video_id_key" ON "videos"("channel_video_id");

-- CreateIndex
CREATE INDEX "videos_category_idx" ON "videos"("category");

-- CreateIndex
CREATE INDEX "videos_is_active_is_featured_idx" ON "videos"("is_active", "is_featured");

-- CreateIndex
CREATE INDEX "videos_published_at_idx" ON "videos"("published_at");

-- CreateIndex
CREATE INDEX "videos_like_count_idx" ON "videos"("like_count");

-- CreateIndex
CREATE INDEX "videos_view_count_idx" ON "videos"("view_count");

-- CreateIndex
CREATE INDEX "video_likes_user_id_idx" ON "video_likes"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "video_likes_video_id_user_id_key" ON "video_likes"("video_id", "user_id");

-- CreateIndex
CREATE INDEX "video_comments_video_id_created_at_idx" ON "video_comments"("video_id", "created_at");

-- AddForeignKey
ALTER TABLE "otps" ADD CONSTRAINT "otps_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "login_attempts" ADD CONSTRAINT "login_attempts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sub_exam_categories" ADD CONSTRAINT "sub_exam_categories_exam_category_id_fkey" FOREIGN KEY ("exam_category_id") REFERENCES "exam_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question_sets" ADD CONSTRAINT "question_sets_sub_exam_category_id_fkey" FOREIGN KEY ("sub_exam_category_id") REFERENCES "sub_exam_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questions" ADD CONSTRAINT "questions_question_set_id_fkey" FOREIGN KEY ("question_set_id") REFERENCES "question_sets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exam_attempts" ADD CONSTRAINT "exam_attempts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exam_attempts" ADD CONSTRAINT "exam_attempts_question_set_id_fkey" FOREIGN KEY ("question_set_id") REFERENCES "question_sets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_answers" ADD CONSTRAINT "user_answers_exam_attempt_id_fkey" FOREIGN KEY ("exam_attempt_id") REFERENCES "exam_attempts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_answers" ADD CONSTRAINT "user_answers_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_favorites" ADD CONSTRAINT "user_favorites_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_favorites" ADD CONSTRAINT "user_favorites_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "routines" ADD CONSTRAINT "routines_sub_exam_category_id_fkey" FOREIGN KEY ("sub_exam_category_id") REFERENCES "sub_exam_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "syllabuses" ADD CONSTRAINT "syllabuses_sub_exam_category_id_fkey" FOREIGN KEY ("sub_exam_category_id") REFERENCES "sub_exam_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_notification_reads" ADD CONSTRAINT "user_notification_reads_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_notification_reads" ADD CONSTRAINT "user_notification_reads_notification_id_fkey" FOREIGN KEY ("notification_id") REFERENCES "notifications"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pdf_documents" ADD CONSTRAINT "pdf_documents_sub_exam_category_id_fkey" FOREIGN KEY ("sub_exam_category_id") REFERENCES "sub_exam_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pdf_documents" ADD CONSTRAINT "pdf_documents_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pdf_likes" ADD CONSTRAINT "pdf_likes_pdf_id_fkey" FOREIGN KEY ("pdf_id") REFERENCES "pdf_documents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pdf_likes" ADD CONSTRAINT "pdf_likes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pdf_comments" ADD CONSTRAINT "pdf_comments_pdf_id_fkey" FOREIGN KEY ("pdf_id") REFERENCES "pdf_documents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pdf_comments" ADD CONSTRAINT "pdf_comments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "slide_style_configs" ADD CONSTRAINT "slide_style_configs_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "slide_generation_jobs" ADD CONSTRAINT "slide_generation_jobs_question_set_id_fkey" FOREIGN KEY ("question_set_id") REFERENCES "question_sets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "slide_generation_jobs" ADD CONSTRAINT "slide_generation_jobs_style_config_id_fkey" FOREIGN KEY ("style_config_id") REFERENCES "slide_style_configs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "slides" ADD CONSTRAINT "slides_question_set_id_fkey" FOREIGN KEY ("question_set_id") REFERENCES "question_sets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "slides" ADD CONSTRAINT "slides_style_config_id_fkey" FOREIGN KEY ("style_config_id") REFERENCES "slide_style_configs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_packages" ADD CONSTRAINT "user_packages_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_packages" ADD CONSTRAINT "user_packages_package_id_fkey" FOREIGN KEY ("package_id") REFERENCES "packages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_transactions" ADD CONSTRAINT "payment_transactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_transactions" ADD CONSTRAINT "payment_transactions_package_id_fkey" FOREIGN KEY ("package_id") REFERENCES "packages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "videos" ADD CONSTRAINT "videos_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "video_likes" ADD CONSTRAINT "video_likes_video_id_fkey" FOREIGN KEY ("video_id") REFERENCES "videos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "video_likes" ADD CONSTRAINT "video_likes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "video_comments" ADD CONSTRAINT "video_comments_video_id_fkey" FOREIGN KEY ("video_id") REFERENCES "videos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "video_comments" ADD CONSTRAINT "video_comments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
