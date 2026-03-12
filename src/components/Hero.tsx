import React, { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { FolderGit2, Mail } from "lucide-react";
import { CircuitLines } from "./CircuitLines";
import { RobotWithLadder } from "./RobotWithLadder";

type RepairableLetter = "J" | "Y";

interface LetterState {
  letter: RepairableLetter;
  index: number;
  isBroken: boolean;
  isRepairing: boolean;
}

export function Hero() {
  const [letterStates, setLetterStates] = useState<LetterState[]>([
    {
      letter: "J",
      index: 8,
      isBroken: false,
      isRepairing: false,
    },
    {
      letter: "Y",
      index: 16,
      isBroken: false,
      isRepairing: false,
    },
  ]);
  const [letterPositions, setLetterPositions] = useState<
    Record<
      number,
      {
        x: number;
        y: number;
        baselineY: number;
        height: number;
        lineHeight: number;
      }
    >
  >({});

  const titleRef = useRef<HTMLHeadingElement>(null);
  const name = "Hi, I'm Jiliang Ye";
  const normalLetterStyle = {
    color: "#E6F1FF",
    textShadow: "0 0 20px rgba(100, 255, 218, 0.3)",
  };

  useEffect(() => {
    if (!titleRef.current) return;

    const updatePositions = () => {
      if (!titleRef.current) return;

      const spans = titleRef.current.querySelectorAll<HTMLSpanElement>(
        "span[data-char-index]",
      );
      const titleRect = titleRef.current.getBoundingClientRect();
      const entries = Array.from(spans).map((span) => {
        const idx = Number(span.dataset.charIndex);
        const rect = span.getBoundingClientRect();
        return { idx, rect };
      });

      const maxHeight = Math.max(...entries.map((entry) => entry.rect.height));
      const baselineY = titleRect.height * 0.78;
      const positions: typeof letterPositions = {};

      entries.forEach(({ idx, rect }) => {
        positions[idx] = {
          x: rect.left + rect.width / 2 - titleRect.left,
          y: rect.top + rect.height / 2 - titleRect.top,
          baselineY,
          height: rect.height,
          lineHeight: maxHeight,
        };
      });

      setLetterPositions(positions);
    };

    updatePositions();
    window.addEventListener("resize", updatePositions);

    return () => window.removeEventListener("resize", updatePositions);
  }, []);

  useEffect(() => {
    let currentIndex = 0;

    const breakInterval = setInterval(() => {
      setLetterStates((prev) => {
        const available = prev.filter((item) => !item.isBroken && !item.isRepairing);
        if (available.length === 0) return prev;

        const target = prev[currentIndex % 2];
        currentIndex += 1;

        return prev.map((item) =>
          item.letter === target.letter ? { ...item, isBroken: true } : item,
        );
      });
    }, 8000);

    return () => clearInterval(breakInterval);
  }, []);

  useEffect(() => {
    letterStates.forEach((letterState) => {
      if (!letterState.isBroken || letterState.isRepairing) return;

      const timer = window.setTimeout(() => {
        setLetterStates((prev) =>
          prev.map((item) =>
            item.letter === letterState.letter
              ? { ...item, isRepairing: true }
              : item,
          ),
        );
      }, 1500);

      return () => window.clearTimeout(timer);
    });
  }, [letterStates]);

  const handleRepairComplete = (letter: RepairableLetter) => {
    setLetterStates((prev) =>
      prev.map((item) =>
        item.letter === letter
          ? { ...item, isBroken: false, isRepairing: false }
          : item,
      ),
    );
  };

  const getLetterStyle = (index: number) => {
    const state = letterStates.find((item) => item.index === index);

    if (!state || (!state.isBroken && !state.isRepairing)) {
      return normalLetterStyle;
    }

    if (state.isBroken && !state.isRepairing) {
      return {
        color: "#FF6B6B",
        textShadow: "0 0 10px #FF6B6B, 0 0 20px #FF4500",
      };
    }

    return {
      color: "#8892B0",
      textShadow: "0 0 5px #8892B0",
    };
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-8 overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundColor: "rgba(10, 25, 47, 1)",
          zIndex: -20,
        }}
      />

      <CircuitLines />

      <div className="text-center relative">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative inline-block"
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ zIndex: -10 }}
          >
            {letterStates.map((letterState) => {
              if (letterState.letter !== "J" || !letterState.isRepairing) {
                return null;
              }

              return (
                <RobotWithLadder
                  key={`behind-${letterState.letter}`}
                  letter={letterState.letter}
                  position={
                    letterPositions[letterState.index] || {
                      x: 0,
                      y: 0,
                      baselineY: 0,
                      height: 0,
                      lineHeight: 0,
                    }
                  }
                  isRepairing={true}
                  onRepairComplete={() => handleRepairComplete(letterState.letter)}
                />
              );
            })}
          </div>

          <h1
            ref={titleRef}
            className="mb-6 relative"
            style={{
              fontSize: "clamp(3rem, 10vw, 8rem)",
              fontWeight: 900,
              zIndex: 0,
              whiteSpace: "pre",
            }}
          >
            {name.split("").map((char, index) => {
              const state = letterStates.find((item) => item.index === index);
              const isBroken = !!state?.isBroken && !state?.isRepairing;
              const isRepairing = !!state?.isRepairing;
              const isSpace = char === " ";

              return (
                <motion.span
                  data-char-index={index}
                  key={index}
                  className="inline-block"
                  style={{
                    ...getLetterStyle(index),
                    ...(isSpace ? { width: "0.3em" } : null),
                  }}
                  animate={
                    isBroken
                      ? {
                          opacity: [1, 0.3, 1, 0.5, 1, 0.2, 1],
                          scale: [1, 0.98, 1, 0.99, 1],
                        }
                      : isRepairing
                        ? { opacity: 1, scale: 1 }
                        : { opacity: 1, scale: 1 }
                  }
                  transition={
                    isBroken
                      ? {
                          duration: 0.8,
                          repeat: Infinity,
                          repeatType: "loop",
                        }
                      : { duration: 0.2 }
                  }
                >
                  {isSpace ? "\u00A0" : char}
                </motion.span>
              );
            })}
          </h1>

          <div
            className="absolute inset-0 pointer-events-none"
            style={{ zIndex: 10 }}
          >
            {letterStates.map((letterState) => {
              if (letterState.letter !== "Y" || !letterState.isRepairing) {
                return null;
              }

              return (
                <RobotWithLadder
                  key={`front-${letterState.letter}`}
                  letter={letterState.letter}
                  position={
                    letterPositions[letterState.index] || {
                      x: 0,
                      y: 0,
                      baselineY: 0,
                      height: 0,
                      lineHeight: 0,
                    }
                  }
                  isRepairing={true}
                  onRepairComplete={() => handleRepairComplete(letterState.letter)}
                />
              );
            })}
          </div>

          {[
            { top: -10, left: -10, rotate: 0 },
            { top: -10, right: -10, rotate: 90 },
            { bottom: -10, right: -10, rotate: 180 },
            { bottom: -10, left: -10, rotate: 270 },
          ].map((position, index) => (
            <motion.div
              key={index}
              className="absolute w-6 h-6"
              style={{
                ...position,
                borderTop: "2px solid #64FFDA",
                borderLeft: "2px solid #64FFDA",
                transform: `rotate(${position.rotate}deg)`,
                zIndex: 15,
              }}
              animate={{ opacity: [0.3, 0.8, 0.3] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: index * 0.2,
              }}
            />
          ))}
        </motion.div>

        <div className="flex items-center justify-center gap-6 mt-8 mb-12 relative z-10">
          <div className="relative">
            <p className="tracking-widest" style={{ color: "#8892B0" }}>
              TECHNICAL ARTIST • GAME DEVELOPER • GRAPHICS RESEARCHER
            </p>
            <motion.div
              className="absolute -bottom-1 left-0 h-0.5"
              style={{ backgroundColor: "#64FFDA" }}
              animate={{ width: ["0%", "100%", "0%"] }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="flex gap-4 justify-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              document.getElementById("featured-projects")?.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
            }}
            className="px-8 py-3 rounded-lg flex items-center gap-2 transition-all"
            style={{
              backgroundColor: "#64FFDA",
              color: "#0A192F",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = "0 0 20px rgba(100, 255, 218, 0.5)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <FolderGit2 className="w-5 h-5" />
            View Projects
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              document.getElementById("contact")?.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
            }}
            className="px-8 py-3 border-2 rounded-lg flex items-center gap-2 transition-all"
            style={{
              borderColor: "#64FFDA",
              color: "#64FFDA",
              backgroundColor: "transparent",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(100, 255, 218, 0.1)";
              e.currentTarget.style.boxShadow = "0 0 20px rgba(100, 255, 218, 0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <Mail className="w-5 h-5" />
            Contact
          </motion.button>
        </motion.div>
      </div>

      <motion.div
        className="absolute top-1/4 left-1/4 w-3 h-3 rounded-full"
        style={{ backgroundColor: "#64FFDA" }}
        animate={{
          y: [0, -20, 0],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute bottom-1/3 right-1/4 w-4 h-4 rounded-full"
        style={{ backgroundColor: "#4A9EFF" }}
        animate={{
          y: [0, 20, 0],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute top-1/2 left-1/3 w-2 h-2 rounded-full"
        style={{ backgroundColor: "#FF6B6B" }}
        animate={{
          x: [-10, 10, -10],
          opacity: [0.4, 0.7, 0.4],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}
