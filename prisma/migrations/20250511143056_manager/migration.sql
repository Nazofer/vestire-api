/*
  Warnings:

  - Added the required column `firstName` to the `B2BPersonal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `B2BPersonal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `B2BPersonal` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "b2b"."B2BPersonalType" AS ENUM ('MANAGER');

-- AlterTable
ALTER TABLE "b2b"."B2BPersonal" ADD COLUMN     "description" TEXT,
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "lastName" TEXT NOT NULL,
ADD COLUMN     "phone" TEXT NOT NULL,
ADD COLUMN     "type" "b2b"."B2BPersonalType" NOT NULL DEFAULT 'MANAGER';
