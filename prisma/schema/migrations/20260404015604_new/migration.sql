-- AlterTable
ALTER TABLE "question_sets" ADD COLUMN     "is_free" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "app_settings" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "free_live_limit" INTEGER NOT NULL DEFAULT 3,
    "free_archive_limit" INTEGER NOT NULL DEFAULT 3,

    CONSTRAINT "app_settings_pkey" PRIMARY KEY ("id")
);
