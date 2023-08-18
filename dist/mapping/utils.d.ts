import { AnimeModuleInfo, BaseAnimeModule, ModuleResult } from "../@types";
export declare const getId: (typeToGet?: "index" | "id") => Promise<any>;
export declare const getNextId: (id: string) => Promise<any>;
export declare const updateId: (id: string) => void;
export declare const matchMedia: (searchFrom: AnimeModuleInfo, module: BaseAnimeModule) => Promise<ModuleResult[]>;
export declare const goThroughList: (last_id_index: number, mapFN: Function) => Promise<void>;
