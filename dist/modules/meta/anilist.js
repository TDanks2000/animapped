"use strict";
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
    async search(keyword) {
        const searchResults = [];
        const data = await anilist.search.anime(keyword);
        if (!data?.data)
            return undefined;
        data?.data?.Page?.media.forEach((item) => {
            searchResults.push({
                id: item?.id.toString(),
                malId: item?.idMal?.toString(),
                title: item?.title,
                synonyms: [],
                currentEpisode: item?.episodes,
                bannerImage: item?.bannerImage,
                coverImage: item?.coverImage?.large,
                color: item?.coverImage.large,
                season: item?.season,
                year: item?.seasonYear,
                status: item?.status,
                genres: item?.genres,
                description: item?.description,
                format: item?.format,
                duration: null,
                trailer: null,
                countryOfOrigin: null,
                tags: item?.tags?.map((tag) => tag.name),
                rating: item?.averageScore,
                popularity: item?.popularity,
            });
        });
        return searchResults;
    }
    async getMedia(id) {
        const data = await anilist.media.anime(parseInt(id));
        if (!data?.data)
            return undefined;
        const item = data?.data?.Media;
        const info = {
            title: item?.title,
            synonyms: [],
            currentEpisode: item?.episodes,
            bannerImage: item?.bannerImage,
            coverImage: item?.coverImage?.large,
            color: item?.coverImage.large,
            season: item?.season,
            year: item?.seasonYear,
            status: item?.status,
            genres: item?.genres,
            description: item?.description,
            format: item?.format,
            duration: null,
            trailer: null,
            countryOfOrigin: null,
            tags: item?.tags?.map((tag) => tag.name),
            rating: item?.averageScore,
            popularity: item?.popularity,
            id: item?.id.toString(),
            malId: item?.idMal?.toString(),
        };
        return info;
    }
}
exports.default = Anilist;
