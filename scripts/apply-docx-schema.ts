/**
 * Apply docx tables idempotently (fallback if `prisma db push` was not run).
 * Uses DATABASE_URL only — Supabase must use session pooler (5432), not 6543.
 *
 * Usage: npm run db:apply-docx
 */
import { PrismaClient } from '@prisma/client';

/** Idempotent DDL — safe to re-run. */
const STATEMENTS: string[] = [
  `DO $$ BEGIN
    CREATE TYPE "docx_template_style" AS ENUM ('COLORFUL', 'PLAIN');
  EXCEPTION WHEN duplicate_object THEN NULL; END $$`,

  `DO $$ BEGIN
    CREATE TYPE "docx_job_status" AS ENUM ('QUEUED', 'PROCESSING', 'DONE', 'FAILED');
  EXCEPTION WHEN duplicate_object THEN NULL; END $$`,

  `CREATE TABLE IF NOT EXISTS "docx_style_configs" (
    "id" TEXT NOT NULL,
    "template_style" "docx_template_style" NOT NULL DEFAULT 'COLORFUL',
    "column_count" INTEGER NOT NULL DEFAULT 1,
    "font_size_pt" DOUBLE PRECISION,
    "font_bn" VARCHAR(100) NOT NULL DEFAULT 'Kalpurush',
    "brand_name" VARCHAR(200) NOT NULL DEFAULT 'Farhan MCQ',
    "brand_subtitle" VARCHAR(200) NOT NULL DEFAULT 'farhanmcq.com',
    "footer_text" TEXT NOT NULL DEFAULT 'নিয়মিত অনুশীলন করতে ফলো করুন — Farhan MCQ',
    "show_explanation" BOOLEAN NOT NULL DEFAULT false,
    "explanation_max_chars" INTEGER NOT NULL DEFAULT 400,
    "site_base_url" VARCHAR(500) NOT NULL DEFAULT 'https://farhanmcq.com',
    "config_hash" VARCHAR(64) NOT NULL,
    "created_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "docx_style_configs_pkey" PRIMARY KEY ("id")
  )`,

  `CREATE TABLE IF NOT EXISTS "docx_generation_jobs" (
    "id" TEXT NOT NULL,
    "question_set_ids" TEXT[],
    "sets_hash" VARCHAR(64) NOT NULL,
    "status" "docx_job_status" NOT NULL DEFAULT 'QUEUED',
    "progress" INTEGER NOT NULL DEFAULT 0,
    "style_config_id" TEXT NOT NULL,
    "error_message" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "docx_generation_jobs_pkey" PRIMARY KEY ("id")
  )`,

  `CREATE TABLE IF NOT EXISTS "docx_documents" (
    "id" TEXT NOT NULL,
    "question_set_ids" TEXT[],
    "sets_hash" VARCHAR(64) NOT NULL,
    "set_count" INTEGER NOT NULL,
    "file_url" VARCHAR(1000) NOT NULL,
    "question_count" INTEGER NOT NULL,
    "style_config_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "docx_documents_pkey" PRIMARY KEY ("id")
  )`,

  `CREATE UNIQUE INDEX IF NOT EXISTS "docx_style_configs_config_hash_key"
    ON "docx_style_configs"("config_hash")`,

  `CREATE INDEX IF NOT EXISTS "docx_style_configs_created_by_idx"
    ON "docx_style_configs"("created_by")`,

  `CREATE INDEX IF NOT EXISTS "docx_generation_jobs_sets_hash_style_config_id_idx"
    ON "docx_generation_jobs"("sets_hash", "style_config_id")`,

  `CREATE INDEX IF NOT EXISTS "docx_generation_jobs_status_idx"
    ON "docx_generation_jobs"("status")`,

  `CREATE UNIQUE INDEX IF NOT EXISTS "docx_documents_sets_hash_style_config_id_key"
    ON "docx_documents"("sets_hash", "style_config_id")`,

  `CREATE INDEX IF NOT EXISTS "docx_documents_sets_hash_idx"
    ON "docx_documents"("sets_hash")`,

  `DO $$ BEGIN
    ALTER TABLE "docx_style_configs"
      ADD CONSTRAINT "docx_style_configs_created_by_fkey"
      FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  EXCEPTION WHEN duplicate_object THEN NULL; END $$`,

  `DO $$ BEGIN
    ALTER TABLE "docx_generation_jobs"
      ADD CONSTRAINT "docx_generation_jobs_style_config_id_fkey"
      FOREIGN KEY ("style_config_id") REFERENCES "docx_style_configs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  EXCEPTION WHEN duplicate_object THEN NULL; END $$`,

  `DO $$ BEGIN
    ALTER TABLE "docx_documents"
      ADD CONSTRAINT "docx_documents_style_config_id_fkey"
      FOREIGN KEY ("style_config_id") REFERENCES "docx_style_configs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  EXCEPTION WHEN duplicate_object THEN NULL; END $$`,
];

async function main() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not set');

  console.log('Applying docx schema via DATABASE_URL...');
  const prisma = new PrismaClient();

  for (let i = 0; i < STATEMENTS.length; i++) {
    const preview = STATEMENTS[i]!.replace(/\s+/g, ' ').slice(0, 70);
    console.log(`  [${i + 1}/${STATEMENTS.length}] ${preview}...`);
    await prisma.$executeRawUnsafe(STATEMENTS[i]!);
  }

  const tables = await prisma.$queryRaw<Array<{ table_name: string }>>`
    SELECT table_name FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name LIKE 'docx_%'
    ORDER BY table_name
  `;
  console.log('Tables present:', tables.map((t) => t.table_name).join(', ') || '(none)');

  if (tables.length < 3) {
    throw new Error('Expected 3 docx_* tables — schema apply incomplete');
  }

  console.log('✅ Docx schema ready.');
  await prisma.$disconnect();
}

main().catch((err) => {
  console.error('❌', err.message);
  process.exitCode = 1;
});
