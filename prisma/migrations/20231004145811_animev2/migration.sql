-- CreateTable
CREATE TABLE "AnimeV2" (
    "id" TEXT NOT NULL,
    "anilist_id" TEXT NOT NULL,
    "mal_id" TEXT,
    "title" TEXT NOT NULL,
    "year" TEXT NOT NULL,
    "mappings" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AnimeV2_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AnimeV2_id_key" ON "AnimeV2"("id");

-- CreateIndex
CREATE UNIQUE INDEX "AnimeV2_anilist_id_key" ON "AnimeV2"("anilist_id");

-- CreateIndex
CREATE UNIQUE INDEX "AnimeV2_mal_id_key" ON "AnimeV2"("mal_id");
