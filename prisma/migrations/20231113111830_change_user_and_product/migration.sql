-- AlterTable
ALTER TABLE `Product` ADD COLUMN `point` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `endSubscribe` DATETIME(3) NULL,
    ADD COLUMN `isSubscribe` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `startSubscribe` DATETIME(3) NULL;
