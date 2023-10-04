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
  private timeout_time: number;

  private proxies: Proxies = new Proxies();

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

  async start() {
    await this.idManager.goThroughList();
  }

  // async test(custom_id?: string) {
  //   const id = custom_id || this.last_id;

  //   const searchFrom = await this.anilist.getMedia(id);
  //   if (!searchFrom) return null;
  //   let searchFromTitle = (await getTitle(searchFrom?.title)) || [];
  //   if (!searchFromTitle.length) return null;

  //   if (!searchFrom.year) return "no year";

  //   const matches = await this.match(searchFrom, searchFromTitle[0]);

  //   return matches;
  // }
}

// (async () => {
//   const mapping = await Mapping.create();
//   const matches = await mapping.test("113415");
//   console.log(matches);

//   process.exit(1);
// })();

export { Mapping };
