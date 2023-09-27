-- AlterTable
ALTER TABLE `orders` ADD COLUMN `country` ENUM('BR') NULL DEFAULT 'BR',
    ADD COLUMN `currency` ENUM('BRL') NULL DEFAULT 'BRL',
    ADD COLUMN `paymentMethodId` VARCHAR(191) NULL,
    ADD COLUMN `paymentType` ENUM('TICKET', 'CARD', 'BANK_TRANSFER') NULL;
