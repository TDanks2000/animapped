import "dotenv/config";

import { Mapping } from "./mappings/mapping";
import { Server } from "./server/main";
import { env } from "process";

const shouldDisableMapping = Boolean(env.DISABLE_MAPPING) ?? false;

(async () => {
  const mapping = new Mapping();
  const server = new Server();

  if (!shouldDisableMapping) {
    await mapping.start().catch((err) => {
      console.log("Error starting mapping: ", err);
    });
  }

  await server.start().catch((err) => {
    console.error("Error starting server: ", err);
  });
})();
