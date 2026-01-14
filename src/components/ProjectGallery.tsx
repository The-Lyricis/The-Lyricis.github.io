import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Eye,
  Github,
  ExternalLink,
  Search,
  Filter,
  X,
  Shuffle,
  ArrowRight
} from "lucide-react";
import img1 from "figma:asset/acf72adfe465d4db855efa8da3d9f0be2b13dc9e.png";
import img2 from "figma:asset/510d0c71db35598b232560f09a4d46c569735d17.png";
import img3 from "figma:asset/9cb12c39b95097e4153b36471a7928a2a3c7584c.png";
import img4 from "figma:asset/b7be30991966a201e22d55cd8a54e4487532b70b.png";
import img5 from "figma:asset/aec850c9ae88cbc0c2fc0301ed11ccfa259fd346.png";
import img6 from "figma:asset/b728911a0d5458658529c26097e89272475ef427.png";
import christmasPsychoImg from 'figma:asset/57c6cd618f6f0f604c4aa86adf1c0b301471bb48.png';
import unselfImg from 'figma:asset/3f8f58d9debae47e48daed17820b86a2b919a073.png';
import vibrantImg from 'figma:asset/3569637c7d42adbc57930f8d94a090c1b7990ed6.png';

interface Project {
  id: number;
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
}

const CATEGORIES = [
  { id: "all", label: "All Projects" },
  { id: "ta", label: "Technical Art" },
  { id: "gamedev", label: "Game Dev" },
  { id: "graphics", label: "Graphics" },
];

const RAW_PROJECTS: Project[] = [
  {
    id: 8,
    title: "UNSELF",
    category: "gamedev",
    description: "UNSELF — a puzzle-driven visual novel in trembling monochrome, exploring identity and reflection through cosmic horror.",
    longDescription: "UNSELF is a puzzle-driven visual novel drawn in quivering black-and-white lines—an ink-and-shadow world where the visuals themselves carry meaning. Set under a cosmic-horror lens, the story follows a creature that wakes each day to a different face in the mirror, performing small rituals of adjustment and concealment as it searches for a stable self. The result is a compact, atmosphere-first experience built around reflection, ambiguity, and unease.\n\nHighlights:\n• Visual-first storytelling: trembling linework and \"breathing\" darkness as narrative language\n• Puzzle + VN structure: light puzzles that gate scenes and reinforce the theme of reflection\n• Cosmic-horror tone: quiet, ritual-like progression rather than jump-scare reliance\n• Game Jam delivery: built in a short jam timeframe (48–72h), focused scope and finish",
    credits: "Credits: Jiliang Ye, Ao Wang, Zhengyang Gu, Yuxi Guo, Hang Wan\nAudio: Epidemic Sound (music & SFX)\nFont: Estonia",
    color: "#E0E0E0",
    image: unselfImg,
    tags: ["Puzzle VN", "Cosmic Horror", "Hand-drawn", "Narrative", "Game Jam", "Indie", "Experimental"],
    demo: "https://legolaswan.itch.io/unself",
  },
  {
    id: 9,
    title: "Vibrant",
    subtitle: "A 2D pixel side-scrolling action adventure",
    category: "gamedev",
    description: "A curious little chick exploring a vibrant world filled with enemies, secrets, and new abilities.",
    longDescription: "Play as a curious little chick exploring a vibrant world filled with enemies, secrets, and new abilities. Fight through stages, unlock skills that expand your movement and combat options, and rescue your trapped friend—a pig—along the journey.",
    color: "#A3E635", // Lime Green for vibrant feel
    image: vibrantImg,
    tags: ["2D", "Pixel Art", "Aseprite", "Action Adventure", "Exploration", "Combat"],
    github: "https://github.com/The-Lyricis/Vibrant",
  },
  {
    id: 7,
    title: "Christmas Psycho",
    category: "gamedev",
    description: "A 15-day jam puzzle game with a quirky hand-drawn style and comedic storytelling.",
    longDescription: "A short, story-driven puzzle game made in 15 days. It blends hand-drawn, humorous visuals with light narrative moments, where players explore compact scenes, collect clues, and solve small logic puzzles to push the story forward. Built with a focus on clear interaction, readable composition, and punchy comedic timing.",
    color: "#FFFFFF",
    image: christmasPsychoImg,
    tags: ["Game Jam", "15-Day Dev", "2D", "Puzzle", "Narrative", "Comedy", "Hand-Drawn"],
    demo: "https://www.gcores.com/games/148141",
  },
  {
    id: 1,
    title: "ShaderFactory",
    subtitle: "A Personal Shader Library & Study Collection",
    category: "ta",
    description:
      "A curated collection of shader studies and visual experiments exploring rendering fundamentals and real-time art direction.",
    longDescription: "ShaderFactory is my personal shader library—a curated collection of shader studies and visual experiments. It includes a range of small, focused effects built to explore rendering fundamentals and real-time art direction, with clean parameter controls for quick iteration. I use it as both a learning archive and a reusable toolbox for future projects.\n\nHighlights:\n• A growing set of shader exercises and stylized effects (each isolated and easy to reuse)\n• Artist-friendly parameters with sensible defaults for fast look-dev\n• Notes / variations that document what I learned and how each effect was built",
    color: "#64FFDA",
    image: img2,
    tags: ["Shader Graph", "HLSL", "Unity", "Real-time Rendering"],
    github: "https://github.com",
    demo: "https://demo.com",
  },
  {
    id: 3,
    title: "GPU Particle System",
    category: "graphics",
    description:
      "Implemented a million-particle simulation system using compute shaders with collision detection.",
    longDescription: "Implemented a million-particle simulation system using compute shaders. Features include collision detection, force fields, particle spawning patterns, and real-time performance on mobile platforms.",
    color: "#FF6B6B",
    image: img6,
    tags: ["Compute Shaders", "GPU", "VFX", "Optimization"],
    github: "https://github.com",
  },
  {
    id: 4,
    title: "HDA for Unity — Procedural Hex Terrain Tool",
    category: "ta",
    description:
      "Built a Houdini Digital Asset (HDA) workflow integrated into Unity for fast, art-directable procedural generation.",
    longDescription: "Built a Houdini Digital Asset (HDA) workflow integrated into Unity for fast, art-directable procedural generation. Exposed key parameters through a clean UI, enabling rapid iteration on layout, density, and shape while keeping results consistent and reproducible across builds.\n\nKey Features:\n• Parametric generation: controllable size, noise, falloff, and distribution with real-time iteration\n• Reproducible outputs: seed-based generation to keep results stable across sessions\n• Unity-friendly workflow: one-click bake/export to meshes for downstream use\n• Artist-facing controls: organized parameter groups and sensible defaults for quick tuning",
    color: "#FF9A3C",
    image: img5,
    tags: ["Houdini Engine", "HDA", "Unity", "Procedural Generation", "VEX"],
    github: "https://github.com",
  },
  {
    id: 6,
    title: "Ray Marching Renderer",
    category: "graphics",
    description:
      "Developed real-time SDF-based ray marching renderer with volumetric fog and soft shadows.",
    longDescription: "Developed real-time SDF-based ray marching renderer with volumetric fog, soft shadows, and ambient occlusion. Optimized for 60fps on mid-range hardware using distance field caching.",
    color: "#FF6B6B",
    image: img3,
    tags: ["GLSL", "Ray Marching", "SDF", "Real-time"],
    github: "https://github.com",
    demo: "https://demo.com",
  },
];

