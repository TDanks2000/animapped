import { ModuleResult } from "./types";
export type Matches = {
    gogoanime: MatchItem | null;
    kickassanime: MatchItem | null;
    aniwatch: MatchItem | null;
    [x: string]: MatchItem | null;
};
export type MatchItem = {
    [x: string]: Match | null;
};
export type Match = Pick<ModuleResult, "id" | "title">;
