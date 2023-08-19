import { AnimeModuleInfo, BaseAnimeModule, ModuleResult } from "../@types";
type MATCHES = ModuleResult & {
    diffrence?: number;
};
export declare const getId: (typeToGet?: "index" | "id") => Promise<any>;
export declare const getNextId: (id: string) => Promise<any>;
export declare const updateId: (id: string) => void;
export declare const matchMedia: (searchFrom: AnimeModuleInfo, module: BaseAnimeModule) => Promise<MATCHES[]>;
export declare const goThroughList: (last_id_index: number, mapFN: Function) => Promise<void>;
export {};
