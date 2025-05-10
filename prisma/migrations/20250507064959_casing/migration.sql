/*
  Warnings:

  - You are about to drop the column `domainUrl` on the `B2BClient` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `B2BClient` table. All the data in the column will be lost.
  - You are about to drop the column `image_url` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `image_url` on the `Equipment` table. All the data in the column will be lost.
  - You are about to drop the column `image_url` on the `Organization` table. All the data in the column will be lost.
  - You are about to drop the column `site_url` on the `Organization` table. All the data in the column will be lost.
  - You are about to drop the column `hired_at` on the `Personal` table. All the data in the column will be lost.
  - You are about to drop the column `image_url` on the `Personal` table. All the data in the column will be lost.
  - You are about to drop the column `image_url` on the `RentalObject` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "b2b"."B2BClient" DROP COLUMN "domainUrl",
DROP COLUMN "image",
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "siteUrl" TEXT;

-- AlterTable
ALTER TABLE "public"."Customer" DROP COLUMN "image_url",
ADD COLUMN     "imageUrl" TEXT;

-- AlterTable
ALTER TABLE "public"."Equipment" DROP COLUMN "image_url",
ADD COLUMN     "imageUrl" TEXT;

-- AlterTable
ALTER TABLE "public"."Organization" DROP COLUMN "image_url",
DROP COLUMN "site_url",
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "siteUrl" TEXT;

-- AlterTable
ALTER TABLE "public"."Personal" DROP COLUMN "hired_at",
DROP COLUMN "image_url",
ADD COLUMN     "hiredAt" TIMESTAMP(6),
ADD COLUMN     "imageUrl" TEXT;

-- AlterTable
ALTER TABLE "public"."RentalObject" DROP COLUMN "image_url",
ADD COLUMN     "imageUrl" TEXT;
