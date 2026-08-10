-- Phase 3: broadcast automation rules

CREATE TYPE "AutomationRuleKind" AS ENUM ('RANDOM_QUESTIONS');

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

CREATE INDEX "broadcast_automation_rules_is_active_kind_idx" ON "broadcast_automation_rules"("is_active", "kind");
