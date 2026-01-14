import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { WeldingSparks } from "./shaders/WeldingSparks";

interface RobotWithLadderProps {
  letter: string;
  position: {
    x: number;
    y: number;
    baselineY: number;
    height: number;
    lineHeight: number;
  };
  isRepairing: boolean;
  onRepairComplete: () => void;
}

type Phase =
  | "arriving"
  | "setupScaffold"
  | "climbing"
  | "welding"
  | "climbingDown"
  | "teardownScaffold"
  | "movingToFront"
  | "leaving"
  | "hiding";

const sleep = (ms: number) =>
  new Promise<void>((r) => setTimeout(r, ms));

function tweenState(
  setter: React.Dispatch<React.SetStateAction<number>>,
  target: number,
  stepAbs: number,
  intervalMs: number,
  isCancelled: () => boolean,
) {
  return new Promise<void>((resolve) => {
    const id = window.setInterval(() => {
      if (isCancelled()) {
        window.clearInterval(id);
        resolve();
        return;
      }

      setter((prev) => {
        const dir = target >= prev ? 1 : -1;
        let next = prev + dir * Math.abs(stepAbs);
        const reached =
          (dir > 0 && next >= target) ||
          (dir < 0 && next <= target);

        if (reached) {
          next = target;
          window.clearInterval(id);
          resolve();
        }
        return next;
      });
    }, intervalMs);
  });
}

