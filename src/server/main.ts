import Console from "@tdanks2000/fancyconsolelog";
import { start as startServer } from "./utils";

const console = new Console();

class Server {
  async start() {
    console.info(`starting the animapped server...`);
    await startServer();
    console.info(`started the animapped server!!!`);
  }
}

export { Server };
