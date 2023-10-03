import Console from "@tdanks2000/fancyconsolelog";
import Anilist from "../modules/meta/anilist";
import IdManager from "./ids";
import { MappingUtils } from "./utils";
import { Proxies, delay, getTitle } from "../utils";
import { Matches, ModuleIds, ModuleList } from "../@types";
import { MODULES } from "../modules";
import { Database } from "../database";
import ms from "ms";

const c = new Console();

class Mapping {
  private idManager: IdManager;
  private last_id: string = "0";
  private anilist: Anilist = new Anilist();
  private modules: ModuleList = MODULES;
  private proxies: Proxies = new Proxies();
  private database: Database = new Database();
  private timeout_time: number;

  constructor(timeout_time: number | string = "4s") {
    this.idManager = new IdManager();
    this.proxies.start();
    this.timeout_time = typeof timeout_time === "string" ? ms(timeout_time) : timeout_time;
  }

  protected async init() {
    const lastId = await this.idManager.getId("id");
    this.last_id = String(lastId);
  }

  static async create(timeout_time?: number) {
    const mapping = new Mapping(timeout_time);
    await mapping.init();
    return mapping;
  }

  private async populateMatches(module: any, searchFrom: any, matches: Matches) {
    const module_name = module.name?.toLowerCase();
    module.updateProxy(this.proxies.getRandomProxy());

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

  private async matchModuleMedia(module: any, searchFrom: any) {
    const map = new MappingUtils(searchFrom, module);
    return await map.matchMedia();
  }

  async match(searchFrom: any, title: string) {
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

  async start() {
    await this.idManager.goThroughList(this.last_id, async (id: string) => {
      try {
        const searchFrom = await this.anilist.getMedia(id);

        if (!searchFrom || !searchFrom.title) {
          c.warn(`Skipping ID ${id} - Invalid data`);
          return;
        }

        let searchFromTitle = (await getTitle(searchFrom.title)) || "";
        if (!searchFromTitle.length) {
          c.warn(`Skipping ID ${id} - Empty title`);
          return;
        }

        if (!searchFrom.year) {
          c.warn(`Skipping ID ${id} - Missing year`);
          return;
        }

        const matches = await this.match(searchFrom, searchFromTitle[0]);

        await this.database.FillWithData({
          anilist_id: searchFrom.id!,
          mal_id: searchFrom.malId!,
          title: searchFromTitle,
          year: searchFrom.year.toString(),
          mappings: matches,
        });

        const id_index = await this.idManager.getId("index");
        const ids_left = this.idManager.total_ids - parseInt(id_index.toString());

        c.info(`Mapped: ${id_index}/${this.idManager.total_ids}, ${ids_left} to go`);

        const nextId = await this.idManager.getNextId(id);
        if (nextId) {
          this.idManager.updateId(nextId);
        }

        const timeoutTime = this.timeout_time;

        c.warn(`Delaying for ${ms(timeoutTime, { long: true })} before next request`);
        await delay(timeoutTime);

        c.info(`Finished delaying for ${ms(timeoutTime, { long: true })}. Starting next request`);
      } catch (error) {
        c.error(`Error processing ID ${id}:`, error);
      }
    });
  }

  async test(custom_id?: string) {
    const id = custom_id || this.last_id;

    const searchFrom = await this.anilist.getMedia(id);
    if (!searchFrom) return null;
    let searchFromTitle = (await getTitle(searchFrom?.title)) || [];
    if (!searchFromTitle.length) return null;

    if (!searchFrom.year) return "no year";

    const matches = await this.match(searchFrom, searchFromTitle[0]);

    return matches;
  }
}

// (async () => {
//   const mapping = await Mapping.create();
//   const matches = await mapping.test("113415");
//   console.log(matches);

//   process.exit(1);
// })();

export { Mapping };
