import fs from "node:fs";
import path from "node:path";
import axios from "axios";
import { closest, distance } from "fastest-levenshtein";
import {
  AnimeModuleInfo,
  BaseAnimeModule,
  ModuleIds,
  ModuleResult,
  TitleLanguageOptions,
} from "../@types";
import { delay, getTitle } from "../utils";
import Console from "@tdanks2000/fancyconsolelog";

type MATCHES = ModuleResult & { diffrence?: number };

const last_id_filePath = path.join(__dirname, "..", "../last_id.txt");
const ids_path = path.join(__dirname, "..", "../ids.txt");
let checkedYear: boolean = false;

export const getId = async (typeToGet: "index" | "id" = "id") => {
  let last_id_file = fs.existsSync(last_id_filePath);
  let last_id: string = "0";

  if (!last_id_file) fs.writeFileSync(last_id_filePath, "0");
  else last_id = fs.readFileSync(last_id_filePath, "utf-8");

  if (!fs.existsSync(ids_path)) {
    let { data: ids } = await axios.get(
      "https://raw.githubusercontent.com/inumakieu/IDFetch/main/ids.txt"
    );
    fs.writeFileSync(ids_path, ids);
  }
  let ids: any = fs.readFileSync(ids_path, "utf-8");

  ids = ids.split("\n");
  let id = ids[0];
  if (parseInt(last_id) > 0) {
    const id_find = ids.find((id: string) => id === last_id);
    if (id_find) id = id_find;
  }

  return typeToGet === "index" ? ids.indexOf(last_id) : id;
};

export const getNextId = async (id: string) => {
  let last_id_file = fs.existsSync(last_id_filePath);
  let last_id: string = "0";

  if (!last_id_file) fs.writeFileSync(last_id_filePath, "0");
  else last_id = fs.readFileSync(last_id_filePath, "utf-8");

  if (!fs.existsSync(ids_path)) {
    let { data: ids } = await axios.get(
      "https://raw.githubusercontent.com/inumakieu/IDFetch/main/ids.txt"
    );
    fs.writeFileSync(ids_path, ids);
  }
  let ids: any = fs.readFileSync(ids_path, "utf-8");

  ids = ids.split("\n");
  let id_index = ids.indexOf(id);
  let next_id = ids[id_index + 1];

  if (!next_id) return undefined;

  return next_id;
};

export const updateId = (id: string) => {
  let last_id_file = fs.existsSync(last_id_filePath);
  if (!last_id_file) fs.writeFileSync(last_id_filePath, "0");
  fs.writeFileSync(last_id_filePath, id);
};

export const matchMedia = async (searchFrom: AnimeModuleInfo, module: BaseAnimeModule) => {
  checkedYear = false;
  let matches: MATCHES[] = [];
  const console = new Console();
  const start = new Date(Date.now());

  let language: TitleLanguageOptions = "english";
  let title = (await getTitle(searchFrom.title))!;

  console.info(`Searching ${module.name} for ${title}`);

  let searchThrough = await module.search(title);

  await search(searchFrom, searchThrough!, "title", matches);

  if (!matches || matches.length <= 0) {
    language = "romaji";
    title = (await getTitle(searchFrom.title, language))!;
    searchThrough = await module.search(title);
    await search(searchFrom, searchThrough!, "title", matches, {
      titleLanguage: "romaji",
    });
  }

  if (
    matches.length > 2 &&
    searchFrom.year &&
    module.id === ModuleIds.Gogoanime &&
    checkedYear === false
  ) {
    checkedYear = true;
    await search(searchFrom, matches, "year", matches);
  }
  if (
    matches.length >= 2 &&
    searchFrom.year &&
    module.id !== ModuleIds.Gogoanime &&
    checkedYear === false
  ) {
    checkedYear = true;
    await search(searchFrom, matches!, "year", matches);
  }

  matches = matches.sort((a, b) => {
    if (a.diffrence! > b.diffrence!) return 1;
    if (a.diffrence! < b.diffrence!) return -1;
    return 0;
  });

  if (module.doesDubHaveSeprateID) {
    let maxMatches = 2;
    if (matches.length > maxMatches) matches = matches.slice(0, maxMatches);
  } else {
    let maxMatches = 1;
    if (matches.length > maxMatches) matches = matches.slice(0, maxMatches);
  }

  if (matches.length > 0) {
    const end = new Date(Date.now());
    const matchedIn = end.getTime() - start.getTime();
    console.info(`Matched ${await getTitle(searchFrom.title)}, ${module.name} in ${matchedIn}ms`);
  } else {
    const end = new Date(Date.now());
    const matchedIn = end.getTime() - start.getTime();
    console.info(
      `Not found any Mappings for ${await getTitle(searchFrom.title)}, ${
        module.name
      } in ${matchedIn}ms`
    );
  }

  return matches;
};

const search = async (
  searchFrom: AnimeModuleInfo,
  searchThrough: ModuleResult[],
  searchingFor: "title" | "year" = "title",
  matches: MATCHES[],
  extraData?: {
    titleLanguage?: TitleLanguageOptions;
    customTitle?: string;
    checkDub?: boolean;
  }
) => {
  let searchFromTitle = (await getTitle(searchFrom.title, extraData?.titleLanguage))!;
  if (extraData?.customTitle) searchFromTitle = (await getTitle(extraData.customTitle))!;

  switch (searchingFor) {
    case "title":
      for await (const item of searchThrough!) {
        let title = item.title?.toLowerCase() ?? item.altTitles!?.[0]?.toLowerCase();

        if (!title) return;
        if (title?.includes("dub") || title.includes("[raw]")) {
          const cleanTitle = cleanUpTitle(item.title);
          const distanceFrom = distance(searchFromTitle, cleanTitle);
          if (distanceFrom <= parseInt(process.env.DISTANCE!))
            matches.push({
              ...item,
              diffrence: distanceFrom,
            });
        }
        const distanceFrom = distance(searchFromTitle, title);

        if (distanceFrom <= parseInt(process.env.DISTANCE!)) matches.push(item);
      }
      break;
    case "year":
      let newMatches: MATCHES[] = [];
      for await (const item of matches!) {
        if (item.year === searchFrom.year) newMatches.push(item);
      }
      matches = newMatches;
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

  // start looping through ids starting from id
  for (let i = last_id_index - 1; i < ids.length; i++) {
    let id = ids[i];
    await mapFN(id);
  }
};

const removeDubFromTitle = (title: string) => {
  let realTitle = title.toLowerCase();
  realTitle = realTitle.replace(/dub|[\(\)]/g, "");
  return realTitle;
};

const cleanUpTitle = (title: string) => {
  let realTitle = removeDubFromTitle(title);
  realTitle = realTitle.replace(/\[RAW\]\s*/g, "");
  return realTitle;
};
