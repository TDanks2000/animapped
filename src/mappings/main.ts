import { Mapping as MappingClass } from "./mapping";
import Console from "@tdanks2000/fancyconsolelog";
import { StateManager } from "./utils";

import ms from "ms";

const c = new Console();
export class Mapping {
  private stateManager: StateManager = new StateManager();
  private timeBetweenMappings = ms("5 days");

  async startMapping() {
    const mapping = await MappingClass.create(this.stateManager);

    setInterval(async () => {
      if (this.stateManager.running === true) return;
      c.info(
        `it is has been ${ms(this.timeBetweenMappings, {
          long: true,
        })}, going through the list again`
      );

      await mapping.start();
    }, this.timeBetweenMappings);
  }
}
