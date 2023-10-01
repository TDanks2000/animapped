import "dotenv/config";

import { Mapping } from "./mappings/main";
import { Server } from "./server/main";
import { env } from "process";
import figlet from "figlet";
import Console from "@tdanks2000/fancyconsolelog";

const c = new Console();

const shouldDisableMapping = env.DISABLE_MAPPING === "true" ?? false;

class Start {
  async start() {
    const server = new Server();

    await server.start().catch((err) => {
      console.error("Error starting server: ", err);
    });

    if (!shouldDisableMapping) {
      const mapping = new Mapping();

      await mapping.startMapping().catch((err) => {
        console.log("Error starting mapping: ", err);
      });
    }
  }
}

(async () => {
  figlet.text(
    "AniMapped",
    {
      font: "Big",
      horizontalLayout: "default",
      verticalLayout: "default",
      whitespaceBreak: true,
    },
    async function (err, data) {
      if (err) {
        console.log("Something went wrong...");
        console.dir(err);
        return;
      }

      c.setColor("yellowBright");
      c.log(data);
      console.log("\n");

      const start = new Start();
      await start.start();
    }
  );
})();
