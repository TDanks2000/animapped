import "dotenv/config";
import Anilist from "../modules/meta/anilist";
import { Matches, ModuleList } from "../@types";
import { Database } from "../database";
declare class Mapping {
    last_id: string;
    last_id_index: number;
    anilist: Anilist;
    modules: ModuleList;
    database: Database;
    timeout_time: number;
    constructor(timeout_time?: number);
    protected init(): Promise<void>;
    static create(timeout_time?: number): Promise<Mapping>;
    match(searchFrom: any, title: string): Promise<Matches>;
    start(): Promise<void>;
}
export { Mapping };
