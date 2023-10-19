import axios from "axios";
import { BaseAnimeModule, ModuleIds, ModuleResult, VoiceType } from "../../@types";

class AnimePahe extends BaseAnimeModule {
  id: ModuleIds = ModuleIds.AnimePahe;
  name: string = "animepahe";
  url: string = "https://animepahe.ru";

  doesDubHaveSeprateID: boolean = false;

  async search(keyword: string, page?: number | undefined): Promise<ModuleResult[] | undefined> {
    const searchResult: ModuleResult[] = [];

    try {
      const { data } = await axios.get(`${this.url}/api?m=search&q=${encodeURIComponent(keyword)}`);

      data.data.map((item: any) => {
        searchResult.push({
          id: item?.id,
          title: item?.title,
          year: item?.year ?? 0,
          altTitles: [],
          format: item?.type,
          image: item?.poster,
          moduleId: this.id,
        });
      });

      return searchResult;
    } catch (err) {
      throw new Error((err as Error).message);
    }
  }

  get voiceOptions(): VoiceType[] {
    return [VoiceType.DUB, VoiceType.SUB];
  }
}

export default AnimePahe;
