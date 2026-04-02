import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const projectsDataSource = import.meta.env.VITE_PROJECTS_DATA_SOURCE;

export const shouldUseSupabaseProjects =
  projectsDataSource === "supabase" &&
  typeof supabaseUrl === "string" &&
  supabaseUrl.length > 0 &&
  typeof supabaseAnonKey === "string" &&
  supabaseAnonKey.length > 0;

export const supabase = shouldUseSupabaseProjects
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
