import axios from "axios";
import { ModuleResult, VoiceType, BaseAnimeModule, ModuleIds, Proxy } from "../../@types";
import { USER_AGENT } from "../../utils";

class Kickassanime extends BaseAnimeModule {
  id = ModuleIds.Kickassanime;
  name = "Kickassanime";
  url = "https://kickassanime.am";
  proxy?: Proxy;

  doesDubHaveSeprateID = false;

  constructor(proxy?: Proxy) {
    super();
    if (proxy) this.proxy = proxy;
  }

  updateProxy(proxy: Proxy): void {
    this.proxy = proxy;
  }

  private headers = {
    "User-Agent": USER_AGENT,
    "Content-type": "application/json",
    referer: `${this.url}/`,
    origin: this.url,
  };

  async search(keyword: string): Promise<ModuleResult[] | undefined> {
    const searchResult: ModuleResult[] = [];

    const { data } = await axios.request({
      method: "POST",
      timeout: 10000,
      url: `${this.url}/api/search`,
      headers: this.headers,
      data: JSON.stringify({
        query: keyword,
      }),
    });
    data.forEach((item: any) => {
      searchResult.push({
        id: item.slug,
        altTitles: [item.title],
        title: item.title_en,
        year: item.year,
        image: this.getImageUrl(item.poster),
        moduleId: this.id,
      });
    });

    return searchResult;
  }

  get voiceOptions(): VoiceType[] {
    return [VoiceType.DUB, VoiceType.SUB];
  }

  private getImageUrl = (poster: any, type: "banner" | "poster" = "poster") => {
    try {
      return `${this.url}/image/${type}/${poster.hq ?? poster.sm}.${
        poster.formats.includes("webp") ? "webp" : poster.formats[0]
      }`;
    } catch (err) {
      return "";
    }
  };
}

export default Kickassanime;
