"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const kickassanime_1 = __importDefault(require("./kickassanime"));
const gogoanime_1 = __importDefault(require("./gogoanime"));
const aniwatch_1 = __importDefault(require("./aniwatch"));
exports.default = { Kickassanime: kickassanime_1.default, Gogoanime: gogoanime_1.default, Aniwatch: aniwatch_1.default };
