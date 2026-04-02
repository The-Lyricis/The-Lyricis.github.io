import React from "react";
import { motion } from "motion/react";
import {
  Box,
  Code2,
  Cpu,
  Layers,
  Lightbulb,
  Wand2,
  Wrench,
  Zap,
} from "lucide-react";
import { useMessages } from "../i18n";

export function AboutSection() {
  const messages = useMessages();

  const highlights = [
    {
      icon: <Code2 className="w-6 h-6" />,
      title: "Shader Development",
      description: messages.about.highlights.shaderDevelopment,
    },
    {
      icon: <Lightbulb className="w-6 h-6" />,
      title: "Gameplay Engineering",
      description: messages.about.highlights.gameplayEngineering,
    },
    {
      icon: <Cpu className="w-6 h-6" />,
      title: "Graphics Research",
      description: messages.about.highlights.graphicsResearch,
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Performance Optimization",
      description: messages.about.highlights.performanceOptimization,
    },
    {
      icon: <Wand2 className="w-6 h-6" />,
      title: "VFX Systems",
      description: messages.about.highlights.vfxSystems,
    },
    {
      icon: <Wrench className="w-6 h-6" />,
      title: "Tool Authoring",
      description: messages.about.highlights.toolAuthoring,
    },
    {
      icon: <Box className="w-6 h-6" />,
      title: "Procedural Generation",
      description: messages.about.highlights.proceduralGeneration,
    },
    {
      icon: <Layers className="w-6 h-6" />,
      title: "Pipeline Architecture",
      description: messages.about.highlights.pipelineArchitecture,
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
            <p className="text-xl leading-loose mb-6" style={{ color: "#CCD6F6" }}>
              {messages.about.intro.prefix}
              <span style={{ color: "#64FFDA" }}>
                {messages.about.intro.technicalArtist}
              </span>
              {messages.about.intro.connector}
              <span style={{ color: "#4A9EFF" }}>
                {messages.about.intro.gameDeveloper}
              </span>
              {messages.about.intro.suffix}
            </p>
            <p className="text-lg leading-loose" style={{ color: "#8892B0" }}>
              {messages.about.summary}
            </p>
          </motion.div>

          <div className="relative py-8">
            <style>{`
              @keyframes scroll {
                0% { transform: translateX(0); }
                100% { transform: translateX(-50%); }
              }
              .carousel-track {
                animation: scroll 40s linear infinite;
                will-change: transform;
              }
              .carousel-track:hover {
                animation-play-state: paused;
              }
              .carousel-viewport {
                overflow: hidden;
                padding: 18px 0;
                margin: -18px 0;
                -webkit-mask-image: linear-gradient(
                  to right,
                  transparent 0%,
                  rgba(0, 0, 0, 1) 12%,
                  rgba(0, 0, 0, 1) 88%,
                  transparent 100%
                );
                mask-image: linear-gradient(
                  to right,
                  transparent 0%,
                  rgba(0, 0, 0, 1) 12%,
                  rgba(0, 0, 0, 1) 88%,
                  transparent 100%
                );
                -webkit-mask-repeat: no-repeat;
                mask-repeat: no-repeat;
                -webkit-mask-size: 100% 100%;
                mask-size: 100% 100%;
              }
            `}</style>

            <div className="carousel-viewport">
              <div className="flex carousel-track overflow-visible">
                {[...highlights, ...highlights].map((highlight, index) => (
                  <motion.div
                    key={`${highlight.title}-${index}`}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      delay: 0.3 + (index % highlights.length) * 0.05,
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
                        backgroundColor: "rgba(10, 25, 47, 0.5)",
                        borderColor: "rgba(100, 255, 218, 0.2)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "#64FFDA";
                        e.currentTarget.style.boxShadow =
                          "0 0 20px rgba(100, 255, 218, 0.3)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor =
                          "rgba(100, 255, 218, 0.2)";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    >
                      <div
                        className="mb-4 group-hover:scale-110 transition-transform duration-300"
                        style={{ color: "#64FFDA" }}
                      >
                        {highlight.icon}
                      </div>
                      <h3 className="text-base mb-2" style={{ color: "#E6F1FF" }}>
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
