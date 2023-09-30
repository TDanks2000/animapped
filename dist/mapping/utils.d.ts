import { AnimeModuleInfo, BaseAnimeModule, ModuleResult, SearchingFor, TitleLanguageOptions } from "../@types";
type MATCHES = ModuleResult & {
    diffrence?: number;
};
export declare class MappingUtils {
    search_from: AnimeModuleInfo;
    module: BaseAnimeModule;
    matches: MATCHES[];
    constructor(search_from: AnimeModuleInfo, module: BaseAnimeModule);
    matchMedia(): Promise<MATCHES[] | undefined>;
    search(searching_for: SearchingFor | undefined, searchThrough: ModuleResult[], extraData?: {
        titleLanguage?: TitleLanguageOptions;
    }): Promise<void>;
}
export {};
