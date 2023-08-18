import { PrismaClient } from "@prisma/client";
import { AnimeData } from "../@types";
type Data = AnimeData;
export declare class Database extends PrismaClient {
    constructor();
    FillWithData: (data: Data) => Promise<void>;
    addMappings: (data: Data) => Promise<void>;
}
export default Database;
