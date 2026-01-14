import React, { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { FolderGit2, Mail } from "lucide-react";
import { RobotWithLadder } from "./RobotWithLadder";
import { CircuitLines } from "./CircuitLines";

interface HeroProps {
  onExplore: () => void;
}

type RepairableLetter = "H" | "J" | "e";

interface LetterState {
  letter: RepairableLetter;
  index: number;
  isBroken: boolean;
  isRepairing: boolean;
}

export function Hero({ onExplore }: HeroProps) {
  const [letterStates, setLetterStates] = useState<
    LetterState[]
  >([
    {
      letter: "J",
      index: 8,
      isBroken: false,
      isRepairing: false,
    }, // J at 8
    {
      letter: "Y",
      index: 16,
      isBroken: false,
      isRepairing: false,
    }, // Y at 16
  ]);

  const titleRef = useRef<HTMLHeadingElement>(null);
  const [letterPositions, setLetterPositions] = useState<{
    [key: number]: {
      x: number;
      y: number;
      baselineY: number;
      height: number;
      lineHeight: number;
    };
  }>({});

  const name = "Hi, I'm Jiliang Ye"; // One space after I'm

  // Define UNIFIED normal letter style - use this everywhere for consistency
  const NORMAL_LETTER_STYLE = {
    color: "#E6F1FF",
    textShadow: "0 0 20px rgba(100, 255, 218, 0.3)",
  };

  // Calculate letter positions
  useEffect(() => {
    if (!titleRef.current) return;

    const updatePositions = () => {
      const spans =
        titleRef.current!.querySelectorAll<HTMLSpanElement>(
          "span[data-char-index]",
        );
      const titleRect =
        titleRef.current!.getBoundingClientRect();

      const entries = Array.from(spans).map((span) => {
        const idx = Number(span.dataset.charIndex);
        const rect = span.getBoundingClientRect();
        const ch = span.textContent ?? "";
        return { idx, rect, ch };
      });

      const maxH = Math.max(
        ...entries.map((e) => e.rect.height),
      );

      // Manual baseline adjustment - calculate relative to titleRect
      // Position at 78% height (move up by 22% of container height)
      const baselineY = titleRect.height * (1 - 0.22); // 78% from top, or 22% up from bottom

      const positions: Record<
        number,
        {
          x: number;
          y: number;
          baselineY: number;
          height: number;
          lineHeight: number;
        }
      > = {};
      entries.forEach(({ idx, rect }) => {
        positions[idx] = {
          x: rect.left + rect.width / 2 - titleRect.left,
          y: rect.top + rect.height / 2 - titleRect.top,
          baselineY, // ★ Unified baseline for entire line
          height: rect.height,
          lineHeight: maxH, // ★ Unified reference height
        };
      });

      setLetterPositions(positions);
    };

    updatePositions();
    window.addEventListener("resize", updatePositions);
    return () =>
      window.removeEventListener("resize", updatePositions);
  }, []);

  // Sequential letter breaking system (not random - cycle through H -> J -> e -> H -> ...)
  useEffect(() => {
    let currentIndex = 0; // Track which letter to break next (0: H, 1: J, 2: e)

    const breakInterval = setInterval(() => {
      setLetterStates((prev) => {
        // Find letters that are not broken or being repaired
        const available = prev.filter(
          (ls) => !ls.isBroken && !ls.isRepairing,
        );
        if (available.length === 0) return prev;

        // Pick the next letter in sequence (J -> Y -> J -> ...)
        const toBrake = prev[currentIndex % 2];
        currentIndex++; // Move to next letter for next cycle

        return prev.map((ls) =>
          ls.letter === toBrake.letter
            ? { ...ls, isBroken: true }
            : ls,
        );
      });
    }, 8000); // Break a letter every 8 seconds

    return () => clearInterval(breakInterval);
  }, []);

  // Trigger robot repair when letter breaks
  useEffect(() => {
    letterStates.forEach((ls) => {
      if (ls.isBroken && !ls.isRepairing) {
        // Start repair after a short delay
        setTimeout(() => {
          setLetterStates((prev) =>
            prev.map((item) =>
              item.letter === ls.letter
                ? { ...item, isRepairing: true }
                : item,
            ),
          );
        }, 1500); // Wait 1.5s before robot arrives
      }
    });
  }, [letterStates]);

  const handleRepairComplete = (letter: RepairableLetter) => {
    console.log("🔧 Repair complete for letter:", letter);
    setLetterStates((prev) => {
      const newStates = prev.map((ls) =>
        ls.letter === letter
          ? { ...ls, isBroken: false, isRepairing: false }
          : ls,
      );
      console.log("📝 New letter states:", newStates);
      return newStates;
    });
  };

  const getLetterStyle = (index: number, char: string) => {
    const state = letterStates.find((ls) => ls.index === index);

    // If no state exists OR letter is fixed (not broken and not repairing)
    // Always use NORMAL_LETTER_STYLE for consistency
    if (!state || (!state.isBroken && !state.isRepairing)) {
      return NORMAL_LETTER_STYLE;
    }

    if (state.isBroken && !state.isRepairing) {
      // Broken letter - flickering orange/red
      return {
        color: "#FF6B6B",
        textShadow: "0 0 10px #FF6B6B, 0 0 20px #FF4500",
      };
    }

    if (state.isRepairing) {
      // Being repaired - stable dim
      return {
        color: "#8892B0",
        textShadow: "0 0 5px #8892B0",
      };
    }

    // Fallback to normal (should not reach here)
    return NORMAL_LETTER_STYLE;
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-8 overflow-hidden">
      {/* Semi-transparent backdrop to block global particle background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundColor: "rgba(10, 25, 47, 1)",
          zIndex: -20,
        }}
      />

      {/* Circuit Lines Background */}
      <CircuitLines />

      <div className="text-center relative">
        {/* Animated Title */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative inline-block"
        >
          {/* Layer 1: Behind text - J repair (descending from above) */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ zIndex: -10 }}
          >
            {letterStates.map((ls) => {
              // Only show J repair in the back layer
              if (ls.letter === "J" && ls.isRepairing) {
                return (
                  <RobotWithLadder
                    key={`behind-${ls.letter}`}
                    letter={ls.letter}
                    position={
                      letterPositions[ls.index] || {
                        x: 0,
                        y: 0,
                        baselineY: 0,
                        height: 0,
                        lineHeight: 0,
                      }
                    }
                    isRepairing={true}
                    onRepairComplete={() =>
                      handleRepairComplete(ls.letter)
                    }
                  />
                );
              }
              return null;
            })}
          </div>

          {/* Layer 2: Text */}
          <h1
            ref={titleRef}
            className="mb-6 relative"
            style={{
              fontSize: "clamp(3rem, 10vw, 8rem)",
              fontWeight: 900,
              zIndex: 0,
              whiteSpace: "pre", // ★ Preserve multiple spaces
            }}
          >
            {name.split("").map((char, index) => {
              const state = letterStates.find(
                (ls) => ls.index === index,
              );
              const style = getLetterStyle(index, char);

              const isBroken =
                !!state?.isBroken && !state?.isRepairing;
              const isRepairing = !!state?.isRepairing;

              // ★ Handle space display
              const isSpace = char === " ";
              const displayChar = isSpace ? "\u00A0" : char;

              return (
                <motion.span
                  data-char-index={index}
                  key={index}
                  className="inline-block"
                  style={{
                    ...style,
                    ...(isSpace ? { width: "0.3em" } : null), // ★ Fixed width for spaces (reduced from 0.6em)
                  }}
                  animate={
                    isBroken
                      ? {
                          // Flickering animation
                          opacity: [1, 0.3, 1, 0.5, 1, 0.2, 1],
                          scale: [1, 0.98, 1, 0.99, 1],
                        }
                      : isRepairing
                        ? { opacity: 1, scale: 1 } // Explicitly set for repairing state
                        : { opacity: 1, scale: 1 } // Explicitly set for normal state - CRITICAL FIX
                  }
                  transition={
                    isBroken
                      ? {
                          duration: 0.8,
                          repeat: Infinity,
                          repeatType: "loop",
                        }
                      : { duration: 0.2 } // Smooth transition back to normal
                  }
                >
                  {displayChar}
                </motion.span>
              );
            })}
          </h1>

          {/* Layer 3: In front of text - Y repair with ladder/side approach */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ zIndex: 10 }}
          >
            {letterStates.map((ls) => {
              // Only show Y repair in the front layer
              if (ls.letter === "Y" && ls.isRepairing) {
                return (
                  <RobotWithLadder
                    key={`front-${ls.letter}`}
                    letter={ls.letter}
                    position={
                      letterPositions[ls.index] || {
                        x: 0,
                        y: 0,
                        baselineY: 0,
                        height: 0,
                        lineHeight: 0,
                      }
                    }
                    isRepairing={true}
                    onRepairComplete={() =>
                      handleRepairComplete(ls.letter)
                    }
                  />
                );
              }
              return null;
            })}
          </div>

          {/* Construction Brackets */}
          {[
            { top: -10, left: -10, rotate: 0 },
            { top: -10, right: -10, rotate: 90 },
            { bottom: -10, right: -10, rotate: 180 },
            { bottom: -10, left: -10, rotate: 270 },
          ].map((pos, i) => (
            <motion.div
              key={i}
              className="absolute w-6 h-6"
              style={{
                ...pos,
                borderTop: "2px solid #64FFDA",
                borderLeft: "2px solid #64FFDA",
                transform: `rotate(${pos.rotate}deg)`,
                zIndex: 15,
              }}
              animate={{
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </motion.div>

        {/* Subtitle */}
        <div className="flex items-center justify-center gap-6 mt-8 mb-12 relative z-10">
          <div className="relative">
            <p
              className="tracking-widest"
              style={{ color: "#8892B0" }}
            >
              TECHNICAL ARTIST · GAME DEVELOPER · GRAPHICS
              RESEARCHER
            </p>
            {/* Underline animation */}
            <motion.div
              className="absolute -bottom-1 left-0 h-0.5"
              style={{ backgroundColor: "#64FFDA" }}
              animate={{
                width: ["0%", "100%", "0%"],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>
        </div>

        {/* Action Buttons */}
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
              e.currentTarget.style.boxShadow =
                "0 0 20px rgba(100, 255, 218, 0.5)";
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
              e.currentTarget.style.backgroundColor =
                "rgba(100, 255, 218, 0.1)";
              e.currentTarget.style.boxShadow =
                "0 0 20px rgba(100, 255, 218, 0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor =
                "transparent";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <Mail className="w-5 h-5" />
            Contact
          </motion.button>
        </motion.div>
      </div>

      {/* Floating Orbs */}
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