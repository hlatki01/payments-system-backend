/*
  Warnings:

  - You are about to drop the column `date` on the `payments` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `payments` DROP COLUMN `date`,
    ADD COLUMN `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `deleted` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `status` ENUM('PENDING', 'PAID', 'REJECTED', 'CANCELLED', 'AUTHORIZED', 'VERIFIED') NOT NULL DEFAULT 'PENDING',
    ADD COLUMN `updatedAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `description` VARCHAR(191) NULL;
