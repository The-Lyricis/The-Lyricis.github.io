import type { Locale } from "../../locales";
import en from "./en";
import zh from "./zh";
import type { ProjectContentMap } from "./types";

const projectContentByLocale: Record<Locale, ProjectContentMap> = {
  en,
  zh,
};

export { projectContentByLocale };
export type { ProjectContent, ProjectContentMap } from "./types";
