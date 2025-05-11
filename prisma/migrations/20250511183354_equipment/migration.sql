/*
  Warnings:

  - You are about to drop the column `address` on the `Equipment` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `Equipment` table. All the data in the column will be lost.
  - You are about to drop the column `workingHoursId` on the `Equipment` table. All the data in the column will be lost.
  - Made the column `name` on table `Equipment` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `workingHoursId` to the `Organization` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Equipment" DROP CONSTRAINT "Equipment_workingHoursId_fkey";

-- AlterTable
ALTER TABLE "public"."Equipment" DROP COLUMN "address",
DROP COLUMN "phone",
DROP COLUMN "workingHoursId",
ALTER COLUMN "name" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."Organization" ADD COLUMN     "workingHoursId" VARCHAR(26) NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Organization" ADD CONSTRAINT "Organization_workingHoursId_fkey" FOREIGN KEY ("workingHoursId") REFERENCES "public"."WorkingHours"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
