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
exports.goThroughList = exports.matchMedia = exports.updateId = exports.getNextId = exports.getId = void 0;
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
const axios_1 = __importDefault(require("axios"));
const fastest_levenshtein_1 = require("fastest-levenshtein");
const utils_1 = require("../utils");
const fancyconsolelog_1 = __importDefault(require("@tdanks2000/fancyconsolelog"));
const last_id_filePath = node_path_1.default.join(__dirname, "..", "../last_id.txt");
const ids_path = node_path_1.default.join(__dirname, "..", "../ids.txt");
const getId = (typeToGet = "id") => __awaiter(void 0, void 0, void 0, function* () {
    let last_id_file = node_fs_1.default.existsSync(last_id_filePath);
    let last_id = "0";
    if (!last_id_file)
        node_fs_1.default.writeFileSync(last_id_filePath, "0");
    else
        last_id = node_fs_1.default.readFileSync(last_id_filePath, "utf-8");
    if (!node_fs_1.default.existsSync(ids_path)) {
        let { data: ids } = yield axios_1.default.get("https://raw.githubusercontent.com/inumakieu/IDFetch/main/ids.txt");
        node_fs_1.default.writeFileSync(ids_path, ids);
    }
    let ids = node_fs_1.default.readFileSync(ids_path, "utf-8");
    ids = ids.split("\n");
    let id = ids[0];
    if (parseInt(last_id) > 0) {
        const id_find = ids.find((id) => id === last_id);
        if (id_find)
            id = id_find;
    }
    return typeToGet === "index" ? ids.indexOf(last_id) : id;
});
exports.getId = getId;
const getNextId = (id) => __awaiter(void 0, void 0, void 0, function* () {
    let last_id_file = node_fs_1.default.existsSync(last_id_filePath);
    let last_id = "0";
    if (!last_id_file)
        node_fs_1.default.writeFileSync(last_id_filePath, "0");
    else
        last_id = node_fs_1.default.readFileSync(last_id_filePath, "utf-8");
    if (!node_fs_1.default.existsSync(ids_path)) {
        let { data: ids } = yield axios_1.default.get("https://raw.githubusercontent.com/inumakieu/IDFetch/main/ids.txt");
        node_fs_1.default.writeFileSync(ids_path, ids);
    }
    let ids = node_fs_1.default.readFileSync(ids_path, "utf-8");
    ids = ids.split("\n");
    let id_index = ids.indexOf(id);
    let next_id = ids[id_index + 1];
    if (!next_id)
        return undefined;
    return next_id;
});
exports.getNextId = getNextId;
const updateId = (id) => {
    let last_id_file = node_fs_1.default.existsSync(last_id_filePath);
    if (!last_id_file)
        node_fs_1.default.writeFileSync(last_id_filePath, "0");
    node_fs_1.default.writeFileSync(last_id_filePath, id);
};
exports.updateId = updateId;
const matchMedia = (searchFrom, module) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const console = new fancyconsolelog_1.default();
    const start = new Date(Date.now());
    let language = "english";
    let title = (_a = (0, utils_1.getTitle)(searchFrom.title)) !== null && _a !== void 0 ? _a : (0, utils_1.getTitle)(searchFrom.title, language);
    console.info(`Searching ${module.name} for ${title}`);
    let matches = [];
    let searchThrough = yield module.search(title);
    yield search(searchFrom, searchThrough, "title", matches);
    if (!matches || matches.length <= 0) {
        language = "romanji";
        title = (0, utils_1.getTitle)(searchFrom.title, language);
        searchThrough = yield module.search(title);
        yield search(searchFrom, searchThrough, "title", matches, {
            titleLanguage: "romanji",
        });
    }
    if (matches.length > 2 && searchFrom.year)
        yield search(searchFrom, searchThrough, "year", matches);
    if (matches.length > 0) {
        const end = new Date(Date.now());
        const matchedIn = end.getTime() - start.getTime();
        console.info(`Matched ${module.name} in ${matchedIn}ms`, searchFrom.title.english);
    }
    return matches;
});
exports.matchMedia = matchMedia;
const search = (searchFrom, searchThrough, searchingFor = "title", matches, extraData) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, e_1, _c, _d, _e, e_2, _f, _g;
    var _h, _j, _k, _l;
    let searchFromTitle = (0, utils_1.getTitle)(searchFrom.title, extraData === null || extraData === void 0 ? void 0 : extraData.titleLanguage);
    if (extraData === null || extraData === void 0 ? void 0 : extraData.customTitle)
        searchFromTitle = (0, utils_1.getTitle)(extraData.customTitle);
    switch (searchingFor) {
        case "title":
            try {
                for (var _m = true, _o = __asyncValues(searchThrough), _p; _p = yield _o.next(), _b = _p.done, !_b; _m = true) {
                    _d = _p.value;
                    _m = false;
                    const item = _d;
                    let title = (_j = (_h = item.title) === null || _h === void 0 ? void 0 : _h.toLowerCase()) !== null && _j !== void 0 ? _j : (_l = (_k = item.altTitles) === null || _k === void 0 ? void 0 : _k[0]) === null || _l === void 0 ? void 0 : _l.toLowerCase();
                    if (!title)
                        return;
                    if (title === null || title === void 0 ? void 0 : title.includes("dub")) {
                        const dubTitle = removeDubFromTitle(item.title);
                        const distanceFrom = (0, fastest_levenshtein_1.distance)(searchFromTitle, dubTitle);
                        if (distanceFrom <= parseInt(process.env.DISTANCE))
                            matches.push(item);
                    }
                    const distanceFrom = (0, fastest_levenshtein_1.distance)(searchFromTitle, title);
                    if (distanceFrom <= parseInt(process.env.DISTANCE))
                        matches.push(item);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_m && !_b && (_c = _o.return)) yield _c.call(_o);
                }
                finally { if (e_1) throw e_1.error; }
            }
            break;
        case "year":
            try {
                for (var _q = true, _r = __asyncValues(searchThrough), _s; _s = yield _r.next(), _e = _s.done, !_e; _q = true) {
                    _g = _s.value;
                    _q = false;
                    const item = _g;
                    if (Number(item.year) === Number(searchFrom.year))
                        matches.push(item);
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (!_q && !_e && (_f = _r.return)) yield _f.call(_r);
                }
                finally { if (e_2) throw e_2.error; }
            }
            break;
        default:
            break;
    }
});
const goThroughList = (last_id_index, mapFN) => __awaiter(void 0, void 0, void 0, function* () {
    const does_ids_exist = node_fs_1.default.existsSync(ids_path);
    if (!does_ids_exist) {
        let { data: ids } = yield axios_1.default.get("https://raw.githubusercontent.com/inumakieu/IDFetch/main/ids.txt");
        node_fs_1.default.writeFileSync(ids_path, ids);
    }
    let ids = node_fs_1.default.readFileSync(ids_path, "utf-8");
    ids = ids.split("\n");
    // start looping through ids starting from id
    for (let i = last_id_index - 1; i < ids.length; i++) {
        let id = ids[i];
        yield mapFN(id);
    }
});
exports.goThroughList = goThroughList;
const removeDubFromTitle = (title) => {
    let realTitle = title.toLowerCase();
    realTitle = realTitle.replace(/dub|[\(\)]/g, "");
    return realTitle;
};
