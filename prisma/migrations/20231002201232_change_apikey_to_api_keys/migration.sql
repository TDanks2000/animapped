/*
  Warnings:

  - You are about to drop the `ApiKey` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "ApiKey";

-- CreateTable
CREATE TABLE "apiKeys" (
    "id" TEXT NOT NULL,
    "api_key" TEXT NOT NULL,
    "discord_id" TEXT,
    "is_admin" BOOLEAN NOT NULL DEFAULT false,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "apiKeys_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "apiKeys_api_key_key" ON "apiKeys"("api_key");

-- CreateIndex
CREATE UNIQUE INDEX "apiKeys_discord_id_key" ON "apiKeys"("discord_id");
