import { PrismaClient, Prisma } from "@prisma/client";
import { AnimeData } from "../@types";
import Console from "@tdanks2000/fancyconsolelog";
const console = new Console();
type Data = AnimeData;

export class Database extends PrismaClient {
  constructor() {
    super();
  }

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

    this.animeV2.update({
      where: {
        anilist_id: data.anilist_id,
      },
      data: {
        mappings: data.mappings,
      },
    });
  };
}

export default Database;
