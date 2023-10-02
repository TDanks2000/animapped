import Console from "@tdanks2000/fancyconsolelog";
import Anilist from "../modules/meta/anilist";
import IdManager from "./ids";
import { MappingUtils } from "./utils";
import { Proxies, delay, getTitle } from "../utils";
import { Matches, ModuleIds, ModuleList } from "../@types";
import { MODULES } from "../modules";
import { Database } from "../database";
import ms from "ms";

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

  private async populateMatches(Module: any, searchFrom: any, matches: Matches) {
    Module.updateProxy(this.proxies.getRandomProxy());
    const map = new MappingUtils(searchFrom, Module);

    let match = await map.matchMedia();

    const module_name = Module.name?.toLowerCase();

    if (match) {
      match.forEach((item) => {
        matches[module_name] = {
          ...matches[module_name],
          [item.id]: {
            id: item.id,
            title: item.title ?? item.altTitles![0],
            module: Module.name,
          },
        };
      });
    }
  }

  async match(searchFrom: any, title: string) {
    let matches: Matches = {
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
      const searchFrom = await this.anilist.getMedia(id).catch((err) => {
        return;
      });

      if (!searchFrom || !searchFrom?.title) return;

      let searchFromTitle = (await getTitle(searchFrom?.title)) || "";
      if (!searchFromTitle.length) return;

      if (!searchFrom?.year) return;

      const matches = await this.match(searchFrom, searchFromTitle[0]);

      await this.database.FillWithData({
        anilist_id: searchFrom.id!,
        mal_id: searchFrom.malId!,
        title: searchFromTitle,
        year: searchFrom.year.toString(),
        mappings: matches,
      });

      const nextId = await this.idManager.getNextId(id);
      if (nextId) this.idManager.updateId(nextId);

      const timeoutTime = this.timeout_time;

      const c = new Console();
      c.setColor("redBright");

      c.log(`delaying for ${ms(timeoutTime, { long: true })} before next request`);

      await delay(timeoutTime);

      c.setColor("greenBright");
      c.log(`finished delaying for ${ms(timeoutTime, { long: true })} starting next request`);
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

export { Mapping };
