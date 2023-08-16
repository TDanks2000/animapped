import "dotenv/config";

import Kickassanime from "../modules/anime/kickassanime";
import Anilist from "../modules/meta/anilist";
import { getId } from "./utils";
import { closest, distance } from "fastest-levenshtein";

class Mapping {
  last_id: string = "0";

  constructor() {}

  protected async init() {
    this.last_id = await getId();
    console.log(this.last_id);
  }

  static async create() {
    const mapping = new Mapping();
    await mapping.init();
    return mapping;
  }

  async start() {
    const anilist = new Anilist();
    const kaa = new Kickassanime();

    const searchFrom = await anilist.getMedia(this.last_id);
    let searchFromTitle = searchFrom!.title.english! ?? searchFrom!.title?.romaji;
    searchFromTitle = searchFromTitle?.toLowerCase();

    if (!searchFromTitle?.length) return null;

    const testingTo = await kaa.search(searchFromTitle);

    let match = null;

    for await (const item of testingTo!) {
      const distanceFrom = distance(searchFromTitle, item.title.toLowerCase());
      console.log(
        `kaa: ${item.title} \nanilist: ${searchFromTitle} \ndistance: ${distanceFrom} | max: ${process.env.DISTANCE}`
      );
      if (distanceFrom <= parseInt(process.env.DISTANCE!)) {
        match = item;
        break;
      }
      continue;
    }
    console.log(match);
    return match;
  }
}

(async () => {
  const mapping = await Mapping.create();
  await mapping.start();
  console.log("done");
})();

export default Mapping;
