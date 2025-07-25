/*
  Warnings:

  - Added the required column `category` to the `Task` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dueDate` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "category" TEXT NOT NULL,
ADD COLUMN     "dueDate" TIMESTAMP(3) NOT NULL;
