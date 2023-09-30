"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const _types_1 = require("../../@types");
const utils_1 = require("../../utils");
class Kickassanime extends _types_1.BaseAnimeModule {
    constructor(proxy) {
        super();
        this.id = _types_1.ModuleIds.Kickassanime;
        this.name = "Kickassanime";
        this.url = "https://kickassanime.am";
        this.doesDubHaveSeprateID = false;
        this.headers = {
            "User-Agent": utils_1.USER_AGENT,
            "Content-type": "application/json",
            referer: `${this.url}/`,
            origin: this.url,
        };
        this.getImageUrl = (poster, type = "poster") => {
            try {
                return `${this.url}/image/${type}/${poster.hq ?? poster.sm}.${poster.formats.includes("webp") ? "webp" : poster.formats[0]}`;
            }
            catch (err) {
                return "";
            }
        };
        if (proxy)
            this.proxy = proxy;
    }
    updateProxy(proxy) {
        this.proxy = proxy;
    }
    async search(keyword) {
        const searchResult = [];
        const { data } = await axios_1.default.request({
            method: "POST",
            url: `${this.url}/api/search`,
            headers: this.headers,
            data: JSON.stringify({
                query: keyword,
            }),
        });
        data.forEach((item) => {
            searchResult.push({
                id: item.slug,
                altTitles: [item.title],
                title: item.title_en,
                year: item.year,
                image: this.getImageUrl(item.poster),
                moduleId: this.id,
            });
        });
        return searchResult;
    }
    get voiceOptions() {
        return ["dub" /* VoiceType.DUB */, "sub" /* VoiceType.SUB */];
    }
}
exports.default = Kickassanime;
