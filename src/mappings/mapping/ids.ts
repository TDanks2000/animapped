import fs from "node:fs";
import path from "node:path";
import axios from "axios";

class IdManager {
  private lastIdFilePath: string;
  private idsFilePath: string;

  constructor() {
    this.lastIdFilePath = path.join(__dirname, "..", "..", "../last_id.txt");
    this.idsFilePath = path.join(__dirname, "..", "..", "../ids.txt");
  }

  private readFileContent(filePath: string): string {
    return fs.readFileSync(filePath, "utf-8");
  }

  private writeFileContent(filePath: string, content: string): void {
    fs.writeFileSync(filePath, content);
  }

  public async getId(typeToGet: "index" | "id" = "id"): Promise<number | string> {
    let lastIdFileExists = fs.existsSync(this.lastIdFilePath);
    let lastId: string = "0";

    if (lastIdFileExists) {
      lastId = fs.readFileSync(this.lastIdFilePath, "utf-8").trim();
    } else {
      // If the file doesn't exist, create it with an initial value of 0
      fs.writeFileSync(this.lastIdFilePath, lastId, "utf-8");
    }

    if (!fs.existsSync(this.idsFilePath)) {
      let { data: ids } = await axios.get(
        "https://raw.githubusercontent.com/inumakieu/IDFetch/main/ids.txt"
      );
      fs.writeFileSync(this.idsFilePath, ids, "utf-8");
    }

    let ids: string = fs.readFileSync(this.idsFilePath, "utf-8");

    let id: string;

    if (typeToGet === "index") {
      const index = ids.split("\n").indexOf(lastId);

      if (index === -1) {
        console.log("Last ID not found in the list.");
        return "0"; // Fallback to starting at index 0 if last ID is not found
      }
      id = index.toString();
    } else {
      id = lastId;
    }

    return id;
  }

  public async getNextId(id: string): Promise<string | undefined> {
    const lastIdFileExists = fs.existsSync(this.lastIdFilePath);
    const lastId = lastIdFileExists ? this.readFileContent(this.lastIdFilePath) : "0";

    if (!fs.existsSync(this.idsFilePath)) {
      const { data: ids } = await axios.get(
        "https://raw.githubusercontent.com/inumakieu/IDFetch/main/ids.txt"
      );
      this.writeFileContent(this.idsFilePath, ids);
    }
    const idsList = this.readFileContent(this.idsFilePath).split("\n");

    const idIndex = idsList.indexOf(lastId);
    const nextId = idsList[idIndex + 1];

    if (!nextId) return undefined;

    return nextId;
  }

  public updateId(id: string): void {
    const lastIdFileExists = fs.existsSync(this.lastIdFilePath);
    if (!lastIdFileExists) this.writeFileContent(this.lastIdFilePath, "0");
    this.writeFileContent(this.lastIdFilePath, id);
  }

  public async goThroughList(lastId: string, mapFN: Function): Promise<void> {
    const doesIdsExist = fs.existsSync(this.idsFilePath);

    if (!doesIdsExist) {
      let { data: ids } = await axios.get(
        "https://raw.githubusercontent.com/inumakieu/IDFetch/main/ids.txt"
      );
      fs.writeFileSync(this.idsFilePath, ids);
    }

    let ids: string | string[] = fs.readFileSync(this.idsFilePath, "utf-8");
    ids = ids.split("\n");

    let lastIdIndex = ids.indexOf(lastId);
    if (lastIdIndex === -1) lastIdIndex = 0;

    for (let i = lastIdIndex; i < ids.length; i++) {
      let id = ids[i];
      await mapFN(id);
    }
  }
}

export default IdManager;
