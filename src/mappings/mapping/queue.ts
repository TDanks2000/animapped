import ms from "ms";
import { delay, getTitle } from "../utils";
import Anilist from "../modules/meta/anilist";
import { MappingUtils } from "./utils";
import Console from "@tdanks2000/fancyconsolelog";
import { AnimeModuleInfo, BaseAnimeModule, Matches, ModuleList } from "../@types";
import { MODULES } from "../modules";
import { Database } from "../database";
import IdManager from "./ids";

const c = new Console();

class MappingQueueHandler {
  private anilist: Anilist = new Anilist();
  private modules: ModuleList = MODULES;

  private queue: Set<string> = new Set<string>();
  // private mappingFN: (id: string) => Promise<void>;

  private paused: boolean = false;
  private delay: number = ms("7s");

  public running: boolean = false;

  private database: Database = new Database();
  private idManager: IdManager;

  constructor() {
    this.idManager = new IdManager();
  }

  setDelay(time: number | string) {
    const number = typeof time === "string" ? ms(time) : time;
    this.delay = number;
  }

  pause() {
    this.paused = true;
  }

  unpause() {
    this.paused = false;
  }

  add(id: string) {
    this.queue.add(id);
  }

  private async match(searchFrom: AnimeModuleInfo, title: string) {
    const matches: Matches = {
      gogoanime: null,
      kickassanime: null,
      aniwatch: null,
    };

    for await (const Module of this.modules.anime) {
      await this.populateMatches(Module, searchFrom, matches);
    }

    return matches;
  }

  private async populateMatches(
    module: BaseAnimeModule,
    searchFrom: AnimeModuleInfo,
    matches: Matches
  ) {
    const module_name = module.name?.toLowerCase();

    let match = await this.matchModuleMedia(module, searchFrom);

    if (match) {
      match.forEach((item) => {
        matches[module_name] = {
          ...matches[module_name],
          [item.id]: {
            id: item.id,
            title: item.title ?? item.altTitles![0],
            module: module.name,
          },
        };
      });
    }
  }

  private async matchModuleMedia(module: BaseAnimeModule, searchFrom: AnimeModuleInfo) {
    const map = new MappingUtils(searchFrom, module);
    return await map.matchMedia();
  }

  async start() {
    // if (!this.mappingFN) throw new Error("Mapping Function is not defined");
    if (this.paused || this.queue.size <= 0) return;

    this.running = true;

    // go through the queue
    for await (const id of this.queue) {
      try {
        const searchFrom = await this.anilist.getMedia(id);

        if (!searchFrom) {
          c.warn(`Skipping ID ${id} - Invalid data`);
          continue;
        }

        let searchFromTitle = (await getTitle(searchFrom.title)) || "";
        if (!searchFromTitle.length) {
          c.warn(`Skipping ID ${id} - Empty title`);
          continue;
        }

        if (!searchFrom.year) {
          c.warn(`Skipping ID ${id} - Missing year`);
          continue;
        }

        const matches = await this.match(searchFrom, searchFromTitle[0]);

        await this.database
          .FillWithData({
            anilist_id: searchFrom.id!,
            mal_id: searchFrom.malId!,
            title: searchFromTitle,
            year: searchFrom.year.toString(),
            mappings: matches,
          })
          .catch((err) => {
            c.error(err);
          });

        this.idManager.updateId(id);
        this.queue.delete(id);

        c.warn(`Delaying for ${ms(this.delay, { long: true })} before next request`);
        await delay(this.delay);

        c.info(`Finished delaying for ${ms(this.delay, { long: true })}. Starting next request`);
      } catch (error) {
        c.warn(`Error processing ID ${id}:`);
        c.error((error as Error).message);
      }
    }

    this.running = false;
  }
}

// (async () => {
//   const queue = new MappingQueueHandler();
//   await queue.start();
// })();

export { MappingQueueHandler };
