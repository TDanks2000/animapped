"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const main_1 = require("./mappings/main");
const main_2 = require("./server/main");
const process_1 = require("process");
const figlet_1 = __importDefault(require("figlet"));
const fancyconsolelog_1 = __importDefault(require("@tdanks2000/fancyconsolelog"));
const c = new fancyconsolelog_1.default();
const shouldDisableMapping = process_1.env.DISABLE_MAPPING === "true" ?? false;
class Start {
    async start() {
        const server = new main_2.Server();
        await server.start().catch((err) => {
            console.error("Error starting server: ", err);
        });
        if (!shouldDisableMapping) {
            const mapping = new main_1.Mapping();
            await mapping.startMapping().catch((err) => {
                console.log("Error starting mapping: ", err);
            });
        }
    }
}
(async () => {
    figlet_1.default.text("AniMapped", {
        font: "Big",
        horizontalLayout: "default",
        verticalLayout: "default",
        whitespaceBreak: true,
    }, async function (err, data) {
        if (err) {
            console.log("Something went wrong...");
            console.dir(err);
            return;
        }
        c.setColor("yellowBright");
        c.log(data);
        console.log("\n");
        const start = new Start();
        await start.start();
    });
    process.on("unhandledRejection", (reason, promise) => {
        console.error("Unhandled Promise rejection:", reason);
    });
    process.on("uncaughtException", (error) => {
        console.error("Uncaught Exception:", error);
    });
})();
