/*
  Warnings:

  - You are about to drop the column `description` on the `Permission` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Permission` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Role` table. All the data in the column will be lost.
  - You are about to drop the `RolePermission` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[name]` on the table `Role` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `action` to the `Permission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `roleId` to the `Permission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subject` to the `Permission` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "b2b"."RolePermission" DROP CONSTRAINT "RolePermission_permissionId_fkey";

-- DropForeignKey
ALTER TABLE "b2b"."RolePermission" DROP CONSTRAINT "RolePermission_roleId_fkey";

-- DropIndex
DROP INDEX "b2b"."Permission_name_key";

-- AlterTable
ALTER TABLE "b2b"."Permission" DROP COLUMN "description",
DROP COLUMN "name",
ADD COLUMN     "action" TEXT NOT NULL,
ADD COLUMN     "conditions" JSONB,
ADD COLUMN     "roleId" VARCHAR(26) NOT NULL,
ADD COLUMN     "subject" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "b2b"."Role" DROP COLUMN "type";

-- DropTable
DROP TABLE "b2b"."RolePermission";

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "b2b"."Role"("name");

-- AddForeignKey
ALTER TABLE "b2b"."Permission" ADD CONSTRAINT "Permission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "b2b"."Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;
