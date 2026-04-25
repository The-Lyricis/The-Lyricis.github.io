const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
dotenv.config();

function parseBoolean(value, fallback = false) {
  if (typeof value !== "string") {
    return fallback;
  }

  const normalized = value.trim().toLowerCase();
  if (["1", "true", "yes", "on"].includes(normalized)) {
    return true;
  }

  if (["0", "false", "no", "off"].includes(normalized)) {
    return false;
  }

  return fallback;
}

const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.SERVER_PORT || 8787),
  steamApiKey: process.env.STEAM_API_KEY || "",
  steamId: process.env.STEAM_ID || "",
  steamFilterLibrary: parseBoolean(process.env.STEAM_FILTER_LIBRARY, true),
  steamExcludedKeywords:
    process.env.STEAM_EXCLUDED_KEYWORDS ||
    "aseprite,wallpaper engine,vtube studio,tmodloader,beta,playtest,test server,dedicated server,demo,soundtrack",
  supabaseUrl: process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "",
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
  databaseUrl: process.env.DATABASE_URL || "",
  resumeFilePath: process.env.RESUME_FILE_PATH || "public/resume-en.pdf",
  corsAllowedOrigin: process.env.CORS_ALLOWED_ORIGIN || "*",
};

module.exports = { env, parseBoolean };
