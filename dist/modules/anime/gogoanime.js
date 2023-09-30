"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const _types_1 = require("../../@types");
const utils_1 = require("../../utils");
const cheerio_1 = require("cheerio");
class Gogoanime extends _types_1.BaseAnimeModule {
    constructor(proxy) {
        super();
        this.id = _types_1.ModuleIds.Gogoanime;
        this.name = "gogoanime";
        this.url = "https://gogoanimehd.to";
        this.doesDubHaveSeprateID = true;
        if (proxy)
            this.proxy = proxy;
    }
    updateProxy(proxy) {
        this.proxy = proxy;
    }
    async search(keyword, page = 1) {
        const searchResult = [];
        const { data } = await axios_1.default.get(`${this.url}/search.html?keyword=${encodeURIComponent(keyword)}&page=${page}`, {
            headers: {
                "User-Agent": utils_1.USER_AGENT,
            },
        });
        const $ = (0, cheerio_1.load)(data);
        $("ul.items > li").each((i, el) => {
            const title = $(el).find("div.img a").attr("title").trim().replace(/\\n/g, "");
            const id = $(el).find("div.img a").attr("href")?.split("/")[2];
            const year = parseInt($("p.released").text()?.split("Released: ")[1]) ?? 0;
            const image = $(el).find("div.img a img").attr("src");
            const format = "UNKNOWN" /* Format.UNKNOWN */;
            searchResult.push({
                id: id,
                title: title,
                altTitles: [],
                year: year,
                image: image,
                format: format,
                moduleId: this.id,
            });
        });
        return searchResult;
    }
    get voiceOptions() {
        return ["dub" /* VoiceType.DUB */, "sub" /* VoiceType.SUB */];
    }
}
exports.default = Gogoanime;
