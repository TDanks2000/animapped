"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const _types_1 = require("../../@types");
const utils_1 = require("../../utils");
const cheerio_1 = require("cheerio");
class Aniwatch extends _types_1.BaseAnimeModule {
    constructor(proxy) {
        super();
        this.id = _types_1.ModuleIds.Aniwatch;
        this.name = "aniwatch";
        this.url = "https://aniwatch.to";
        this.doesDubHaveSeprateID = false;
        if (proxy)
            this.proxy = proxy;
    }
    updateProxy(proxy) {
        this.proxy = proxy;
    }
    async search(keyword, page = 1) {
        const searchResult = [];
        const { data } = await axios_1.default.get(`${this.url}/search?keyword=${encodeURIComponent(keyword)}&page=${page}`, {
            headers: {
                "User-Agent": utils_1.USER_AGENT,
            },
        });
        const $ = (0, cheerio_1.load)(data);
        $(".film_list-wrap > div.flw-item").map((i, el) => {
            const title = $(el)
                .find("div.film-detail h3.film-name a.dynamic-name")
                .attr("title")
                .trim()
                .replace(/\\n/g, "");
            const id = $(el)
                .find("div:nth-child(1) > a")
                .last()
                .attr("href")
                .split("?")[0]
                .split("/")[1]
                .trim();
            const img = $(el).find("img").attr("data-src");
            const altTitles = [];
            const jpName = $(el)
                .find("div.film-detail h3.film-name a.dynamic-name")
                .attr("data-jname")
                .trim()
                .replace(/\\n/g, "");
            altTitles.push(jpName);
            const formatString = $(el)
                .find("div.film-detail div.fd-infor span.fdi-item")
                ?.first()
                ?.text()
                .toUpperCase();
            const format = _types_1.Formats.includes(formatString)
                ? formatString
                : "UNKNOWN" /* Format.UNKNOWN */;
            searchResult.push({
                id: id,
                title: title,
                altTitles: altTitles,
                year: 0,
                format,
                image: img,
                moduleId: this.id,
            });
        });
        return searchResult;
    }
    get voiceOptions() {
        return ["dub" /* VoiceType.DUB */, "sub" /* VoiceType.SUB */];
    }
}
exports.default = Aniwatch;
