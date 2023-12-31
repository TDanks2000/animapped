import { FastifyInstance, RegisterOptions } from "fastify";
import { prisma } from "../../utils";
import { checkIfAdmin, generateUniqueApiKey } from "../../helpers";
import { Unauthorized, NotFound } from "http-errors";

type CreateApiKeyData = {
  discord_id: string;
};

const routes = async (fastify: FastifyInstance, options: RegisterOptions) => {
  const db = prisma.apiKeys;

  fastify.get("/", async (request, reply) => {
    await checkIfAdmin(request, reply);

    const { discord_id } = request.query as {
      discord_id: string;
    };

    const data = await db.findUnique({
      where: {
        discord_id,
      },
    });

    if (!data) return NotFound("Discord ID does not exist");

    return reply.send({
      message: `your api key is ${data.api_key}`,
    });
  });

  fastify.put("/", async (request, reply) => {
    await checkIfAdmin(request, reply);

    const body = request.body as CreateApiKeyData;
    const discord_id = body?.discord_id;

    if (!discord_id) {
      return reply.send(
        Unauthorized("You haven't provided a Discord ID to associate with the API key.")
      );
    }

    const find_discord_id = await db.findUnique({
      where: {
        discord_id,
      },
    });

    if (find_discord_id) {
      return reply.send(Unauthorized("The Discord ID already exists."));
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
    await checkIfAdmin(request, reply);

    const body = request.body as CreateApiKeyData;
    if (!body.discord_id) {
      return reply.send(
        Unauthorized("You haven't specified a Discord ID to remove the API key associated with it.")
      );
    }

    const doesExist = await db.findUnique({
      where: {
        discord_id: body.discord_id,
      },
    });

    if (!doesExist) return reply.send(NotFound("Discord ID does not exist"));

    const didDelete = await db.deleteMany({
      where: {
        discord_id: body.discord_id,
      },
    });

    if (didDelete) {
      return reply.send({
        message: `Delted API Key for ${body.discord_id}`,
      });
    }
  });
};

export default routes;
