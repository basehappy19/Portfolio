/*
  Warnings:

  - The primary key for the `Achievement` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `awardLevel` on the `Achievement` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Achievement` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `Achievement` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Achievement` table. All the data in the column will be lost.
  - The primary key for the `AchievementImage` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `altText` on the `AchievementImage` table. All the data in the column will be lost.
  - The primary key for the `AchievementLink` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `label` on the `AchievementLink` table. All the data in the column will be lost.
  - The primary key for the `AchievementsOnCategories` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `name` on the `Category` table. All the data in the column will be lost.
  - Added the required column `title_en` to the `Achievement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title_th` to the `Achievement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `label_en` to the `AchievementLink` table without a default value. This is not possible if the table is not empty.
  - Added the required column `label_th` to the `AchievementLink` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name_en` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name_th` to the `Category` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('DRAFT', 'PUBLIC');

-- DropForeignKey
ALTER TABLE "AchievementImage" DROP CONSTRAINT "AchievementImage_achievementId_fkey";

-- DropForeignKey
ALTER TABLE "AchievementLink" DROP CONSTRAINT "AchievementLink_achievementId_fkey";

-- DropForeignKey
ALTER TABLE "AchievementsOnCategories" DROP CONSTRAINT "AchievementsOnCategories_achievementId_fkey";

-- AlterTable
ALTER TABLE "Achievement" DROP CONSTRAINT "Achievement_pkey",
DROP COLUMN "awardLevel",
DROP COLUMN "description",
DROP COLUMN "location",
DROP COLUMN "title",
ADD COLUMN     "awardLevel_en" TEXT,
ADD COLUMN     "awardLevel_th" TEXT,
ADD COLUMN     "description_en" TEXT,
ADD COLUMN     "description_th" TEXT,
ADD COLUMN     "given_by_en" TEXT,
ADD COLUMN     "given_by_th" TEXT,
ADD COLUMN     "location_en" TEXT,
ADD COLUMN     "location_th" TEXT,
ADD COLUMN     "sortOrder" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'DRAFT',
ADD COLUMN     "title_en" TEXT NOT NULL,
ADD COLUMN     "title_th" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Achievement_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Achievement_id_seq";

-- AlterTable
ALTER TABLE "AchievementImage" DROP CONSTRAINT "AchievementImage_pkey",
DROP COLUMN "altText",
ADD COLUMN     "altText_en" TEXT,
ADD COLUMN     "altText_th" TEXT,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "achievementId" SET DATA TYPE TEXT,
ADD CONSTRAINT "AchievementImage_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "AchievementImage_id_seq";

-- AlterTable
ALTER TABLE "AchievementLink" DROP CONSTRAINT "AchievementLink_pkey",
DROP COLUMN "label",
ADD COLUMN     "label_en" TEXT NOT NULL,
ADD COLUMN     "label_th" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "achievementId" SET DATA TYPE TEXT,
ADD CONSTRAINT "AchievementLink_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "AchievementLink_id_seq";

-- AlterTable
ALTER TABLE "AchievementsOnCategories" DROP CONSTRAINT "AchievementsOnCategories_pkey",
ALTER COLUMN "achievementId" SET DATA TYPE TEXT,
ADD CONSTRAINT "AchievementsOnCategories_pkey" PRIMARY KEY ("achievementId", "categoryId");

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "name",
ADD COLUMN     "name_en" TEXT NOT NULL,
ADD COLUMN     "name_th" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AchievementsOnCategories" ADD CONSTRAINT "AchievementsOnCategories_achievementId_fkey" FOREIGN KEY ("achievementId") REFERENCES "Achievement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AchievementImage" ADD CONSTRAINT "AchievementImage_achievementId_fkey" FOREIGN KEY ("achievementId") REFERENCES "Achievement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AchievementLink" ADD CONSTRAINT "AchievementLink_achievementId_fkey" FOREIGN KEY ("achievementId") REFERENCES "Achievement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
