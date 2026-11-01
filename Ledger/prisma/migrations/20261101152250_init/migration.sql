/*
  Warnings:

  - You are about to alter the column `totalBandwidthUsed` on the `sessions` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Decimal(18,8)`.

*/
-- AlterTable
ALTER TABLE "sessions" ALTER COLUMN "sessionStartTime" DROP NOT NULL,
ALTER COLUMN "sessionStartTime" DROP DEFAULT,
ALTER COLUMN "totalBandwidthUsed" SET DATA TYPE DECIMAL(18,8);
