import axios, { AxiosInstance } from "axios";
import { ModuleResult, BaseMangaModule, Format, Proxy, MangaModuleIds } from "../../@types";
import { USER_AGENT } from "../../utils";

class ComicK extends BaseMangaModule {
  id = MangaModuleIds.ComicK;
  name = "ComicK";
  url = "https://comick.app";
  proxy?: Proxy;

  readonly api_url = "https://api.comick.fun";

  constructor(proxy?: Proxy) {
    super();
    if (proxy) this.proxy = proxy;
  }

  updateProxy(proxy: Proxy): void {
    this.proxy = proxy;
  }

  private setupReq(): AxiosInstance {
    return axios.create({
      baseURL: this.api_url,
      headers: {
        "User-Agent": USER_AGENT,
        Referer: this.url,
        Origin: this.url,
      },
    });
  }

  async search(
    keyword: string,
    page: number = 1,
    limit: number = 20
  ): Promise<ModuleResult[] | undefined> {
    try {
      const data = await this.setupReq().get(
        `/v1.0/search?q=${encodeURIComponent(keyword)}&limit=${limit}&page=${page}`
      );

      const searchResult: ModuleResult[] = [];

      for (const manga of data.data) {
        let cover: Cover | null = manga.md_covers ? manga.md_covers[0] : null;
        let image: string | undefined = undefined;

        if (cover && cover.b2key != undefined) image = `https://meo.comick.pictures${cover.b2key}`;

        searchResult.push({
          id: manga.slug,
          title: manga.title ?? manga.slug,
          altTitles: manga.md_titles
            ? manga.md_titles.map((title: { title: string }) => title.title)
            : [],
          image: image,
          year: 0,
          format: Format.UNKNOWN,
          moduleId: this.id,
        });
      }

      return searchResult;
    } catch (error) {
      console.log(error);
      throw new Error((error as Error).message);
    }
  }
}

// (async () => {
//   const manga = new ComicK();
//   const search = await manga.search("one piece");

//   console.log(search);
// })();

export default ComicK;

interface Cover {
  vol: any;
  w: number;
  h: number;
  b2key: string;
}
