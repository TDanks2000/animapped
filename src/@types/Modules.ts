import { Anime } from "./types";

export enum ModuleIds {
  Kickassanime = "1",
  Gogoanime = "2",
  Aniwatch = "3",

  Anilist = "10",
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
