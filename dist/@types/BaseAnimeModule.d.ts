import { ModuleIds } from "./Modules";
import { ModuleResult, Proxy, VoiceType } from "./types";
export declare abstract class BaseAnimeModule {
    abstract id: ModuleIds;
    abstract name: string;
    abstract url: string;
    abstract proxy?: Proxy;
    abstract doesDubHaveSeprateID: boolean;
    abstract updateProxy(proxy: Proxy): void;
    abstract search(keyword: string): Promise<ModuleResult[] | undefined>;
    abstract get voiceOptions(): VoiceType[];
}
