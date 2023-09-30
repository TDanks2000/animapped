import fs from "node:fs";
import path from "node:path";
import axios from "axios";

const last_id_filePath = path.join(__dirname, "..", "../last_id.txt");
const ids_path = path.join(__dirname, "..", "../ids.txt");

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
  for (let i = last_id_index; i < ids.length; i++) {
    let id = ids[i];
    await mapFN(id);
  }
};
