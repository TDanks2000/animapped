import axios from "axios";
import { BaseAnimeModule, Format, ModuleIds, ModuleResult, VoiceType } from "../../@types";

class AllAnime extends BaseAnimeModule {
  id: ModuleIds = ModuleIds.AllAnime;
  name: string = "allanime";
  url: string = "https://allanime.to";

  doesDubHaveSeprateID: boolean = false;

  protected apiURL: string = "https://api.allanime.day/api";
  private searchHash = "06327bc10dd682e1ee7e07b6db9c16e9ad2fd56c1b769e47513128cd5c9fc77a";

  async search(keyword: string, page?: number | undefined): Promise<ModuleResult[] | undefined> {
    const searchResult: ModuleResult[] = [];

    const variables = `{"search":{"query":"${keyword}"},"translationType":"sub"}`;

    try {
      const data = await this.graphqlQuery<AllAnimeSearch>(variables, this.searchHash);
      const edges = data?.data?.shows?.edges;

      if (!edges) return searchResult;

      edges.map((item) => {
        searchResult.push({
          id: item?._id,
          title: item.englishName!,
          year: item?.airedStart.year! ?? 0,
          altTitles: [item.nativeName!, item.name!],
          format: item?.type as Format,
          image: item?.thumbnail,
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

  private async graphqlQuery<T>(variables: string, persistHash: string): Promise<T | null> {
    const extensions = `{"persistedQuery":{"version":1,"sha256Hash":"${persistHash}"}}`;

    const url = `${this.apiURL}?variables=${variables}&extensions=${extensions}`;

    const headers = {
      Origin: "https://allanime.to",
    };

    try {
      const response = await axios.get<T>(url, {
        headers,
      });
      return response.data;
    } catch (error) {
      throw new Error(`Error making GraphQL query:, ${(error as Error).message}`);
    }
  }
}

export default AllAnime;

interface AllAnimeSearch {
  data: AllAnimeSearchData;
}

interface AllAnimeSearchData {
  shows: AllAnimeSearchShows;
}

interface AllAnimeSearchShows {
  pageInfo: PageInfo;
  edges: AllAnimeSearchEdge[];
}

interface AllAnimeSearchEdge {
  _id: string;
  name: string;
  englishName: null | string;
  nativeName: null | string;
  slugTime: null;
  thumbnail: string;
  lastEpisodeInfo: LastEpisodeInfo;
  lastEpisodeDate: LastEpisodeDate;
  type: null | string;
  season: Season | null;
  score: number | null;
  airedStart: AiredStart;
  availableEpisodes: AvailableEpisodes;
  episodeDuration: null | string;
  episodeCount: null | string;
  lastUpdateEnd: Date;
}

interface AiredStart {
  hour?: number;
  minute?: number;
  year?: number;
  month?: number;
  date?: number;
}

interface AvailableEpisodes {
  sub: number;
  dub: number;
  raw: number;
}

interface LastEpisodeDate {
  dub: AiredStart;
  sub: AiredStart;
  raw: AiredStart;
}

interface LastEpisodeInfo {
  sub: Raw;
  dub?: Dub;
  raw?: Raw;
}

interface Dub {
  episodeString: string;
  notes?: string;
}

interface Raw {
  episodeString: string;
}

interface Season {
  quarter: string;
  year: number;
}

interface PageInfo {
  total: null;
}
