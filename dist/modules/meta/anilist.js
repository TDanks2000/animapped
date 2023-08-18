"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const _types_1 = require("../../@types");
const anilist_wrapper_1 = require("@tdanks2000/anilist-wrapper");
const anilist = new anilist_wrapper_1.Anilist();
class Anilist extends _types_1.BaseMetaModule {
    constructor() {
        super(...arguments);
        this.id = _types_1.ModuleIds.Anilist;
        this.name = "Anilist";
        this.url = "https://anilist.co/";
    }
    search(keyword) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const searchResults = [];
            const data = yield anilist.search.anime(keyword);
            if (!(data === null || data === void 0 ? void 0 : data.data))
                return undefined;
            (_b = (_a = data === null || data === void 0 ? void 0 : data.data) === null || _a === void 0 ? void 0 : _a.Page) === null || _b === void 0 ? void 0 : _b.media.forEach((item) => {
                var _a, _b, _c;
                searchResults.push({
                    id: item === null || item === void 0 ? void 0 : item.id.toString(),
                    malId: (_a = item === null || item === void 0 ? void 0 : item.idMal) === null || _a === void 0 ? void 0 : _a.toString(),
                    title: item === null || item === void 0 ? void 0 : item.title,
                    synonyms: [],
                    currentEpisode: item === null || item === void 0 ? void 0 : item.episodes,
                    bannerImage: item === null || item === void 0 ? void 0 : item.bannerImage,
                    coverImage: (_b = item === null || item === void 0 ? void 0 : item.coverImage) === null || _b === void 0 ? void 0 : _b.large,
                    color: item === null || item === void 0 ? void 0 : item.coverImage.large,
                    season: item === null || item === void 0 ? void 0 : item.season,
                    year: item === null || item === void 0 ? void 0 : item.seasonYear,
                    status: item === null || item === void 0 ? void 0 : item.status,
                    genres: item === null || item === void 0 ? void 0 : item.genres,
                    description: item === null || item === void 0 ? void 0 : item.description,
                    format: item === null || item === void 0 ? void 0 : item.format,
                    duration: null,
                    trailer: null,
                    countryOfOrigin: null,
                    tags: (_c = item === null || item === void 0 ? void 0 : item.tags) === null || _c === void 0 ? void 0 : _c.map((tag) => tag.name),
                    rating: item === null || item === void 0 ? void 0 : item.averageScore,
                    popularity: item === null || item === void 0 ? void 0 : item.popularity,
                });
            });
            return searchResults;
        });
    }
    getMedia(id) {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield anilist.media.anime(parseInt(id));
            if (!(data === null || data === void 0 ? void 0 : data.data))
                return undefined;
            const item = (_a = data === null || data === void 0 ? void 0 : data.data) === null || _a === void 0 ? void 0 : _a.Media;
            const info = {
                title: item === null || item === void 0 ? void 0 : item.title,
                synonyms: [],
                currentEpisode: item === null || item === void 0 ? void 0 : item.episodes,
                bannerImage: item === null || item === void 0 ? void 0 : item.bannerImage,
                coverImage: (_b = item === null || item === void 0 ? void 0 : item.coverImage) === null || _b === void 0 ? void 0 : _b.large,
                color: item === null || item === void 0 ? void 0 : item.coverImage.large,
                season: item === null || item === void 0 ? void 0 : item.season,
                year: item === null || item === void 0 ? void 0 : item.seasonYear,
                status: item === null || item === void 0 ? void 0 : item.status,
                genres: item === null || item === void 0 ? void 0 : item.genres,
                description: item === null || item === void 0 ? void 0 : item.description,
                format: item === null || item === void 0 ? void 0 : item.format,
                duration: null,
                trailer: null,
                countryOfOrigin: null,
                tags: (_c = item === null || item === void 0 ? void 0 : item.tags) === null || _c === void 0 ? void 0 : _c.map((tag) => tag.name),
                rating: item === null || item === void 0 ? void 0 : item.averageScore,
                popularity: item === null || item === void 0 ? void 0 : item.popularity,
                id: item === null || item === void 0 ? void 0 : item.id.toString(),
                malId: (_d = item === null || item === void 0 ? void 0 : item.idMal) === null || _d === void 0 ? void 0 : _d.toString(),
            };
            return info;
        });
    }
}
exports.default = Anilist;
