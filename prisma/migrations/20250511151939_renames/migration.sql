/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Permission` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Role` table. All the data in the column will be lost.
  - You are about to drop the `B2BClient` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `B2BPersonal` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
ALTER TYPE "b2b"."RoleType" ADD VALUE 'MANAGER';

-- DropForeignKey
ALTER TABLE "b2b"."B2BClient" DROP CONSTRAINT "B2BClient_accountId_fkey";

-- DropForeignKey
ALTER TABLE "b2b"."B2BPersonal" DROP CONSTRAINT "B2BPersonal_accountId_fkey";

-- AlterTable
ALTER TABLE "b2b"."Account" DROP COLUMN "createdAt";

-- AlterTable
ALTER TABLE "b2b"."Permission" DROP COLUMN "createdAt";

-- AlterTable
ALTER TABLE "b2b"."Role" DROP COLUMN "createdAt";

-- DropTable
DROP TABLE "b2b"."B2BClient";

-- DropTable
DROP TABLE "b2b"."B2BPersonal";

-- DropEnum
DROP TYPE "b2b"."B2BPersonalType";

-- CreateTable
CREATE TABLE "b2b"."Owner" (
    "id" VARCHAR(26) NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "siteUrl" TEXT,
    "imageUrl" TEXT,
    "description" TEXT,
    "accountId" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Owner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "b2b"."Manager" (
    "id" VARCHAR(26) NOT NULL,
    "accountId" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "imageUrl" TEXT,
    "description" TEXT,
    "ownerId" VARCHAR(26) NOT NULL,

    CONSTRAINT "Manager_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Owner_accountId_key" ON "b2b"."Owner"("accountId");

-- CreateIndex
CREATE UNIQUE INDEX "Manager_accountId_key" ON "b2b"."Manager"("accountId");

-- AddForeignKey
ALTER TABLE "b2b"."Owner" ADD CONSTRAINT "Owner_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "b2b"."Account"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "b2b"."Manager" ADD CONSTRAINT "Manager_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "b2b"."Account"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "b2b"."Manager" ADD CONSTRAINT "Manager_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "b2b"."Owner"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
