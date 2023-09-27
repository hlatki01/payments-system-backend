/*
  Warnings:

  - Added the required column `invoice` to the `payments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `payments` ADD COLUMN `invoice` VARCHAR(191) NOT NULL;
