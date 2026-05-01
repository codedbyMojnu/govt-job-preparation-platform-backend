/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `questions` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "questions" ADD COLUMN     "frequency_tag" VARCHAR(200),
ADD COLUMN     "slug" VARCHAR(600);

-- CreateIndex
CREATE UNIQUE INDEX "questions_slug_key" ON "questions"("slug");
