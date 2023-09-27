/*
  Warnings:

  - The values [CASH] on the enum `payments_paymentType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `payments` ADD COLUMN `paymentMethodId` VARCHAR(191) NULL,
    MODIFY `paymentType` ENUM('TICKET', 'CARD', 'BANK_TRANSFER') NULL;
