import React from 'react';
import { motion } from 'motion/react';

interface HologramEffectProps {
  children: React.ReactNode;
  className?: string;
}

export function HologramEffect({ children, className = '' }: HologramEffectProps) {
  return (
    <div className={`relative ${className}`}>
      {/* Main content */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Hologram scanline overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            repeating-linear-gradient(
              0deg,
              rgba(100, 255, 218, 0.03) 0px,
              transparent 1px,
              transparent 2px,
              rgba(100, 255, 218, 0.03) 3px
            )
          `,
          animation: 'hologram-scan 8s linear infinite'
        }}
      />

      {/* Scanning beam */}
      <motion.div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, transparent 0%, rgba(100, 255, 218, 0.2) 50%, transparent 100%)',
          height: '100px',
          filter: 'blur(10px)'
        }}
        animate={{
          y: ['-100px', '100%']
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'linear'
        }}
      />

      {/* Chromatic aberration */}
      <motion.div
        className="absolute inset-0 pointer-events-none opacity-30"
        animate={{
          x: [0, 1, -1, 0],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
        style={{
          filter: 'blur(1px)',
          mixBlendMode: 'screen',
          background: 'linear-gradient(90deg, rgba(255,0,0,0.1), rgba(0,255,255,0.1))'
        }}
      />

      {/* Flicker effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none bg-cyan-400"
        animate={{
          opacity: [0, 0.02, 0]
        }}
        transition={{
          duration: 0.1,
          repeat: Infinity,
          repeatDelay: Math.random() * 3
        }}
      />

      <style jsx>{`
        @keyframes hologram-scan {
          0% { transform: translateY(0); }
          100% { transform: translateY(4px); }
        }
      `}</style>
    </div>
  );
}
