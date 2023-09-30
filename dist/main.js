"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const mapping_1 = require("./mappings/mapping");
const main_1 = require("./server/main");
const process_1 = require("process");
const shouldDisableMapping = process_1.env.DISABLE_MAPPING === "true" ?? false;
(async () => {
    const mapping = new mapping_1.Mapping();
    const server = new main_1.Server();
    if (!shouldDisableMapping) {
        await mapping.start().catch((err) => {
            console.log("Error starting mapping: ", err);
        });
    }
    await server.start().catch((err) => {
        console.error("Error starting server: ", err);
    });
})();
