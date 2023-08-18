import { ModuleResult, VoiceType, BaseAnimeModule, ModuleIds } from "../../@types";
declare class Kickassanime extends BaseAnimeModule {
    id: ModuleIds;
    name: string;
    url: string;
    private headers;
    search(keyword: string): Promise<ModuleResult[] | undefined>;
    get voiceOptions(): VoiceType[];
    private getImageUrl;
}
export default Kickassanime;
