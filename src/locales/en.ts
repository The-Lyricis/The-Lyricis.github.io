import type { Messages } from "./types";

const en: Messages = {
  navigation: {
    home: "Home",
    about: "About",
    services: "Services",
    skills: "Skills",
    projects: "Projects",
    contact: "Contact",
    resume: "Resume",
  },
  hero: {
    viewProjects: "View Projects",
    contact: "Contact",
  },
  about: {
    intro: {
      prefix: "I'm a ",
      technicalArtist: "Technical Artist",
      connector: " and ",
      gameDeveloper: "Game Developer",
      suffix:
        " focused on real-time delivery: high-quality visuals, solid tooling, and performance that holds up.",
    },
    summary:
      "I build systems and workflows that reduce iteration cost, keep frame-time stable, and help creative teams move faster from first prototype to final polish.",
    highlights: {
      shaderDevelopment:
        "Writing custom HLSL/GLSL shaders to create unique visual identities.",
      gameplayEngineering:
        "Building robust systems that power engaging interactive experiences.",
      graphicsResearch:
        "Implementing cutting-edge rendering techniques from academic papers.",
      performanceOptimization:
        "Profiling and optimizing to ensure 60+ FPS on target hardware.",
      vfxSystems:
        "Designing complex particle systems and visual effects architectures.",
      toolAuthoring:
        "Creating custom editors that streamline the artistic workflow.",
      proceduralGeneration:
        "Algorithmic creation of infinite worlds and assets.",
      pipelineArchitecture:
        "Automating the journey from content creation to game engine.",
    },
  },
  manifesto: {
    paragraphs: [
      "Outside of work, I stay close to art through drawing, photography, games, and films. I'm drawn to light, composition, and rhythm. I pay attention to how a scene is framed, how color sets the mood, and how pacing shapes emotion. These everyday observations quietly build my sense of taste, one detail at a time.",
      "Photography trains me to wait for the right moment: a subtle gesture, a shift of shadow, or a reflection that turns ordinary space into something cinematic. Drawing does the opposite. It slows time down and helps me break a scene into shapes and values, so I can understand why a visual choice feels balanced, tense, or calm.",
      "Games and films extend that practice into constructed worlds. I notice how environments guide the eye, how camera movement changes meaning, and how silence can be as expressive as action. Sometimes I pause just to take a photo in-game, because a single frame can carry atmosphere, story, and emotion without a line of dialogue.",
    ],
    collapse: "Collapse",
  },
  services: {
    subtitle:
      "Bridging the gap between creative vision and technical reality.",
    outputLabel: "OUTPUT:",
    capabilities: {
      shaderEngineering:
        "Custom HLSL/GLSL shaders for unique visual identities.",
      performanceOps:
        "Using profiling tools to identify bottlenecks and optimize CPU/GPU, memory, and draw calls for stable 60+ FPS.",
      toolDevelopment:
        "Editor extensions and CLI tools to accelerate art teams.",
      proceduralTech:
        "Algorithmic generation for infinite worlds and assets.",
      renderPipelines:
        "Customizing scriptable render pipelines (URP/HDRP).",
      assetPipelines:
        "Automated import/export and validation workflows.",
    },
    pipeline: {
      discoveryScope: {
        desc: "Clarify goals, constraints, and success metrics. Define budgets for frame time, memory, and visual targets before building.",
        output: "Tech Brief + Budgets",
      },
      prototypeBenchmark: {
        desc: "Build a focused prototype to validate feasibility. Benchmark early to de-risk performance and visual quality on target hardware.",
        output: "Proof of Concept + Benchmark Report",
      },
      implementation: {
        desc: "Develop modular, production-ready systems with clean interfaces. Keep them maintainable, testable, and easy to iterate on.",
        output: "Production System",
      },
      qualityPerformancePass: {
        desc: "Polish the experience to meet both visual and technical targets: readability, consistency, and frame-time stability. Iterate with profiling and visual reviews to make sure it feels right and runs well.",
        output: "Quality-Approved Build",
      },
      deliveryHandoff: {
        desc: "Polish, document, and hand off with clear usage notes. Ensure the team can extend and troubleshoot confidently.",
        output: "Shipped Feature + Documentation",
      },
    },
  },
  experience: {
    descriptions: {
      "future-3":
        "Evolving into a core technical pillar. Leading technical art teams, defining rendering pipelines for next-gen platforms.",
      "future-2":
        "Transitioning from academic to professional mastery. Focusing on production-proven tool chains and shader optimization.",
      "future-1":
        "Gaining diverse industry exposure through high-intensity internships in game engines and web interactive graphics.",
      chalmers:
        "Pursuing M.Sc. with a focus on Interaction Design, Game Design, Game Development, Advanced Computer Graphics, and Real-time Rendering systems.",
      "funplus-ft":
        "Developed shader systems and technical art tools for the central game engine. Optimized rendering pipelines and created workflow automation tools.",
      "funplus-intern":
        "Created visual effects systems, custom shaders, and performance optimization for mobile game projects.",
      seasun:
        "Assisted in gameplay programming and technical implementation for AAA mobile game projects. Developed tools and optimized game systems.",
      jilin:
        "Studied software engineering fundamentals, computer graphics, game development, and procedural generation techniques.",
    },
  },
  projects: {
    categoryLabels: {
      all: "All Projects",
      ta: "Technical Art",
      gamedev: "Game Dev",
      graphics: "Graphics",
    },
    searchPlaceholder: "Search technologies...",
    shuffleTitle: "Shuffle Suggestions",
    emptyState: "No projects found matching your criteria.",
    clearFilters: "Clear filters",
    aboutProject: "About Project",
    projectCredits: "Project Credits",
    technologies: "Technologies",
    sourceCode: "SOURCE CODE",
    liveDemo: "LIVE DEMO",
    projectPage: "PROJECT PAGE",
  },
  contact: {
    errors: {
      nameRequired: "Name is required",
      nameMin: "Name must be at least 2 characters",
      emailRequired: "Email is required",
      emailInvalid: "Please enter a valid email",
      subjectRequired: "Subject is required",
      subjectMin: "Subject must be at least 3 characters",
      messageRequired: "Message is required",
      messageMin: "Message must be at least 10 characters",
    },
    toasts: {
      fixErrorsTitle: "Please fix the errors in the form",
      fixErrorsDescription: "Check all fields and try again",
      openedTitle: "Email draft opened",
      openedDescription: "If nothing opened, use the direct email listed below.",
    },
    intro:
      "I am actively seeking new opportunities to contribute to innovative game projects. Whether you're a recruiter scouting for talent, a developer looking for collaboration, or just want to discuss graphics tech, my inbox is always open.",
    labels: {
      name: "Name",
      email: "Email",
      subject: "Subject",
      message: "Message",
      emailCard: "Email",
      location: "Location",
      availability: "Current Availability",
    },
    placeholders: {
      name: "Your Name",
      email: "your@email.com",
      subject: "What's this about?",
      message: "Tell me about your project...",
    },
    buttons: {
      openDraft: "Open Email Draft",
      opening: "Opening...",
      draftReady: "Draft Ready",
      failed: "Failed to Send",
    },
    meta: {
      responseTime: "I'll respond within 24 hours",
      locationValue: "Gothenburg, Sweden",
      locationAvailability: "Open to remote & on-site work",
      availableForNewProjects: "Available for new projects",
      availabilityBody:
        "I'm currently accepting freelance projects and full-time opportunities. Especially interested in innovative graphics programming and technical art challenges.",
    },
  },
  footer: {
    email: "Email",
    linkedin: "LinkedIn",
    copyright: "© 2026 Jiliang Ye · Technical Artist & Game Developer",
  },
};

export default en;
