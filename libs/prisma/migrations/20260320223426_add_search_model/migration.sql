/*
  Warnings:

  - A unique constraint covering the columns `[productId]` on the table `Search` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `description` to the `Search` table without a default value. This is not possible if the table is not empty.
  - Added the required column `normalizedText` to the `Search` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Search` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Search_name_key";

-- AlterTable
ALTER TABLE "Search" ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "normalizedText" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Search_productId_key" ON "Search"("productId");
