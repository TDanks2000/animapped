import fs from "node:fs";
import path from "node:path";
import axios from "axios";
import { closest, distance } from "fastest-levenshtein";
import { AnimeModuleInfo, BaseAnimeModule, ModuleResult, TitleLanguageOptions } from "../@types";
import { getTitle } from "../utils";

const last_id_filePath = path.join(__dirname, "..", "../last_id.txt");
const ids_path = path.join(__dirname, "..", "../ids.txt");

export const getId = async (typeToGet: "index" | "id" = "id") => {
  let last_id_file = fs.existsSync(last_id_filePath);
  let last_id: string = "0";

  if (!last_id_file) fs.writeFileSync(last_id_filePath, "0");
  else last_id = fs.readFileSync(last_id_filePath, "utf-8");

  let { data: ids } = await axios.get(
    "https://raw.githubusercontent.com/inumakieu/IDFetch/main/ids.txt"
  );
  ids = ids.split("\n");

  let id = ids[0];
  if (parseInt(last_id) > 0) {
    const id_find = ids.find((id: string) => id === last_id);
    if (id_find) id = id_find;
  }

  return typeToGet === "index" ? ids.indexOf(last_id) : id;
};

export const updateId = (id: string) => {
  let last_id_file = fs.existsSync(last_id_filePath);
  if (!last_id_file) fs.writeFileSync(last_id_filePath, "0");
  fs.writeFileSync(last_id_filePath, id);
};

export const matchMedia = async (searchFrom: AnimeModuleInfo, module: BaseAnimeModule) => {
  let matches: ModuleResult[] = [];

  let language: TitleLanguageOptions = "english";
  let title = getTitle(searchFrom.title)!;
  let searchThrough = await module.search(title);
  await search(searchFrom, searchThrough!, "title", matches);

  if (matches.length <= 0) {
    language = "userPreferred";
    title = getTitle(searchFrom.title, language)!;
    searchThrough = await module.search(title);
    await search(searchFrom, searchThrough!, "title", matches, {
      titleLanguage: "userPreferred",
    });
  }

  if (matches.length > 2) await search(searchFrom, searchThrough!, "year", matches);

  return matches;
};

const search = async (
  searchFrom: AnimeModuleInfo,
  searchThrough: ModuleResult[],
  searchingFor: "title" | "year" = "title",
  matches: ModuleResult[],
  extraData?: {
    titleLanguage?: TitleLanguageOptions;
    customTitle?: string;
    checkDub?: boolean;
  }
) => {
  let searchFromTitle = getTitle(searchFrom.title, extraData?.titleLanguage)!;
  if (extraData?.customTitle) searchFromTitle = getTitle(extraData.customTitle)!;

  switch (searchingFor) {
    case "title":
      for await (const item of searchThrough!) {
        let title = item.title?.toLowerCase() ?? item.altTitles!?.[0]?.toLowerCase();

        if (!title) return;
        if (title?.includes("dub")) {
          const dubTitle = removeDubFromTitle(item.title);
          const distanceFrom = distance(searchFromTitle, dubTitle);
          if (distanceFrom <= parseInt(process.env.DISTANCE!)) matches.push(item);
        }
        const distanceFrom = distance(searchFromTitle, title);

        if (distanceFrom <= parseInt(process.env.DISTANCE!)) matches.push(item);
      }
      break;
    case "year":
      for await (const item of searchThrough!) {
        if (Number(item.year) === Number(searchFrom.year)) matches.push(item);
      }
      break;
    default:
      break;
  }
};

export const goThroughList = async (last_id_index: number, mapFN: Function) => {
  const does_ids_exist = fs.existsSync(ids_path);

  if (!does_ids_exist) {
    let { data: ids } = await axios.get(
      "https://raw.githubusercontent.com/inumakieu/IDFetch/main/ids.txt"
    );
    fs.writeFileSync(ids_path, ids);
  }

  let ids: any = fs.readFileSync(ids_path, "utf-8");
  ids = ids.split("\n");

  let id = ids[last_id_index];
};

const removeDubFromTitle = (title: string) => {
  let realTitle = title.toLowerCase();
  realTitle = realTitle.replace(/dub|[\(\)]/g, "");
  return realTitle;
};
