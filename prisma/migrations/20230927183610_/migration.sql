/*
  Warnings:

  - You are about to drop the column `paymentStatus` on the `orders` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `orders` DROP COLUMN `paymentStatus`,
    ADD COLUMN `status` ENUM('PENDING', 'PAID', 'REJECTED', 'CANCELLED', 'AUTHORIZED', 'VERIFIED') NOT NULL DEFAULT 'PENDING';
