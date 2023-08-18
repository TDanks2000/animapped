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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mapping = void 0;
require("dotenv/config");
const figlet_1 = __importDefault(require("figlet"));
const fancyconsolelog_1 = __importDefault(require("@tdanks2000/fancyconsolelog"));
const anilist_1 = __importDefault(require("../modules/meta/anilist"));
const utils_1 = require("./utils");
const utils_2 = require("../utils");
const modules_1 = require("../modules");
const database_1 = require("../database");
class Mapping {
    constructor(timeout_time) {
        this.last_id = "0";
        this.last_id_index = 0;
        this.anilist = new anilist_1.default();
        this.modules = modules_1.MODULES;
        this.database = new database_1.Database();
        this.timeout_time = 60 * 60 * 12;
        this.timeout_time = timeout_time !== null && timeout_time !== void 0 ? timeout_time : this.timeout_time;
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            this.last_id = yield (0, utils_1.getId)();
            this.last_id_index = (yield (0, utils_1.getId)("index")) + 1;
        });
    }
    static create(timeout_time) {
        return __awaiter(this, void 0, void 0, function* () {
            const mapping = new Mapping(timeout_time);
            yield mapping.init();
            return mapping;
        });
    }
    match(searchFrom, title) {
        var _a, e_1, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            let matches = {
                gogoanime: null,
                kickassanime: null,
                aniwatch: null,
            };
            try {
                for (var _d = true, _e = __asyncValues(this.modules.anime), _f; _f = yield _e.next(), _a = _f.done, !_a; _d = true) {
                    _c = _f.value;
                    _d = false;
                    const Module = _c;
                    let match = yield (0, utils_1.matchMedia)(searchFrom, Module);
                    const module_name = Module.name.toLowerCase();
                    // get matches from module_name
                    if (match) {
                        match.forEach((item) => {
                            var _a;
                            matches[module_name] = Object.assign(Object.assign({}, matches[module_name]), { [item.id]: {
                                    id: item.id,
                                    title: (_a = item.title) !== null && _a !== void 0 ? _a : item.altTitles[0],
                                } });
                        });
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = _e.return)) yield _b.call(_e);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return matches;
        });
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            yield figlet_1.default.text("AniMapped", {
                font: "Big",
                horizontalLayout: "default",
                verticalLayout: "default",
                whitespaceBreak: true,
            }, function (err, data) {
                if (err) {
                    console.log("Something went wrong...");
                    console.dir(err);
                    return;
                }
                const c = new fancyconsolelog_1.default();
                c.setColor("yellowBright");
                c.log(data);
                console.log("\n");
            });
            return (0, utils_1.goThroughList)(this.last_id_index, (id) => __awaiter(this, void 0, void 0, function* () {
                var _a;
                const searchFrom = yield this.anilist.getMedia(id);
                let searchFromTitle = (0, utils_2.getTitle)(searchFrom.title);
                if (!(searchFromTitle === null || searchFromTitle === void 0 ? void 0 : searchFromTitle.length))
                    return null;
                if (!(searchFrom === null || searchFrom === void 0 ? void 0 : searchFrom.year))
                    return;
                const matches = yield this.match(searchFrom, searchFromTitle);
                yield this.database.FillWithData({
                    anilist_id: searchFrom === null || searchFrom === void 0 ? void 0 : searchFrom.id,
                    mal_id: searchFrom === null || searchFrom === void 0 ? void 0 : searchFrom.malId,
                    title: searchFromTitle,
                    year: (_a = searchFrom === null || searchFrom === void 0 ? void 0 : searchFrom.year) === null || _a === void 0 ? void 0 : _a.toString(),
                    mappings: matches,
                });
                const nextId = yield (0, utils_1.getNextId)(id);
                if (!nextId)
                    return;
                else
                    (0, utils_1.updateId)(nextId);
                let timeoutTime = this.timeout_time;
                console.log(`delaying for ${timeoutTime}ms before next request`);
                yield (0, utils_2.delay)(timeoutTime);
            }));
        });
    }
}
exports.Mapping = Mapping;