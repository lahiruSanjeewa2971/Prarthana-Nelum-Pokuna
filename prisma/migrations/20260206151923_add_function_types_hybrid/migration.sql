/*
  Warnings:

  - You are about to drop the column `functionType` on the `Booking` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "functionType",
ADD COLUMN     "functionTypeCustom" TEXT,
ADD COLUMN     "functionTypeId" TEXT,
ADD COLUMN     "functionTypeLabel" TEXT,
ADD COLUMN     "functionTypeLegacy" TEXT;

-- CreateTable
CREATE TABLE "FunctionType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FunctionType_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FunctionType_name_key" ON "FunctionType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "FunctionType_slug_key" ON "FunctionType"("slug");

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_functionTypeId_fkey" FOREIGN KEY ("functionTypeId") REFERENCES "FunctionType"("id") ON DELETE SET NULL ON UPDATE CASCADE;
