import { Matches } from "./Mapping";

export type AnimeData = {
  id?: string;
  anilist_id: string;
  mal_id: string;
  title: string;
  year: string;
  mappings?: Matches;
};
