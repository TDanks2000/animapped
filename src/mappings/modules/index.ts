import { ModuleList } from "../@types";
import Anime from "./anime";
import Manga from "./manga";
import Meta from "./meta";

export const MODULES: ModuleList = {
  anime: [
    new Anime.Kickassanime(),
    new Anime.Gogoanime(),
    new Anime.Aniwatch(),
    new Anime.AnimePahe(),
    new Anime.AllAnime(),
  ],
  meta: [new Meta.Anilist()],
  manga: [new Manga.MangaSee()],
};
