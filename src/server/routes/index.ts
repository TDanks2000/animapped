import { FastifyInstance, RegisterOptions } from "fastify";

import getFromId_info from "./getFromId/info";
import getFromId_mappings from "./getFromId/mapping";
import stats from "./stats";
import apiKeys from "./apiKeys";

const routes = async (fastify: FastifyInstance, options: RegisterOptions) => {
  fastify.get("/", async (request, reply) => {
    return { message: "Hello World" };
  });

  /**
   * GET FROM ID
   */
  fastify.register(getFromId_info);
  fastify.register(getFromId_mappings);

  /**
   * STATS
   */
  fastify.register(stats, {
    prefix: "/stats",
  });
  /**
   *
   * APIKEYS
   */
  fastify.register(apiKeys, {
    prefix: "/apiKey",
  });
};

export default routes;
