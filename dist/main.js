"use strict";
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
    async startMapping() {
        const mapping = await mapping_1.Mapping.create();
        await mapping.start();
    }
}
(async () => {
    const main = new Main();
    main.startMapping();
})();