export function ProjectGallery() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  
  // Random shuffle on mount to simulate "Random Strategy" recommendation
  const [shuffledProjects, setShuffledProjects] = useState<Project[]>([]);

  useEffect(() => {
    // Keep UNSELF (Newest, ID 8) always first, shuffle the rest
    const newest = RAW_PROJECTS[0];
    const others = RAW_PROJECTS.slice(1);
    
    // Fisher-Yates shuffle for the rest
    for (let i = others.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [others[i], others[j]] = [others[j], others[i]];
    }
    
    setShuffledProjects([newest, ...others]);
  }, []);

  const filteredProjects = useMemo(() => {
    // If we haven't hydrated the shuffle yet, return empty or raw
    const baseList = shuffledProjects.length > 0 ? shuffledProjects : RAW_PROJECTS;

    const filtered = baseList.filter((project) => {
      const matchesSearch =
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        );
      const matchesFilter =
        activeFilter === "all" || project.category === activeFilter;

      return matchesSearch && matchesFilter;
    });

    // Limit to max 6 items
    return filtered.slice(0, 6);
  }, [shuffledProjects, searchQuery, activeFilter]);

  return (
    <div className="min-h-screen px-8 py-20 relative">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#233554] to-transparent opacity-50" />

      {/* Header Section */}
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

        {/* Search & Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex flex-col md:flex-row justify-between items-center gap-6 bg-[#112240]/30 p-4 rounded-2xl backdrop-blur-sm border border-[#233554]"
        >
            
          {/* Filter Tabs */}
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
                    <span className="relative z-10">{category.label}</span>
                </button>
             ))}
          </div>

          {/* Search Input */}
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative w-full md:w-64 group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-[#8892B0] group-focus-within:text-[#64FFDA] transition-colors" />
                </div>
                <input
                type="text"
                placeholder="Search technologies..."
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
            
            {/* Shuffle Button (Visual Indicator of Random Strategy) */}
             <button 
                onClick={() => {
                    // Re-shuffle logic for user interaction
                    const currentList = [...shuffledProjects];
                    for (let i = currentList.length - 1; i > 0; i--) {
                        const j = Math.floor(Math.random() * (i + 1));
                        [currentList[i], currentList[j]] = [currentList[j], currentList[i]];
                    }
                    setShuffledProjects(currentList);
                }}
                className="p-2 rounded-lg bg-[#112240] border border-[#233554] text-[#64FFDA] hover:bg-[#233554] transition-colors tooltip"
                title="Shuffle Suggestions"
             >
                 <Shuffle className="w-4 h-4" />
             </button>
          </div>
        </motion.div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        <AnimatePresence mode="popLayout">
            {filteredProjects.length > 0 ? (
                filteredProjects.map((project, index) => (
                    <ProjectCard
                        key={project.id}
                        project={project}
                        index={index}
                        isHovered={hoveredId === project.id}
                        onHover={setHoveredId}
                        onClick={setSelectedProject}
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
                    <p>No projects found matching your criteria.</p>
                    <button 
                        onClick={() => { setSearchQuery(""); setActiveFilter("all"); }}
                        className="text-[#64FFDA] hover:underline text-sm"
                    >
                        Clear filters
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
      </div>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
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
}

const ProjectCard = React.forwardRef<HTMLDivElement, ProjectCardProps>(({
  project,
  index,
  isHovered,
  onHover,
  onClick,
}, ref) => {
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
          borderColor: isHovered
            ? project.color
            : `${project.color}40`,
          boxShadow: isHovered
            ? `0 0 30px ${project.color}20` 
            : "none",
        }}
        whileHover={{ scale: 1.02 }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 20,
        }}
      >
        {/* Project Image */}
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
          {/* Gradient overlay */}
          <div
            className="absolute inset-0 transition-opacity duration-300"
            style={{
              background: `linear-gradient(180deg, transparent 40%, rgba(2, 12, 27, 0.95) 100%)`,
              opacity: isHovered ? 0.8 : 1
            }}
          />
        </div>

        {/* Content */}
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
              {project.category}
            </span>

            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: isHovered ? 1 : 0,
                scale: isHovered ? 1 : 0,
              }}
              className="backdrop-blur-sm rounded-full p-2 border border-white/10"
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.5)",
              }}
            >
              <Eye
                className="w-5 h-5"
                style={{ color: project.color }}
              />
            </motion.div>
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

            {/* Tech Tags */}
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
});

