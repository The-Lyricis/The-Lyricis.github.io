import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUp } from 'lucide-react';

export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0, y: 100 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0, y: 100 }}
          transition={{ duration: 0.3 }}
          onClick={scrollToTop}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="fixed bottom-8 right-8 z-50 w-14 h-14 rounded-full border-2 flex items-center justify-center cursor-pointer transition-all"
          style={{
            borderColor: isHovered ? '#64FFDA' : '#4A9EFF',
            backgroundColor: isHovered ? 'rgba(100, 255, 218, 0.1)' : 'rgba(10, 25, 47, 0.8)',
            boxShadow: isHovered 
              ? '0 0 30px rgba(100, 255, 218, 0.5), 0 0 60px rgba(100, 255, 218, 0.2)' 
              : '0 0 20px rgba(74, 158, 255, 0.3)',
            backdropFilter: 'blur(10px)'
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <motion.div
            animate={{
              y: isHovered ? [-2, 2, -2] : 0
            }}
            transition={{
              duration: 1.5,
              repeat: isHovered ? Infinity : 0,
              ease: 'easeInOut'
            }}
          >
            <ArrowUp
              className="w-6 h-6"
              style={{ color: isHovered ? '#64FFDA' : '#4A9EFF' }}
            />
          </motion.div>

          {/* Glow effect ring */}
          <motion.div
            className="absolute inset-0 rounded-full border-2"
            style={{
              borderColor: isHovered ? '#64FFDA' : 'transparent'
            }}
            animate={{
              scale: isHovered ? [1, 1.5, 1] : 1,
              opacity: isHovered ? [0.5, 0, 0.5] : 0
            }}
            transition={{
              duration: 2,
              repeat: isHovered ? Infinity : 0,
              ease: 'easeOut'
            }}
          />

          {/* Tooltip */}
          <motion.span
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : 10 }}
            className="absolute right-full mr-3 whitespace-nowrap px-3 py-1 rounded text-xs"
            style={{
              backgroundColor: 'rgba(10, 25, 47, 0.9)',
              border: '1px solid #64FFDA',
              color: '#64FFDA'
            }}
          >
            Back to Top
          </motion.span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}