import { ModuleIds } from "./Modules";
import { ModuleResult, VoiceType } from "./types";
export declare abstract class BaseAnimeModule {
    abstract id: ModuleIds;
    abstract name: string;
    abstract url: string;
    abstract search(keyword: string): Promise<ModuleResult[] | undefined>;
    abstract get voiceOptions(): VoiceType[];
}
