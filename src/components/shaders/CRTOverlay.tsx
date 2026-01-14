import React from 'react';
import { motion } from 'motion/react';

interface CRTOverlayProps {
  intensity?: number;
}

export function CRTOverlay({ intensity = 0.3 }: CRTOverlayProps) {
  return (
    <div className="fixed inset-0 pointer-events-none z-50" style={{ mixBlendMode: 'overlay' }}>
      {/* Scanlines */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            repeating-linear-gradient(
              0deg,
              rgba(0, 0, 0, ${0.2 * intensity}),
              rgba(0, 0, 0, ${0.2 * intensity}) 1px,
              transparent 1px,
              transparent 2px
            )
          `,
          animation: 'crt-scanline 8s linear infinite'
        }}
      />

      {/* Screen curve vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(
              ellipse at center,
              transparent 0%,
              transparent 60%,
              rgba(0, 0, 0, ${0.3 * intensity}) 100%
            )
          `,
          boxShadow: `inset 0 0 100px rgba(0, 0, 0, ${0.5 * intensity})`
        }}
      />

      {/* Noise/grain */}
      <motion.div
        className="absolute inset-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='3.5' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          opacity: 0.03 * intensity,
          animation: 'crt-noise 0.2s steps(2) infinite'
        }}
      />

      {/* Flicker */}
      <motion.div
        className="absolute inset-0 bg-white"
        animate={{
          opacity: [0, 0.02 * intensity, 0]
        }}
        transition={{
          duration: 0.1,
          repeat: Infinity,
          repeatDelay: Math.random() * 5 + 2
        }}
      />

      {/* Rolling interference */}
      <motion.div
        className="absolute w-full h-24"
        style={{
          background: `linear-gradient(180deg, transparent, rgba(255, 255, 255, ${0.05 * intensity}), transparent)`,
          filter: 'blur(2px)'
        }}
        animate={{
          y: ['-100px', '100vh']
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'linear',
          repeatDelay: 5
        }}
      />

      <style jsx>{`
        @keyframes crt-scanline {
          0% { transform: translateY(0); }
          100% { transform: translateY(2px); }
        }
        
        @keyframes crt-noise {
          0%, 100% { transform: translate(0, 0); }
          10% { transform: translate(-5%, -5%); }
          20% { transform: translate(-10%, 5%); }
          30% { transform: translate(5%, -10%); }
          40% { transform: translate(-5%, 15%); }
          50% { transform: translate(-10%, 5%); }
          60% { transform: translate(15%, 0); }
          70% { transform: translate(0, 10%); }
          80% { transform: translate(-15%, 0); }
          90% { transform: translate(10%, 5%); }
        }
      `}</style>
    </div>
  );
}
