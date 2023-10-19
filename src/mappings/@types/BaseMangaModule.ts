import { BaseModule } from "./BaseModule";
import { MangaModuleIds } from "./Modules";
import { ModuleResult, Proxy, VoiceType } from "./types";

export abstract class BaseMangaModule extends BaseModule {
  abstract id: MangaModuleIds;
}
