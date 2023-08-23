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
const _types_1 = require("../@types");
const utils_1 = require("../utils");
const fancyconsolelog_1 = __importDefault(require("@tdanks2000/fancyconsolelog"));
const last_id_filePath = node_path_1.default.join(__dirname, "..", "../last_id.txt");
const ids_path = node_path_1.default.join(__dirname, "..", "../ids.txt");
let checkedYear = false;
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
    checkedYear = false;
    let matches = [];
    const console = new fancyconsolelog_1.default();
    const start = new Date(Date.now());
    let language = "english";
    let title = cleanUpTitle((yield (0, utils_1.getTitle)(searchFrom.title)));
    console.info(`Searching ${module.name} for ${title}`);
    let searchThrough = yield module.search(title);
    console.log(module.name, searchThrough);
    yield search(searchFrom, searchThrough, "title", matches, { titleLanguage: language });
    if (matches.length <= 0) {
        console.log("try again!");
        language = "romaji";
        title = cleanUpTitle((yield (0, utils_1.getTitle)(searchFrom.title, language)));
        console.log(title);
        searchThrough = yield module.search(title);
        console.log(module.name, searchThrough);
        yield search(searchFrom, searchThrough, "title", matches, { titleLanguage: language });
    }
    if (matches.length > 2 &&
        searchFrom.year &&
        module.id === _types_1.ModuleIds.Gogoanime &&
        checkedYear === false) {
        checkedYear = true;
        yield search(searchFrom, matches, "year", matches, { titleLanguage: language });
    }
    if (matches.length >= 2 &&
        searchFrom.year &&
        module.id !== _types_1.ModuleIds.Gogoanime &&
        checkedYear === false) {
        checkedYear = true;
        yield search(searchFrom, matches, "year", matches, { titleLanguage: language });
    }
    matches = matches.sort((a, b) => {
        if (a.diffrence > b.diffrence)
            return 1;
        if (a.diffrence < b.diffrence)
            return -1;
        return 0;
    });
    if (module.doesDubHaveSeprateID) {
        let maxMatches = 2;
        if (matches.length > maxMatches)
            matches = matches.slice(0, maxMatches);
    }
    else {
        let maxMatches = 1;
        if (matches.length > maxMatches)
            matches = matches.slice(0, maxMatches);
    }
    if (matches.length > 0) {
        const end = new Date(Date.now());
        const matchedIn = end.getTime() - start.getTime();
        console.info(`Matched ${yield (0, utils_1.getTitle)(searchFrom.title)}, ${module.name} in ${matchedIn}ms`);
    }
    else {
        const end = new Date(Date.now());
        const matchedIn = end.getTime() - start.getTime();
        console.info(`Not found any Mappings for ${yield (0, utils_1.getTitle)(searchFrom.title)}, ${module.name} in ${matchedIn}ms`);
    }
    return matches;
});
exports.matchMedia = matchMedia;
const search = (searchFrom, searchThrough, searchingFor = "title", matches, extraData) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, e_1, _b, _c, _d, e_2, _e, _f;
    var _g, _h, _j, _k;
    let searchFromTitle = (yield (0, utils_1.getTitle)(searchFrom.title, extraData === null || extraData === void 0 ? void 0 : extraData.titleLanguage));
    if (extraData === null || extraData === void 0 ? void 0 : extraData.customTitle)
        searchFromTitle = (yield (0, utils_1.getTitle)(extraData.customTitle));
    switch (searchingFor) {
        case "title":
            try {
                for (var _l = true, _m = __asyncValues(searchThrough), _o; _o = yield _m.next(), _a = _o.done, !_a; _l = true) {
                    _c = _o.value;
                    _l = false;
                    const item = _c;
                    let title = (_h = (_g = item.title) === null || _g === void 0 ? void 0 : _g.toLowerCase()) !== null && _h !== void 0 ? _h : (_k = (_j = item.altTitles) === null || _j === void 0 ? void 0 : _j[0]) === null || _k === void 0 ? void 0 : _k.toLowerCase();
                    if (!title)
                        return;
                    if ((title === null || title === void 0 ? void 0 : title.includes("dub")) || title.includes("[raw]")) {
                        const cleanTitle = cleanUpTitle(item.title);
                        const distanceFrom = (0, fastest_levenshtein_1.distance)(searchFromTitle, cleanTitle);
                        if (distanceFrom <= parseInt(process.env.DISTANCE))
                            matches.push(Object.assign(Object.assign({}, item), { diffrence: distanceFrom }));
                    }
                    const distanceFrom = (0, fastest_levenshtein_1.distance)(searchFromTitle, title);
                    if (distanceFrom <= parseInt(process.env.DISTANCE))
                        matches.push(item);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_l && !_a && (_b = _m.return)) yield _b.call(_m);
                }
                finally { if (e_1) throw e_1.error; }
            }
            break;
        case "year":
            let newMatches = [];
            try {
                for (var _p = true, _q = __asyncValues(matches), _r; _r = yield _q.next(), _d = _r.done, !_d; _p = true) {
                    _f = _r.value;
                    _p = false;
                    const item = _f;
                    if (item.year === searchFrom.year)
                        newMatches.push(item);
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (!_p && !_d && (_e = _q.return)) yield _e.call(_q);
                }
                finally { if (e_2) throw e_2.error; }
            }
            matches = newMatches;
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
const cleanUpTitle = (title) => {
    let realTitle = removeDubFromTitle(title);
    realTitle = realTitle.replace(/\[RAW\]\s*/g, "");
    realTitle = realTitle.replace(/\//g, "");
    return realTitle;
};
