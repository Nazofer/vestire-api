/*
  Warnings:

  - The values [B2B_CLIENT] on the enum `RoleType` will be removed. If these variants are still used in the database, this will fail.
  - Changed the type of `name` on the `Role` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "b2b"."RoleType_new" AS ENUM ('ADMIN', 'USER');
ALTER TABLE "b2b"."Role" ALTER COLUMN "name" TYPE "b2b"."RoleType_new" USING ("name"::text::"b2b"."RoleType_new");
ALTER TYPE "b2b"."RoleType" RENAME TO "RoleType_old";
ALTER TYPE "b2b"."RoleType_new" RENAME TO "RoleType";
DROP TYPE "b2b"."RoleType_old";
COMMIT;

-- AlterTable
ALTER TABLE "b2b"."Role" DROP COLUMN "name",
ADD COLUMN     "name" "b2b"."RoleType" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "b2b"."Role"("name");