interface ProjectModalProps {
  project: Project;
  onClose: () => void;
}

function ProjectModal({ project, onClose }: ProjectModalProps) {
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
        {/* Modal Background Decor */}
        <div className="absolute top-0 right-0 p-32 opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" style={{ backgroundColor: project.color }}></div>

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
                {project.category}
                </span>
                <div className="h-px w-10 bg-[#233554]"></div>
            </div>
           
            <h2 className="text-3xl md:text-4xl font-bold text-[#E6F1FF]">
              {project.title}
            </h2>
            {/* Added subtitle to modal */}
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
             {/* Project Image in Modal */}
            <div
            className="aspect-video rounded-xl mb-8 overflow-hidden relative group"
            style={{
                border: `1px solid ${project.color}30`,
            }}
            >
            <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F] via-transparent to-transparent opacity-60"></div>
            </div>

            <div className="grid md:grid-cols-[2fr_1fr] gap-8">
                <div>
                    <h3 className="text-sm uppercase tracking-wider text-[#64FFDA] font-bold mb-4">About Project</h3>
                    <p className="text-base leading-relaxed text-[#8892B0] mb-6 whitespace-pre-line">
                        {project.longDescription || project.description}
                    </p>
                    
                    {/* Credits Section */}
                    {project.credits && (
                        <div className="mt-8 pt-6 border-t border-[#233554]/50">
                            <h3 className="text-xs uppercase tracking-wider text-[#8892B0] font-bold mb-3">Project Credits</h3>
                            <pre className="text-xs text-[#64FFDA] font-mono whitespace-pre-wrap leading-relaxed">
                                {project.credits}
                            </pre>
                        </div>
                    )}
                </div>
                
                <div className="bg-[#112240]/50 p-6 rounded-xl border border-[#233554]">
                    <h3 className="text-sm uppercase tracking-wider text-[#E6F1FF] font-bold mb-4">Technologies</h3>
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
              className="flex-1 py-3 border rounded-lg flex items-center justify-center gap-2 transition-all font-mono font-bold text-sm"
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
              SOURCE CODE
            </motion.a>
          )}
          {project.demo && (
            <motion.a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 py-3 rounded-lg flex items-center justify-center gap-2 transition-all font-mono font-bold text-sm shadow-lg"
              style={{
                backgroundColor: project.color,
                color: "#0A192F",
                boxShadow: `0 0 20px ${project.color}40`,
              }}
            >
              <ExternalLink className="w-4 h-4" />
              LIVE DEMO
            </motion.a>
          )}

          {/* Placeholder for future detailed view */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 py-3 border rounded-lg flex items-center justify-center gap-2 transition-all font-mono font-bold text-sm"
            style={{
              borderColor: "#233554",
              color: "#8892B0",
              backgroundColor: "transparent",
            }}
            onClick={() => {/* Future navigation logic */}}
          >
            <ArrowRight className="w-4 h-4" />
            PROJECT PAGE
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}