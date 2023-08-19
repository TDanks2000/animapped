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
    search(keyword, page = 1) {
        return __awaiter(this, void 0, void 0, function* () {
            const searchResult = [];
            const { data } = yield axios_1.default.get(`${this.url}/search.html?keyword=${encodeURIComponent(keyword)}&page=${page}`, {
                headers: {
                    "User-Agent": utils_1.USER_AGENT,
                },
            });
            const $ = (0, cheerio_1.load)(data);
            $("ul.items > li").each((i, el) => {
                var _a, _b, _c;
                const title = $(el).find("div.img a").attr("title").trim().replace(/\\n/g, "");
                const id = (_a = $(el).find("div.img a").attr("href")) === null || _a === void 0 ? void 0 : _a.split("/")[2];
                const year = (_c = parseInt((_b = $("p.released").text()) === null || _b === void 0 ? void 0 : _b.split("Released: ")[1])) !== null && _c !== void 0 ? _c : 0;
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
        });
    }
    get voiceOptions() {
        return ["dub" /* VoiceType.DUB */, "sub" /* VoiceType.SUB */];
    }
}
exports.default = Gogoanime;
