import { Anime } from "./types";

export enum ModuleIds {
  Kickassanime = "1",
  Gogoanime = "2",
  Aniwatch = "3",
  AnimePahe = "4",
  AllAnime = "6",

  Anilist = "10",
}

export enum MangaModuleIds {
  MangaSee = "4",
  ComicK = "5",
}

export type AnimeModuleInfo = Pick<
  Anime,
  | "id"
  | "malId"
  | "title"
  | "synonyms"
  | "totalEpisodes"
  | "currentEpisode"
  | "bannerImage"
  | "coverImage"
  | "color"
  | "season"
  | "year"
  | "status"
  | "genres"
  | "description"
  | "format"
  | "duration"
  | "trailer"
  | "countryOfOrigin"
  | "tags"
> & {
  rating: number | null;
  popularity: number | null;
};
