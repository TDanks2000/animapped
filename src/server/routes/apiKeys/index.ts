import { FastifyInstance, RegisterOptions } from "fastify";
import { prisma } from "../../utils";
import { generateUniqueApiKey } from "../../helpers";
import { Unauthorized, NotFound } from "http-errors";

type CreateApiKeyData = {
  discord_id: string;
};

const routes = async (fastify: FastifyInstance, options: RegisterOptions) => {
  const db = prisma.apiKeys;

  fastify.put("/", async (request, reply) => {
    const body = request.body as CreateApiKeyData;
    const discord_id = body?.discord_id;

    if (!discord_id) {
      return reply.send(Unauthorized("You have not specified a discord id to link the api key to"));
    }

    const find_discord_id = await db.findUnique({
      where: {
        discord_id,
      },
    });

    if (find_discord_id) {
      return reply.send(Unauthorized("Discord ID already exists"));
    }

    // Generate a unique API key
    const apiKeyLength = 32; // Adjust the length as needed
    let apiKey = await generateUniqueApiKey(apiKeyLength);

    try {
      // Add the API key to the database
      await db.create({
        data: {
          api_key: apiKey,
          discord_id,
          is_admin: false,
        },
      });

      console.log("API key created:", apiKey);
      return { apiKey };
    } catch (error) {
      const prismaError = error as { code: string; meta?: { target: string[] } };
      // Handle the case where the API key is not unique and regenerate it
      if (prismaError.code === "P2002" && prismaError.meta?.target?.includes("apiKey")) {
        console.log("API key is not unique, regenerating...");
        apiKey = await generateUniqueApiKey(apiKeyLength);
        await db.create({
          data: {
            api_key: apiKey,
            discord_id,
            // Add other data as needed for your use case
          },
        });
        console.log("Regenerated API key:", apiKey);
        return { apiKey };
      }

      console.error("Error creating API key:", error);
      throw new Error("Unable to create API key");
    }
  });

  fastify.delete("/", async (request, reply) => {
    const params = request.body as CreateApiKeyData;
    if (!params.discord_id) {
      return reply.send(
        Unauthorized(
          "You have not specified a discord id to delete the api key that is linked to the discord id"
        )
      );
    }

    const doesExist = await db.findUnique({
      where: {
        discord_id: params.discord_id,
      },
    });

    if (!doesExist) return reply.send(NotFound("Discord ID does not exist"));

    const didDelete = await db.deleteMany({
      where: {
        discord_id: params.discord_id,
      },
    });

    if (didDelete) {
      return reply.send({
        message: `Delted API Key for ${params.discord_id}`,
      });
    }
  });
};

export default routes;
