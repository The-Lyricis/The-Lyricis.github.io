import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import cityImage from 'figma:asset/bcd66bf4efb1bc82802197a0c435ac1e93db09df.png';
import streetImage from 'figma:asset/5ddef6520438cbf486174d0ce151df5193f97ae1.png';
import glassImage from 'figma:asset/437cba162ddef1914666f1b1e897b20de657cee1.png';
import beachImage from 'figma:asset/f120eb1bdb8f96744a86d1e3bc08d114e3d9744a.png';
import nightVillageImage from 'figma:asset/3ac696634b6322ae652fc72b86375ebf6ba72123.png';

export function ManifestoSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isExpanded, setIsExpanded] = useState(false);

  const photos = [
    {
      url: cityImage,
      caption: 'Urban Atmosphere',
      color: '#64FFDA'
    },
    {
      url: streetImage,
      caption: 'Street Moments',
      color: '#4A9EFF'
    },
    {
      url: glassImage,
      caption: 'Light & Structure',
      color: '#A78BFA'
    },
    {
      url: beachImage,
      caption: 'Perspective',
      color: '#FFD93D'
    },
    {
      url: nightVillageImage,
      caption: 'Nightscape',
      color: '#FF6B6B'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      paginate(1);
    }, 5000); 

    return () => clearInterval(timer);
  }, [currentIndex]);

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prevIndex) => {
      const nextIndex = prevIndex + newDirection;
      if (nextIndex >= photos.length) return 0;
      if (nextIndex < 0) return photos.length - 1;
      return nextIndex;
    });
  };

  const currentColor = photos[currentIndex].color;

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden py-24">
      <AnimatePresence>
        <motion.div 
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 z-0 pointer-events-none"
        >
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-20 blur-3xl scale-110"
            style={{ backgroundImage: `url(${photos[currentIndex].url})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#020C1B] via-[#0A192FCC] to-[#020C1B]" />
        </motion.div>
      </AnimatePresence>

      <div className="max-w-7xl mx-auto w-full px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-12 gap-16 items-start">
          
          <div className="lg:col-span-7 flex flex-col justify-center pt-10">
            
            <div className="relative origin-top-left">
              <h1 
                className="font-black tracking-tighter leading-none text-[#E6F1FF] mb-2 flex flex-wrap items-baseline gap-x-4"
              >
                <span 
                  className={`transition-all duration-700 ease-in-out ${isExpanded ? 'text-4xl md:text-5xl lg:text-6xl' : 'text-7xl md:text-8xl lg:text-9xl delay-300'}`}
                >
                    BE {isExpanded ? 'A' : 'AN'}
                </span> 
                
                <AnimatePresence mode="wait">
                  {isExpanded ? (
                    <motion.span 
                      key="builder"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1, transition: { duration: 0.4, delay: 0.4 } }}
                      exit={{ opacity: 0, transition: { duration: 0.3 } }}
                      className="text-[#64FFDA] text-4xl md:text-5xl lg:text-6xl"
                    >
                      WORLD BUILDER
                    </motion.span>
                  ) : (
                    <motion.span 
                      key="artist"
                      initial={{ opacity: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-transparent bg-clip-text pb-2 w-full text-7xl md:text-8xl lg:text-9xl"
                      style={{
                        backgroundImage: 'linear-gradient(to right, #64FFDA, #4A9EFF, #A78BFA, #FF6B6B, #FFD93D, #64FFDA)',
                        backgroundSize: '200% auto'
                      }}
                      animate={{ 
                        opacity: 1,
                        backgroundPosition: '200% center'
                      }}
                      transition={{ 
                        opacity: { duration: 0.3 },
                        backgroundPosition: { duration: 8, repeat: Infinity, ease: "linear" }
                      }}
                    >
                      ARTIST
                    </motion.span>
                  )}
                </AnimatePresence>
              </h1>
            </div>

            <div className="max-w-3xl relative min-h-[360px]">
              
              <AnimatePresence mode="wait">
                {!isExpanded ? (
                  <motion.div
                    key="collapsed"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { duration: 0.5, delay: 0.7 } }}
                    exit={{ opacity: 0, transition: { duration: 0.3 } }}
                    onClick={() => setIsExpanded(true)}
                    className="absolute top-0 left-0 w-full cursor-pointer group"
                  >
                    <h2 className="text-xl md:text-2xl font-mono text-[#64FFDA] opacity-80 tracking-widest uppercase mb-10 block">
                      <span>&#47;&#47;</span> Not just a developer
                    </h2>

                    <div className="text-2xl md:text-3xl font-light leading-snug text-[#E6F1FF] mb-6 block relative inline-block">
                      <div className="border-b border-[#64FFDA]/30 pb-6 group-hover:border-[#64FFDA] transition-colors duration-300">
                        Engineering is my discipline; <br className="hidden md:inline" />
                        <span className="text-[#64FFDA] font-normal">art keeps me curious.</span>
                      </div>
                      
                      <motion.div 
                        className="absolute left-0 bottom-0 translate-y-full pt-2"
                        animate={{ y: [0, 5, 0] }}
                        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                      >
                         <ChevronDown className="w-6 h-6 text-[#64FFDA] opacity-60 group-hover:opacity-100 transition-opacity" />
                      </motion.div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="expanded"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { duration: 0.5, delay: 0.8 } }}
                    exit={{ opacity: 0, transition: { duration: 0.3 } }}
                    className="absolute top-0 left-0 w-full"
                  >
                    <div className="space-y-6 text-lg text-[#8892B0] leading-relaxed pb-4 pt-2">
                      <p>
                        Outside of work, I stay close to art through drawing, photography, games, and films. I’m drawn to light, composition, and rhythm. I pay attention to how a scene is framed, how color sets the mood, and how pacing shapes emotion. These everyday observations quietly build my sense of taste, one detail at a time.
                      </p>
                      <p>
                        Photography trains me to wait for the right moment: a subtle gesture, a shift of shadow, or a reflection that turns ordinary space into something cinematic. Drawing does the opposite. It slows time down and helps me break a scene into shapes and values, so I can understand why a visual choice feels balanced, tense, or calm.
                      </p>
                      <p>
                        Games and films extend that practice into constructed worlds. I notice how environments guide the eye, how camera movement changes meaning, and how silence can be as expressive as action. Sometimes I pause just to take a photo in-game, because a single frame can carry atmosphere, story, and emotion without a line of dialogue.
                      </p>

                      <div 
                        onClick={() => setIsExpanded(false)}
                        className="pt-4 flex items-center gap-2 text-[#64FFDA] text-sm font-mono uppercase tracking-wider cursor-pointer opacity-60 hover:opacity-100 transition-opacity w-fit"
                      >
                         <ChevronUp className="w-4 h-4" />
                         <span>Collapse</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>


          <div className="lg:col-span-5 relative flex flex-col justify-center h-full pt-10">
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative w-full bg-[#020C1B] border border-[#233554] p-1 shadow-2xl ml-auto"
              style={{
                boxShadow: `0 30px 60px -15px ${currentColor}15`,
                aspectRatio: '4/5'
              }}
            >
              <div className="absolute inset-0 z-20 pointer-events-none m-4 border border-[#FFFFFF1A]">
                <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#64FFDA]" />
                <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#64FFDA]" />
                <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#64FFDA]" />
                <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#64FFDA]" />
                
                <div className="absolute top-3 right-3 text-[9px] font-mono text-[#64FFDA] tracking-widest flex flex-col items-end gap-1">
                   <span>REC ●</span>
                   <span className="opacity-70">ISO 800</span>
                </div>

                <div className="absolute bottom-3 left-3 text-[9px] font-mono text-[#64FFDA] flex gap-3">
                   <span>Aperture</span>
                   <span>f 2.8</span>
                </div>
                
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 opacity-40">
                   <div className="w-full h-[1px] bg-white absolute top-1/2 -translate-y-1/2" />
                   <div className="h-full w-[1px] bg-white absolute left-1/2 -translate-x-1/2" />
                </div>
              </div>

              <div className="relative w-full h-full overflow-hidden bg-[#112240]">
                <AnimatePresence initial={false} custom={direction}>
                  <motion.img
                    key={currentIndex}
                    src={photos[currentIndex].url}
                    alt={photos[currentIndex].caption}
                    custom={direction}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.2 }}
                    className="absolute inset-0 w-full h-full object-cover grayscale-[30%] hover:grayscale-0 transition-all duration-700"
                  />
                </AnimatePresence>
                
                <div 
                  className="absolute inset-0 opacity-10 mix-blend-color-dodge pointer-events-none"
                  style={{ backgroundColor: currentColor }}
                />
              </div>

              <div className="absolute -bottom-10 left-0 w-full flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold" style={{ color: currentColor }}>
                    0{currentIndex + 1}
                  </span>
                  <div className="h-[1px] w-12 bg-[#233554]" />
                </div>
                <p className="text-xs font-mono tracking-[0.2em] text-[#8892B0] uppercase">
                   {photos[currentIndex].caption}
                </p>
              </div>

            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
}