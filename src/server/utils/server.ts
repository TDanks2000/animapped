import * as config from "./config.json";

import FastifyCors from "@fastify/cors";
import Fastify from "fastify";
import bodyParser from "@fastify/formbody";

import routes from "../routes";
import Logger from "./logger";

export const start = async () => {
  const app = Fastify({
    maxParamLength: 1000,
  });

  app.register(Logger);
  app.register(FastifyCors, {
    origin: "*",
  });
  app.register(bodyParser);

  app.register(routes, {
    prefix: "/api",
  });

  const PORT = Number(config.PORT) ?? 5001;

  app.listen({ port: PORT, host: "0.0.0.0" }, (err, address) => {
    if (err) {
      app.log.error(err);
      process.exit(1);
    }
  });
};