/** 2D 备用焊接火花：直接挂在枪头上，保证“必定显示” */
function SimpleWeldSparks({ active }: { active: boolean }) {
  if (!active) return null;

  return (
    <div className="absolute left-0 top-1/2 -translate-y-1/2 pointer-events-none">
      {Array.from({ length: 10 }).map((_, i) => (
        <motion.span
          key={i}
          className="absolute block"
          style={{
            width: 8,
            height: 2,
            borderRadius: 2,
            backgroundColor:
              i % 3 === 0 ? "#FFD700" : "#FF6B6B",
            boxShadow:
              i % 3 === 0
                ? "0 0 10px #FFD700"
                : "0 0 10px #FF6B6B",
          }}
          initial={{
            opacity: 0,
            x: 0,
            y: 0,
            rotate: 0,
            scaleX: 0.6,
          }}
          animate={{
            opacity: [0, 1, 0],
            x: [0, 12 + i * 2],
            y: [0, (i % 2 === 0 ? -1 : 1) * (6 + i)],
            rotate: [0, (i % 2 === 0 ? -1 : 1) * (25 + i * 3)],
            scaleX: [0.6, 1, 0.4],
          }}
          transition={{
            duration: 0.35 + (i % 3) * 0.08,
            repeat: Infinity,
            repeatDelay: 0.02,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}

/** 电焊机械臂：两段臂 + 关节 + 枪头，枪头自带火花挂点 */
function WeldingArm({
  isWelding,
  torchTipRef,
  baseRotate = -12,
  weldWobble = [-18, -24, -18],
}: {
  isWelding: boolean;
  torchTipRef: React.RefObject<HTMLDivElement>;
  baseRotate?: number;
  weldWobble?: number[];
}) {
  return (
    <motion.div
      className="absolute"
      style={{
        left: -10,
        top: 26,
        transformOrigin: "left center",
      }}
      animate={{
        rotate: isWelding ? weldWobble : baseRotate,
      }}
      transition={{
        duration: 0.18,
        repeat: isWelding ? Infinity : 0,
      }}
    >
      {/* 第一段臂 */}
      <div
        className="absolute"
        style={{
          width: 14,
          height: 3,
          borderRadius: 3,
          backgroundColor: "#2d4a6f",
          border: "1px solid rgba(100,255,218,0.8)",
          boxShadow: "0 0 6px rgba(100,255,218,0.25)",
        }}
      />
      {/* 关节 1 */}
      <div
        className="absolute"
        style={{
          left: 10,
          top: -2,
          width: 7,
          height: 7,
          borderRadius: 999,
          backgroundColor: "#64FFDA",
          boxShadow: "0 0 10px rgba(100,255,218,0.6)",
        }}
      />

      {/* 第二段臂 */}
      <motion.div
        className="absolute"
        style={{
          left: 14,
          top: 0,
          width: 16,
          height: 3,
          borderRadius: 3,
          backgroundColor: "#1e3a5f",
          border: "1px solid rgba(74,158,255,0.9)",
          boxShadow: "0 0 6px rgba(74,158,255,0.25)",
          transformOrigin: "left center",
        }}
        animate={{
          rotate: isWelding ? [18, 10, 18] : 14,
        }}
        transition={{
          duration: 0.18,
          repeat: isWelding ? Infinity : 0,
        }}
      />

      {/* 关节 2 */}
      <div
        className="absolute"
        style={{
          left: 26,
          top: -2,
          width: 7,
          height: 7,
          borderRadius: 999,
          backgroundColor: "#4A9EFF",
          boxShadow: "0 0 10px rgba(74,158,255,0.6)",
        }}
      />

      {/* 枪头 + 发光 + 火花挂点 */}
      <div
        ref={torchTipRef}
        className="absolute"
        style={{
          left: 34,
          top: -4,
          width: 12,
          height: 10,
          borderRadius: 3,
          backgroundColor: "#FF6B6B",
          boxShadow: isWelding
            ? "0 0 18px rgba(255,107,107,0.9)"
            : "0 0 6px rgba(255,107,107,0.4)",
          border: "1px solid rgba(255,255,255,0.18)",
        }}
      >
        {/* 枪嘴 */}
        <div
          className="absolute"
          style={{
            right: -6,
            top: 3,
            width: 8,
            height: 4,
            borderRadius: 2,
            backgroundColor: "#FFD700",
            boxShadow: isWelding
              ? "0 0 14px rgba(255,215,0,0.9)"
              : "0 0 6px rgba(255,215,0,0.4)",
          }}
        />
        {/* 2D 火花（保证显示） */}
        <SimpleWeldSparks active={isWelding} />
      </div>
    </motion.div>
  );
}

export function RobotWithLadder({
  letter,
  position,
  isRepairing,
  onRepairComplete,
}: RobotWithLadderProps) {
  const [phase, setPhase] = useState<Phase>("arriving");
  const [scaffoldHeight, setScaffoldHeight] = useState(0);
  const [robotY, setRobotY] = useState(0);

  // 焊枪枪头 DOM：用于（可选）给 WeldingSparks shader 提供更稳的坐标
  const torchTipRef = useRef<HTMLDivElement>(null);
  const [torchLocal, setTorchLocal] = useState<{
    x: number;
    y: number;
  } | null>(null);

  // Calculate heights based on lineHeight
  const lineH = position.lineHeight || position.height;
  const groundY = 0;
  const scaffoldTargetHeight = lineH * 0.425;
  const weldY = -lineH * 0.4;

  useEffect(() => {
    let cancelled = false;
    const isCancelled = () => cancelled;

    if (!isRepairing) {
      setPhase("arriving");
      setScaffoldHeight(0);
      setRobotY(0);
      return () => {
        cancelled = true;
      };
    }

    const sequence = async () => {
      setPhase("arriving");
      await sleep(500);

      // J / Y sequence
      setPhase("welding");
      await sleep(2500);

      setPhase("movingToFront");
      await sleep(500);

      setPhase("leaving");
      await sleep(500);

      setPhase("hiding");
      await sleep(300);

      if (!isCancelled()) onRepairComplete();
    };

    sequence();

    return () => {
      cancelled = true;
    };
  }, [
    isRepairing,
    letter,
    onRepairComplete,
    scaffoldTargetHeight,
  ]);

  // 可选：如果你的 WeldingSparks shader 仍然想用，这里给它更稳的“局部坐标”
  useEffect(() => {
    if (phase !== "welding") {
      setTorchLocal(null);
      return;
    }

    let raf = 0;
    const tick = () => {
      const tip = torchTipRef.current;
      if (tip) {
        // tip 的 offsetParent 就是 Robot 容器内部，取 offsetLeft/Top 更稳定
        setTorchLocal({
          x: tip.offsetLeft + tip.offsetWidth,
          y: tip.offsetTop + tip.offsetHeight / 2,
        });
      }
      raf = requestAnimationFrame(tick);
    };

    tick();
    return () => cancelAnimationFrame(raf);
  }, [phase]);

  if (!isRepairing && phase !== "hiding") return null;

  const configMap: Record<
    string,
    {
      startX: number;
      startY: number;
      endX: number;
      endY: number;
      rotation: number;
      robotFlip: number;
      showScaffold: boolean;
      showBack: boolean;
      rightmostX?: number;
    }
  > = {
    J: {
      startX: 0,
      startY: -lineH * 0.6,
      endX: 0,
      endY: weldY,
      rotation: 0,
      robotFlip: 1,
      showScaffold: false,
      showBack: false,
    },
    Y: {
      startX: -20,
      startY: groundY,
      rightmostX: 80,
      endX: 40,
      endY: groundY,
      rotation: 0,
      robotFlip: -1,
      showScaffold: false,
      showBack: false,
    },
  };

  const config = configMap[letter] || configMap["J"];

  const isArriving = phase === "arriving";
  const isLeaving = phase === "leaving";
  const isHiding = phase === "hiding";
  const isWelding = phase === "welding";
  const isMovingToFront = phase === "movingToFront";

  let robotX: number;
  if (letter === "Y") {
    if (isArriving)
      robotX = config.rightmostX || config.endX;
    else if (isMovingToFront) robotX = config.endX;
    else if (isLeaving)
      robotX = config.rightmostX || config.endX;
    else if (isHiding) robotX = config.startX;
    else robotX = config.endX;
  } else {
    robotX = isArriving
      ? config.startX
      : isLeaving || isHiding
        ? config.startX
        : config.endX;
  }

  const baseY = isArriving
    ? config.startY
    : isLeaving || isHiding
      ? config.startY
      : config.endY;
  const finalY = baseY + robotY;

  const robotZIndex =
    letter === "Y"
      ? isArriving || isMovingToFront || isLeaving || isHiding
        ? -1
        : 250
      : 250;

  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: isHiding ? -1 : 100 }}
    >
      <AnimatePresence>
        {(isRepairing || isHiding) && (
          <motion.div
            className="absolute"
            style={{
              left: position.x,
              top: position.baselineY,
              transform: "translateX(-50%)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: isHiding ? 0 : 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Scaffold for H - REMOVED */}
            
            {/* Robot */}
            <motion.div
              className="absolute"
              animate={{
                x: robotX,
                y: finalY,
                rotate: config.rotation,
              }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              style={{ zIndex: robotZIndex }}
            >
              {/* foot anchor */}
              <div
                style={{ transform: "translate(-50%, -100%)" }}
              >
                {/* flip wrapper */}
                <div
                  style={{
                    transform: `scaleX(${config.robotFlip})`,
                  }}
                >
                  <div className="relative">
                    {config.showBack ? (
                      // ================= BACK VIEW =================
                      <motion.div
                        className="relative"
                        animate={{
                          y: isWelding ? [0, -2, 0] : 0,
                        }}
                        transition={{
                          duration: 0.2,
                          repeat: isWelding ? Infinity : 0,
                        }}
                      >
                        {/* 低层：焊接手（被身体遮挡） */}
                        <div
                          className="absolute inset-0"
                          style={{ zIndex: 5 }}
                        >
                          <WeldingArm
                            isWelding={isWelding}
                            torchTipRef={torchTipRef}
                          />
                        </div>

                        {/* 高层：头+身（遮挡焊接手） */}
                        <div
                          className="relative"
                          style={{ zIndex: 10 }}
                        >
                          {/* 背面头部 */}
                          <div
                            className="w-12 h-10 rounded-t-lg border-2 relative"
                            style={{
                              backgroundColor: "#0f2744",
                              borderColor: "#64FFDA",
                              boxShadow:
                                "0 0 10px rgba(100, 255, 218, 0.25)",
                            }}
                          >
                            {/* vent */}
                            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                              {[...Array(3)].map((_, i) => (
                                <div
                                  key={i}
                                  className="w-1 h-3 rounded-full"
                                  style={{
                                    backgroundColor: "#4A9EFF",
                                    opacity: 0.6,
                                    boxShadow:
                                      "0 0 3px #4A9EFF",
                                  }}
                                />
                              ))}
                            </div>
                          </div>

                          {/* 背面身体 */}
                          <div
                            className="w-12 h-10 border-2 border-t-0 relative"
                            style={{
                              backgroundColor: "#0f2744",
                              borderColor: "#64FFDA",
                            }}
                          >
                            {/* 电源模块 */}
                            <div
                              className="w-8 h-6 mx-auto mt-1 rounded border-2 relative"
                              style={{
                                backgroundColor: "#1e3a5f",
                                borderColor: "#FF6B6B",
                                boxShadow:
                                  "inset 0 0 8px rgba(255, 107, 107, 0.25)",
                              }}
                            >
                              <motion.div
                                className="w-2 h-2 mx-auto mt-2 rounded-full"
                                style={{
                                  backgroundColor: isWelding
                                    ? "#FFD700"
                                    : "#64FFDA",
                                  boxShadow: isWelding
                                    ? "0 0 10px #FFD700"
                                    : "0 0 6px #64FFDA",
                                }}
                                animate={{
                                  opacity: isWelding
                                    ? [1, 0.5, 1]
                                    : [0.8, 1, 0.8],
                                }}
                                transition={{
                                  duration: isWelding
                                    ? 0.25
                                    : 1.8,
                                  repeat: Infinity,
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ) : (
                      // ================= FRONT VIEW (J / Y) =================
                      <motion.div
                        className="relative"
                        animate={{
                          y: isWelding ? [0, -2, 0] : 0,
                        }}
                        transition={{
                          duration: 0.2,
                          repeat: isWelding ? Infinity : 0,
                        }}
                      >
                        {/* Head */}
                        <div
                          className="w-12 h-10 rounded-t-lg border-2 relative"
                          style={{
                            backgroundColor: "#1e3a5f",
                            borderColor: "#64FFDA",
                            boxShadow:
                              "0 0 10px rgba(100, 255, 218, 0.25)",
                          }}
                        >
                          <motion.div
                            className="absolute top-3 left-1/2 -translate-x-1/2 w-6 h-2 rounded-full"
                            style={{
                              backgroundColor: isWelding
                                ? "#FF6B6B"
                                : "#64FFDA",
                              boxShadow: isWelding
                                ? "0 0 10px #FF6B6B"
                                : "0 0 10px #64FFDA",
                            }}
                            animate={{
                              opacity: isWelding
                                ? [1, 0.5, 1]
                                : 1,
                            }}
                            transition={{
                              duration: 0.25,
                              repeat: isWelding ? Infinity : 0,
                            }}
                          />
                        </div>

                        {/* Body */}
                        <div
                          className="w-12 h-8 border-2 border-t-0"
                          style={{
                            backgroundColor: "#2d4a6f",
                            borderColor: "#64FFDA",
                          }}
                        >
                          <div
                            className="w-6 h-4 mx-auto mt-1 rounded border"
                            style={{
                              backgroundColor: "#1e3a5f",
                              borderColor: "#4A9EFF",
                            }}
                          />
                        </div>

                        {/* 前视也换成机械电焊手（比你之前那根细线更像“工具”） */}
                        <WeldingArm
                          isWelding={isWelding}
                          torchTipRef={torchTipRef}
                          baseRotate={letter === "J" ? 10 : -12}
                          weldWobble={
                            letter === "J"
                              ? [10, 6, 10]
                              : [-18, -24, -18]
                          }
                        />
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Welding Sparks Shader（可选保留）：如果你的 WebGL shader 没显示，至少上面的 2D 火花一定会显示 */}
            {isWelding && torchLocal && (
              <div className="absolute inset-0 pointer-events-none">
                <WeldingSparks
                  x={torchLocal.x}
                  y={torchLocal.y}
                  isActive
                />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}