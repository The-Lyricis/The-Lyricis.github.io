import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { ArrowLeft, ArrowRight, ExternalLink, Github } from "lucide-react";
import { getProjectBySlug, type Project } from "../data/projects";
import { useLocale, useMessages } from "../i18n";
import { buildHomeSectionPath, navigateTo } from "../lib/routing";

interface ProjectDetailPageProps {
  slug: string;
}

export function ProjectDetailPage({ slug }: ProjectDetailPageProps) {
  const { locale } = useLocale();
  const messages = useMessages();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    setIsLoading(true);

    void getProjectBySlug(locale, slug).then((nextProject) => {
      if (!cancelled) {
        setProject(nextProject);
        setIsLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [locale, slug]);

  useEffect(() => {
    if (isLoading || !project?.projectPage) {
      return;
    }

    window.location.replace(project.projectPage);
  }, [isLoading, project]);

  const handleBackToProjects = () => {
    navigateTo(buildHomeSectionPath("featured-projects"));
    requestAnimationFrame(() => {
      document
        .getElementById("featured-projects")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  if (isLoading) {
    return (
      <div className="relative z-10 px-8 pt-32 pb-20">
        <div className="max-w-5xl mx-auto rounded-3xl border border-[#233554] bg-[#0A192F]/80 p-8 md:p-10">
          <p className="text-[#64FFDA] font-mono tracking-wider">Loading...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="relative z-10 px-8 pt-32 pb-20">
        <div className="max-w-5xl mx-auto rounded-3xl border border-[#233554] bg-[#0A192F]/80 p-8 md:p-10 text-center space-y-6">
          <p className="text-2xl font-bold text-[#E6F1FF]">Project Not Found</p>
          <p className="text-[#8892B0]">
            The requested project detail page is not available.
          </p>
          <button
            type="button"
            onClick={handleBackToProjects}
            className="inline-flex items-center gap-2 rounded-lg border border-[#64FFDA]/40 px-5 py-3 text-[#64FFDA] transition-colors hover:bg-[#64FFDA]/10"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Projects
          </button>
        </div>
      </div>
    );
  }

  if (project.projectPage) {
    return (
      <div className="relative z-10 px-8 pt-32 pb-20">
        <div className="max-w-5xl mx-auto rounded-3xl border border-[#233554] bg-[#0A192F]/80 p-8 md:p-10">
          <p className="text-[#64FFDA] font-mono tracking-wider">
            Redirecting to project page...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative z-10 px-8 pt-32 pb-20">
      <div className="max-w-6xl mx-auto space-y-8">
        <button
          type="button"
          onClick={handleBackToProjects}
          className="inline-flex items-center gap-2 text-[#64FFDA] font-mono tracking-wider transition-opacity hover:opacity-100 opacity-80"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Projects
        </button>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[28px] border relative overflow-hidden"
          style={{
            backgroundColor: "#0A192F",
            borderColor: `${project.color}50`,
            boxShadow: `0 0 40px ${project.color}18`,
          }}
        >
          <div
            className="absolute top-0 right-0 h-60 w-60 rounded-full blur-3xl opacity-20 translate-x-1/3 -translate-y-1/3"
            style={{ backgroundColor: project.color }}
          />

          <div className="relative p-6 md:p-10 space-y-10">
            <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
              <div className="space-y-5">
                <span
                  className="inline-flex items-center rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-[0.22em]"
                  style={{
                    backgroundColor: `${project.color}15`,
                    color: project.color,
                    border: `1px solid ${project.color}40`,
                  }}
                >
                  {messages.projects.categoryLabels[project.category] ??
                    project.category}
                </span>
                <div className="space-y-3">
                  <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[#E6F1FF]">
                    {project.title}
                  </h1>
                  {project.subtitle && (
                    <p className="text-[#64FFDA] font-mono tracking-wide">
                      {project.subtitle}
                    </p>
                  )}
                  <p className="max-w-2xl text-base md:text-lg leading-relaxed text-[#A8B2D1]">
                    {project.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-[#233554] bg-[#081425] px-3 py-1.5 text-xs font-mono text-[#64FFDA]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl overflow-hidden border border-[#233554] bg-[#081425]">
                <img
                  src={project.image}
                  alt={project.title}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-[1.4fr_0.6fr]">
              <div className="space-y-8">
                <section className="space-y-4">
                  <h2 className="text-sm uppercase tracking-[0.2em] text-[#64FFDA] font-bold">
                    {messages.projects.aboutProject}
                  </h2>
                  <div className="text-[#8892B0] leading-8 whitespace-pre-line">
                    {project.longDescription || project.description}
                  </div>
                </section>

                {project.credits && (
                  <section className="space-y-4 border-t border-[#233554] pt-8">
                    <h2 className="text-sm uppercase tracking-[0.2em] text-[#8892B0] font-bold">
                      {messages.projects.projectCredits}
                    </h2>
                    <pre className="whitespace-pre-wrap text-sm leading-7 text-[#64FFDA] font-mono">
                      {project.credits}
                    </pre>
                  </section>
                )}
              </div>

              <aside className="space-y-6">
                <div className="rounded-2xl border border-[#233554] bg-[#112240]/50 p-6 space-y-4">
                  <h2 className="text-sm uppercase tracking-[0.2em] text-[#E6F1FF] font-bold">
                    {messages.projects.technologies}
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-[#233554] bg-[#0A192F] px-3 py-1.5 text-xs font-mono text-[#64FFDA]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  {project.github && (
                    <motion.a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-mono font-bold transition-all"
                      style={{
                        borderColor: project.color,
                        color: project.color,
                      }}
                    >
                      <Github className="w-4 h-4" />
                      {messages.projects.sourceCode}
                    </motion.a>
                  )}
                  {project.demo && (
                    <motion.a
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-mono font-bold shadow-lg transition-all"
                      style={{
                        backgroundColor: project.color,
                        color: "#0A192F",
                        boxShadow: `0 0 20px ${project.color}40`,
                      }}
                    >
                      <ExternalLink className="w-4 h-4" />
                      {messages.projects.liveDemo}
                    </motion.a>
                  )}
                  {project.projectPage && (
                    <motion.a
                      href={project.projectPage}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-[#233554] px-4 py-3 text-sm font-mono font-bold text-[#8892B0] transition-all"
                    >
                      <ArrowRight className="w-4 h-4" />
                      {messages.projects.projectPage}
                    </motion.a>
                  )}
                </div>
              </aside>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
