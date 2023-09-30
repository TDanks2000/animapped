import { FastifyInstance, RegisterOptions } from "fastify";

import getFromId_info from "./getFromId/info";
import getFromId_mappings from "./getFromId/mapping";

const routes = async (fastify: FastifyInstance, options: RegisterOptions) => {
  fastify.get("/", async (request, reply) => {
    return { message: "Hello World" };
  });

  /**
   * INFO
   */
  fastify.register(getFromId_info);
  fastify.register(getFromId_mappings);
};

export default routes;
