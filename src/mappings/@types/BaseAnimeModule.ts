import { BaseModule } from "./BaseModule";
import { ModuleIds } from "./Modules";
import { ModuleResult, Proxy, VoiceType } from "./types";

export abstract class BaseAnimeModule extends BaseModule {
  abstract id: ModuleIds;

  abstract doesDubHaveSeprateID: boolean;

  abstract get voiceOptions(): VoiceType[];
}
