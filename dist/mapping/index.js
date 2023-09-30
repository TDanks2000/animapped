"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mapping = void 0;
require("dotenv/config");
const fancyconsolelog_1 = __importDefault(require("@tdanks2000/fancyconsolelog"));
const anilist_1 = __importDefault(require("../modules/meta/anilist"));
const ids_1 = require("./ids");
const utils_1 = require("./utils");
const utils_2 = require("../utils");
const modules_1 = require("../modules");
const database_1 = require("../database");
const ms_1 = __importDefault(require("ms"));
class Mapping {
    constructor(timeout_time) {
        this.last_id = "0";
        this.last_id_index = 0;
        this.anilist = new anilist_1.default();
        this.modules = modules_1.MODULES;
        this.proxies = new utils_2.Proxies();
        this.database = new database_1.Database();
        this.timeout_time = (0, ms_1.default)("10s");
        this.proxies.start();
        this.timeout_time =
            typeof timeout_time === "string" ? (0, ms_1.default)(timeout_time) : timeout_time ?? this.timeout_time;
    }
    async init() {
        this.last_id = await (0, ids_1.getId)();
        this.last_id_index = (await (0, ids_1.getId)("index")) + 1;
    }
    static async create(timeout_time) {
        const mapping = new Mapping(timeout_time);
        await mapping.init();
        return mapping;
    }
    async match(searchFrom, title) {
        let matches = {
            gogoanime: null,
            kickassanime: null,
            aniwatch: null,
        };
        for await (const Module of this.modules.anime) {
            Module.updateProxy(this.proxies.getRandomProxy());
            const map = new utils_1.MappingUtils(searchFrom, Module);
            let match = await map.matchMedia();
            const module_name = Module.name?.toLowerCase();
            // get matches from module_name
            if (match) {
                match.forEach((item) => {
                    matches[module_name] = {
                        ...matches[module_name],
                        [item.id]: {
                            id: item.id,
                            title: item.title ?? item.altTitles[0],
                            module: Module.name,
                        },
                    };
                });
            }
        }
        return matches;
    }
    async start() {
        return (0, ids_1.goThroughList)(this.last_id_index, async (id) => {
            const searchFrom = await this.anilist.getMedia(id);
            let searchFromTitle = (await (0, utils_2.getTitle)(searchFrom.title));
            if (!searchFromTitle?.length)
                return null;
            if (!searchFrom?.year)
                return;
            const matches = await this.match(searchFrom, searchFromTitle);
            await this.database.FillWithData({
                anilist_id: searchFrom?.id,
                mal_id: searchFrom?.malId,
                title: searchFromTitle,
                year: searchFrom?.year?.toString(),
                mappings: matches,
            });
            const nextId = await (0, ids_1.getNextId)(id);
            if (!nextId)
                return;
            else
                (0, ids_1.updateId)(nextId);
            let timeoutTime = this.timeout_time;
            const c = new fancyconsolelog_1.default();
            c.setColor("redBright");
            c.log(`delaying for ${(0, ms_1.default)(timeoutTime, { long: true })} before next request`);
            await (0, utils_2.delay)(timeoutTime);
            c.setColor("greenBright");
            c.log(`finshed delaying for ${(0, ms_1.default)(timeoutTime, { long: true })} starting next request`);
        });
    }
    async test(custom_id) {
        const id = custom_id ?? this.last_id;
        const searchFrom = await this.anilist.getMedia(id);
        let searchFromTitle = (await (0, utils_2.getTitle)(searchFrom.title));
        if (!searchFromTitle?.length)
            return null;
        if (!searchFrom?.year)
            return "no year";
        const matches = await this.match(searchFrom, searchFromTitle);
        return matches;
    }
}
exports.Mapping = Mapping;
