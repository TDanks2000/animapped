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
    if (!keyword) return undefined;

    const searchResults: AnimeModuleInfo[] = [];
    const data = await anilist.search.anime(keyword);

    if (!data?.data) return undefined;

    data?.data?.Page?.media.forEach((item) => {
      searchResults.push({
        id: item?.id.toString(),
        malId: item?.idMal?.toString(),
        title: {
          romaji: item?.title.romaji!,
          english: item?.title.english!,
          native: item?.title.native!,
          userPreferred: item?.title.userPreferred!,
        },
        synonyms: (item as any)?.synonyms,
        currentEpisode: item?.episodes,
        bannerImage: item?.bannerImage,
        coverImage: item?.coverImage?.large,
        color: item?.coverImage.large,
        season: item?.season as Season,
        year: item.startDate.year ?? item?.seasonYear,
        status: item?.status as any,
        genres: item?.genres as Genres[],
        description: item?.description,
        format: item?.format as Format,
        duration: item?.duration,
        trailer: undefined,
        countryOfOrigin: null,
        tags: item?.tags?.map((tag) => tag.name),
        rating: item?.averageScore,
        popularity: item?.popularity,
      });
    });

    return searchResults;
  }

  async getMedia(id: string): Promise<AnimeModuleInfo | undefined> {
    if (!id) return undefined;
    const data: any = await anilist.media.anime(parseInt(id));

    if (!data?.data) return undefined;

    const item = data?.data?.Media;

    const info: AnimeModuleInfo = {
      id: item?.id.toString(),
      malId: item?.idMal?.toString(),
      title: {
        romaji: item?.title.romaji!,
        english: item?.title.english!,
        native: item?.title.native!,
        userPreferred: item?.title.userPreferred!,
      },
      synonyms: (item as any)?.synonyms,
      currentEpisode: item?.nextAiringEpisode?.episode
        ? item.nextAiringEpisode?.episode - 1
        : item.Media?.episodes,
      totalEpisodes: item?.episodes ?? item?.nextAiringEpisode?.episode - 1,
      bannerImage: item?.bannerImage,
      coverImage:
        item?.coverImage?.extraLarge ?? item?.coverImage?.large ?? item?.coverImage?.medium,
      color: item?.coverImage?.color,
      season: item?.season as Season,
      year: item.startDate.year ?? item?.seasonYear,
      status: item?.status as any,
      genres: item?.genres as Genres[],
      description: item?.description,
      format: item?.format as Format,
      duration: item?.duration,
      trailer:
        {
          id: item?.trailer.id,
          site: item?.trailer?.site,
          thumbnail: item?.trailer?.thumbnail,
        } ?? undefined,
      countryOfOrigin: item.countryOfOrigin ?? undefined,
      tags: item?.tags?.map((tag: any) => tag.name),
      rating: item?.averageScore,
      popularity: item?.popularity,
    };

    return info;
  }
}

export default Anilist;
