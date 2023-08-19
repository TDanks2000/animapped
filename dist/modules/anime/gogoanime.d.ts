import { ModuleResult, VoiceType, BaseAnimeModule, ModuleIds, Proxy } from "../../@types";
declare class Gogoanime extends BaseAnimeModule {
    id: ModuleIds;
    name: string;
    url: string;
    proxy?: Proxy;
    doesDubHaveSeprateID: boolean;
    constructor(proxy?: Proxy);
    updateProxy(proxy: Proxy): void;
    search(keyword: string, page?: number): Promise<ModuleResult[] | undefined>;
    get voiceOptions(): VoiceType[];
}
export default Gogoanime;
