import React from "react";
import { motion } from "motion/react";
import {
  Camera,
  Code2,
  Cpu,
  Gamepad2,
  Palette,
  Rocket,
} from "lucide-react";
import { useLocale } from "../i18n";

export function AboutSection() {
  const { locale } = useLocale();

  const content =
    locale === "zh"
      ? {
          title: "About Me",
          subtitle: "一个在技术与艺术交界处持续探索的多面创作者。",
          quote: "“技术是手段，艺术是目标，游戏是表达。”",
          identities: [
            {
              icon: <Code2 className="w-7 h-7" />,
              title: "程序员",
              description:
                "从底层引擎到可扩展系统架构，持续打磨清晰、稳定且高性能的代码实现。",
              tags: ["C++", "C#", "HLSL/GLSL", "Python"],
            },
            {
              icon: <Palette className="w-7 h-7" />,
              title: "创作者",
              description:
                "在技术与审美之间建立连接。对我来说，Technical Art 既是方法，也是表达语言。",
              tags: ["Shader Art", "VFX Design", "Procedural", "Digital Painting"],
            },
            {
              icon: <Camera className="w-7 h-7" />,
              title: "摄影爱好者",
              description:
                "记录光线、空间与瞬间，把现实中的观察转化为数字媒介中的视觉感受。",
              tags: ["Landscape", "Urban", "Cinematic", "Post-Processing"],
            },
            {
              icon: <Gamepad2 className="w-7 h-7" />,
              title: "玩家",
              description:
                "从《塞尔达》到《黑暗之魂》，长期而深入的游戏体验塑造了我对设计节奏和反馈的理解。",
              tags: ["RPG", "Souls-like", "Indie Games", "Action Adventure"],
            },
            {
              icon: <Cpu className="w-7 h-7" />,
              title: "图形技术探索者",
              description:
                "持续关注实时渲染，从光线追踪到体积效果，把图形技术当作长期研究方向。",
              tags: ["Ray Tracing", "PBR", "Volumetric", "SIGGRAPH"],
            },
            {
              icon: <Rocket className="w-7 h-7" />,
              title: "独立游戏开发者",
              description:
                "从概念到落地尽量保持完整控制。Hybrid Engine 是我持续实践与验证技术想法的试验场。",
              tags: ["Game Design", "Solo Dev", "Full Stack", "Publishing"],
            },
          ],
        }
      : {
          title: "About Me",
          subtitle:
            "A multi-faceted creator navigating the intersection of technology and art.",
          quote:
            '"Technology is the means, art is the goal, games are the expression."',
          identities: [
            {
              icon: <Code2 className="w-7 h-7" />,
              title: "Programmer",
              description:
                "Crafting elegant code and high-performance systems from low-level engines to scalable architectures.",
              tags: ["C++", "C#", "HLSL/GLSL", "Python"],
            },
            {
              icon: <Palette className="w-7 h-7" />,
              title: "Artist",
              description:
                "Bridging technology and artistic expression. Technical Art is my creative language.",
              tags: ["Shader Art", "VFX Design", "Procedural", "Digital Painting"],
            },
            {
              icon: <Camera className="w-7 h-7" />,
              title: "Photographer",
              description:
                "Capturing light and moments, translating real-world beauty into digital medium.",
              tags: ["Landscape", "Urban", "Cinematic", "Post-Processing"],
            },
            {
              icon: <Gamepad2 className="w-7 h-7" />,
              title: "Gamer",
              description:
                "Deep gaming experiences from Zelda to Dark Souls shape my design understanding.",
              tags: ["RPG", "Souls-like", "Indie Games", "Action Adventure"],
            },
            {
              icon: <Cpu className="w-7 h-7" />,
              title: "Graphics Enthusiast",
              description:
                "Exploring real-time rendering from ray tracing to volumetric effects.",
              tags: ["Ray Tracing", "PBR", "Volumetric", "SIGGRAPH"],
            },
            {
              icon: <Rocket className="w-7 h-7" />,
              title: "Indie Game Developer",
              description:
                "Full control from concept to release. Hybrid Engine is my technical playground.",
              tags: ["Game Design", "Solo Dev", "Full Stack", "Publishing"],
            },
          ],
        };

  return (
    <div className="h-full min-h-screen px-8 md:px-16 py-12 flex items-center justify-center overflow-y-auto">
      <div className="w-full">
        <div className="max-w-5xl w-full mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12 text-center"
          >
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-[#E6F1FF]">
              ABOUT <span className="text-[#64FFDA]">ME</span>
            </h2>
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              whileInView={{ opacity: 1, width: "60px" }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mx-auto mb-4 h-1 rounded-full bg-[#64FFDA]"
            />
            <p className="mx-auto max-w-2xl text-base leading-relaxed text-[#8892B0]">
              {content.subtitle}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            {content.identities.map((identity, index) => (
              <motion.div
                key={identity.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{
                  delay: index * 0.05,
                  duration: 0.5,
                }}
                className="group"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 pt-0.5">
                    <span className="text-2xl font-light text-[#64FFDA] opacity-40 group-hover:opacity-100 transition-opacity duration-300">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <div className="flex-1 border-l border-[#233554] pl-4 group-hover:border-[#64FFDA] transition-colors duration-300">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="text-[#64FFDA] opacity-60 group-hover:opacity-100 transition-opacity duration-300">
                        {identity.icon}
                      </div>
                      <h3 className="text-xl font-light text-[#E6F1FF]">
                        {identity.title}
                      </h3>
                    </div>

                    <p className="text-sm text-[#8892B0] leading-relaxed mb-3">
                      {identity.description}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {identity.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs font-mono text-[#64FFDA] opacity-50 hover:opacity-100 transition-opacity duration-200"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mt-10 pt-8 border-t border-[#233554]"
          >
            <p className="text-lg md:text-xl font-light text-[#64FFDA] italic">
              {content.quote}
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
