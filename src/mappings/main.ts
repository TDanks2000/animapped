import { Mapping as MappingClass } from "./mapping";
import Console from "@tdanks2000/fancyconsolelog";

const c = new Console();
export class Mapping {
  constructor() {}

  async startMapping() {
    const mapping = await MappingClass.create();
    await mapping.start();
  }
}
