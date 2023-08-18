"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.delay = exports.getTitle = exports.USER_AGENT = void 0;
exports.USER_AGENT = `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.120 Safari/537.36`;
const getTitle = (title, preferedLanguage) => {
    var _a, _b, _c, _d, _e, _f, _g;
    if (typeof title === "string")
        return title.toLowerCase();
    if (!title)
        return undefined;
    if (preferedLanguage)
        return ((_b = (_a = Object.entries(title)
            .find(([key]) => key === preferedLanguage)) === null || _a === void 0 ? void 0 : _a[1].toLowerCase()) !== null && _b !== void 0 ? _b : undefined);
    return ((_g = (_f = (_e = (_d = (_c = title.english) === null || _c === void 0 ? void 0 : _c.toLowerCase()) !== null && _d !== void 0 ? _d : title.userPreferred.toLowerCase()) !== null && _e !== void 0 ? _e : title.native.toLowerCase()) !== null && _f !== void 0 ? _f : title === null || title === void 0 ? void 0 : title.romaji.toLowerCase()) !== null && _g !== void 0 ? _g : undefined);
};
exports.getTitle = getTitle;
const delay = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};
exports.delay = delay;
