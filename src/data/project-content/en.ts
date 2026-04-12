import type { ProjectContentMap } from "./types";

const en: ProjectContentMap = {
  "8": {
    description:
      "UNSELF - a puzzle-driven visual novel in trembling monochrome, exploring identity and reflection through cosmic horror.",
    longDescription:
      "UNSELF is a puzzle-driven visual novel drawn in quivering black-and-white lines, an ink-and-shadow world where the visuals themselves carry meaning. Set under a cosmic-horror lens, the story follows a creature that wakes each day to a different face in the mirror, performing small rituals of adjustment and concealment as it searches for a stable self. The result is a compact, atmosphere-first experience built around reflection, ambiguity, and unease.\n\nHighlights:\n- Visual-first storytelling: trembling linework and \"breathing\" darkness as narrative language\n- Puzzle + VN structure: light puzzles that gate scenes and reinforce the theme of reflection\n- Cosmic-horror tone: quiet, ritual-like progression rather than jump-scare reliance\n- Game Jam delivery: built in a short jam timeframe, with focused scope and finish",
    tags: ["Narrative", "Puzzle", "Cosmic Horror", "Game Jam"],
    credits:
      "Credits: Jiliang Ye, Ao Wang, Zhengyang Gu, Yuxi Guo, Hang Wan\nAudio: Epidemic Sound (music & SFX)\nFont: Estonia",
  },
  "9": {
    subtitle: "A 2D pixel side-scrolling action adventure",
    description:
      "A curious little chick exploring a vibrant world filled with enemies, secrets, and new abilities.",
    longDescription:
      "Play as a curious little chick exploring a vibrant world filled with enemies, secrets, and new abilities. Fight through stages, unlock skills that expand your movement and combat options, and rescue your trapped friend, a pig, along the journey.",
    tags: ["2D", "Pixel Art", "Action Adventure", "Exploration"],
  },
  "7": {
    description:
      "A 15-day jam puzzle game with a quirky hand-drawn style and comedic storytelling.",
    longDescription:
      "A short, story-driven puzzle game made in 15 days. It blends hand-drawn, humorous visuals with light narrative moments, where players explore compact scenes, collect clues, and solve small logic puzzles to push the story forward. Built with a focus on clear interaction, readable composition, and punchy comedic timing.",
    tags: ["Game Jam", "Puzzle", "Narrative", "Comedy"],
  },
  "11": {
    description:
      "A top-down grid-based puzzle game jam project built around masks, where wearing a mask lets you control elemental creatures of the same color.",
    longDescription:
      "Cubie is a top-down, grid-based puzzle project created for the mask theme. In the demo, the player explores compact stages, picks up masks, and uses them to establish shared control over elemental creatures of the same color. Each mask changes which group you can command, while movement, blocking, hazards, and enemy traits turn every step into a small tactical puzzle.\n\nThe design mixes sokoban-like positioning with synchronized control: once a mask is equipped, all linked actors respond together, making spacing, order, and terrain interaction part of the solution. The result is a small but system-driven puzzle prototype built around control transfer, level logic, and getting every move to matter.",
    tags: ["Top-Down", "Grid Puzzle", "Mask Control", "Game Jam"],
  },
  "1": {
    subtitle: "A Personal Shader Library & Study Collection",
    description:
      "A curated collection of shader studies and visual experiments exploring rendering fundamentals and real-time art direction.",
    longDescription:
      "ShaderFactory is my personal shader library, a curated collection of shader studies and visual experiments. It includes a range of small, focused effects built to explore rendering fundamentals and real-time art direction, with clean parameter controls for quick iteration. I use it as both a learning archive and a reusable toolbox for future projects.\n\nHighlights:\n- A growing set of shader exercises and stylized effects, each isolated and easy to reuse\n- Artist-friendly parameters with sensible defaults for fast look-dev\n- Notes and variations that document what I learned and how each effect was built",
    tags: ["Shader Graph", "HLSL", "Unity", "Real-time Rendering"],
  },
  "3": {
    description:
      "Implemented a million-particle simulation system using compute shaders with collision detection.",
    longDescription:
      "Implemented a million-particle simulation system using compute shaders. Features include collision detection, force fields, particle spawning patterns, and real-time performance on mobile platforms.",
    tags: ["Compute Shaders", "GPU", "Particles", "VFX"],
  },
  "4": {
    description:
      "Built a Houdini Digital Asset (HDA) workflow integrated into Unity for fast, art-directable procedural generation.",
    longDescription:
      "Built a Houdini Digital Asset (HDA) workflow integrated into Unity for fast, art-directable procedural generation. Exposed key parameters through a clean UI, enabling rapid iteration on layout, density, and shape while keeping results consistent and reproducible across builds.\n\nKey Features:\n- Parametric generation: controllable size, noise, falloff, and distribution with real-time iteration\n- Reproducible outputs: seed-based generation to keep results stable across sessions\n- Unity-friendly workflow: one-click bake/export to meshes for downstream use\n- Artist-facing controls: organized parameter groups and sensible defaults for quick tuning",
    tags: ["Houdini", "Unity", "Procedural Generation", "Tooling"],
  },
  "6": {
    description:
      "Developed real-time SDF-based ray marching renderer with volumetric fog and soft shadows.",
    longDescription:
      "Developed real-time SDF-based ray marching renderer with volumetric fog, soft shadows, and ambient occlusion. Optimized for 60fps on mid-range hardware using distance field caching.",
    tags: ["GLSL", "Ray Marching", "SDF", "Real-time Rendering"],
  },
  "10": {
    description:
      "A personal engine study project focused on modern engine architecture, system implementation, and editor tooling.",
    longDescription:
      "Hybrid Engine is a personal project for studying and practicing modern engine architecture through hands-on implementation. The work is centered on understanding how core runtime systems collaborate, where module boundaries should live, and how editor-facing workflows connect back to engine fundamentals.\n\nKey Features:\n- Core runtime foundation with logging, events, input, windowing, and main loop management\n- OpenGL rendering backend with framebuffer-driven rendering and split Scene / Game viewports\n- EnTT-based ECS architecture with scene serialization and hierarchy data\n- Editor tooling with docking UI, Hierarchy, Inspector, Scene View, gizmo interaction, and object picking\n- Asset pipeline foundations with VFS, registry, .meta files, and import workflows for textures, meshes, materials, and scenes\n- Basic lighting support for directional lights and point lights\n- Early physics baseline with AABB collision and rigidbody iteration",
    tags: ["C++", "OpenGL", "ECS", "Editor"],
  },
};

export default en;
