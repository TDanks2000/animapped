import "dotenv/config";

import Kickassanime from "../modules/anime/kickassanime";
import Anilist from "../modules/meta/anilist";
import { getId, matchMedia } from "./utils";
import { closest, distance } from "fastest-levenshtein";
import { getTitle } from "../utils";

class Mapping {
  last_id: string = "0";
  last_id_index: number = 0;
  anilist: Anilist = new Anilist();
  kaa: Kickassanime = new Kickassanime();

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
    const testingTo = await this.kaa.search(title);

    let match = await matchMedia(searchFrom!, testingTo!);

    return match;
  }

  async start() {
    const searchFrom = await this.anilist.getMedia(this.last_id);
    let searchFromTitle = getTitle(searchFrom!.title);

    if (!searchFromTitle?.length) return null;

    return await this.match(searchFrom, searchFromTitle!);
  }
}

(async () => {
  const mapping = await Mapping.create();
  console.log(await mapping.start());
  console.log("done");
})();

export default Mapping;
