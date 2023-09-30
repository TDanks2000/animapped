"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MappingUtils = void 0;
const fastest_levenshtein_1 = require("fastest-levenshtein");
const utils_1 = require("../utils");
const fancyconsolelog_1 = __importDefault(require("@tdanks2000/fancyconsolelog"));
const console = new fancyconsolelog_1.default();
class MappingUtils {
    constructor(search_from, module) {
        this.search_from = search_from;
        this.module = module;
        this.matches = [];
    }
    async matchMedia() {
        const start = new Date(Date.now());
        let language = "romaji";
        let title = (await (0, utils_1.getTitle)(this.search_from.title, language));
        if (this.search_from.status === "NOT_YET_RELEASED" /* MediaStatus.NOT_YET_RELEASED */) {
            console.error(`Skipping ${title} because it is not yet released`);
            return [];
        }
        let searchThrough;
        try {
            searchThrough = await this.module.search(title);
        }
        catch (error) {
            console.error(error);
        }
        if (!searchThrough)
            return;
        console.info(`Searching ${this.module.name} for ${title}`);
        await this.search("title", searchThrough);
        if (!this.matches ||
            this.matches.length <= 0 ||
            (this.module.doesDubHaveSeprateID && this.matches.length < 2)) {
            language = "english";
            title = (0, utils_1.cleanTitle)((await (0, utils_1.getTitle)(this.search_from.title, language)));
            try {
                searchThrough = await this.module.search(title).catch();
            }
            catch (error) {
                console.error(error);
            }
            await this.search("title", searchThrough, { titleLanguage: language });
        }
        if (this.matches.length > 2 && this.search_from.year) {
            await this.search("year", searchThrough, { titleLanguage: language });
        }
        if (this.matches.length > 2 && this.search_from.format) {
            await this.search("format", searchThrough);
        }
        this.matches = this.matches.sort((a, b) => {
            if (a.diffrence > b.diffrence)
                return 1;
            if (a.diffrence < b.diffrence)
                return -1;
            return 0;
        });
        let maxMatches = 2;
        if (this.module.doesDubHaveSeprateID) {
            if (this.matches.length > maxMatches)
                this.matches = this.matches.slice(0, maxMatches);
        }
        else {
            maxMatches = 1;
            if (this.matches.length > maxMatches)
                this.matches = this.matches.slice(0, maxMatches);
        }
        if (this.matches.length > 0) {
            const end = new Date(Date.now());
            const matchedIn = end.getTime() - start.getTime();
            console.info(`Matched ${await (0, utils_1.getTitle)(this.search_from.title)}, ${this.module.name} in ${matchedIn}ms`);
        }
        else {
            const end = new Date(Date.now());
            const matchedIn = end.getTime() - start.getTime();
            console.info(`Not found any Mappings for ${await (0, utils_1.getTitle)(this.search_from.title)}, ${this.module.name} in ${matchedIn}ms`);
        }
        return this.matches;
    }
    async search(searching_for = "title", searchThrough, extraData) {
        let newMatches = [];
        let searchFromTitle = (await (0, utils_1.getTitle)(this.search_from.title, extraData?.titleLanguage));
        switch (searching_for) {
            case "title":
                for await (const item of searchThrough) {
                    let title = item.title?.toLowerCase() ?? item.altTitles?.[0]?.toLowerCase();
                    if (!title || !searchFromTitle)
                        return;
                    title = (0, utils_1.cleanTitle)(title);
                    const distanceFrom = (0, fastest_levenshtein_1.distance)(searchFromTitle, title);
                    if (distanceFrom <= parseInt(process.env.DISTANCE))
                        this.matches.push({
                            ...item,
                            diffrence: distanceFrom,
                        });
                }
                break;
            case "year":
                for await (const item of this.matches) {
                    if (item.year > 0)
                        continue;
                    if (item.year === this.search_from.year)
                        newMatches.push(item);
                }
                if (newMatches.length > 0)
                    this.matches = newMatches;
                break;
            case "format":
                for await (const item of this.matches) {
                    if (!item.format)
                        continue;
                    const distanceFrom = (0, fastest_levenshtein_1.distance)(item.format?.toLowerCase(), this.search_from.format?.toLowerCase());
                    if (distanceFrom <= 6)
                        newMatches.push(item);
                }
                if (newMatches.length > 0)
                    this.matches = newMatches;
            default:
                break;
        }
    }
}
exports.MappingUtils = MappingUtils;
