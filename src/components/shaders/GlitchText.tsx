import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';

interface GlitchTextProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  intensity?: number;
}

export function GlitchText({ children, className = '', style = {}, intensity = 1 }: GlitchTextProps) {
  const [isGlitching, setIsGlitching] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const glitchInterval = setInterval(() => {
      setIsGlitching(true);
      setTimeout(() => setIsGlitching(false), 200);
    }, 3000 + Math.random() * 2000);

    return () => clearInterval(glitchInterval);
  }, []);

  return (
    <div className={`relative inline-block ${className}`} style={style} ref={textRef}>
      {/* Main text */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Glitch layers */}
      {isGlitching && (
        <>
          {/* Red channel */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              color: '#FF0000',
              mixBlendMode: 'screen',
              opacity: 0.8
            }}
            animate={{
              x: [0, -3 * intensity, 2 * intensity, -1 * intensity, 0],
              y: [0, 1 * intensity, -2 * intensity, 1 * intensity, 0]
            }}
            transition={{ duration: 0.2, ease: 'linear' }}
          >
            {children}
          </motion.div>

          {/* Blue channel */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              color: '#00FFFF',
              mixBlendMode: 'screen',
              opacity: 0.8
            }}
            animate={{
              x: [0, 3 * intensity, -2 * intensity, 1 * intensity, 0],
              y: [0, -1 * intensity, 2 * intensity, -1 * intensity, 0]
            }}
            transition={{ duration: 0.2, ease: 'linear' }}
          >
            {children}
          </motion.div>

          {/* Scan lines */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255, 255, 255, 0.1) 2px, rgba(255, 255, 255, 0.1) 4px)',
              animation: 'scanlines 0.1s linear infinite'
            }}
          />
        </>
      )}

      <style jsx>{`
        @keyframes scanlines {
          0% { transform: translateY(0); }
          100% { transform: translateY(4px); }
        }
      `}</style>
    </div>
  );
}
