-- AlterTable
ALTER TABLE `payments` ADD COLUMN `cardBrand` ENUM('MC', 'MD', 'VD', 'VI') NULL,
    ADD COLUMN `paymentType` ENUM('CASH', 'CARD', 'BANK_TRANSFER') NULL;
