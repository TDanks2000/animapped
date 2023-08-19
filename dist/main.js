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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const figlet_1 = __importDefault(require("figlet"));
const mapping_1 = require("./mapping");
const fancyconsolelog_1 = __importDefault(require("@tdanks2000/fancyconsolelog"));
const c = new fancyconsolelog_1.default();
class Main {
    constructor() {
        figlet_1.default.text("AniMapped", {
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
            c.setColor("yellowBright");
            c.log(data);
            console.log("\n");
        });
    }
    startMapping() {
        return __awaiter(this, void 0, void 0, function* () {
            const mapping = yield mapping_1.Mapping.create();
            yield mapping.start();
        });
    }
}
(() => __awaiter(void 0, void 0, void 0, function* () {
    const main = new Main();
    main.startMapping();
}))();
