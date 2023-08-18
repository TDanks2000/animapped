import "dotenv/config";

import figlet from "figlet";
import Console from "@tdanks2000/fancyconsolelog";

import Anilist from "../modules/meta/anilist";
import { getId, getNextId, goThroughList, matchMedia, updateId } from "./utils";
import { delay, getTitle } from "../utils";
import { Matches, ModuleList } from "../@types";
import { MODULES } from "../modules";
import { Database } from "../database";

class Mapping {
  last_id: string = "0";
  last_id_index: number = 0;
  anilist: Anilist = new Anilist();
  modules: ModuleList = MODULES;
  database: Database = new Database();

  timeout_time: number = 60 * 60 * 12;

  constructor(timeout_time?: number) {
    this.timeout_time = timeout_time ?? this.timeout_time;
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
      let match = await matchMedia(searchFrom!, Module);

      const module_name = Module.name.toLowerCase();

      // get matches from module_name
      if (match) {
        match.forEach((item) => {
          matches[module_name] = {
            ...matches[module_name],
            [item.id]: {
              id: item.id,
              title: item.title ?? item.altTitles![0],
            },
          };
        });
      }
    }

    return matches;
  }

  async start() {
    await figlet.text(
      "AniMapped",
      {
        font: "Big",
        horizontalLayout: "default",
        verticalLayout: "default",
        whitespaceBreak: true,
      },
      function (err, data) {
        if (err) {
          console.log("Something went wrong...");
          console.dir(err);
          return;
        }

        const c = new Console();
        c.setColor("yellowBright");
        c.log(data);
        console.log("\n");
      }
    );

    return goThroughList(this.last_id_index, async (id: string) => {
      const searchFrom = await this.anilist.getMedia(id);
      let searchFromTitle = getTitle(searchFrom!.title);
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

      console.log(`delaying for ${timeoutTime}ms before next request`);
      await delay(timeoutTime);
    });
  }
}

export { Mapping };
