/*
  Warnings:

  - You are about to drop the `CustomerOrders` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OrderPersonnel` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Orders` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Organizations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Personnel` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RentalObjects` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."CustomerOrders" DROP CONSTRAINT "CustomerOrders_customerId_fkey";

-- DropForeignKey
ALTER TABLE "public"."CustomerOrders" DROP CONSTRAINT "CustomerOrders_orderId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Equipment" DROP CONSTRAINT "Equipment_rentalObjectId_fkey";

-- DropForeignKey
ALTER TABLE "public"."OrderEquipment" DROP CONSTRAINT "OrderEquipment_orderId_fkey";

-- DropForeignKey
ALTER TABLE "public"."OrderPersonnel" DROP CONSTRAINT "OrderPersonnel_orderId_fkey";

-- DropForeignKey
ALTER TABLE "public"."OrderPersonnel" DROP CONSTRAINT "OrderPersonnel_personnelId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Orders" DROP CONSTRAINT "Orders_rentalObjectId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Personnel" DROP CONSTRAINT "Personnel_hourRateId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Personnel" DROP CONSTRAINT "Personnel_rentalObjectId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Personnel" DROP CONSTRAINT "Personnel_workingHoursId_fkey";

-- DropForeignKey
ALTER TABLE "public"."RentalObjects" DROP CONSTRAINT "RentalObjects_hourRateId_fkey";

-- DropForeignKey
ALTER TABLE "public"."RentalObjects" DROP CONSTRAINT "RentalObjects_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "public"."RentalObjects" DROP CONSTRAINT "RentalObjects_workingHoursId_fkey";

-- DropTable
DROP TABLE "public"."CustomerOrders";

-- DropTable
DROP TABLE "public"."OrderPersonnel";

-- DropTable
DROP TABLE "public"."Orders";

-- DropTable
DROP TABLE "public"."Organizations";

-- DropTable
DROP TABLE "public"."Personnel";

-- DropTable
DROP TABLE "public"."RentalObjects";

-- CreateTable
CREATE TABLE "public"."CustomerOrder" (
    "id" VARCHAR(26) NOT NULL,
    "orderId" VARCHAR(26) NOT NULL,
    "customerId" VARCHAR(26) NOT NULL,
    "accepted" BOOLEAN,
    "initiatedBy" BOOLEAN,

    CONSTRAINT "CustomerOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."OrderPersonal" (
    "orderId" VARCHAR(26) NOT NULL,
    "personalId" VARCHAR(26) NOT NULL,

    CONSTRAINT "OrderPersonal_pkey" PRIMARY KEY ("orderId","personalId")
);

-- CreateTable
CREATE TABLE "public"."Order" (
    "id" VARCHAR(26) NOT NULL,
    "start" TIMESTAMP(6) NOT NULL,
    "end" TIMESTAMP(6) NOT NULL,
    "rentalObjectId" VARCHAR(26) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Organization" (
    "id" VARCHAR(26) NOT NULL,
    "name" TEXT,
    "description" TEXT,
    "site_url" TEXT,
    "image_url" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "updatedAt" TIMESTAMP(6),

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Personal" (
    "id" VARCHAR(26) NOT NULL,
    "workingHoursId" VARCHAR(26) NOT NULL,
    "hourRateId" VARCHAR(26) NOT NULL,
    "rentalObjectId" VARCHAR(26) NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "phone" TEXT,
    "description" TEXT,
    "image_url" TEXT,
    "hired_at" TIMESTAMP(6),

    CONSTRAINT "Personal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."RentalObject" (
    "id" VARCHAR(26) NOT NULL,
    "workingHoursId" VARCHAR(26) NOT NULL,
    "hourRateId" VARCHAR(26) NOT NULL,
    "organizationId" VARCHAR(26) NOT NULL,
    "name" TEXT,
    "description" TEXT,
    "image_url" TEXT,
    "phone" TEXT,
    "address" TEXT,

    CONSTRAINT "RentalObject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "b2b"."B2BClient" (
    "id" VARCHAR(26) NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "domainUrl" TEXT,
    "image" TEXT,
    "description" TEXT,
    "accountId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "B2BClient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "b2b"."Account" (
    "id" VARCHAR(26) NOT NULL,
    "email" TEXT NOT NULL,
    "password" VARCHAR(255),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "b2b"."B2BPersonal" (
    "id" VARCHAR(26) NOT NULL,
    "accountId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "B2BPersonal_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "B2BClient_accountId_key" ON "b2b"."B2BClient"("accountId");

-- CreateIndex
CREATE UNIQUE INDEX "Account_email_key" ON "b2b"."Account"("email");

-- CreateIndex
CREATE UNIQUE INDEX "B2BPersonal_accountId_key" ON "b2b"."B2BPersonal"("accountId");

-- AddForeignKey
ALTER TABLE "public"."CustomerOrder" ADD CONSTRAINT "CustomerOrder_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "public"."Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CustomerOrder" ADD CONSTRAINT "CustomerOrder_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "public"."Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Equipment" ADD CONSTRAINT "Equipment_rentalObjectId_fkey" FOREIGN KEY ("rentalObjectId") REFERENCES "public"."RentalObject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."OrderEquipment" ADD CONSTRAINT "OrderEquipment_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "public"."Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."OrderPersonal" ADD CONSTRAINT "OrderPersonal_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "public"."Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."OrderPersonal" ADD CONSTRAINT "OrderPersonal_personalId_fkey" FOREIGN KEY ("personalId") REFERENCES "public"."Personal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Order" ADD CONSTRAINT "Order_rentalObjectId_fkey" FOREIGN KEY ("rentalObjectId") REFERENCES "public"."RentalObject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Personal" ADD CONSTRAINT "Personal_hourRateId_fkey" FOREIGN KEY ("hourRateId") REFERENCES "public"."HourRates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Personal" ADD CONSTRAINT "Personal_rentalObjectId_fkey" FOREIGN KEY ("rentalObjectId") REFERENCES "public"."RentalObject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Personal" ADD CONSTRAINT "Personal_workingHoursId_fkey" FOREIGN KEY ("workingHoursId") REFERENCES "public"."WorkingHours"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RentalObject" ADD CONSTRAINT "RentalObject_hourRateId_fkey" FOREIGN KEY ("hourRateId") REFERENCES "public"."HourRates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RentalObject" ADD CONSTRAINT "RentalObject_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "public"."Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RentalObject" ADD CONSTRAINT "RentalObject_workingHoursId_fkey" FOREIGN KEY ("workingHoursId") REFERENCES "public"."WorkingHours"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "b2b"."B2BClient" ADD CONSTRAINT "B2BClient_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "b2b"."Account"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "b2b"."B2BPersonal" ADD CONSTRAINT "B2BPersonal_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "b2b"."Account"("id") ON DELETE SET NULL ON UPDATE CASCADE;
