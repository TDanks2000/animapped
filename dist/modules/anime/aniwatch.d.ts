import { ModuleResult, VoiceType, BaseAnimeModule, ModuleIds } from "../../@types";
declare class Aniwatch extends BaseAnimeModule {
    id: ModuleIds;
    name: string;
    url: string;
    search(keyword: string, page?: number): Promise<ModuleResult[] | undefined>;
    get voiceOptions(): VoiceType[];
}
export default Aniwatch;
