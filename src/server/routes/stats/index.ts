import { FastifyInstance, RegisterOptions } from "fastify";
import { prisma } from "../../utils";

const routes = async (fastify: FastifyInstance, options: RegisterOptions) => {
  const db = prisma.anime;

  fastify.get("/", async (request, reply) => {
    try {
      const data = await db.count();

      reply.send({
        anime: data,
      });
    } catch (error) {
      return reply.send({
        message: "there was an error getting the data",
      });
    }
  });
};

export default routes;
