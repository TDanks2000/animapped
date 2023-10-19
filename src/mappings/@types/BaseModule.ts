import { AnimeModuleInfo, ModuleIds } from "./Modules";
import { ModuleResult } from "./types";

export abstract class BaseModule {
  abstract name: string;
  abstract url: string;

  abstract search(keyword: string, page?: number): Promise<ModuleResult[] | undefined>;
}
