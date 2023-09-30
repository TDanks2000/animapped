import axios from "axios";
import {
  ModuleResult,
  VoiceType,
  BaseAnimeModule,
  ModuleIds,
  Format,
  Formats,
  Proxy,
} from "../../@types";
import { USER_AGENT } from "../../utils";
import { load } from "cheerio";

class Aniwatch extends BaseAnimeModule {
  id = ModuleIds.Aniwatch;
  name = "aniwatch";
  url = "https://aniwatch.to";
  proxy?: Proxy;

  doesDubHaveSeprateID = false;

  constructor(proxy?: Proxy) {
    super();
    if (proxy) this.proxy = proxy;
  }

  updateProxy(proxy: Proxy): void {
    this.proxy = proxy;
  }

  async search(keyword: string, page: number = 1): Promise<ModuleResult[] | undefined> {
    const searchResult: ModuleResult[] = [];

    const { data } = await axios.get(
      `${this.url}/search?keyword=${encodeURIComponent(keyword)}&page=${page}`,
      {
        headers: {
          "User-Agent": USER_AGENT,
        },
      }
    );

    const $ = load(data);

    $(".film_list-wrap > div.flw-item").map((i, el) => {
      const title = $(el)
        .find("div.film-detail h3.film-name a.dynamic-name")
        .attr("title")!
        .trim()
        .replace(/\\n/g, "");
      const id = $(el)
        .find("div:nth-child(1) > a")
        .last()
        .attr("href")!
        .split("?")[0]
        .split("/")[1]
        .trim();
      const img = $(el).find("img").attr("data-src")!;

      const altTitles: string[] = [];
      const jpName = $(el)
        .find("div.film-detail h3.film-name a.dynamic-name")
        .attr("data-jname")!
        .trim()
        .replace(/\\n/g, "");
      altTitles.push(jpName);

      const formatString: string = $(el)
        .find("div.film-detail div.fd-infor span.fdi-item")
        ?.first()
        ?.text()
        .toUpperCase();

      const format: Format = Formats.includes(formatString as Format)
        ? (formatString as Format)
        : Format.UNKNOWN;

      searchResult.push({
        id: id,
        title: title,
        altTitles: altTitles,
        year: 0,
        format,
        image: img,
        moduleId: this.id,
      });
    });

    return searchResult;
  }

  get voiceOptions(): VoiceType[] {
    return [VoiceType.DUB, VoiceType.SUB];
  }
}

export default Aniwatch;
