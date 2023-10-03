-- AlterTable
ALTER TABLE "Anime" ALTER COLUMN "updated_at" DROP DEFAULT;

-- CreateTable
CREATE TABLE "ApiKey" (
    "id" TEXT NOT NULL,
    "api_key" TEXT NOT NULL,
    "discord_id" TEXT,
    "is_admin" BOOLEAN NOT NULL DEFAULT false,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ApiKey_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ApiKey_api_key_key" ON "ApiKey"("api_key");

-- CreateIndex
CREATE UNIQUE INDEX "ApiKey_discord_id_key" ON "ApiKey"("discord_id");
