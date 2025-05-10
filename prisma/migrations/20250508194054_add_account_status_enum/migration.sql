-- CreateEnum
CREATE TYPE "b2b"."AccountStatus" AS ENUM ('PENDING', 'ACTIVE', 'BLOCKED', 'DELETED');

-- AlterTable
ALTER TABLE "b2b"."Account" ADD COLUMN     "status" "b2b"."AccountStatus" NOT NULL DEFAULT 'PENDING';
