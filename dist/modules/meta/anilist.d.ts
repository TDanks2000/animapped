import { AnimeModuleInfo, BaseMetaModule, ModuleIds } from "../../@types";
declare class Anilist extends BaseMetaModule {
    id: ModuleIds;
    name: string;
    url: string;
    search(keyword: string): Promise<AnimeModuleInfo[] | undefined>;
    getMedia(id: string): Promise<AnimeModuleInfo | undefined>;
}
export default Anilist;
