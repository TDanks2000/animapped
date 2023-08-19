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
Object.defineProperty(exports, "__esModule", { value: true });
exports.delay = exports.getTitle = exports.USER_AGENT = void 0;
exports.USER_AGENT = `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.120 Safari/537.36`;
const getTitle = (title, preferedLanguage) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    if (typeof title === "string")
        return title.toLowerCase();
    if (!title)
        return undefined;
    if (preferedLanguage) {
        return ((_b = (yield ((_a = Object.entries(title)
            .find(([key]) => key.toLowerCase() === preferedLanguage.toLowerCase())) === null || _a === void 0 ? void 0 : _a[1].toLowerCase()))) !== null && _b !== void 0 ? _b : undefined);
    }
    return ((_k = (_h = (_f = (_d = (_c = title === null || title === void 0 ? void 0 : title.english) === null || _c === void 0 ? void 0 : _c.toLowerCase()) !== null && _d !== void 0 ? _d : (_e = title === null || title === void 0 ? void 0 : title.userPreferred) === null || _e === void 0 ? void 0 : _e.toLowerCase()) !== null && _f !== void 0 ? _f : (_g = title === null || title === void 0 ? void 0 : title.native) === null || _g === void 0 ? void 0 : _g.toLowerCase()) !== null && _h !== void 0 ? _h : (_j = title === null || title === void 0 ? void 0 : title.romaji) === null || _j === void 0 ? void 0 : _j.toLowerCase()) !== null && _k !== void 0 ? _k : undefined);
});
exports.getTitle = getTitle;
const delay = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};
exports.delay = delay;
