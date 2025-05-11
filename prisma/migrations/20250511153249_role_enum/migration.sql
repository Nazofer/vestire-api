/*
  Warnings:

  - The values [USER] on the enum `RoleType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "b2b"."RoleType_new" AS ENUM ('ADMIN', 'OWNER', 'MANAGER');
ALTER TABLE "b2b"."Role" ALTER COLUMN "name" TYPE "b2b"."RoleType_new" USING ("name"::text::"b2b"."RoleType_new");
ALTER TYPE "b2b"."RoleType" RENAME TO "RoleType_old";
ALTER TYPE "b2b"."RoleType_new" RENAME TO "RoleType";
DROP TYPE "b2b"."RoleType_old";
COMMIT;
