import type { Locale } from "../locales";
import {
  projectContentByLocale,
  type ProjectContent,
} from "./project-content";
import { supabase, shouldUseSupabaseProjects } from "../lib/supabase";
import img2 from "figma:asset/projects/shader-factory-cover.png";
import img3 from "figma:asset/projects/ray-marching-renderer-cover.png";
import img5 from "figma:asset/projects/hda-hex-terrain-cover.png";
import img6 from "figma:asset/projects/gpu-particle-system-cover.png";
import cubieImg from "../assets/projects/cubie-cover.png";
import christmasPsychoImg from "figma:asset/projects/christmas-psycho-cover.png";
import hybridEngineImg from "figma:asset/projects/hybrid-engine-cover.png";
import unselfImg from "figma:asset/projects/unself-cover.png";
import vibrantImg from "figma:asset/projects/vibrant-cover.png";

export interface Project {
  id: number;
  slug: string;
  title: string;
  subtitle?: string;
  category: "ta" | "gamedev" | "graphics";
  description: string;
  longDescription?: string;
  credits?: string;
  color: string;
  image: string;
  tags: string[];
  github?: string;
  demo?: string;
  projectPage?: string;
  pinned?: boolean;
}

type BaseProject = Omit<
  Project,
  "description" | "longDescription" | "subtitle" | "credits" | "tags"
>;

type ProjectTranslationRow = {
  locale: Locale;
  title: string;
  subtitle: string | null;
  description: string;
  long_description: string;
  credits: string | null;
  tags: string[] | null;
};

type ProjectRow = {
  id: number;
  slug: string;
  category: Project["category"];
  color: string;
  cover_url: string | null;
  github_url: string | null;
  demo_url: string | null;
  project_page_url: string | null;
  is_pinned: boolean;
  project_translations: ProjectTranslationRow[];
};

const BASE_PROJECTS: BaseProject[] = [
  {
    id: 8,
    slug: "unself",
    title: "UNSELF",
    category: "gamedev",
    color: "#E0E0E0",
    image: unselfImg,
    demo: "https://legolaswan.itch.io/unself",
  },
  {
    id: 9,
    slug: "vibrant",
    title: "Vibrant",
    category: "gamedev",
    color: "#A3E635",
    image: vibrantImg,
    github: "https://github.com/The-Lyricis/Vibrant",
  },
  {
    id: 7,
    slug: "christmas-psycho",
    title: "Christmas Psycho",
    category: "gamedev",
    color: "#FFFFFF",
    image: christmasPsychoImg,
    demo: "https://www.gcores.com/games/148141",
  },
  {
    id: 11,
    slug: "cubie",
    title: "Cubie",
    category: "gamedev",
    color: "#B88E84",
    image: cubieImg,
    demo: "https://pigchick.itch.io/cubie",
  },
  {
    id: 1,
    slug: "shader-factory",
    title: "ShaderFactory",
    category: "ta",
    color: "#64FFDA",
    image: img2,
  },
  {
    id: 3,
    slug: "gpu-particle-system",
    title: "GPU Particle System",
    category: "graphics",
    color: "#FF6B6B",
    image: img6,
  },
  {
    id: 4,
    slug: "hda-for-unity-procedural-hex-terrain-tool",
    title: "HDA for Unity - Procedural Hex Terrain Tool",
    category: "ta",
    color: "#FF9A3C",
    image: img5,
  },
  {
    id: 6,
    slug: "ray-marching-renderer",
    title: "Ray Marching Renderer",
    category: "graphics",
    color: "#FF6B6B",
    image: img3,
  },
  {
    id: 10,
    slug: "hybrid-engine",
    title: "Hybrid Engine",
    category: "graphics",
    color: "#9D4EDD",
    image: hybridEngineImg,
    github: "https://github.com/The-Lyricis/HybridEngine",
    projectPage: "https://hybrid-engine-site.vercel.app",
    pinned: true,
  },
];

const staticProjectById = new Map(BASE_PROJECTS.map((project) => [project.id, project]));

