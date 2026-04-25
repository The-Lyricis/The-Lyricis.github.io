const { getSupabaseAdmin } = require("../config/db");

async function listProjects(req, res) {
  const supabase = await getSupabaseAdmin();

  if (!supabase) {
    return res.json({
      source: "placeholder",
      items: [],
      message: "Supabase is not configured yet. Add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to enable projects data.",
    });
  }

  const locale = req.query.locale === "zh" ? "zh" : "en";

  const [projectsResult, translationsResult] = await Promise.all([
    supabase
      .from("projects")
      .select(
        "id, slug, category, color, cover_url, github_url, demo_url, project_page_url, is_pinned, sort_weight, is_published, published_at",
      )
      .eq("is_published", true)
      .order("is_pinned", { ascending: false })
      .order("sort_weight", { ascending: false })
      .order("published_at", { ascending: false }),
    supabase
      .from("project_translations")
      .select("project_id, locale, title, subtitle, description, long_description, credits, tags")
      .eq("locale", locale),
  ]);

  if (projectsResult.error || translationsResult.error) {
    return res.status(500).json({
      error: "Failed to load projects from Supabase",
      details: {
        projects: projectsResult.error?.message || null,
        translations: translationsResult.error?.message || null,
      },
    });
  }

  const translationsByProjectId = new Map(
    (translationsResult.data || []).map((item) => [item.project_id, item]),
  );

  const items = (projectsResult.data || []).map((project) => {
    const translation = translationsByProjectId.get(project.id);

    return {
      id: project.id,
      slug: project.slug,
      category: project.category,
      color: project.color,
      coverUrl: project.cover_url,
      githubUrl: project.github_url,
      demoUrl: project.demo_url,
      projectPageUrl: project.project_page_url,
      pinned: project.is_pinned,
      sortWeight: project.sort_weight,
      publishedAt: project.published_at,
      locale,
      title: translation?.title || null,
      subtitle: translation?.subtitle || null,
      description: translation?.description || null,
      longDescription: translation?.long_description || null,
      credits: translation?.credits || null,
      tags: translation?.tags || [],
    };
  });

  res.json({
    source: "supabase",
    locale,
    items,
  });
}

async function uploadProject(req, res) {
  res.status(501).json({
    error: "Project upload is not implemented yet",
    nextStep: "Connect file storage and database persistence in server/controllers/projectsController.js",
  });
}

async function deleteProject(req, res) {
  res.status(501).json({
    error: "Project deletion is not implemented yet",
    projectId: req.params.id,
    nextStep: "Wire database deletion and asset cleanup in server/controllers/projectsController.js",
  });
}

module.exports = {
  listProjects,
  uploadProject,
  deleteProject,
};
