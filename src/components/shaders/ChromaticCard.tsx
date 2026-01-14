import React, { useState } from 'react';
import { motion } from 'motion/react';

interface ChromaticCardProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
}

export function ChromaticCard({ children, className = '', intensity = 5 }: ChromaticCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className={`relative ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ perspective: 1000 }}
    >
      {/* Main content */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Chromatic aberration effect on hover */}
      {isHovered && (
        <>
          {/* Red channel */}
          <motion.div
            className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            style={{
              filter: 'blur(1px)',
              mixBlendMode: 'screen'
            }}
          >
            <motion.div
              className="w-full h-full"
              animate={{
                x: [-intensity, intensity],
                y: [0, intensity / 2]
              }}
              transition={{
                duration: 0.15,
                repeat: Infinity,
                repeatType: 'reverse'
              }}
              style={{
                background: 'rgba(255, 0, 0, 0.3)'
              }}
            />
          </motion.div>

          {/* Blue channel */}
          <motion.div
            className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            style={{
              filter: 'blur(1px)',
              mixBlendMode: 'screen'
            }}
          >
            <motion.div
              className="w-full h-full"
              animate={{
                x: [intensity, -intensity],
                y: [intensity / 2, 0]
              }}
              transition={{
                duration: 0.15,
                repeat: Infinity,
                repeatType: 'reverse'
              }}
              style={{
                background: 'rgba(0, 255, 255, 0.3)'
              }}
            />
          </motion.div>

          {/* Scan line glitch */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(100, 255, 218, 0.1) 2px, rgba(100, 255, 218, 0.1) 4px)'
            }}
            animate={{
              y: ['0%', '100%']
            }}
            transition={{
              duration: 0.5,
              repeat: Infinity,
              ease: 'linear'
            }}
          />
        </>
      )}

      {/* Glow effect on hover */}
      <motion.div
        className="absolute -inset-1 rounded-lg blur-xl -z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 0.6 : 0 }}
        transition={{ duration: 0.3 }}
        style={{
          background: 'linear-gradient(135deg, #FF0000, #00FFFF, #64FFDA)'
        }}
      />
    </motion.div>
  );
}
