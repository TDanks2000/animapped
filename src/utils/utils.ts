import { ITitleLanguageOptions, TitleLanguageOptions } from "../@types";

export const USER_AGENT = `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.120 Safari/537.36`;

export const getTitle = (
  title: string | ITitleLanguageOptions,
  preferedLanguage?: TitleLanguageOptions
): string | undefined => {
  if (typeof title === "string") return title.toLowerCase();
  if (!title) return undefined;

  if (preferedLanguage)
    return (
      Object.entries(title)
        .find(([key]) => key === preferedLanguage)?.[1]
        .toLowerCase() ?? undefined
    );

  return (
    title.english?.toLowerCase() ??
    title.userPreferred.toLowerCase() ??
    title.native.toLowerCase() ??
    title?.romaji.toLowerCase() ??
    undefined
  );
};

export const delay = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