function getProjectContent(locale: Locale): Record<string, ProjectContent> {
  return projectContentByLocale[locale];
}

function mergeStaticProjects(locale: Locale): Project[] {
  const contentById = getProjectContent(locale);

  return BASE_PROJECTS.map((project) => {
    const content = contentById[String(project.id)];

    return {
      ...project,
      subtitle: content.subtitle,
      description: content.description,
      longDescription: content.longDescription,
      credits: content.credits,
      tags: content.tags,
    };
  });
}

function mapSupabaseProject(row: ProjectRow): Project {
  const translation = row.project_translations[0];
  const fallback = staticProjectById.get(row.id);

  return {
    id: row.id,
    slug: row.slug,
    title: translation?.title ?? fallback?.title ?? row.slug,
    subtitle: translation?.subtitle ?? undefined,
    category: row.category,
    description: translation?.description ?? "",
    longDescription: translation?.long_description ?? "",
    credits: translation?.credits ?? undefined,
    color: row.color,
    image: row.cover_url ?? fallback?.image ?? "",
    tags: translation?.tags ?? [],
    github: row.github_url ?? fallback?.github,
    demo: row.demo_url ?? fallback?.demo,
    projectPage: row.project_page_url ?? fallback?.projectPage,
    pinned: row.is_pinned,
  };
}

async function getProjectsFromSupabase(locale: Locale): Promise<Project[]> {
  if (!supabase) {
    return mergeStaticProjects(locale);
  }

  const { data, error } = await supabase
    .from("projects")
    .select(
      `
        id,
        slug,
        category,
        color,
        cover_url,
        github_url,
        demo_url,
        project_page_url,
        is_pinned,
        project_translations!inner (
          locale,
          title,
          subtitle,
          description,
          long_description,
          credits,
          tags
        )
      `,
    )
    .eq("is_published", true)
    .eq("project_translations.locale", locale)
    .order("is_pinned", { ascending: false })
    .order("sort_weight", { ascending: false })
    .order("published_at", { ascending: false });

  if (error) {
    throw error;
  }

  return ((data ?? []) as ProjectRow[]).map(mapSupabaseProject);
}

async function getProjectBySlugFromSupabase(
  locale: Locale,
  slug: string,
): Promise<Project | null> {
  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("projects")
    .select(
      `
        id,
        slug,
        category,
        color,
        cover_url,
        github_url,
        demo_url,
        project_page_url,
        is_pinned,
        project_translations!inner (
          locale,
          title,
          subtitle,
          description,
          long_description,
          credits,
          tags
        )
      `,
    )
    .eq("is_published", true)
    .eq("slug", slug)
    .eq("project_translations.locale", locale)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data ? mapSupabaseProject(data as ProjectRow) : null;
}

export function getStaticProjects(locale: Locale): Project[] {
  return mergeStaticProjects(locale);
}

export async function getProjects(locale: Locale): Promise<Project[]> {
  if (!shouldUseSupabaseProjects) {
    return mergeStaticProjects(locale);
  }

  try {
    const projects = await getProjectsFromSupabase(locale);
    return projects.length > 0 ? projects : mergeStaticProjects(locale);
  } catch (error) {
    console.error("Failed to load projects from Supabase, using static fallback.", error);
    return mergeStaticProjects(locale);
  }
}

export async function getProjectBySlug(
  locale: Locale,
  slug: string,
): Promise<Project | null> {
  if (!shouldUseSupabaseProjects) {
    return (
      mergeStaticProjects(locale).find((project) => project.slug === slug) ?? null
    );
  }

  try {
    const project = await getProjectBySlugFromSupabase(locale, slug);
    return (
      project ??
      mergeStaticProjects(locale).find((item) => item.slug === slug) ??
      null
    );
  } catch (error) {
    console.error("Failed to load project detail from Supabase, using static fallback.", error);
    return (
      mergeStaticProjects(locale).find((project) => project.slug === slug) ?? null
    );
  }
}
