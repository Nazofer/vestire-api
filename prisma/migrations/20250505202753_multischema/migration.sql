/*
  Warnings:

  - You are about to drop the `RentalOnjects` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "b2b";

-- DropForeignKey
ALTER TABLE "public"."Equipment" DROP CONSTRAINT "Equipment_rentalObjectId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Orders" DROP CONSTRAINT "Orders_rentalObjectId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Personnel" DROP CONSTRAINT "Personnel_rentalObjectId_fkey";

-- DropForeignKey
ALTER TABLE "public"."RentalOnjects" DROP CONSTRAINT "RentalOnjects_hourRateId_fkey";

-- DropForeignKey
ALTER TABLE "public"."RentalOnjects" DROP CONSTRAINT "RentalOnjects_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "public"."RentalOnjects" DROP CONSTRAINT "RentalOnjects_workingHoursId_fkey";

-- DropTable
DROP TABLE "public"."RentalOnjects";

-- CreateTable
CREATE TABLE "public"."RentalObjects" (
    "id" VARCHAR(26) NOT NULL,
    "workingHoursId" VARCHAR(26) NOT NULL,
    "hourRateId" VARCHAR(26) NOT NULL,
    "organizationId" VARCHAR(26) NOT NULL,
    "name" TEXT,
    "description" TEXT,
    "image_url" TEXT,
    "phone" TEXT,
    "address" TEXT,

    CONSTRAINT "RentalObjects_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Equipment" ADD CONSTRAINT "Equipment_rentalObjectId_fkey" FOREIGN KEY ("rentalObjectId") REFERENCES "public"."RentalObjects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Orders" ADD CONSTRAINT "Orders_rentalObjectId_fkey" FOREIGN KEY ("rentalObjectId") REFERENCES "public"."RentalObjects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Personnel" ADD CONSTRAINT "Personnel_rentalObjectId_fkey" FOREIGN KEY ("rentalObjectId") REFERENCES "public"."RentalObjects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RentalObjects" ADD CONSTRAINT "RentalObjects_hourRateId_fkey" FOREIGN KEY ("hourRateId") REFERENCES "public"."HourRates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RentalObjects" ADD CONSTRAINT "RentalObjects_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "public"."Organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RentalObjects" ADD CONSTRAINT "RentalObjects_workingHoursId_fkey" FOREIGN KEY ("workingHoursId") REFERENCES "public"."WorkingHours"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
