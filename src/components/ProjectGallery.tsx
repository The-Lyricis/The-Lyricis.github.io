import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Filter,
  Github,
  Pin,
  Search,
  Shuffle,
  X,
} from "lucide-react";
import { useLocale, useMessages } from "../i18n";
import {
  getProjects,
  getStaticProjects,
  type Project,
} from "../data/projects";
import { buildProjectPath, navigateTo } from "../lib/routing";

const CATEGORIES = [
  { id: "all", label: "All Projects" },
  { id: "ta", label: "Technical Art" },
  { id: "gamedev", label: "Game Dev" },
  { id: "graphics", label: "Graphics" },
];

export function ProjectGallery() {
  const { locale } = useLocale();
  const messages = useMessages();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [localizedProjects, setLocalizedProjects] = useState<Project[]>(() =>
    getStaticProjects(locale),
  );
  const [shuffledProjects, setShuffledProjects] = useState<Project[]>([]);
  const ITEMS_PER_PAGE = 6;

  useEffect(() => {
    let cancelled = false;

    setLocalizedProjects(getStaticProjects(locale));

    void getProjects(locale).then((projects) => {
      if (!cancelled) {
        setLocalizedProjects(projects);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [locale]);

  useEffect(() => {
    const pinnedProjects = localizedProjects.filter((project) => project.pinned);
    const unpinnedProjects = localizedProjects.filter((project) => !project.pinned);

    for (let i = unpinnedProjects.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [unpinnedProjects[i], unpinnedProjects[j]] = [
        unpinnedProjects[j],
        unpinnedProjects[i],
      ];
    }

    setShuffledProjects([...pinnedProjects, ...unpinnedProjects]);
  }, [localizedProjects]);

  useEffect(() => {
    if (!selectedProject) return;

    const nextProject = localizedProjects.find(
      (project) => project.id === selectedProject.id,
    );

    if (nextProject) {
      setSelectedProject(nextProject);
    }
  }, [localizedProjects, selectedProject]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter, searchQuery]);

  const { paginatedProjects, totalPages } = useMemo(() => {
    const baseList =
      shuffledProjects.length > 0 ? shuffledProjects : localizedProjects;

    const filtered = baseList.filter((project) => {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        project.title.toLowerCase().includes(query) ||
        project.description.toLowerCase().includes(query) ||
        project.tags.some((tag) => tag.toLowerCase().includes(query));

      const matchesFilter =
        activeFilter === "all" || project.category === activeFilter;

      return matchesSearch && matchesFilter;
    });

    const pageCount = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

    return {
      paginatedProjects: filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE),
      totalPages: pageCount,
    };
  }, [
    localizedProjects,
    shuffledProjects,
    searchQuery,
    activeFilter,
    currentPage,
  ]);

  const getCategoryLabel = (category: string) =>
    messages.projects.categoryLabels[category] ?? category;

  const openProject = (project: Project) => {
    if (project.projectPage) {
      window.location.assign(project.projectPage);
      return;
    }

    setSelectedProject(project);
  };

  return (
    <div className="min-h-screen px-8 py-20 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#233554] to-transparent opacity-50" />

      <div className="max-w-7xl mx-auto mb-16 space-y-8">
        <div className="text-center space-y-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold tracking-tight"
            style={{ color: "#E6F1FF" }}
          >
            FEATURED <span style={{ color: "#64FFDA" }}>PROJECTS</span>
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            whileInView={{ opacity: 1, width: "60px" }}
            viewport={{ once: true }}
            className="h-1 bg-[#64FFDA] mx-auto rounded-full"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex flex-col md:flex-row justify-between items-center gap-6 bg-[#112240]/30 p-4 rounded-2xl backdrop-blur-sm border border-[#233554]"
        >
          <div className="flex flex-wrap gap-2 justify-center md:justify-start">
            {CATEGORIES.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveFilter(category.id)}
                className={`px-4 py-2 rounded-lg text-sm font-mono transition-all duration-300 relative overflow-hidden group ${
                  activeFilter === category.id
                    ? "text-[#0A192F] font-bold"
                    : "text-[#8892B0] hover:text-[#64FFDA]"
                }`}
              >
                {activeFilter === category.id && (
                  <motion.div
                    layoutId="activeFilter"
                    className="absolute inset-0 bg-[#64FFDA]"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="relative z-10">
                  {messages.projects.categoryLabels[category.id] ?? category.label}
                </span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative w-full md:w-64 group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-[#8892B0] group-focus-within:text-[#64FFDA] transition-colors" />
              </div>
              <input
                type="text"
                placeholder={messages.projects.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-2 bg-[#0A192F] border border-[#233554] rounded-lg text-[#E6F1FF] text-sm focus:outline-none focus:border-[#64FFDA] focus:ring-1 focus:ring-[#64FFDA] transition-all placeholder-[#8892B0]/50"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#8892B0] hover:text-[#E6F1FF]"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <button
              onClick={() => {
                const pinnedProjects = shuffledProjects.filter(
                  (project) => project.pinned,
                );
                const unpinnedProjects = shuffledProjects.filter(
                  (project) => !project.pinned,
                );

                for (let i = unpinnedProjects.length - 1; i > 0; i -= 1) {
                  const j = Math.floor(Math.random() * (i + 1));
                  [unpinnedProjects[i], unpinnedProjects[j]] = [
                    unpinnedProjects[j],
                    unpinnedProjects[i],
                  ];
                }

                setShuffledProjects([...pinnedProjects, ...unpinnedProjects]);
              }}
              className="p-2 rounded-lg bg-[#112240] border border-[#233554] text-[#64FFDA] hover:bg-[#233554] transition-colors"
              title={messages.projects.shuffleTitle}
            >
              <Shuffle className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>

      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
        style={{ minHeight: "680px" }}
      >
        <AnimatePresence mode="popLayout">
          {paginatedProjects.length > 0 ? (
            paginatedProjects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
                isHovered={hoveredId === project.id}
                onHover={setHoveredId}
                onClick={openProject}
                categoryLabel={getCategoryLabel(project.category)}
              />
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="col-span-full text-center py-20 text-[#8892B0] flex flex-col items-center gap-4"
            >
              <Filter className="w-12 h-12 opacity-20" />
              <p>{messages.projects.emptyState}</p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setActiveFilter("all");
                }}
                className="text-[#64FFDA] hover:underline text-sm"
              >
                {messages.projects.clearFilters}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {totalPages > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center justify-center gap-3 mt-8 max-w-7xl mx-auto"
        >
          <motion.button
            type="button"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            whileHover={{ scale: currentPage === 1 ? 1 : 1.05 }}
            whileTap={{ scale: currentPage === 1 ? 1 : 0.95 }}
            className="p-3 rounded-lg border transition-all duration-300"
            style={{
              backgroundColor:
                currentPage === 1
                  ? "rgba(17, 34, 64, 0.3)"
                  : "rgba(17, 34, 64, 0.5)",
              borderColor:
                currentPage === 1
                  ? "rgba(35, 53, 84, 0.5)"
                  : "rgba(100, 255, 218, 0.3)",
              color: currentPage === 1 ? "#4A5568" : "#64FFDA",
              cursor: currentPage === 1 ? "not-allowed" : "pointer",
              opacity: currentPage === 1 ? 0.5 : 1,
            }}
          >
            <ChevronLeft className="w-5 h-5" />
          </motion.button>

          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (pageNum) => {
                const isActive = pageNum === currentPage;
                const showPage =
                  pageNum === 1 ||
                  pageNum === totalPages ||
                  Math.abs(pageNum - currentPage) <= 1;
                const showEllipsisBefore = pageNum === 2 && currentPage > 3;
                const showEllipsisAfter =
                  pageNum === totalPages - 1 && currentPage < totalPages - 2;

                if (!showPage && !showEllipsisBefore && !showEllipsisAfter) {
                  return null;
                }

                if (showEllipsisBefore || showEllipsisAfter) {
                  return (
                    <span
                      key={`ellipsis-${pageNum}`}
                      className="px-2 text-[#8892B0]"
                    >
                      ···
                    </span>
                  );
                }

                return (
                  <motion.button
                    key={pageNum}
                    type="button"
                    onClick={() => setCurrentPage(pageNum)}
                    whileHover={{ scale: isActive ? 1 : 1.1 }}
                    whileTap={{ scale: isActive ? 1 : 0.95 }}
                    className="relative w-10 h-10 rounded-lg font-mono text-sm font-bold transition-all duration-300"
                    style={{
                      backgroundColor: isActive
                        ? "#64FFDA"
                        : "rgba(17, 34, 64, 0.5)",
                      color: isActive ? "#0A192F" : "#8892B0",
                      border: isActive
                        ? "2px solid #64FFDA"
                        : "1px solid rgba(35, 53, 84, 0.8)",
                      boxShadow: isActive
                        ? "0 0 20px rgba(100, 255, 218, 0.4)"
                        : "none",
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.borderColor =
                          "rgba(100, 255, 218, 0.5)";
                        e.currentTarget.style.color = "#E6F1FF";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.borderColor =
                          "rgba(35, 53, 84, 0.8)";
                        e.currentTarget.style.color = "#8892B0";
                      }
                    }}
                  >
                    {pageNum}
                    {isActive && (
                      <motion.div
                        layoutId="activePage"
                        className="absolute inset-0 rounded-lg"
                        style={{
                          background:
                            "linear-gradient(135deg, rgba(100, 255, 218, 0.2), rgba(100, 255, 218, 0.05))",
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 30,
                        }}
                      />
                    )}
                  </motion.button>
                );
              },
            )}
          </div>

          <motion.button
            type="button"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            whileHover={{ scale: currentPage === totalPages ? 1 : 1.05 }}
            whileTap={{ scale: currentPage === totalPages ? 1 : 0.95 }}
            className="p-3 rounded-lg border transition-all duration-300"
            style={{
              backgroundColor:
                currentPage === totalPages
                  ? "rgba(17, 34, 64, 0.3)"
                  : "rgba(17, 34, 64, 0.5)",
              borderColor:
                currentPage === totalPages
                  ? "rgba(35, 53, 84, 0.5)"
                  : "rgba(100, 255, 218, 0.3)",
              color: currentPage === totalPages ? "#4A5568" : "#64FFDA",
              cursor: currentPage === totalPages ? "not-allowed" : "pointer",
              opacity: currentPage === totalPages ? 0.5 : 1,
            }}
          >
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </motion.div>
      )}

      <AnimatePresence>
        {selectedProject && (
          <ProjectModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
            categoryLabel={getCategoryLabel(selectedProject.category)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

interface ProjectCardProps {
  project: Project;
  index: number;
  isHovered: boolean;
  onHover: (id: number | null) => void;
  onClick: (project: Project) => void;
  categoryLabel: string;
}

const ProjectCard = React.forwardRef<HTMLDivElement, ProjectCardProps>(
  ({ project, isHovered, onHover, onClick, categoryLabel }, ref) => {
    return (
      <motion.div
        ref={ref}
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
        onMouseEnter={() => onHover(project.id)}
        onMouseLeave={() => onHover(null)}
        onClick={() => onClick(project)}
        className="relative group cursor-pointer"
      >
        <motion.div
          className="relative aspect-video rounded-xl overflow-hidden border-2"
          style={{
            backgroundColor: "transparent",
            borderColor: isHovered ? project.color : `${project.color}40`,
            boxShadow: isHovered ? `0 0 30px ${project.color}20` : "none",
          }}
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <div className="absolute inset-0">
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover transition-all duration-500"
              style={{
                opacity: isHovered ? 1 : 0.85,
                filter: isHovered
                  ? "blur(3px) brightness(1.0)"
                  : "blur(0px) brightness(0.7) contrast(1.1)",
              }}
            />
            <div
              className="absolute inset-0 transition-opacity duration-300"
              style={{
                background:
                  "linear-gradient(180deg, transparent 40%, rgba(2, 12, 27, 0.95) 100%)",
                opacity: isHovered ? 0.8 : 1,
              }}
            />
          </div>

          <div className="relative z-10 p-5 h-full flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <span
                className="px-3 py-1 rounded text-[10px] font-bold tracking-[0.1em] uppercase backdrop-blur-md shadow-lg"
                style={{
                  backgroundColor: "rgba(2, 12, 27, 0.7)",
                  color: project.color,
                  border: `1px solid ${project.color}60`,
                }}
              >
                {categoryLabel}
              </span>

              {project.pinned && (
                <div
                  className="backdrop-blur-md rounded-full p-2 shadow-lg"
                  style={{
                    backgroundColor: "rgba(2, 12, 27, 0.8)",
                  }}
                >
                  <Pin className="w-4 h-4" style={{ color: "#FFD700" }} />
                </div>
              )}
            </div>

            <div className="transform transition-transform duration-300 group-hover:-translate-y-1">
              <h3 className="mb-1 text-lg md:text-xl font-bold tracking-tight text-[#E6F1FF] drop-shadow-md">
                {project.title}
              </h3>
              {project.subtitle && (
                <p className="text-xs text-[#64FFDA] mb-2 font-mono tracking-tight opacity-90 line-clamp-1">
                  {project.subtitle}
                </p>
              )}
              <p
                className="text-sm leading-relaxed line-clamp-2 mb-3 drop-shadow-md font-medium"
                style={{ color: "#CCD6F6" }}
              >
                {project.description}
              </p>

              <div className="flex flex-wrap gap-2">
                {project.tags.slice(0, 3).map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 rounded text-[10px] font-mono backdrop-blur-md transition-colors"
                    style={{
                      backgroundColor: "rgba(2, 12, 27, 0.6)",
                      color: "#64FFDA",
                      border: "1px solid rgba(100, 255, 218, 0.2)",
                    }}
                  >
                    {tag}
                  </span>
                ))}
                {project.tags.length > 3 && (
                  <span className="px-2 py-1 rounded text-[10px] font-mono text-[#8892B0] bg-black/40">
                    +{project.tags.length - 3}
                  </span>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  },
);

interface ProjectModalProps {
  project: Project;
  onClose: () => void;
  categoryLabel: string;
}

function ProjectModal({ project, onClose, categoryLabel }: ProjectModalProps) {
  const messages = useMessages();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 backdrop-blur-sm z-50 flex items-center justify-center p-4 md:p-8"
      style={{ backgroundColor: "rgba(2, 12, 27, 0.85)" }}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="rounded-2xl max-w-5xl w-full h-[85vh] p-6 md:p-8 border relative overflow-hidden flex flex-col"
        style={{
          backgroundColor: "#0A192F",
          borderColor: project.color,
          boxShadow: `0 0 50px ${project.color}30`,
        }}
      >
        <div
          className="absolute top-0 right-0 p-32 opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"
          style={{ backgroundColor: project.color }}
        />

        <div className="flex justify-between items-start mb-6 z-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span
                className="px-3 py-1 rounded text-xs font-bold tracking-widest uppercase"
                style={{
                  backgroundColor: `${project.color}15`,
                  color: project.color,
                  border: `1px solid ${project.color}40`,
                }}
              >
                {categoryLabel}
              </span>
              <div className="h-px w-10 bg-[#233554]" />
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-[#E6F1FF]">
              {project.title}
            </h2>
            {project.subtitle && (
              <p className="text-[#64FFDA] mt-2 font-mono text-sm tracking-wide">
                {project.subtitle}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#112240] transition-colors group"
          >
            <X className="w-6 h-6 text-[#8892B0] group-hover:text-[#64FFDA]" />
          </button>
        </div>

        <div className="overflow-y-auto pr-2 custom-scrollbar flex-1">
          <div
            className="aspect-video rounded-xl mb-8 overflow-hidden relative group"
            style={{ border: `1px solid ${project.color}30` }}
          >
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F] via-transparent to-transparent opacity-60" />
          </div>

          <div className="grid md:grid-cols-[2fr_1fr] gap-8">
            <div>
              <h3 className="text-sm uppercase tracking-wider text-[#64FFDA] font-bold mb-4">
                {messages.projects.aboutProject}
              </h3>
              <p className="text-base leading-relaxed text-[#8892B0] mb-6 whitespace-pre-line">
                {project.longDescription || project.description}
              </p>

              {project.credits && (
                <div className="mt-8 pt-6 border-t border-[#233554]/50">
                  <h3 className="text-xs uppercase tracking-wider text-[#8892B0] font-bold mb-3">
                    {messages.projects.projectCredits}
                  </h3>
                  <pre className="text-xs text-[#64FFDA] font-mono whitespace-pre-wrap leading-relaxed">
                    {project.credits}
                  </pre>
                </div>
              )}
            </div>

            <div className="bg-[#112240]/50 p-6 rounded-xl border border-[#233554]">
              <h3 className="text-sm uppercase tracking-wider text-[#E6F1FF] font-bold mb-4">
                {messages.projects.technologies}
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded text-xs font-mono text-[#64FFDA] bg-[#0A192F] border border-[#233554]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-4 mt-8 pt-6 border-t border-[#233554] z-10">
          {project.github && (
            <motion.a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-lg border py-3 text-sm font-mono font-bold transition-all"
              style={{
                borderColor: project.color,
                color: project.color,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = `${project.color}10`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
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
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-lg py-3 text-sm font-mono font-bold shadow-lg transition-all"
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
          {project.projectPage ? (
            <motion.a
              href={project.projectPage}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-lg border py-3 text-sm font-mono font-bold transition-all"
              style={{
                borderColor: "#233554",
                color: "#8892B0",
                backgroundColor: "transparent",
              }}
            >
              <ArrowRight className="w-4 h-4" />
              {messages.projects.projectPage}
            </motion.a>
          ) : (
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigateTo(buildProjectPath(project.slug))}
              className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-lg border py-3 text-sm font-mono font-bold transition-all"
              style={{
                borderColor: "#233554",
                color: "#8892B0",
                backgroundColor: "transparent",
              }}
            >
              <ArrowRight className="w-4 h-4" />
              {messages.projects.projectPage}
            </motion.button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
