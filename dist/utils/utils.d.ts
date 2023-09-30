import { ITitleLanguageOptions, TitleLanguageOptions } from "../@types";
export declare const USER_AGENT = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.120 Safari/537.36";
export declare const getTitle: (title: string | ITitleLanguageOptions, preferedLanguage?: TitleLanguageOptions) => Promise<string | undefined>;
export declare const delay: (ms: number) => Promise<unknown>;
export declare const substringBefore: (string: string, toFind: string) => string;
export declare const substringAfter: (string: string, toFind: string) => string;
