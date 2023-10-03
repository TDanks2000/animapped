import { Unauthorized, NotFound, Forbidden } from "http-errors";
import { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../../utils";

export const generateUniqueApiKey = async (length: number): Promise<string> => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let apiKey = "";

  for (let i = 0; i < length; i++) {
    apiKey += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  // Check if the generated API key is unique
  const existingApiKey = await prisma.apiKeys.findUnique({ where: { api_key: apiKey } });
  if (existingApiKey) {
    // If not unique, regenerate API key and try again
    return generateUniqueApiKey(length);
  }

  return apiKey;
};

export const checkIfAdmin = async (request: FastifyRequest, reply: FastifyReply) => {
  const query = request.query as { api_key: string };
  const { api_key } = query;

  if (!api_key) {
    return reply.send(
      Forbidden(
        "You haven't provided an API key, so we're unable to delete the associated API key linked to the Discord ID."
      )
    );
  }

  const find_api_key = await prisma.apiKeys.findUnique({
    where: {
      api_key,
    },
  });

  if (!find_api_key) {
    return reply.send(NotFound("The specified API key does not exist."));
  }

  if (!find_api_key.is_admin) {
    return reply.send(Unauthorized("You do not have administrator privileges."));
  }
};
