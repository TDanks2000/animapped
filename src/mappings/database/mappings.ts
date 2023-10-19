import { StateManager } from "./../utils/StateManager";
import { PrismaClient, Prisma } from "@prisma/client";
import { AnimeData } from "../@types";
import Console from "@tdanks2000/fancyconsolelog";
const console = new Console();
type Data = AnimeData;

export class Database extends PrismaClient {
  private stateManager: StateManager;

  constructor(stateManager: StateManager) {
    super();
    this.stateManager = stateManager;
  }

  public fillOldIds = async () => {
    const db = this.animeV2;

    const data = await db.findMany();

    if (!data) return;

    this.stateManager.clearOldIds();
    for await (const anime of data) {
      this.stateManager.oldIds.set(anime.anilist_id, anime);
    }
  };

  public FillWithData = async (data: Data) => {
    const findById = await this.animeV2.findFirst({
      where: {
        anilist_id: data.anilist_id,
      },
    });

    if (!findById?.anilist_id) {
      try {
        await this.animeV2.create({
          data: {
            anilist_id: data.anilist_id,
            title: data.title,
            year: data.year,
            mal_id: data.mal_id,
            mappings: data.mappings,
          },
        });
        console.info(`added ${data.title} to database`);
      } catch (error) {
        console.error(error);
        console.warn(`${data.title} already in database`);
        return;
      }
    } else {
      console.warn(`${data.title} already in database`);
    }
  };

  public addMappings = async (data: Data) => {
    // const findById = await this.anime.findFirst({
    //   where: {
    //     anilist_id: data.anilist_id,
    //   },
    // });

    await this.animeV2.updateMany({
      where: {
        anilist_id: data?.anilist_id,
      },
      data: {
        mappings: data.mappings,
      },
    });

    return;

    await this.animeV2.deleteMany({
      where: {
        anilist_id: data?.anilist_id,
      },
    });

    await this.animeV2.create({
      data: {
        anilist_id: data.anilist_id,
        title: data.title,
        year: data.year,
        mal_id: data.mal_id,
        mappings: data.mappings,
      },
    });
  };
}

export default Database;
