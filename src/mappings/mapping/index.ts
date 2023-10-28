import Console from "@tdanks2000/fancyconsolelog";
import Anilist from "../modules/meta/anilist";
import IdManager from "./ids";
import { MappingUtils } from "./utils";
import { Proxies, StateManager, delay, getTitle } from "../utils";
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

  private stateManager: StateManager;

  constructor(timeout_time: number | string = "4s", stateManager: StateManager) {
    this.idManager = new IdManager(stateManager);
    this.stateManager = stateManager;
    this.proxies.update();
    this.timeout_time = typeof timeout_time === "string" ? ms(timeout_time) : timeout_time;
  }

  protected async init() {
    const lastId = await this.idManager.getId("id");
    this.last_id = String(lastId);
  }

  static async create(stateManager: StateManager, timeout_time?: number | string) {
    const mapping = new Mapping(timeout_time, stateManager);
    await mapping.init();
    return mapping;
  }

  async start() {
    await this.idManager.goThroughList();
  }

  async test(custom_id: string) {
    return await this.idManager.test(custom_id);
  }
}

// (async () => {
//   const stateManager: StateManager = new StateManager();
//   const mapping = await Mapping.create(stateManager);
//   const matches = await mapping.test("158927");

//   process.exit(1);
// })();

export { Mapping };
