"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.substringAfter = exports.substringBefore = exports.delay = exports.getTitle = exports.USER_AGENT = void 0;
exports.USER_AGENT = `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.120 Safari/537.36`;
const getTitle = async (title, preferedLanguage) => {
    if (typeof title === "string")
        return title.toLowerCase();
    if (!title)
        return undefined;
    if (preferedLanguage) {
        return ((await Object.entries(title)
            .find(([key]) => key?.toLowerCase() === preferedLanguage?.toLowerCase())?.[1]
            ?.toLowerCase()) ?? undefined);
    }
    return (title?.english?.toLowerCase() ??
        title?.userPreferred?.toLowerCase() ??
        title?.native?.toLowerCase() ??
        title?.romaji?.toLowerCase() ??
        undefined);
};
exports.getTitle = getTitle;
const delay = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};
exports.delay = delay;
const substringBefore = (string, toFind) => {
    const index = string.indexOf(toFind);
    return index == -1 ? "" : string.substring(0, index);
};
exports.substringBefore = substringBefore;
const substringAfter = (string, toFind) => {
    const index = string.indexOf(toFind);
    return index == -1 ? "" : string.substring(index + toFind.length);
};
exports.substringAfter = substringAfter;
