import { BaseAnimeModule } from "./BaseAnimeModule";
import { BaseMetaModule } from "./BaseMetaModule";
import { ModuleIds } from "./Modules";
export declare const enum VoiceType {
    DUB = "dub",
    SUB = "sub"
}
export interface ModuleResult {
    id: string;
    title: string;
    altTitles?: string[];
    year: number;
    format?: Format;
    image?: string | null;
    moduleId?: ModuleIds;
}
export declare const Formats: Format[];
export declare const enum Format {
    TV = "TV",
    TV_SHORT = "TV_SHORT",
    MOVIE = "MOVIE",
    SPECIAL = "SPECIAL",
    OVA = "OVA",
    ONA = "ONA",
    MUSIC = "MUSIC",
    MANGA = "MANGA",
    NOVEL = "NOVEL",
    ONE_SHOT = "ONE_SHOT",
    UNKNOWN = "UNKNOWN"
}
export declare const enum Type {
    ANIME = "ANIME",
    MANGA = "MANGA"
}
export declare const enum Season {
    WINTER = "WINTER",
    SPRING = "SPRING",
    SUMMER = "SUMMER",
    FALL = "FALL",
    UNKNOWN = "UNKNOWN"
}
export declare const enum MediaStatus {
    FINISHED = "FINISHED",
    RELEASING = "RELEASING",
    NOT_YET_RELEASED = "NOT_YET_RELEASED",
    CANCELLED = "CANCELLED",
    HIATUS = "HIATUS"
}
export declare const enum Genres {
    ACTION = "Action",
    ADVENTURE = "Adventure",
    COMEDY = "Comedy",
    DRAMA = "Drama",
    ECCHI = "Ecchi",
    FANTASY = "Fantasy",
    HORROR = "Horror",
    MAHOU_SHOUJO = "Mahou Shoujo",
    MECHA = "Mecha",
    MUSIC = "Music",
    MYSTERY = "Mystery",
    PSYCHOLOGICAL = "Psychological",
    ROMANCE = "Romance",
    SCI_FI = "Sci-Fi",
    SLICE_OF_LIFE = "Slice of Life",
    SPORTS = "Sports",
    SUPERNATURAL = "Supernatural",
    THRILLER = "Thriller"
}
export type Anime = {
    id: string;
    malId: string;
    kitsuId: string | null;
    slug: string;
    coverImage: string | null;
    bannerImage: string | null;
    trailer: string | null;
    status: MediaStatus | null;
    season: Season;
    title: ITitleLanguageOptions;
    currentEpisode: number | null;
    mappings: {
        id: string;
        providerId: string;
        similarity: number;
    }[];
    synonyms: string[];
    countryOfOrigin: string | null;
    description: string | null;
    duration: number | null;
    color: string | null;
    year: number | null;
    rating: {
        anilist: number;
        mal: number;
        kitsu: number;
    };
    popularity: {
        anilist: number;
        mal: number;
        kitsu: number;
    };
    type: Type;
    genres: Genres[];
    format: Format;
    relations: any[];
    totalEpisodes?: number;
    tags: string[];
};
export type TitleLanguageOptions = "english" | "native" | "romaji" | "userPreferred";
export interface ITitleLanguageOptions {
    english?: string;
    romaji: string;
    native: string;
    userPreferred: string;
}
export type TitleType = string | ITitleLanguageOptions;
export interface ModuleList {
    anime: BaseAnimeModule[];
    meta: BaseMetaModule[];
}
export type Proxy = string;
