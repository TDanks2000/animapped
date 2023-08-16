import fs from "node:fs";
import path from "node:path";
import axios from "axios";

const last_id_filePath = path.join(__dirname, "..", "../last_id.txt");

export const getId = async () => {
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

  return id;
};

export const updateId = (id: string) => {
  let last_id_file = fs.existsSync(last_id_filePath);
  if (!last_id_file) fs.writeFileSync(last_id_filePath, "0");
  fs.writeFileSync(last_id_filePath, id);
};
