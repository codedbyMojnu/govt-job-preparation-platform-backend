/*
  Warnings:

  - You are about to drop the column `account_number` on the `payment_transactions` table. All the data in the column will be lost.
  - Added the required column `mobile_number` to the `payment_transactions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `payment_method` to the `payment_transactions` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('BKASH', 'NAGAD', 'ROCKET');

-- AlterTable
ALTER TABLE "packages" ADD COLUMN     "archive_quota" INTEGER,
ADD COLUMN     "live_quota" INTEGER,
ADD COLUMN     "sort_order" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "payment_transactions" DROP COLUMN "account_number",
ADD COLUMN     "mobile_number" VARCHAR(20) NOT NULL,
ADD COLUMN     "payment_method" "PaymentMethod" NOT NULL;

-- AlterTable
ALTER TABLE "user_packages" ADD COLUMN     "archive_used" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "live_used" INTEGER NOT NULL DEFAULT 0;
