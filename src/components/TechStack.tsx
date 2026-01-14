import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Code, Boxes, Wrench, Sparkles, Terminal, Cpu, ArrowDown, LayoutGrid, X } from 'lucide-react';
import { FloatingCode } from './FloatingCode';

interface Tool {
  name: string;
  level: number;
  category: string;
  icon?: React.ReactNode;
}

interface StackColumn {
  id: string;
  title: string;
  icon: React.ReactNode;
  color: string;
  items: string[]; // Ordered from TOP (High Level) to BOTTOM (Low Level)
}

export function TechStack() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [showAll, setShowAll] = useState(false);
  const [hoveredStack, setHoveredStack] = useState<string | null>(null);
  const [hoveredItem, setHoveredItem] = useState<{ colId: string, index: number } | null>(null);

  const categories = [
    { id: 'all', name: 'Core', icon: <Boxes className="w-4 h-4" />, color: '#E6F1FF' },
    { id: 'engines', name: 'Engines', icon: <Cpu className="w-4 h-4" />, color: '#64FFDA' },
    { id: 'languages', name: 'Languages', icon: <Code className="w-4 h-4" />, color: '#4A9EFF' },
    { id: 'tools', name: 'Tools', icon: <Wrench className="w-4 h-4" />, color: '#FF6B6B' },
    { id: 'specialties', name: 'Specialties', icon: <Sparkles className="w-4 h-4" />, color: '#FFB84D' }
  ];

  const tools: Tool[] = [
    // Engines
    { name: 'Unity', level: 95, category: 'engines' },
    { name: 'Unreal Engine 5', level: 85, category: 'engines' },
    { name: 'Godot', level: 60, category: 'engines' },
    { name: 'Custom Engines', level: 70, category: 'engines' },
    
    // Languages
    { name: 'C#', level: 95, category: 'languages' },
    { name: 'C++', level: 85, category: 'languages' },
    { name: 'HLSL / GLSL', level: 95, category: 'languages' },
    { name: 'Python', level: 80, category: 'languages' },
    { name: 'JavaScript / TS', level: 75, category: 'languages' },
    
    // Tools
    { name: 'Shader Graph', level: 95, category: 'tools' },
    { name: 'Houdini', level: 80, category: 'tools' },
    { name: 'Blender', level: 60, category: 'tools' },
    { name: 'RenderDoc', level: 90, category: 'tools' },
    { name: 'Git & Perforce', level: 85, category: 'tools' },
    { name: 'Figma', level: 70, category: 'tools' },
    
    // Specialties
    { name: 'Procedural Gen', level: 90, category: 'specialties' },
    { name: 'Shader Dev', level: 98, category: 'specialties' },
    { name: 'Performance Ops', level: 92, category: 'specialties' },
    { name: 'Tool Creation', level: 88, category: 'specialties' },
    { name: 'Render Pipelines', level: 85, category: 'specialties' },
    { name: 'VFX Systems', level: 85, category: 'specialties' }
  ];

  // Helper to find tool data
  const getTool = (name: string) => tools.find(t => t.name === name) || { name, level: 0, category: 'unknown' };

  // Stack Columns Definition
  // Items ordered from High Level (Top) to Low Level (Bottom)
  const stackColumns: StackColumn[] = [
    {
      id: "app",
      title: "DOMAINS",
      icon: <Sparkles className="w-4 h-4" />,
      color: "#FFB84D", // Orange
      items: [
        "VFX Systems",       // Visual Output
        "Procedural Gen",    // Logic for Visuals
        "Tool Creation",     // Meta-tooling
        "Performance Ops"    // Optimization (Closer to metal)
      ]
    },
    {
      id: "dcc",
      title: "PIPELINE",
      icon: <Wrench className="w-4 h-4" />,
      color: "#FF6B6B", // Red
      items: [
        "Figma",            // UI/Concept
        "Houdini",          // Procedural Content
        "Blender",          // Modeling
        "Git & Perforce"    // Version Control (Infrastructure)
      ]
    },
    {
      id: "runtime",
      title: "ENGINES",
      icon: <Cpu className="w-4 h-4" />,
      color: "#64FFDA", // Green
      items: [
        "Unity",            // High Level
        "Unreal Engine 5",  // High/Mid Level
        "Godot",            // Open Source
        "Custom Engines"    // Low Level
      ]
    },
    {
      id: "code",
      title: "LANGUAGES",
      icon: <Code className="w-4 h-4" />,
      color: "#4A9EFF", // Blue
      items: [
        "JavaScript / TS",  // Scripting
        "Python",           // Scripting
        "C#",               // Managed
        "C++"               // Native
      ]
    },
    {
      id: "gfx",
      title: "GRAPHICS",
      icon: <Terminal className="w-4 h-4" />,
      color: "#A78BFA", // Purple
      items: [
        "Shader Graph",     // Visual Node
        "Render Pipelines", // Architecture
        "HLSL / GLSL",      // Shader Code
        "RenderDoc"         // Debugging/Hardware
      ]
    }
  ];

  const filteredTools = activeCategory === 'all' 
    ? tools.sort((a, b) => b.level - a.level).slice(0, 12)
    : tools.filter(tool => tool.category === activeCategory);

  const getCategoryColor = (category: string) => {
    const cat = categories.find(c => c.id === category);
    return cat?.color || '#E6F1FF';
  };

  return (
    <div id="skills" className="relative min-h-screen px-6 py-24 flex flex-col justify-center overflow-hidden">
      {/* Semi-transparent backdrop */}
      <div 
        className="absolute inset-0 pointer-events-none" 
        style={{ 
          backgroundColor: 'rgba(2, 12, 27, 0.85)',
          zIndex: -20 
        }} 
      />
      
      <FloatingCode />
      
      <div className="max-w-7xl mx-auto w-full relative z-10">
        
        {/* Header */}
        <div className="flex flex-col items-center mb-16 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-6"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-[#E6F1FF] tracking-tight">
              {showAll ? (
                <>FULL STACK <span className="text-[#64FFDA]">CAPABILITIES</span></>
              ) : (
                <>TECH STACK <span className="text-[#64FFDA]">&</span> SKILLS</>
              )}
            </h2>

            {/* Close Button (Only in Stack View) */}
            {showAll && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={() => setShowAll(false)}
                className="
                  p-3 rounded-lg border border-[#233554] bg-[#112240] text-[#8892B0] 
                  hover:border-[#64FFDA] hover:text-[#64FFDA] hover:bg-[#1d2d50]
                  transition-all duration-300 group
                "
                aria-label="Back to overview"
              >
                <LayoutGrid className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </motion.button>
            )}
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, width: 0 }}
            whileInView={{ opacity: 1, width: "100px" }}
            viewport={{ once: true }}
            className="h-1 bg-[#233554] mt-4 rounded-full overflow-hidden"
          >
            <div className="h-full bg-[#64FFDA] w-1/2 animate-pulse" />
          </motion.div>
        </div>

        {/* Category Filter Tabs (Grid View Only) */}
        {!showAll && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-3 mb-12"
          >
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`
                  relative px-4 py-2 rounded-full text-sm font-mono border transition-all duration-300
                  ${activeCategory === category.id 
                    ? 'bg-[#112240] text-[#E6F1FF] border-[#64FFDA]' 
                    : 'bg-transparent text-[#8892B0] border-[#233554] hover:border-[#8892B0]'
                  }
                `}
                style={{
                  boxShadow: activeCategory === category.id ? `0 0 15px ${category.color}20` : 'none'
                }}
              >
                <div className="flex items-center gap-2">
                  <span style={{ color: activeCategory === category.id ? category.color : 'inherit' }}>
                    {category.icon}
                  </span>
                  {category.name}
                </div>
              </button>
            ))}
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {!showAll ? (
            /* ================= GRID VIEW ================= */
            <motion.div 
              key="grid-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-8 max-w-5xl mx-auto"
            >
              {filteredTools.map((tool, index) => {
                const catColor = getCategoryColor(tool.category);
                return (
                  <motion.div
                    layout
                    key={tool.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="group"
                  >
                    <div className="flex justify-between items-end mb-2">
                      <div className="flex items-center gap-2">
                        <Terminal className="w-4 h-4 opacity-50" style={{ color: catColor }} />
                        <span className="text-[#E6F1FF] font-medium tracking-wide text-lg">
                          {tool.name}
                        </span>
                      </div>
                      <span className="font-mono text-xs" style={{ color: catColor }}>
                        {tool.level}%
                      </span>
                    </div>
                    
                    <div className="h-2 w-full bg-[#112240] rounded-full overflow-hidden border border-[#233554] relative">
                      <div className="absolute inset-0 w-full h-full opacity-20" 
                          style={{ 
                            backgroundImage: `linear-gradient(90deg, transparent 95%, ${catColor} 95%)`,
                            backgroundSize: '10% 100%' 
                          }} 
                      />
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${tool.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                        className="h-full rounded-full relative overflow-hidden"
                        style={{ 
                          backgroundColor: catColor,
                          boxShadow: `0 0 10px ${catColor}80`
                        }}
                      >
                        <div className="absolute inset-0 bg-white/20 w-full h-full animate-pulse" style={{ animationDuration: '2s' }} />
                      </motion.div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            /* ================= STACK VIEW (Vertical Columns) ================= */
            <motion.div
              key="stack-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 max-w-7xl mx-auto items-end h-full"
            >
               {stackColumns.map((col, colIndex) => {
                 const isStackHovered = hoveredStack === col.id;
                 
                 return (
                   <motion.div
                     key={col.id}
                     initial={{ opacity: 0, y: 50 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ delay: colIndex * 0.1, duration: 0.5 }}
                     onMouseEnter={() => setHoveredStack(col.id)}
                     onMouseLeave={() => {
                       setHoveredStack(null);
                       setHoveredItem(null);
                     }}
                     className="relative flex flex-col h-full"
                   >
                     {/* Column Header */}
                     <div className="flex items-center gap-2 mb-4 pb-2 border-b border-[#233554] min-h-[40px]">
                       <div className="p-1.5 rounded bg-[#112240]" style={{ color: col.color }}>
                         {col.icon}
                       </div>
                       <span className="text-xs font-bold tracking-widest text-[#E6F1FF] uppercase">
                         {col.title}
                       </span>
                     </div>

                     {/* Vertical Stack Items */}
                     <div className="flex flex-col gap-2 relative">
                        {/* Decorative Line behind items */}
                        <div className="absolute left-4 top-0 bottom-0 w-[2px] bg-[#112240] -z-10" />

                        {col.items.map((itemName, itemIndex) => {
                          const tool = getTool(itemName);
                          
                          // Logic: Highlight from Bottom (Low Level) up to Current Hovered Item
                          // Array order is Top -> Bottom.
                          // So Bottom is index = length - 1.
                          // If we hover index H, we want to highlight indices I where I >= H.
                          
                          const isHoveredSpecific = hoveredItem?.colId === col.id && hoveredItem.index === itemIndex;
                          const isInHighlightPath = hoveredItem?.colId === col.id && itemIndex >= hoveredItem.index;
                          const isDimmed = hoveredItem?.colId === col.id && !isInHighlightPath;

                          // Dynamic Styles
                          const borderColor = isInHighlightPath ? col.color : '#233554';
                          const glowShadow = isInHighlightPath ? `0 0 15px ${col.color}30` : 'none';
                          const opacity = isDimmed ? 0.3 : 1;
                          const scale = isHoveredSpecific ? 1.05 : 1;

                          return (
                            <motion.div
                              key={itemName}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ 
                                opacity, 
                                x: 0,
                                scale,
                                zIndex: isHoveredSpecific ? 10 : 1
                              }}
                              transition={{ 
                                delay: colIndex * 0.1 + itemIndex * 0.05,
                                scale: { duration: 0.2 },
                                opacity: { duration: 0.2 }
                              }}
                              onMouseEnter={() => setHoveredItem({ colId: col.id, index: itemIndex })}
                              className={`
                                relative p-3 rounded border bg-[#0a192f] 
                                transition-colors duration-300
                              `}
                              style={{ 
                                borderColor,
                                boxShadow: glowShadow,
                              }}
                            >
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-xs font-medium text-[#E6F1FF]">{tool.name}</span>
                              </div>
                              
                              {/* Mini Bar */}
                              <div className="h-1 w-full bg-[#112240] rounded-full overflow-hidden">
                                <div 
                                  className="h-full rounded-full transition-colors duration-300"
                                  style={{ 
                                    width: `${tool.level}%`, 
                                    backgroundColor: isInHighlightPath ? col.color : '#233554' 
                                  }}
                                />
                              </div>

                              {/* Decorative Connector */}
                              <div 
                                className="absolute left-[-17px] top-1/2 -translate-y-1/2 w-3 h-[2px] bg-[#112240] transition-colors duration-300"
                                style={{ backgroundColor: isInHighlightPath ? col.color : '#233554' }}
                              />
                              <div 
                                className="absolute left-[-21px] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full border border-[#112240] bg-[#0a192f] transition-colors duration-300"
                                style={{ borderColor: isInHighlightPath ? col.color : '#233554' }}
                              />
                            </motion.div>
                          );
                        })}
                     </div>
                   </motion.div>
                 );
               })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Toggle Button (Only in Grid View, at bottom) */}
        {!showAll && activeCategory === 'all' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center mt-12"
          >
            <button
              onClick={() => setShowAll(true)}
              className="group flex items-center gap-2 px-6 py-2 rounded-full border border-[#233554] bg-[#112240] text-[#8892B0] hover:border-[#64FFDA] hover:text-[#64FFDA] transition-all duration-300"
            >
              <span className="text-sm font-mono tracking-wider">
                EXPLORE FULL STACK
              </span>
              <motion.span
                animate={{ rotate: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ArrowDown className="w-4 h-4" />
              </motion.span>
            </button>
          </motion.div>
        )}

        {/* Bottom Stats / Metadata (Only in Grid View) */}
        {!showAll && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 border-t border-[#233554] pt-12 max-w-5xl mx-auto"
          >
            {[
              { label: 'Lines of Code', value: '500k+', color: '#64FFDA' },
              { label: 'Shaders Written', value: '200+', color: '#4A9EFF' },
              { label: 'Tools Built', value: '45+', color: '#FF6B6B' },
              { label: 'FPS Saved', value: '∞', color: '#FFD93D' }
            ].map((stat, i) => (
               <div key={i} className="text-center group hover:-translate-y-1 transition-transform duration-300">
                  <div className="text-3xl font-bold mb-1 font-mono transition-colors" style={{ color: stat.color }}>{stat.value}</div>
                  <div className="text-[#8892B0] text-xs uppercase tracking-widest group-hover:text-[#E6F1FF] transition-colors">{stat.label}</div>
               </div>
            ))}
          </motion.div>
        )}

      </div>
    </div>
  );
}