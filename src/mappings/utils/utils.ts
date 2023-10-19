import { ITitleLanguageOptions, TitleLanguageOptions } from "../@types";

export const USER_AGENT = `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.120 Safari/537.36`;

export const getTitle = async (
  title: string | ITitleLanguageOptions,
  preferedLanguage?: TitleLanguageOptions
): Promise<string | undefined> => {
  if (typeof title === "string") return title.toLowerCase();
  if (!title) return undefined;

  if (preferedLanguage) {
    return (
      (await Object.entries(title)
        .find(([key]) => key?.toLowerCase() === preferedLanguage?.toLowerCase())?.[1]
        ?.toLowerCase()) ?? undefined
    );
  }

  return (
    title?.english?.toLowerCase() ??
    title?.userPreferred?.toLowerCase() ??
    title?.native?.toLowerCase() ??
    title?.romaji?.toLowerCase() ??
    undefined
  );
};

export const delay = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const substringBefore = (string: string, toFind: string) => {
  const index = string.indexOf(toFind);
  return index == -1 ? "" : string.substring(0, index);
};

export const substringAfter = (string: string, toFind: string) => {
  const index = string.indexOf(toFind);
  return index == -1 ? "" : string.substring(index + toFind.length);
};

export const areObjectsSame = (obj1: any, obj2: any): boolean => {
  try {
    if (typeof obj1 !== "object" || typeof obj2 !== "object") {
      return obj1 === obj2;
    }

    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) {
      return false;
    }

    for (const key of keys1) {
      if (!keys2.includes(key)) {
        return false;
      }

      if (!areObjectsSame(obj1[key], obj2[key])) {
        return false;
      }
    }

    return true;
  } catch (error) {
    return false;
  }
};
