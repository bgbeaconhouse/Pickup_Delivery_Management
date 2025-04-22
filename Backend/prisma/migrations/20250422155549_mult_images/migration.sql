/*
  Warnings:

  - You are about to drop the column `image` on the `Delivery` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `Pickup` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Delivery" DROP COLUMN "image",
ADD COLUMN     "images" TEXT[];

-- AlterTable
ALTER TABLE "Pickup" DROP COLUMN "image",
ADD COLUMN     "images" TEXT[];
