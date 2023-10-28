import { distance } from "fastest-levenshtein";
import {
  AnimeModuleInfo,
  BaseAnimeModule,
  MediaStatus,
  ModuleResult,
  SearchingFor,
  TitleLanguageOptions,
} from "../@types";
import { cleanTitle, getTitle } from "../utils";
import Console from "@tdanks2000/fancyconsolelog";

const console = new Console();

type MATCHES = ModuleResult & { diffrence?: number };

export class MappingUtils {
  search_from: AnimeModuleInfo;
  module: BaseAnimeModule;
  matches: MATCHES[];

  constructor(search_from: AnimeModuleInfo, module: BaseAnimeModule) {
    this.search_from = search_from;
    this.module = module;
    this.matches = [];
  }

  async matchMedia() {
    const start = new Date(Date.now());
    let language: TitleLanguageOptions = "english";
    let title = (await getTitle(this.search_from.title, language))!;

    if (this.search_from.status?.toLowerCase() === MediaStatus.NOT_YET_RELEASED.toLowerCase()) {
      console.warn(`Skipping ${title} because it is not yet released`);
      return [];
    }

    let searchThrough;
    try {
      searchThrough = await this.module.search(title);
    } catch (error) {
      console.error(error);
    }

    if (!searchThrough) return;

    console.info(`Searching ${this.module.name} for ${title}`);
    await this.search("title", searchThrough, { cleanTitle: false });
    await this.search("year", searchThrough, { titleLanguage: language });

    if (
      !this.matches ||
      this.matches.length <= 0 ||
      (this.module.doesDubHaveSeprateID && this.matches.length < 2)
    ) {
      language = "romaji";
      title = (await getTitle(this.search_from.title, language))!;
      try {
        searchThrough = await this.module.search(title).catch();
      } catch (error) {
        console.error(error);
      }
      await this.search("title", searchThrough!, { titleLanguage: language });
      await this.search("year", searchThrough!, { titleLanguage: language });
    }

    if (this.matches.length > 2 && this.search_from.format) {
      await this.search("format", searchThrough!);
    }

    this.matches = this.matches.sort((a, b) => {
      if (a.diffrence! > b.diffrence!) return 1;
      if (a.diffrence! < b.diffrence!) return -1;
      return 0;
    });

    let maxMatches = 2;
    if (this.module.doesDubHaveSeprateID) {
      if (this.matches.length > maxMatches) this.matches = this.matches.slice(0, maxMatches);
    } else {
      maxMatches = 1;
      if (this.matches.length > maxMatches) this.matches = this.matches.slice(0, maxMatches);
    }

    if (this.matches.length > 0) {
      const end = new Date(Date.now());
      const matchedIn = end.getTime() - start.getTime();

      console.info(
        `Matched ${await getTitle(this.search_from.title)}, ${this.module.name} in ${matchedIn}ms`
      );
    } else {
      const end = new Date(Date.now());
      const matchedIn = end.getTime() - start.getTime();

      console.info(
        `Not found any Mappings for ${await getTitle(this.search_from.title)}, ${
          this.module.name
        } in ${matchedIn}ms`
      );
    }

    return this.matches;
  }

  async search(
    searching_for: SearchingFor = "title",
    searchThrough: ModuleResult[],
    extraData: {
      titleLanguage?: TitleLanguageOptions;
      cleanTitle?: boolean;
    } = {
      cleanTitle: true,
    }
  ) {
    let newMatches: MATCHES[] = [];
    let searchFromTitle = (await getTitle(this.search_from.title, extraData?.titleLanguage))!;

    switch (searching_for) {
      case "title":
        for await (const item of searchThrough!) {
          let title = item.title?.toLowerCase() ?? item.altTitles!?.[0]?.toLowerCase();

          if (!title || !searchFromTitle) continue;
          if (extraData?.cleanTitle === true) title = cleanTitle(title);
          const distanceFrom = distance(searchFromTitle, title);
          if (distanceFrom <= parseInt(process.env.DISTANCE!))
            this.matches.push({
              ...item,
              diffrence: distanceFrom,
            });
        }

        break;
      case "year":
        this.matches = this.matches.filter((item) => {
          if (item.year <= 0 || isNaN(item.year)) return true;
          return item.year > 0 && !isNaN(item.year) && item.year === this.search_from.year;
        });
        break;
      case "format":
        this.matches = this.matches.filter((item) => {
          return (
            item.format && item.format.toLowerCase() === this.search_from.format?.toLowerCase()
          );
        });
        break;
      default:
        break;
    }
  }
}
