import { ModuleResult, VoiceType, BaseAnimeModule, ModuleIds, Proxy } from "../../@types";
declare class Kickassanime extends BaseAnimeModule {
    id: ModuleIds;
    name: string;
    url: string;
    proxy?: Proxy;
    doesDubHaveSeprateID: boolean;
    constructor(proxy?: Proxy);
    updateProxy(proxy: Proxy): void;
    private headers;
    search(keyword: string): Promise<ModuleResult[] | undefined>;
    get voiceOptions(): VoiceType[];
    private getImageUrl;
}
export default Kickassanime;
