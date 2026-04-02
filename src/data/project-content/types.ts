export interface ProjectContent {
  description: string;
  longDescription: string;
  tags: string[];
  credits?: string;
  subtitle?: string;
}

export type ProjectContentMap = Record<string, ProjectContent>;
