import React from "react";
import { motion } from "motion/react";
import {
  Code2,
  Lightbulb,
  Cpu,
  Zap,
  Palette,
  Wand2,
  Wrench,
  Box,
  Layers,
  GitBranch,
} from "lucide-react";

export function AboutSection() {
  const highlights = [
    {
      icon: <Code2 className="w-6 h-6" />,
      title: "Shader Development",
      description:
        "Writing custom HLSL/GLSL shaders to create unique visual identities",
    },
    {
      icon: <Lightbulb className="w-6 h-6" />,
      title: "Gameplay Engineering",
      description:
        "Building robust systems that power engaging interactive experiences",
    },
    {
      icon: <Cpu className="w-6 h-6" />,
      title: "Graphics Research",
      description:
        "Implementing cutting-edge rendering techniques from academic papers",
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Performance Optimization",
      description:
        "Profiling and optimizing to ensure 60+ FPS on target hardware",
    },
    {
      icon: <Wand2 className="w-6 h-6" />,
      title: "VFX Systems",
      description:
        "Designing complex particle systems and visual effects architectures",
    },
    {
      icon: <Wrench className="w-6 h-6" />,
      title: "Tool Authoring",
      description:
        "Creating custom editors that streamline the artistic workflow",
    },
    {
      icon: <Box className="w-6 h-6" />,
      title: "Procedural Generation",
      description:
        "Algorithmic creation of infinite worlds and assets",
    },
    {
      icon: <Layers className="w-6 h-6" />,
      title: "Pipeline Architecture",
      description:
        "Automating the journey from content creation to game engine",
    },
  ];

  return (
    <div className="min-h-screen px-8 py-20 flex items-center justify-center">
      <div className="max-w-6xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-5xl font-bold text-[#E6F1FF] tracking-tight mb-4"
            >
              ABOUT <span className="text-[#64FFDA]">ME</span>
            </motion.h2>
            <motion.div 
              initial={{ opacity: 0, width: 0 }}
              whileInView={{ opacity: 1, width: "100px" }}
              viewport={{ once: true }}
              className="h-1 bg-[#233554] mx-auto rounded-full overflow-hidden"
            >
              <div className="h-full bg-[#64FFDA] w-1/2 animate-pulse" />
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-center mb-16 max-w-4xl mx-auto"
          >
            <p
              className="text-xl leading-loose mb-6"
              style={{ color: "#CCD6F6" }}
            >
              I’m a <span style={{ color: "#64FFDA" }}>Technical Artist</span> and <span style={{ color: "#4A9EFF" }}>Game Developer</span> focused on real-time delivery: high-quality visuals, solid tooling, and performance that holds up.
            </p>
            <p
              className="text-lg leading-loose"
              style={{ color: "#8892B0" }}
            >
              I build systems and workflows that reduce iteration cost, keep frame-time stable, and help creative teams move faster—from first prototype to final polish.
            </p>
          </motion.div>

          {/* Infinite Horizontal Carousel */}
          <div className="relative py-8">
            <style>{`
              @keyframes scroll {
                0%   { transform: translateX(0); }
                100% { transform: translateX(-50%); }
              }
              .carousel-track {
                animation: scroll 40s linear infinite;
                will-change: transform;
              }
              .carousel-track:hover {
                animation-play-state: paused;
              }

              /* 关键：用 mask 让内容在左右边缘渐隐（不会出现“半透明框”） */
              .carousel-viewport {
                overflow: hidden;
              
                /* 给 hover 上移留缓冲区（可调大） */
                padding: 18px 0;
                margin: -18px 0;
              
                /* 关键：左右边缘渐隐（保留你原来的 mask） */
                -webkit-mask-image: linear-gradient(
                  to right,
                  transparent 0%,
                  rgba(0,0,0,1) 12%,
                  rgba(0,0,0,1) 88%,
                  transparent 100%
                );
                mask-image: linear-gradient(
                  to right,
                  transparent 0%,
                  rgba(0,0,0,1) 12%,
                  rgba(0,0,0,1) 88%,
                  transparent 100%
                );
                -webkit-mask-repeat: no-repeat;
                mask-repeat: no-repeat;
                -webkit-mask-size: 100% 100%;
                mask-size: 100% 100%;
              }
            `}</style>

            {/* 注意：这里不再需要左右两个“渐变遮罩 DIV” */}
            <div className="carousel-viewport">
              <div className="flex carousel-track overflow-visible">
                {/* First set */}
                {highlights.map((highlight, index) => (
                  <motion.div
                    key={`first-${highlight.title}`}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      delay: 0.3 + index * 0.05,
                      duration: 0.5,
                    }}
                    whileHover={{ y: -5 }}
                    className="relative group flex-shrink-0"
                    style={{
                      width: "280px",
                      marginRight: "24px",
                    }}
                  >
                    <div
                      className="backdrop-blur-sm border rounded-lg p-6 h-full transition-all duration-300"
                      style={{
                        backgroundColor:
                          "rgba(10, 25, 47, 0.5)",
                        borderColor: "rgba(100, 255, 218, 0.2)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor =
                          "#64FFDA";
                        e.currentTarget.style.boxShadow =
                          "0 0 20px rgba(100, 255, 218, 0.3)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor =
                          "rgba(100, 255, 218, 0.2)";
                        e.currentTarget.style.boxShadow =
                          "none";
                      }}
                    >
                      <div
                        className="mb-4 group-hover:scale-110 transition-transform duration-300"
                        style={{ color: "#64FFDA" }}
                      >
                        {highlight.icon}
                      </div>
                      <h3
                        className="text-base mb-2"
                        style={{ color: "#E6F1FF" }}
                      >
                        {highlight.title}
                      </h3>
                      <p
                        className="text-sm leading-loose"
                        style={{ color: "#8892B0" }}
                      >
                        {highlight.description}
                      </p>
                    </div>
                  </motion.div>
                ))}

                {/* Duplicate set for seamless loop */}
                {highlights.map((highlight, index) => (
                  <motion.div
                    key={`second-${highlight.title}`}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      delay: 0.3 + index * 0.05,
                      duration: 0.5,
                    }}
                    whileHover={{ y: -5 }}
                    className="relative group flex-shrink-0"
                    style={{
                      width: "280px",
                      marginRight: "24px",
                    }}
                  >
                    <div
                      className="backdrop-blur-sm border rounded-lg p-6 h-full transition-all duration-300"
                      style={{
                        backgroundColor:
                          "rgba(10, 25, 47, 0.5)",
                        borderColor: "rgba(100, 255, 218, 0.2)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor =
                          "#64FFDA";
                        e.currentTarget.style.boxShadow =
                          "0 0 20px rgba(100, 255, 218, 0.3)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor =
                          "rgba(100, 255, 218, 0.2)";
                        e.currentTarget.style.boxShadow =
                          "none";
                      }}
                    >
                      <div
                        className="mb-4 group-hover:scale-110 transition-transform duration-300"
                        style={{ color: "#64FFDA" }}
                      >
                        {highlight.icon}
                      </div>
                      <h3
                        className="text-base mb-2"
                        style={{ color: "#E6F1FF" }}
                      >
                        {highlight.title}
                      </h3>
                      <p
                        className="text-sm leading-loose"
                        style={{ color: "#8892B0" }}
                      >
                        {highlight.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}