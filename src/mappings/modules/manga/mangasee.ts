import axios from "axios";
import { ModuleResult, BaseMangaModule, Format, Proxy, MangaModuleIds } from "../../@types";
import { USER_AGENT } from "../../utils";

class MangaSee extends BaseMangaModule {
  id = MangaModuleIds.MangaSee;
  name = "mangasee123";
  url = "https://mangasee123.com";
  proxy?: Proxy;

  constructor(proxy?: Proxy) {
    super();
    if (proxy) this.proxy = proxy;
  }

  updateProxy(proxy: Proxy): void {
    this.proxy = proxy;
  }

  async search(keyword: string, page: number = 1): Promise<ModuleResult[] | undefined> {
    const matches = [];
    const sanitizedQuery = keyword.replace(/\s/g, "").toLowerCase();

    try {
      const data = await this.getMangaSearch();

      for (const i in data) {
        const sanitizedAlts: string[] = [];

        const item = data[i];
        const altTitles: string[] = data[i]["a"];

        for (const alt of altTitles) {
          sanitizedAlts.push(alt.replace(/\s/g, "").toLowerCase());
        }

        if (
          item["s"].replace(/\s/g, "").toLowerCase().includes(sanitizedQuery) ||
          sanitizedAlts.includes(sanitizedQuery)
        ) {
          matches.push(item);
        }
      }

      const results: ModuleResult[] = matches.map(
        (val): ModuleResult => ({
          id: val["i"],
          title: val["s"],
          altTitles: val["a"],
          year: 0,
          format: Format.UNKNOWN,
          image: `https://temp.compsci88.com/cover/${val["i"]}.jpg`,
          moduleId: this.id,
        })
      );

      return results;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  private async getMangaSearch() {
    try {
      const { data } = await axios.request({
        url: `${this.url}/_search.php`,
        method: "POST",
        headers: {
          "User-Agent": USER_AGENT,
          Referer: this.url,
        },
      });
      return data;
    } catch (error) {
      throw new Error(`MangaSee Error: ${(error as Error).message}`);
    }
  }
}

export default MangaSee;
