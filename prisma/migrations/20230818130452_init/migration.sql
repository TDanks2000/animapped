-- CreateTable
CREATE TABLE "Anime" (
    "id" TEXT NOT NULL,
    "anilist_id" TEXT NOT NULL,
    "mal_id" TEXT,
    "title" TEXT NOT NULL,
    "year" TEXT NOT NULL,
    "mappings" JSONB,

    CONSTRAINT "Anime_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Anime_id_key" ON "Anime"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Anime_anilist_id_key" ON "Anime"("anilist_id");

-- CreateIndex
CREATE UNIQUE INDEX "Anime_mal_id_key" ON "Anime"("mal_id");
