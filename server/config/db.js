const { env } = require("./env");

let supabaseAdminPromise = null;

async function getSupabaseAdmin() {
  if (!env.supabaseUrl || !env.supabaseServiceRoleKey) {
    return null;
  }

  if (!supabaseAdminPromise) {
    supabaseAdminPromise = import("@supabase/supabase-js").then(({ createClient }) =>
      createClient(env.supabaseUrl, env.supabaseServiceRoleKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      }),
    );
  }

  return supabaseAdminPromise;
}

async function connectDatabase() {
  if (!env.supabaseUrl || !env.supabaseServiceRoleKey) {
    return {
      connected: false,
      driver: "supabase",
      reason: "SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not configured",
    };
  }

  try {
    const supabase = await getSupabaseAdmin();
    const { error } = await supabase.from("projects").select("id", { count: "exact", head: true });

    if (error) {
      return {
        connected: false,
        driver: "supabase",
        reason: error.message,
      };
    }

    return {
      connected: true,
      driver: "supabase",
      reason: null,
    };
  } catch (error) {
    return {
      connected: false,
      driver: "supabase",
      reason: error instanceof Error ? error.message : "Unknown Supabase connection error",
    };
  }
}

module.exports = { connectDatabase, getSupabaseAdmin };
