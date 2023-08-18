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
class Kickassanime extends _types_1.BaseAnimeModule {
    constructor() {
        super(...arguments);
        this.id = _types_1.ModuleIds.Kickassanime;
        this.name = "Kickassanime";
        this.url = "https://kickassanime.am";
        this.headers = {
            "User-Agent": utils_1.USER_AGENT,
            "Content-type": "application/json",
            referer: `${this.url}/`,
            origin: this.url,
        };
        this.getImageUrl = (poster, type = "poster") => {
            var _a;
            try {
                return `${this.url}/image/${type}/${(_a = poster.hq) !== null && _a !== void 0 ? _a : poster.sm}.${poster.formats.includes("webp") ? "webp" : poster.formats[0]}`;
            }
            catch (err) {
                return "";
            }
        };
    }
    search(keyword) {
        return __awaiter(this, void 0, void 0, function* () {
            const searchResult = [];
            const { data } = yield axios_1.default.request({
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
        });
    }
    get voiceOptions() {
        return ["dub" /* VoiceType.DUB */, "sub" /* VoiceType.SUB */];
    }
}
exports.default = Kickassanime;
