import { ModuleList } from "../@types";
import Anime from "./anime";
import Meta from "./meta";

export const MODULES: ModuleList = {
  anime: [new Anime.Kickassanime(), new Anime.Gogoanime()],
  meta: [new Meta.Anilist()],
};
