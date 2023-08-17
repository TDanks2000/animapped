import { CoverImage } from "./../../../node_modules/@tdanks2000/anilist-wrapper/dist/types/index.d";
import {
  AnimeModuleInfo,
  BaseMetaModule,
  Format,
  Genres,
  ITitleLanguageOptions,
  ModuleIds,
  Season,
} from "../../@types";
import { Anilist as AnilistWrapper } from "@tdanks2000/anilist-wrapper";

const anilist = new AnilistWrapper();

class Anilist extends BaseMetaModule {
  id: ModuleIds = ModuleIds.Anilist;
  name: string = "Anilist";
  url: string = "https://anilist.co/";

  async search(keyword: string): Promise<AnimeModuleInfo[] | undefined> {
    const searchResults: AnimeModuleInfo[] = [];
    const data = await anilist.search.anime(keyword);

    if (!data?.data) return undefined;

    data?.data?.Page?.media.forEach((item) => {
      searchResults.push({
        title: item?.title as ITitleLanguageOptions,
        synonyms: [],
        currentEpisode: item?.episodes,
        bannerImage: item?.bannerImage,
        coverImage: item?.coverImage?.large,
        color: item?.coverImage.large,
        season: item?.season as Season,
        year: item?.seasonYear,
        status: item?.status as any,
        genres: item?.genres as Genres[],
        description: item?.description,
        format: item?.format as Format,
        duration: null,
        trailer: null,
        countryOfOrigin: null,
        tags: item?.tags?.map((tag) => tag.name),
        rating: item?.averageScore,
        popularity: item?.popularity,
      });
    });

    return searchResults;
  }

  async getMedia(id: string): Promise<AnimeModuleInfo | undefined> {
    const data: any = await anilist.media.anime(parseInt(id));

    if (!data?.data) return undefined;

    const item = data?.data?.Media;

    const info: AnimeModuleInfo = {
      title: item?.title!,
      synonyms: [],
      currentEpisode: item?.episodes,
      bannerImage: item?.bannerImage,
      coverImage: item?.coverImage?.large,
      color: item?.coverImage.large,
      season: item?.season as Season,
      year: item?.seasonYear,
      status: item?.status as any,
      genres: item?.genres as Genres[],
      description: item?.description,
      format: item?.format as Format,
      duration: null,
      trailer: null,
      countryOfOrigin: null,
      tags: item?.tags?.map((tag: any) => tag.name),
      rating: item?.averageScore,
      popularity: item?.popularity,
    };

    return info;
  }
}

export default Anilist;
