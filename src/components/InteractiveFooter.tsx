import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Mail, Github, Linkedin } from 'lucide-react';

export function InteractiveFooter() {
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const idCounterRef = useRef(0);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only trigger ripple if clicking the background, not links
    if ((e.target as HTMLElement).tagName === 'A' || (e.target as HTMLElement).closest('a')) {
        return;
    }

    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const id = idCounterRef.current++;
    setRipples(prev => [...prev, { x, y, id }]);
    
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== id));
    }, 1000);
  };

  const socials = [
    { 
        icon: Mail, 
        label: 'Email', 
        color: '#64FFDA',
        url: 'mailto:pigchick1623@gmail.com'
    },
    { 
        icon: Github, 
        label: 'GitHub', 
        color: '#4A9EFF',
        url: 'https://github.com/The-Lyricis/'
    },
    { 
        icon: Linkedin, 
        label: 'LinkedIn', 
        color: '#FF6B6B',
        url: 'https://www.linkedin.com/feed/?trk=guest_homepage-basic_google-one-tap-submit'
    }
  ];

  return (
    <div
      ref={containerRef}
      onClick={handleClick}
      className="relative px-8 py-12 overflow-hidden cursor-pointer"
      style={{ backgroundColor: '#020C1B' }} // Deep dark background
    >
      {/* Ripple effects */}
      {ripples.map(ripple => (
        <motion.div
          key={ripple.id}
          className="absolute rounded-full border-2 pointer-events-none"
          style={{
            left: ripple.x,
            top: ripple.y,
            x: '-50%',
            y: '-50%',
            borderColor: '#64FFDA'
          }}
          initial={{ width: 0, height: 0, opacity: 1 }}
          animate={{
            width: 300,
            height: 300,
            opacity: 0
          }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      ))}

      <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col justify-center h-full">
        
        {/* Social links */}
        <div className="flex justify-center gap-10 mb-8">
          {socials.map((social, index) => (
            <SocialIcon key={social.label} social={social} index={index} />
          ))}
        </div>

        {/* Footer text */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-sm font-mono tracking-wide"
          style={{ color: '#8892B0' }}
        >
          <p>© 2026 Jiliang Ye · Technical Artist & Game Developer</p>
        </motion.div>
      </div>
    </div>
  );
}

interface SocialIconProps {
  social: {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    color: string;
    url: string;
  };
  index: number;
}

function SocialIcon({ social, index }: SocialIconProps) {
  const [isHovered, setIsHovered] = useState(false);
  const Icon = social.icon;

  return (
    <motion.a
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="relative group"
      href={social.url}
      target="_blank"
      rel="noopener noreferrer"
    >
      <motion.div
        className="w-16 h-16 rounded-full border-2 flex items-center justify-center transition-all bg-[#112240]"
        style={{
          borderColor: isHovered ? social.color : 'rgba(230, 241, 255, 0.1)',
          boxShadow: isHovered ? `0 0 30px ${social.color}40` : 'none'
        }}
      >
        <Icon
          className="w-7 h-7 transition-colors duration-300"
          style={{ color: isHovered ? social.color : '#8892B0' }}
        />
      </motion.div>
      
      {/* Label only visible on hover */}
      <motion.span
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 10 : -10 }}
        className="absolute top-full left-1/2 -translate-x-1/2 mt-2 text-xs font-mono whitespace-nowrap"
        style={{ color: social.color }}
      >
        {social.label}
      </motion.span>
    </motion.a>
  );
}