import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

type Pt = { x: number; y: number };
type Node = { x: number; y: number; frac: number }; // frac：该节点在整条路径长度中的位置比例(0~1)

type Circuit = {
  id: string;
  d: string;
  nodes: Node[];
  duration: number;
  delay: number;
};

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}
function randi(min: number, max: number) {
  return Math.floor(rand(min, max + 1));
}
function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}
function snap(v: number, grid: number) {
  return Math.round(v / grid) * grid;
}

function dist(a: Pt, b: Pt) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * 生成“电路板风格”的正交折线：
 * start -> (turns...) -> end
 * 同时计算每个点在路径中的长度比例，用于“线到哪，点才出现”
 */
function generateOrthPath(opts: {
  view: number;
  margin: number;
  grid: number;
  minTurns: number;
  maxTurns: number;
  minStep: number;
  maxStep: number;
}) {
  const {
    view,
    margin,
    grid,
    minTurns,
    maxTurns,
    minStep,
    maxStep,
  } = opts;

  // 起点
  let x = snap(rand(margin, view - margin), grid);
  let y = snap(rand(margin, view - margin), grid);

  const turns = randi(minTurns, maxTurns);
  const pts: Pt[] = [{ x, y }];

  let horizontal = Math.random() > 0.5;

  // 折点
  for (let i = 0; i < turns; i++) {
    const len =
      snap(rand(minStep, maxStep), grid) *
      (Math.random() > 0.5 ? 1 : -1);

    if (horizontal)
      x = snap(clamp(x + len, margin, view - margin), grid);
    else y = snap(clamp(y + len, margin, view - margin), grid);

    const last = pts[pts.length - 1];
    if (last.x !== x || last.y !== y) pts.push({ x, y });

    horizontal = !horizontal;
  }

  // 终点（“消失点”）
  const endLen =
    snap(rand(minStep, maxStep), grid) *
    (Math.random() > 0.5 ? 1 : -1);
  if (horizontal)
    x = snap(clamp(x + endLen, margin, view - margin), grid);
  else y = snap(clamp(y + endLen, margin, view - margin), grid);

  const last = pts[pts.length - 1];
  if (last.x !== x || last.y !== y) pts.push({ x, y });

  // 计算累计长度与比例
  const cum: number[] = [0];
  for (let i = 1; i < pts.length; i++) {
    cum[i] = cum[i - 1] + dist(pts[i - 1], pts[i]);
  }
  const total = cum[cum.length - 1] || 1;

  // path d
  const d = pts
    .map((p, idx) =>
      idx === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`,
    )
    .join(" ");

  // 节点：保留起点/终点，随机保留部分折点（避免过密）
  const nodes: Node[] = [];
  pts.forEach((p, idx) => {
    const isStart = idx === 0;
    const isEnd = idx === pts.length - 1;
    const keepMid = !isStart && !isEnd && Math.random() > 0.5;
    if (isStart || isEnd || keepMid) {
      nodes.push({ x: p.x, y: p.y, frac: cum[idx] / total });
    }
  });

  return { d, nodes };
}

export function CircuitLines() {
  // === 可调参数（按你目前风格）===
  const VIEW = 1000;
  const LINE_COUNT = 10; // 线条数量：加大更密
  const GRID = 20;
  const MARGIN = 60;
  const MIN_TURNS = 2;
  const MAX_TURNS = 5; // “max 折点”仍然保留
  const MIN_STEP = 120;
  const MAX_STEP = 260;

  const CYCLE_MS = 6500; // 多久整体重新随机一次（一直随机）
  const DRAW_PORTION = 0.32; // 线路“绘制阶段”占一个周期的比例（影响节点出现时机）
  // ===============================

  const [seed, setSeed] = useState(0);

  // 一直随机：每个周期刷新一次线路集合
  useEffect(() => {
    const t = window.setInterval(
      () => setSeed((s) => s + 1),
      CYCLE_MS,
    );
    return () => window.clearInterval(t);
  }, []);

  const circuits = useMemo<Circuit[]>(() => {
    // 每次 seed 变化重新生成路径
    return Array.from({ length: LINE_COUNT }, (_, i) => {
      const { d, nodes } = generateOrthPath({
        view: VIEW,
        margin: MARGIN,
        grid: GRID,
        minTurns: MIN_TURNS,
        maxTurns: MAX_TURNS,
        minStep: MIN_STEP,
        maxStep: MAX_STEP,
      });

      // 让所有线条在同一周期内循环，避免“刷新时正在跑一半被切断”的观感
      const duration = CYCLE_MS / 1000;

      return {
        id: `c-${seed}-${i}`,
        d,
        nodes,
        duration,
        delay: rand(0, 0.8), // 轻微错开
      };
    });
  }, [seed]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
      <svg
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`0 0 ${VIEW} ${VIEW}`}
        preserveAspectRatio="xMidYMid slice" // 保持圆不变形
      >
        <defs>
          <linearGradient
            id="circuit-gradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop
              offset="0%"
              style={{ stopColor: "#64FFDA", stopOpacity: 0 }}
            />
            <stop
              offset="50%"
              style={{ stopColor: "#64FFDA", stopOpacity: 1 }}
            />
            <stop
              offset="100%"
              style={{ stopColor: "#64FFDA", stopOpacity: 0 }}
            />
          </linearGradient>
        </defs>

        <AnimatePresence>
          {circuits.map((c, idx) => (
            <motion.g
              key={c.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
            >
              {/* 线条：保持你最初的 strokeWidth=2 */}
              <motion.path
                d={c.d}
                stroke="url(#circuit-gradient)"
                strokeWidth="1"
                fill="none"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{
                  // 画出 -> 保持 -> 淡出（循环）
                  pathLength: [0, 1, 1, 0],
                  opacity: [0, 1, 1, 0],
                }}
                transition={{
                  duration: c.duration,
                  repeat: Infinity,
                  ease: "linear",
                  delay: c.delay,
                  times: [0, DRAW_PORTION, 0.82, 1],
                }}
              />

              {/* 节点：不在一开始全显示；仅当“线画到该节点”后才开始出现 */}
              {c.nodes.map((n, i) => {
                // 节点出现时刻：线路绘制阶段 * 节点在路径中的位置比例
                const appearDelay =
                  c.delay + c.duration * DRAW_PORTION * n.frac;

                return (
                  <g key={`${c.id}-n-${i}`}>
                    {/* 实心点：r=4（与你最初一致） */}
                    <motion.circle
                      cx={n.x}
                      cy={n.y}
                      r="2"
                      fill="#64FFDA"
                      initial={{ opacity: 0, scale: 0.6 }}
                      animate={{
                        opacity: [0, 0.9, 0.6, 0.9],
                        scale: [0.8, 1.2, 1, 1.2],
                      }}
                      transition={{
                        delay: appearDelay,
                        duration: 1.8,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />

                    {/* 外圈：r=8，strokeWidth=1（与你最初一致） */}
                    <motion.circle
                      cx={n.x}
                      cy={n.y}
                      r="4"
                      fill="none"
                      stroke="#64FFDA"
                      strokeWidth="1"
                      initial={{ opacity: 0, scale: 0.6 }}
                      animate={{
                        opacity: [0, 0.8, 0],
                        scale: [0.6, 1.5],
                      }}
                      transition={{
                        delay: appearDelay,
                        duration: 2.0,
                        repeat: Infinity,
                        ease: "easeOut",
                      }}
                    />
                  </g>
                );
              })}
            </motion.g>
          ))}
        </AnimatePresence>
      </svg>
    </div>
  );
}