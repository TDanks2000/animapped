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
