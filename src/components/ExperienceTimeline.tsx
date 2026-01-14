import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, LayoutGroup } from 'motion/react';
import { Briefcase, GraduationCap, Rocket, Circle, Cpu } from 'lucide-react';

import chalmersLogo from 'figma:asset/34fe8555018b14823bdfd4b6b2f23b1c12a5322a.png';
import jilinLogo from 'figma:asset/ffbde524f2ff9a8f826cabfac3182808795098be.png';
import seasunImage from 'figma:asset/50b67e8164f643d7f867674841bd62afded14e0a.png';
import funplusImage from 'figma:asset/a79c1baff43749d139c783987ee88a65d69a2fc4.png';
import funplusInternImage from 'figma:asset/00e43bc57c0e1d586e9559a450154d8c5d12a233.png';

interface TimelineItem {
  id: string;
  year: string;
  title: string;
  organization: string;
  type: 'work' | 'education' | 'future';
  description: string;
  technologies?: string[];
  color: string;
  image?: string;
  useWhiteBackground?: boolean;
}

export function ExperienceTimeline() {
  const timelineData: TimelineItem[] = [
    {
      id: 'future-3',
      year: '2028 - 2030',
      title: 'Tech Lead / Specialist',
      organization: 'Industry Leader',
      type: 'future',
      description: 'Evolving into a core technical pillar. Leading technical art teams, defining rendering pipelines for next-gen platforms.',
      technologies: ['Team Leadership', 'Next-Gen Rendering', 'Pipeline Architecture'],
      color: '#FFFFFF'
    },
    {
      id: 'future-2',
      year: '2027 - 2028',
      title: 'Junior Technical Artist',
      organization: 'Full-time Role',
      type: 'future',
      description: 'Transitioning from academic to professional mastery. Focusing on production-proven tool chains and shader optimization.',
      technologies: ['Production Pipelines', 'Performance Profiling', 'Asset Optimization'],
      color: '#CCCCCC'
    },
    {
      id: 'future-1',
      year: 'Present - 2026',
      title: 'Game & Internet Intern',
      organization: 'Top Tier Tech/Game Corps',
      type: 'future',
      description: 'Gaining diverse industry exposure through high-intensity internships in game engines and web interactive graphics.',
      technologies: ['Engine Dev', 'Web Graphics', 'Rapid Prototyping'],
      color: '#AAAAAA'
    },
    {
      id: 'chalmers',
      year: '2025 - Present',
      title: 'Interaction Design and Technologies',
      organization: 'Chalmers University of Technology',
      type: 'education',
      description: 'Pursuing M.Sc. with a focus on Interaction Design, Game Design, Game Development, Advanced Computer Graphics, and Real-time Rendering systems.',
      technologies: ['Interaction Design', 'Real-time Rendering', 'Procedural Systems', 'Game Design'],
      color: '#64FFDA',
      image: chalmersLogo,
      useWhiteBackground: true
    },
    {
      id: 'funplus-ft',
      year: '2024 - 2025',
      title: 'Junior Technical Artist',
      organization: 'Fun Plus - Central Engine Team',
      type: 'work',
      description: 'Developed shader systems and technical art tools for the central game engine. Optimized rendering pipelines and created workflow automation tools.',
      technologies: ['Unity', 'Shader Graph', 'C#', 'Pipeline Tools'],
      color: '#4A9EFF',
      image: funplusImage
    },
    {
      id: 'funplus-intern',
      year: '2024',
      title: 'Technical Artist Intern',
      organization: 'Fun Plus - Beijing Studio',
      type: 'work',
      description: 'Created visual effects systems, custom shaders, and performance optimization for mobile game projects.',
      technologies: ['Unity', 'HLSL', 'VFX Graph', 'Mobile Optimization'],
      color: '#FFB84D',
      image: funplusInternImage
    },
    {
      id: 'seasun',
      year: '2023',
      title: 'Game Development Intern',
      organization: 'Seasun Games (Xishanju)',
      type: 'work',
      description: 'Assisted in gameplay programming and technical implementation for AAA mobile game projects. Developed tools and optimized game systems.',
      technologies: ['Unity', 'C#', 'Gameplay Systems', 'Tool Development'],
      color: '#FF6B6B',
      image: seasunImage
    },
    {
      id: 'jilin',
      year: '2020 - 2024',
      title: 'B.Eng. Software Engineering',
      organization: 'Jilin University',
      type: 'education',
      description: 'Studied software engineering fundamentals, computer graphics, game development, and procedural generation techniques.',
      technologies: ['C++', 'Graphics Programming', 'Algorithm Design'],
      color: '#64FFDA',
      image: jilinLogo,
      useWhiteBackground: true
    }
  ];

  const defaultIndex = timelineData.findIndex(item => item.id === 'chalmers');
  const [activeIndex, setActiveIndex] = useState(defaultIndex);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isDraggingState, setIsDraggingState] = useState(false);
  
  const itemPositions = useMemo(() => {
    let currentPos = 0;
    const positions: number[] = [];
    
    const HEIGHT_COMPACT = 48; 
    const HEIGHT_ACTIVE = 140; 
    
    timelineData.forEach((_, i) => {
        const isTarget = i === activeIndex;
        const height = isTarget ? HEIGHT_ACTIVE : HEIGHT_COMPACT;
        
        positions.push(currentPos + height / 2);
        currentPos += height;
    });
    
    return positions;
  }, [activeIndex]);

  const isDragging = useRef(false);
  const startY = useRef(0);
  const startIndex = useRef(0);

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    isDragging.current = true;
    setIsDraggingState(true);
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    startY.current = clientY;
    startIndex.current = activeIndex;
    document.body.style.userSelect = 'none';
  };

  useEffect(() => {
    const handleDragMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging.current) return;

      const clientY = 'touches' in e ? (e as TouchEvent).touches[0].clientY : (e as MouseEvent).clientY;
      const deltaY = clientY - startY.current; 

      const PIXELS_PER_STEP = 24; 
      
      const stepsMoved = Math.round(deltaY / PIXELS_PER_STEP);
      const newIndex = Math.min(Math.max(startIndex.current + stepsMoved, 0), timelineData.length - 1);

      if (newIndex !== activeIndex) {
        setActiveIndex(newIndex);
        setExpandedId(null);
      }
    };

    const handleDragEnd = () => {
      isDragging.current = false;
      setIsDraggingState(false);
      document.body.style.userSelect = '';
    };

    window.addEventListener('mousemove', handleDragMove);
    window.addEventListener('mouseup', handleDragEnd);
    window.addEventListener('touchmove', handleDragMove);
    window.addEventListener('touchend', handleDragEnd);

    return () => {
      window.removeEventListener('mousemove', handleDragMove);
      window.removeEventListener('mouseup', handleDragEnd);
      window.removeEventListener('touchmove', handleDragMove);
      window.removeEventListener('touchend', handleDragEnd);
    };
  }, [activeIndex]);


  const handleWheel = (e: React.WheelEvent) => {
    if (expandedId) return;
  };

  const getIcon = (type: TimelineItem['type']) => {
    switch (type) {
      case 'work': return <Briefcase className="w-3 h-3" />;
      case 'education': return <GraduationCap className="w-3 h-3" />;
      case 'future': return <Rocket className="w-3 h-3" />;
      default: return <Circle className="w-3 h-3" />;
    }
  };

  const activeItem = timelineData[activeIndex];
  const isFutureActive = activeItem.type === 'future';
  
  return (
    <div className="min-h-screen px-4 md:px-8 py-20 flex flex-col relative overflow-hidden" onWheel={handleWheel}>
      
      {/* Title */}
      <div className="text-center mb-8 relative z-10 shrink-0">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-5xl font-bold text-[#E6F1FF] tracking-tight mb-2"
        >
          EXPERIENCE <span className="text-[#64FFDA]">&</span> JOURNEY
        </motion.h2>
        <motion.div 
          initial={{ opacity: 0, width: 0 }}
          whileInView={{ opacity: 1, width: "100px" }}
          viewport={{ once: true }}
          className="h-1 bg-[#233554] mx-auto rounded-full overflow-hidden"
        >
          <div className="h-full bg-[#64FFDA] w-1/2 animate-pulse" />
        </motion.div>
      </div>

      {/* Main Layout Container - Height 600px */}
      <div className="flex-1 w-full max-w-7xl mx-auto relative h-[600px] flex">
        
        {/* ================= LEFT COLUMN (33%): IMAGE ================= */}
        <div className="hidden md:flex absolute left-0 top-0 bottom-0 w-[33%] items-center justify-end pr-16 z-10 pointer-events-none">
            <motion.div
                key={activeItem.id}
                initial={{ opacity: 0, scale: 0.8, x: -20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.8, x: 20 }}
                transition={{ duration: 0.4, type: "spring" }}
                className="relative w-64 h-64 flex items-center justify-center"
            >
                {isFutureActive ? (
                    <div className="relative w-full h-full flex items-center justify-center">
                        <div className="w-32 h-32 bg-black rounded-full border border-gray-800 relative z-20 flex items-center justify-center overflow-hidden shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:8px_8px]" />
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-transparent w-full h-full animate-[scan_3s_linear_infinite]" />
                            <Cpu className="w-12 h-12 text-gray-500 animate-pulse" />
                        </div>
                        <div className="absolute inset-0 animate-[spin_10s_linear_infinite] opacity-30">
                            <div className="absolute top-0 left-1/2 w-1 h-1 bg-white rounded-full shadow-[0_0_10px_white]" />
                            <div className="absolute bottom-0 left-1/2 w-1 h-1 bg-white rounded-full shadow-[0_0_10px_white]" />
                        </div>
                            <div className="absolute inset-4 animate-[spin_15s_linear_infinite_reverse] opacity-20">
                            <div className="absolute left-0 top-1/2 w-1 h-1 bg-white rounded-full" />
                            <div className="absolute right-0 top-1/2 w-1 h-1 bg-white rounded-full" />
                        </div>
                        <div className="absolute inset-0 border border-gray-800 rounded-full opacity-20 scale-110" />
                        <div className="absolute inset-0 border border-dashed border-gray-700 rounded-full opacity-10 animate-[spin_60s_linear_infinite]" />
                    </div>
                ) : (
                    <>
                        <div 
                            className="absolute inset-0 rounded-full blur-[60px] opacity-20 transition-colors duration-500" 
                            style={{ backgroundColor: activeItem.color }} 
                        />
                        <div className="absolute w-[100%] h-[100%] rounded-full border border-[#233554] opacity-50" />
                        <div 
                            className="absolute w-[92%] h-[92%] rounded-full border border-dashed opacity-30 animate-[spin_30s_linear_infinite]" 
                            style={{ borderColor: activeItem.color }} 
                        />
                        <div className="absolute w-[84%] h-[84%] rounded-full overflow-hidden bg-[#0a192f] border-2 border-[#112240] shadow-2xl flex items-center justify-center z-10">
                            {activeItem.image ? (
                                <img 
                                    src={activeItem.image} 
                                    alt={activeItem.title}
                                    className={`w-full h-full object-cover ${activeItem.useWhiteBackground ? 'p-6 bg-white' : ''}`}
                                />
                            ) : (
                                <div className="flex flex-col items-center justify-center text-[#8892B0] opacity-50">
                                    <Briefcase className="w-10 h-10 mb-2" />
                                </div>
                            )}
                        </div>
                    </>
                )}
            </motion.div>
        </div>

        {/* ================= CENTER AXIS ================= */}
        <div className="absolute top-0 bottom-0 left-[33%] w-0 z-20"> 
            
             {/* VISUAL LINE */}
             <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-[2px] h-[650px] bg-gradient-to-b from-[#FFD700] via-[#64FFDA] to-[#112240] opacity-50">
                 <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-[#020c1b] to-transparent" />
                 <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#020c1b] to-transparent" />
             </div>

             {/* INTERACTIVE DRAG AREA */}
             <div 
                className="absolute top-0 bottom-0 -left-10 w-20 flex items-center justify-center cursor-grab active:cursor-grabbing group"
                onMouseDown={handleDragStart}
                onTouchStart={handleDragStart}
             >
                 {/* SLIDER KNOB */}
                 <div className="relative pointer-events-none transition-transform duration-200 group-active:scale-95"> 
                     
                     {/* Glow effect */}
                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-20 bg-[#64FFDA] rounded-full blur-xl opacity-0 group-hover:opacity-30 group-active:opacity-50 transition-all duration-300" />
                     
                     {/* Main Body */}
                     <div className={`
                        relative w-5 h-14 bg-[#020c1b] rounded-full flex flex-col items-center justify-center overflow-hidden transition-all duration-300
                        border 
                        group-hover:border-[#64FFDA] group-hover:shadow-[0_0_15px_rgba(100,255,218,0.3)]
                        group-active:border-[#64FFDA] group-active:shadow-[0_0_20px_rgba(100,255,218,0.5)]
                        border-[#233554] shadow-none
                     `}>
                        <div className="absolute inset-0 bg-[#64FFDA] opacity-0 group-hover:opacity-10 transition-opacity" />
                        
                        <div className="w-[1px] h-2 bg-current opacity-50 absolute top-1 transition-colors duration-300 text-[#233554] group-hover:text-[#64FFDA]" />
                        <div className="w-[1px] h-2 bg-current opacity-50 absolute bottom-1 transition-colors duration-300 text-[#233554] group-hover:text-[#64FFDA]" />
                        
                        <div className="flex flex-col gap-[3px] items-center justify-center z-10">
                            <div className="w-2.5 h-[2px] bg-current rounded-full transition-colors duration-300 text-[#233554] group-hover:text-[#64FFDA]" />
                            <div className="w-2.5 h-[2px] bg-current rounded-full transition-colors duration-300 text-[#233554] group-hover:text-[#64FFDA]" />
                            <div className="w-2.5 h-[2px] bg-current rounded-full transition-colors duration-300 text-[#233554] group-hover:text-[#64FFDA]" />
                        </div>
                     </div>
                     
                     {/* Side Brackets - Controlled by isDraggingState */}
                     <div className={`
                        absolute top-1/2 -left-3 -translate-y-1/2 h-8 w-1.5 border-l-2 border-t-2 border-b-2 rounded-l-md 
                        transition-all duration-200 
                        border-[#64FFDA]
                        ${isDraggingState ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'}
                     `} />
                     
                     <div className={`
                        absolute top-1/2 -right-3 -translate-y-1/2 h-8 w-1.5 border-r-2 border-t-2 border-b-2 rounded-r-md 
                        transition-all duration-200 
                        border-[#64FFDA]
                        ${isDraggingState ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}
                     `} />

                 </div>
             </div>
        </div>

        {/* ================= RIGHT COLUMN: SCROLLING LIST ================= */}
        <div className="absolute top-0 bottom-0 left-[33%] right-0 pl-0 overflow-hidden pointer-events-none"> 
            
            <LayoutGroup>
                <motion.div
                    className="absolute w-full top-1/2 left-6"
                    initial={false}
                    animate={{ 
                        y: -itemPositions[activeIndex] 
                    }}
                    transition={{ type: "spring", stiffness: 200, damping: 25 }}
                >
                    {timelineData.map((item, index) => {
                        const isActive = index === activeIndex;
                        const isExpanded = expandedId === item.id;
                        const isFuture = item.type === 'future';

                        // REMOVED THE HARD RETURN NULL HERE
                        // We render all items but control visibility via opacity
                        // This allows items to animate in/out from the edges naturally
                        
                        const topPos = itemPositions[index];
                        const distance = Math.abs(index - activeIndex);

                        let opacity = 0;
                        let pointerEvents = 'none';

                        if (expandedId && !isExpanded) {
                            opacity = 0;
                        } else if (isActive) {
                            opacity = 1;
                            pointerEvents = 'auto';
                        } else if (distance < 4) {
                            opacity = 0.8;
                            pointerEvents = 'auto';
                        } else if (distance === 4) {
                            opacity = 0.2;
                            pointerEvents = 'auto';
                        } else {
                            opacity = 0;
                            // Still rendered, but invisible and uninteractable
                        }
                        
                        // Performance optimization: 
                        // If distance is excessively large, we can stop rendering to save DOM nodes, 
                        // but 4 vs 5 is the critical transition point we needed to preserve.
                        if (distance > 6) return null; 

                        return (
                            <motion.div
                                key={item.id}
                                className="absolute left-0 flex items-center w-full"
                                style={{ 
                                    pointerEvents: pointerEvents as any,
                                    transform: 'translateY(-50%)' // Moved style prop here for better hydration consistency if needed
                                }}
                                animate={{ 
                                    top: topPos,
                                    opacity: opacity,
                                    y: '-50%' // Using animate for transform ensures smoother physics
                                }}
                                transition={{ type: "spring", stiffness: 200, damping: 25 }}
                            >
                                {/* Connector Line */}
                                <motion.div 
                                    className="absolute left-[-24px] h-[2px] transition-all duration-300 origin-left"
                                    style={{ 
                                        width: isActive || isExpanded ? '24px' : '12px', 
                                        backgroundColor: isActive || isExpanded ? '#64FFDA' : '#233554',
                                        boxShadow: isActive ? '0 0 8px #64FFDA' : 'none',
                                        opacity: isActive || isExpanded ? 1 : 0.5
                                    }}
                                />

                                {/* Content Wrapper */}
                                <div className="relative pl-2">
                                    {isExpanded ? (
                                        <motion.div
                                            layoutId={`card-${item.id}`}
                                            className={`
                                                bg-[#0A192F] border rounded-xl p-6 shadow-2xl max-w-xl relative z-50 cursor-default
                                                ${isFuture ? 'grayscale' : ''}
                                            `}
                                            style={{ 
                                                borderLeft: `4px solid ${item.color}`,
                                                borderColor: isFuture ? '#333' : '#233554'
                                            }}
                                        >
                                             <button 
                                                onClick={(e) => { e.stopPropagation(); setExpandedId(null); }}
                                                className="absolute top-4 right-4 text-[#8892B0] hover:text-[#64FFDA] transition-colors"
                                            >
                                                ✕
                                            </button>

                                            {/* Header Section */}
                                            <div className="flex justify-between items-start mb-2">
                                                <motion.span layoutId={`year-${item.id}`} className="text-sm font-mono text-[#8892B0] font-bold tracking-wider">
                                                    {item.year}
                                                </motion.span>
                                            </div>

                                            <motion.h3 layoutId={`title-${item.id}`} className="text-2xl font-bold text-[#E6F1FF] mb-1">
                                                {item.title}
                                            </motion.h3>
                                            <motion.h4 layoutId={`org-${item.id}`} className="text-[#8892B0] mb-4">
                                                {item.organization}
                                            </motion.h4>
                                            
                                            <motion.div 
                                                initial={{ opacity: 0 }} 
                                                animate={{ opacity: 1 }} 
                                                transition={{ delay: 0.2 }}
                                            >
                                                <p className="text-[#CCD6F6] text-sm leading-relaxed mb-6">
                                                    {item.description}
                                                </p>
                                                
                                                <div className="flex flex-wrap gap-2">
                                                    {item.technologies?.map(tech => (
                                                        <span key={tech} className={`px-2 py-1 text-xs rounded border ${isFuture ? 'bg-gray-800 text-gray-400 border-gray-700' : 'bg-[#112240] text-[#64FFDA] border-[#233554]'}`}>
                                                            {tech}
                                                        </span>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        </motion.div>
                                    ) : isActive ? (
                                        <motion.div
                                            layoutId={`card-${item.id}`}
                                            onClick={() => setExpandedId(item.id)}
                                            className={`
                                                bg-[#112240] rounded-lg p-4 shadow-[0_0_20px_rgba(100,255,218,0.1)] cursor-pointer group w-[400px] border transition-all relative overflow-hidden z-40
                                                ${isFuture ? 'grayscale brightness-75 hover:grayscale-0' : 'hover:border-[#64FFDA]'}
                                            `}
                                            style={{ 
                                                borderLeft: `4px solid ${item.color}`,
                                                borderColor: '#233554'
                                            }}
                                        >
                                            <div className={`absolute left-0 top-0 bottom-0 w-1 shadow-[0_0_10px_#64FFDA] ${isFuture ? 'bg-white shadow-none' : 'bg-[#64FFDA]'}`} />
                                            
                                            <div className="flex justify-between items-start mb-1 pl-3">
                                                <motion.span layoutId={`year-${item.id}`} className="text-sm font-mono font-bold text-[#64FFDA] tracking-wider">
                                                    {item.year}
                                                </motion.span>
                                            </div>

                                            <div className="pl-3">
                                                <motion.h3 layoutId={`title-${item.id}`} className={`text-lg font-bold text-[#E6F1FF] transition-colors ${!isFuture && 'group-hover:text-[#64FFDA]'}`}>
                                                    {item.title}
                                                </motion.h3>
                                                <motion.h4 layoutId={`org-${item.id}`} className="text-xs text-[#8892B0] mt-0.5">
                                                    {item.organization}
                                                </motion.h4>
                                            </div>
                                            
                                            <div className={`absolute right-2 bottom-2 opacity-5 transform scale-150 rotate-12 ${isFuture ? 'text-white' : 'text-[#64FFDA]'}`}>
                                                {getIcon(item.type)}
                                            </div>
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            layoutId={`card-${item.id}`} 
                                            onClick={() => setActiveIndex(index)}
                                            className={`
                                                flex items-center gap-3 px-3 py-1.5 rounded-full cursor-pointer
                                                border border-[#233554] hover:bg-[#112240] transition-all bg-[#0a192f]/80 backdrop-blur-sm
                                                ${isFuture ? 'grayscale hover:grayscale-0' : 'hover:border-[#64FFDA]'}
                                            `}
                                        >
                                            <div style={{ color: item.color }}>{getIcon(item.type)}</div>
                                            <span className="text-xs font-mono font-bold text-[#8892B0] tracking-wider whitespace-nowrap">
                                                {item.year}
                                            </span>
                                        </motion.div>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </LayoutGroup>
        </div>

      </div>
    </div>
  );
}