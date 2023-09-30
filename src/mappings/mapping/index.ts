import Console from "@tdanks2000/fancyconsolelog";

import Anilist from "../modules/meta/anilist";
import { getId, getNextId, goThroughList, updateId } from "./ids";
import { MappingUtils } from "./utils";
import { Proxies, delay, getTitle } from "../utils";
import { Matches, ModuleIds, ModuleList } from "../@types";
import { MODULES } from "../modules";
import { Database } from "../database";
import ms from "ms";

class Mapping {
  last_id: string = "0";
  last_id_index: number = 0;
  anilist: Anilist = new Anilist();
  modules: ModuleList = MODULES;
  proxies: Proxies = new Proxies();
  database: Database = new Database();

  timeout_time: number = ms("4s");

  constructor(timeout_time?: number | string) {
    this.proxies.start();
    this.timeout_time =
      typeof timeout_time === "string" ? ms(timeout_time) : timeout_time ?? this.timeout_time;
  }

  protected async init() {
    this.last_id = await getId();
    this.last_id_index = (await getId("index")) + 1;
  }

  static async create(timeout_time?: number) {
    const mapping = new Mapping(timeout_time);
    await mapping.init();
    return mapping;
  }

  async match(searchFrom: any, title: string) {
    let matches: Matches = {
      gogoanime: null,
      kickassanime: null,
      aniwatch: null,
    };

    for await (const Module of this.modules.anime) {
      Module.updateProxy(this.proxies.getRandomProxy());
      const map = new MappingUtils(searchFrom, Module);

      let match = await map.matchMedia();

      const module_name = Module.name?.toLowerCase();

      // get matches from module_name
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

    return matches;
  }

  async start() {
    return goThroughList(this.last_id_index, async (id: string) => {
      const searchFrom = await this.anilist.getMedia(id);
      let searchFromTitle = (await getTitle(searchFrom!.title))!;
      if (!searchFromTitle?.length) return null;

      if (!searchFrom?.year) return;

      const matches = await this.match(searchFrom, searchFromTitle!);

      await this.database.FillWithData({
        anilist_id: searchFrom?.id!,
        mal_id: searchFrom?.malId!,
        title: searchFromTitle,
        year: searchFrom?.year?.toString()!,
        mappings: matches,
      });

      const nextId = await getNextId(id);
      if (!nextId) return;
      else updateId(nextId);

      let timeoutTime = this.timeout_time;

      const c = new Console();
      c.setColor("redBright");

      c.log(`delaying for ${ms(timeoutTime, { long: true })} before next request`);

      await delay(timeoutTime);

      c.setColor("greenBright");
      c.log(`finshed delaying for ${ms(timeoutTime, { long: true })} starting next request`);
    });
  }

  async test(custom_id?: string) {
    const id = custom_id ?? this.last_id;

    const searchFrom = await this.anilist.getMedia(id);
    let searchFromTitle = (await getTitle(searchFrom!.title))!;
    if (!searchFromTitle?.length) return null;

    if (!searchFrom?.year) return "no year";

    const matches = await this.match(searchFrom, searchFromTitle!);

    return matches;
  }
}

// (async () => {
//   const mapping = await Mapping.create();

//   const matches = await mapping.test("145064");
//   console.log(matches);

//   process.exit(0);
// })();

export { Mapping };
