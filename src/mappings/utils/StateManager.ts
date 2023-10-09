import { AnimeV2 } from "@prisma/client";

type anilist_id = string;

export class StateManager {
  public oldIds: Map<anilist_id, AnimeV2> = new Map<anilist_id, AnimeV2>();

  public running: boolean = false;
  public paused: boolean = false;

  /**
   * @description Set running to true and paused to false
   */
  public start() {
    this.running = true;
    this.paused = false;
  }

  /**
   * @description Set running to false and paused to false
   */
  public stop() {
    this.running = false;
    this.paused = false;
  }

  /**
   * @description Set paused to true
   */
  public pause() {
    this.paused = true;
  }

  /**
   * @description Set paused to false
   */
  public resume() {
    this.paused = false;
  }

  /**
   * @description Add a new anime to the old ids map
   */
  public addToOldIds(id: anilist_id, data: AnimeV2) {
    this.oldIds.set(id, data);
  }

  /**
   * @returns The old ids map
   */
  public getOldIds() {
    return this.oldIds;
  }

  /**
   * @param id The anilist id to get the old id data for
   * @returns The anime data for the old id or undefined if it doesn't exist.
   */
  public getOldId(id: anilist_id) {
    return this.oldIds.get(id);
  }

  /**
   * @description Reset the old ids map
   */
  public clearOldIds() {
    this.oldIds = new Map<anilist_id, AnimeV2>();
  }

  /**
   * @description Resets the state manager
   */
  public reset() {
    this.oldIds = new Map<anilist_id, AnimeV2>();
    this.running = false;
    this.paused = false;
  }
}
