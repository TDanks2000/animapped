import { ModuleResult } from "./types";

export type Matches = {
  gogoanime: MatchItem | null;
  kickassanime: MatchItem | null;
  aniwatch: MatchItem | null;
  animepahe: MatchItem | null;
  [moduleName: string]: MatchItem | null;
};

export type MatchItem = {
  [x: string]: Match | null;
};

export type Match = Pick<ModuleResult, "id" | "title"> & {
  module: string;
};

export type SearchingFor = "title" | "year" | "format";
