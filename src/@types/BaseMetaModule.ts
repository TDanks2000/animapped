import { AnimeModuleInfo, ModuleIds } from "./Modules";

export abstract class BaseMetaModule {
  abstract id: ModuleIds;
  abstract name: string;
  abstract url: string;

  abstract search(keyword: string): Promise<AnimeModuleInfo[] | undefined>;
}
