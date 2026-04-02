import en from "./en";
import zh from "./zh";

export const messagesByLocale = {
  en,
  zh,
} as const;

export type Locale = keyof typeof messagesByLocale;
export type Messages = (typeof messagesByLocale)[Locale];
