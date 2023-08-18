"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MODULES = void 0;
const anime_1 = __importDefault(require("./anime"));
const meta_1 = __importDefault(require("./meta"));
exports.MODULES = {
    anime: [new anime_1.default.Kickassanime(), new anime_1.default.Gogoanime(), new anime_1.default.Aniwatch()],
    meta: [new meta_1.default.Anilist()],
};
