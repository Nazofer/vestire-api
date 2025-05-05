-- CreateTable
CREATE TABLE "Organizations" (
    "id" VARCHAR(26) NOT NULL,
    "name" TEXT,
    "description" TEXT,
    "site_url" TEXT,
    "image_url" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "updatedAt" TIMESTAMP(6),

    CONSTRAINT "Organizations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkingHours" (
    "id" VARCHAR(26) NOT NULL,
    "type" TEXT,
    "sunday" JSONB,
    "monday" JSONB,
    "tuesday" JSONB,
    "wednesday" JSONB,
    "thursday" JSONB,
    "friday" JSONB,
    "saturday" JSONB,
    "updatedAt" TIMESTAMP(6),

    CONSTRAINT "WorkingHours_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HourRates" (
    "id" VARCHAR(26) NOT NULL,
    "type" TEXT,
    "sunday" DOUBLE PRECISION,
    "monday" DOUBLE PRECISION,
    "tuesday" DOUBLE PRECISION,
    "wednesday" DOUBLE PRECISION,
    "thursday" DOUBLE PRECISION,
    "friday" DOUBLE PRECISION,
    "saturday" DOUBLE PRECISION,
    "updatedAt" TIMESTAMP(6),

    CONSTRAINT "HourRates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RentalOnjects" (
    "id" VARCHAR(26) NOT NULL,
    "workingHoursId" VARCHAR(26) NOT NULL,
    "hourRateId" VARCHAR(26) NOT NULL,
    "organizationId" VARCHAR(26) NOT NULL,
    "name" TEXT,
    "description" TEXT,
    "image_url" TEXT,
    "phone" TEXT,
    "address" TEXT,

    CONSTRAINT "RentalOnjects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Equipment" (
    "id" VARCHAR(26) NOT NULL,
    "workingHoursId" VARCHAR(26) NOT NULL,
    "hourRateId" VARCHAR(26) NOT NULL,
    "rentalObjectId" VARCHAR(26) NOT NULL,
    "name" TEXT,
    "description" TEXT,
    "image_url" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "state" TEXT,

    CONSTRAINT "Equipment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Personnel" (
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

    CONSTRAINT "Personnel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Customer" (
    "id" VARCHAR(26) NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "email" TEXT,
    "image_url" TEXT,
    "password" TEXT,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Orders" (
    "id" VARCHAR(26) NOT NULL,
    "start" TIMESTAMP(6) NOT NULL,
    "end" TIMESTAMP(6) NOT NULL,
    "rentalObjectId" VARCHAR(26) NOT NULL,

    CONSTRAINT "Orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomerOrders" (
    "id" VARCHAR(26) NOT NULL,
    "orderId" VARCHAR(26) NOT NULL,
    "customerId" VARCHAR(26) NOT NULL,
    "accepted" BOOLEAN,
    "initiatedBy" BOOLEAN,

    CONSTRAINT "CustomerOrders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderEquipment" (
    "orderId" VARCHAR(26) NOT NULL,
    "equipmentId" VARCHAR(26) NOT NULL,

    CONSTRAINT "OrderEquipment_pkey" PRIMARY KEY ("orderId","equipmentId")
);

-- CreateTable
CREATE TABLE "OrderPersonnel" (
    "orderId" VARCHAR(26) NOT NULL,
    "personnelId" VARCHAR(26) NOT NULL,

    CONSTRAINT "OrderPersonnel_pkey" PRIMARY KEY ("orderId","personnelId")
);

-- AddForeignKey
ALTER TABLE "RentalOnjects" ADD CONSTRAINT "RentalOnjects_workingHoursId_fkey" FOREIGN KEY ("workingHoursId") REFERENCES "WorkingHours"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RentalOnjects" ADD CONSTRAINT "RentalOnjects_hourRateId_fkey" FOREIGN KEY ("hourRateId") REFERENCES "HourRates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RentalOnjects" ADD CONSTRAINT "RentalOnjects_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Equipment" ADD CONSTRAINT "Equipment_workingHoursId_fkey" FOREIGN KEY ("workingHoursId") REFERENCES "WorkingHours"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Equipment" ADD CONSTRAINT "Equipment_hourRateId_fkey" FOREIGN KEY ("hourRateId") REFERENCES "HourRates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Equipment" ADD CONSTRAINT "Equipment_rentalObjectId_fkey" FOREIGN KEY ("rentalObjectId") REFERENCES "RentalOnjects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Personnel" ADD CONSTRAINT "Personnel_workingHoursId_fkey" FOREIGN KEY ("workingHoursId") REFERENCES "WorkingHours"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Personnel" ADD CONSTRAINT "Personnel_hourRateId_fkey" FOREIGN KEY ("hourRateId") REFERENCES "HourRates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Personnel" ADD CONSTRAINT "Personnel_rentalObjectId_fkey" FOREIGN KEY ("rentalObjectId") REFERENCES "RentalOnjects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Orders" ADD CONSTRAINT "Orders_rentalObjectId_fkey" FOREIGN KEY ("rentalObjectId") REFERENCES "RentalOnjects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerOrders" ADD CONSTRAINT "CustomerOrders_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerOrders" ADD CONSTRAINT "CustomerOrders_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderEquipment" ADD CONSTRAINT "OrderEquipment_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderEquipment" ADD CONSTRAINT "OrderEquipment_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "Equipment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderPersonnel" ADD CONSTRAINT "OrderPersonnel_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderPersonnel" ADD CONSTRAINT "OrderPersonnel_personnelId_fkey" FOREIGN KEY ("personnelId") REFERENCES "Personnel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
