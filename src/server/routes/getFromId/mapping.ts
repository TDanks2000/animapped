import { FastifyInstance, RegisterOptions } from "fastify";
import { prisma } from "../../utils";
import { NO_DATA_ANIME } from "../../utils/errors";
import { checkForApiKey } from "../../helpers";

const routes = async (fastify: FastifyInstance, options: RegisterOptions) => {
  fastify.get("/gogoanime/:gogoanime_id", async (request, reply) => {
    await checkForApiKey(request, reply);

    const { gogoanime_id } = request.params as {
      gogoanime_id: string;
    };

    try {
      const anime: any = await prisma.$queryRaw`
      SELECT * FROM "Anime"
      WHERE mappings->>'gogoanime' ILIKE ${`%"${gogoanime_id}"%`}
    `;

      if (anime.length > 0) {
        return reply.send({ found: true, ...anime[0] }); // Return the first anime if found
      } else {
        return reply.status(404).send(NO_DATA_ANIME); // Return a 404 if anime not found
      }
    } catch (error) {
      console.error("Error retrieving anime:", error);
      return reply.status(500).send({ found: false, message: "Internal Server Error" }); // Return a 500 for any other error
    }
  });

  fastify.get("/kaa/:kaa_id", async (request, reply) => {
    await checkForApiKey(request, reply);

    const { kaa_id } = request.params as {
      kaa_id: string;
    };

    try {
      const anime: any = await prisma.$queryRaw`
      SELECT * FROM "Anime"
      WHERE mappings->>'kickassanime' ILIKE ${`%"${kaa_id}"%`}
    `;

      if (anime.length > 0) {
        return reply.send({ found: true, ...anime[0] }); // Return the first anime if found
      } else {
        return reply.status(404).send(NO_DATA_ANIME); // Return a 404 if anime not found
      }
    } catch (error) {
      console.error("Error retrieving anime:", error);
      return reply.status(500).send({ found: false, message: "Internal Server Error" }); // Return a 500 for any other error
    }
  });

  fastify.get("/aniwatch/:aniwatch_id", async (request, reply) => {
    await checkForApiKey(request, reply);

    const { aniwatch_id } = request.params as {
      aniwatch_id: string;
    };

    try {
      const anime: any = await prisma.$queryRaw`
      SELECT * FROM "Anime"
      WHERE mappings->>'aniwatch' ILIKE ${`%"${aniwatch_id}"%`}
    `;

      if (anime.length > 0) {
        return reply.send({ found: true, ...anime[0] }); // Return the first anime if found
      } else {
        return reply.status(404).send(NO_DATA_ANIME); // Return a 404 if anime not found
      }
    } catch (error) {
      console.error("Error retrieving anime:", error);
      return reply.status(500).send({ found: false, message: "Internal Server Error" }); // Return a 500 for any other error
    }
  });
};

export default routes;
