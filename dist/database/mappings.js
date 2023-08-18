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
exports.Database = void 0;
const client_1 = require("@prisma/client");
const fancyconsolelog_1 = __importDefault(require("@tdanks2000/fancyconsolelog"));
const console = new fancyconsolelog_1.default();
class Database extends client_1.PrismaClient {
    constructor() {
        super();
        this.FillWithData = (data) => __awaiter(this, void 0, void 0, function* () {
            const findById = yield this.anime.findFirst({
                where: {
                    anilist_id: data.anilist_id,
                },
            });
            if (!findById) {
                yield this.anime.create({
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
        });
        this.addMappings = (data) => __awaiter(this, void 0, void 0, function* () {
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
        });
    }
}
exports.Database = Database;
exports.default = Database;
