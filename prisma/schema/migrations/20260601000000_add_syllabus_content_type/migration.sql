-- AddColumn: content_type to syllabuses (safe - IF NOT EXISTS prevents errors if already present)
ALTER TABLE "syllabuses" ADD COLUMN IF NOT EXISTS "content_type" VARCHAR(20) NOT NULL DEFAULT 'html';

-- Reset all records to 'html':
-- All syllabuses created before this fix used Claude-generated HTML, so 'mdx' was set by a bug.
-- Any NULL/empty/'mdx' values are incorrect and should be 'html'.
UPDATE "syllabuses" SET "content_type" = 'html' WHERE "content_type" IN ('mdx', '') OR "content_type" IS NULL;
