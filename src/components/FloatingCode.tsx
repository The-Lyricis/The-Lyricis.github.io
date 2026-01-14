import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";

interface CodeSnippet {
  id: number;
  text: string;
  x: number;
  y: number;
  color: string;
}

const snippets = [
  "void main()",
  "vec4 color",
  "float time",
  "return shader",
  "uniform mat4",
  "gl_Position",
  "texture2D()",
  "mix(a, b, t)",
  "normalize()",
  "dot(n, l)",
];

const colors = ["#64FFDA", "#4A9EFF", "#FF6B6B", "#FFD700"];

export function FloatingCode() {
  const [codeSnippets, setCodeSnippets] = useState<CodeSnippet[]>([]);

  // === Tunables（你主要调这几个） ===
  const SPAWN_INTERVAL_MS = 450; // 2000 -> 450：频率更高
  const SNIPPETS_PER_TICK = 2; // 每次生成几个（密度倍增）
  const LIFE_MS = 6500; // 每个 snippet 存活时间（动画时长）
  const MAX_ON_SCREEN = 40; // 同屏最大数量（防止性能崩）
  // =================================

  // 用于生成唯一ID的计数器
  const idCounter = useRef(0);

  useEffect(() => {
    const spawnOne = (): CodeSnippet => {
      idCounter.current += 1;
      return {
        id: idCounter.current,
        text: snippets[Math.floor(Math.random() * snippets.length)],
        x: Math.random() * 100,
        y: Math.random() * 100,
        color: colors[Math.floor(Math.random() * colors.length)],
      };
    };

    const interval = setInterval(() => {
      const batch: CodeSnippet[] = Array.from(
        { length: SNIPPETS_PER_TICK },
        spawnOne
      );

      setCodeSnippets((prev) => {
        const next = [...prev, ...batch];
        // 限制上限：超了就裁掉最早的
        return next.length > MAX_ON_SCREEN
          ? next.slice(next.length - MAX_ON_SCREEN)
          : next;
      });

      // 到期自动移除（为每个 snippet 单独定时）
      batch.forEach((snip) => {
        setTimeout(() => {
          setCodeSnippets((prev) => prev.filter((s) => s.id !== snip.id));
        }, LIFE_MS);
      });
    }, SPAWN_INTERVAL_MS);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <AnimatePresence>
        {codeSnippets.map((snippet) => (
          <motion.div
            key={snippet.id}
            className="absolute text-xs font-mono"
            style={{
              left: `${snippet.x}%`,
              top: `${snippet.y}%`,
              color: snippet.color,
              textShadow: `0 0 10px ${snippet.color}`,
            }}
            initial={{ opacity: 0, scale: 0, rotate: -10 }}
            animate={{
              opacity: [0, 0.65, 0.65, 0],
              scale: [0, 1, 1, 0.8],
              rotate: [0, 0, 0, 10],
              y: [-20, -80], // 上浮更明显
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: LIFE_MS / 1000,
              ease: "easeOut",
            }}
          >
            {snippet.text}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
