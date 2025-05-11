/*
  Warnings:

  - A unique constraint covering the columns `[hourRateId]` on the table `Equipment` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[hourRateId]` on the table `Personal` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[hourRateId]` on the table `RentalObject` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "public"."Equipment" DROP CONSTRAINT "Equipment_hourRateId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Personal" DROP CONSTRAINT "Personal_hourRateId_fkey";

-- DropForeignKey
ALTER TABLE "public"."RentalObject" DROP CONSTRAINT "RentalObject_hourRateId_fkey";

-- CreateIndex
CREATE UNIQUE INDEX "Equipment_hourRateId_key" ON "public"."Equipment"("hourRateId");

-- CreateIndex
CREATE UNIQUE INDEX "Personal_hourRateId_key" ON "public"."Personal"("hourRateId");

-- CreateIndex
CREATE UNIQUE INDEX "RentalObject_hourRateId_key" ON "public"."RentalObject"("hourRateId");

-- AddForeignKey
ALTER TABLE "public"."Equipment" ADD CONSTRAINT "Equipment_hourRateId_fkey" FOREIGN KEY ("hourRateId") REFERENCES "public"."HourRates"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Personal" ADD CONSTRAINT "Personal_hourRateId_fkey" FOREIGN KEY ("hourRateId") REFERENCES "public"."HourRates"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RentalObject" ADD CONSTRAINT "RentalObject_hourRateId_fkey" FOREIGN KEY ("hourRateId") REFERENCES "public"."HourRates"("id") ON DELETE CASCADE ON UPDATE CASCADE;
