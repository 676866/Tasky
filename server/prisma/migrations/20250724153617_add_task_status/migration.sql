/*
  Warnings:

  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Made the column `username` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('Active', 'Pending', 'Review', 'Done');

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "status" "TaskStatus" NOT NULL DEFAULT 'Pending';

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "username" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
