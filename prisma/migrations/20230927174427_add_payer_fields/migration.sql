/*
  Warnings:

  - Made the column `country` on table `orders` required. This step will fail if there are existing NULL values in that column.
  - Made the column `currency` on table `orders` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `orders` ADD COLUMN `payerDocument` VARCHAR(191) NULL,
    ADD COLUMN `payerEmail` VARCHAR(191) NULL,
    ADD COLUMN `payerName` VARCHAR(191) NULL,
    MODIFY `country` ENUM('BR') NOT NULL DEFAULT 'BR',
    MODIFY `currency` ENUM('BRL') NOT NULL DEFAULT 'BRL';
