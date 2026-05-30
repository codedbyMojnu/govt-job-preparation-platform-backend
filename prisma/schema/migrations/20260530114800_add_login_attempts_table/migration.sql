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

-- CreateIndex
CREATE INDEX "login_attempts_mobile_created_at_idx" ON "login_attempts"("mobile", "created_at");

-- CreateIndex
CREATE INDEX "login_attempts_mobile_success_idx" ON "login_attempts"("mobile", "success");

-- AddForeignKey
ALTER TABLE "login_attempts" ADD CONSTRAINT "login_attempts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
