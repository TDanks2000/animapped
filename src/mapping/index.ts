import "dotenv/config";

import figlet from "figlet";
import Console from "@tdanks2000/fancyconsolelog";

import Anilist from "../modules/meta/anilist";
import { getId, matchMedia } from "./utils";
import { getTitle } from "../utils";
import { Matches, ModuleList } from "../@types";
import { MODULES } from "../modules";

class Mapping {
  last_id: string = "0";
  last_id_index: number = 0;
  anilist: Anilist = new Anilist();
  modules: ModuleList = MODULES;

  protected async init() {
    this.last_id = await getId();
    this.last_id_index = (await getId("index")) + 1;
  }

  static async create() {
    const mapping = new Mapping();
    await mapping.init();
    return mapping;
  }

  async match(searchFrom: any, title: string) {
    let matches: Matches = {
      gogoanime: null,
      kickassanime: null,
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
              title: item.title,
            },
          };
        });
      }
    }

    return matches;
  }

  async start() {
    figlet.text(
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

    const searchFrom = await this.anilist.getMedia(this.last_id);
    let searchFromTitle = getTitle(searchFrom!.title);

    if (!searchFromTitle?.length) return null;

    return await this.match(searchFrom, searchFromTitle!);
  }
}

import fs from "node:fs";

(async () => {
  const mapping = await Mapping.create();
  const matches = await mapping.start();
  fs.writeFileSync("./matches.json", JSON.stringify(matches, null, 2));
})();

export default Mapping;
