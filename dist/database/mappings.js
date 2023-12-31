"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Database = void 0;
const client_1 = require("@prisma/client");
const fancyconsolelog_1 = __importDefault(require("@tdanks2000/fancyconsolelog"));
const console = new fancyconsolelog_1.default();
class Database extends client_1.PrismaClient {
    constructor() {
        super();
        this.FillWithData = async (data) => {
            const findById = await this.anime.findFirst({
                where: {
                    anilist_id: data.anilist_id,
                },
            });
            if (!findById) {
                await this.anime.create({
                    data: {
                        anilist_id: data.anilist_id,
                        title: data.title,
                        year: data.year,
                        mal_id: data.mal_id,
                        mappings: data.mappings,
                    },
                });
                console.info(`added ${data.title} to database`);
            }
        };
        this.addMappings = async (data) => {
            // const findById = await this.anime.findFirst({
            //   where: {
            //     anilist_id: data.anilist_id,
            //   },
            // });
            this.anime.update({
                where: {
                    anilist_id: data.anilist_id,
                },
                data: {
                    mappings: data.mappings,
                },
            });
        };
    }
}
exports.Database = Database;
exports.default = Database;
