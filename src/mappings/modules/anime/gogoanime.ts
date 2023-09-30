import axios from "axios";
import { ModuleResult, VoiceType, BaseAnimeModule, ModuleIds, Format, Proxy } from "../../@types";
import { USER_AGENT } from "../../utils";
import { load } from "cheerio";

class Gogoanime extends BaseAnimeModule {
  id = ModuleIds.Gogoanime;
  name = "gogoanime";
  url = "https://gogoanimehd.to";
  proxy?: Proxy;
  doesDubHaveSeprateID = true;

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
      `${this.url}/search.html?keyword=${encodeURIComponent(keyword)}&page=${page}`,
      {
        headers: {
          "User-Agent": USER_AGENT,
        },
      }
    );

    const $ = load(data);

    $("ul.items > li").each((i, el) => {
      const title = $(el).find("div.img a").attr("title")!.trim().replace(/\\n/g, "");
      const id = $(el).find("div.img a").attr("href")?.split("/")[2]!;
      const year = parseInt($("p.released").text()?.split("Released: ")[1]) ?? 0;
      const image = $(el).find("div.img a img").attr("src")!;

      const format: Format = Format.UNKNOWN;

      searchResult.push({
        id: id,
        title: title,
        altTitles: [],
        year: year,
        image: image,
        format: format,
        moduleId: this.id,
      });
    });

    return searchResult;
  }

  get voiceOptions(): VoiceType[] {
    return [VoiceType.DUB, VoiceType.SUB];
  }
}

export default Gogoanime;
