import { Mapping as MappingClass } from "./mapping";
import Console from "@tdanks2000/fancyconsolelog";
import { StateManager } from "./utils";
import cron from "node-cron";

const c = new Console();
export class Mapping {
  private stateManager: StateManager = new StateManager();

  constructor() {}

  async startMapping() {
    const mapping = await MappingClass.create(this.stateManager);

    cron.schedule("0 0 * * MON", async () => {
      if (this.stateManager.running === true) return;
      c.info("it is now a monday, going through the list again");

      await mapping.start();
    });
  }
}
