/*
  Warnings:

  - The primary key for the `Media` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[publicId]` on the table `Media` will be added. If there are existing duplicate values, this will fail.
  - The required column `id` was added to the `Media` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "Media" DROP CONSTRAINT "Media_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "Media_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "Media_publicId_key" ON "Media"("publicId");
