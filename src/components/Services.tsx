import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Code2,
  Cpu,
  Zap,
  Box,
  Layers,
  Terminal,
  Lightbulb,
  Pencil,
  Rocket,
  TestTube,
  GitMerge,
  Server,
  Monitor,
  Database,
  Search,
  CheckCircle,
  Play
} from "lucide-react";

type ViewMode = "capabilities" | "pipeline";

export function Services() {
  const [activeTab, setActiveTab] = useState<ViewMode>("capabilities");

  // Typewriter effect state
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Updated phrases list
  const phrases = [
    "system_status: online",
    "channel: open",
    "execute: contact_me"
  ];

  useEffect(() => {
    // If hovered, force text to "execute: contact_me" and stop animation logic
    if (isHovered) {
      setText("execute: contact_me");
      setIsDeleting(false);
      return;
    }

    let ticker: NodeJS.Timeout;
    const i = loopNum % phrases.length;
    const fullText = phrases[i];

    // Determine typing delay
    let delay = 100;
    if (isDeleting) delay = 40;

    const tick = () => {
      let updatedText = isDeleting 
        ? fullText.substring(0, text.length - 1) 
        : fullText.substring(0, text.length + 1);

      setText(updatedText);

      // Logic for pausing and switching state
      if (!isDeleting && updatedText === fullText) {
        setIsDeleting(true); 
      } else if (isDeleting && updatedText === "") {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
      }
    };

    // To implement proper pauses, we use the effect re-run timing
    if (!isDeleting && text === fullText) {
        // Pausing at end of sentence
        ticker = setTimeout(() => setIsDeleting(true), 2000);
    } else if (isDeleting && text === "") {
        // Pausing before next sentence
        ticker = setTimeout(() => {
            setIsDeleting(false);
            setLoopNum(loopNum + 1);
        }, 500);
    } else {
        // Typing or Deleting
        ticker = setTimeout(() => {
            setText(isDeleting 
                ? fullText.substring(0, text.length - 1) 
                : fullText.substring(0, text.length + 1)
            );
        }, isDeleting ? 30 : 100);
    }

    return () => clearTimeout(ticker);
  }, [text, isDeleting, loopNum, phrases, isHovered]);


  // --- Data: Capabilities (Services) ---
  const capabilities = [
    {
      icon: <Code2 className="w-5 h-5" />,
      title: "Shader Engineering",
      desc: "Custom HLSL/GLSL shaders for unique visual identities.",
      tags: ["HLSL", "GLSL", "Node Graphs"],
      color: "#64FFDA"
    },
    {
      icon: <Cpu className="w-5 h-5" />,
      title: "Performance Ops",
      desc: "Using profiling tools to identify bottlenecks and optimize CPU/GPU, memory, and draw calls for stable 60+ FPS.",
      tags: ["Profiler", "Frame Debugger", "GPU Timing"],
      color: "#4A9EFF"
    },
    {
      icon: <Terminal className="w-5 h-5" />,
      title: "Tool Development",
      desc: "Editor extensions & CLI tools to accelerate art teams.",
      tags: ["Python", "C#", "Automation"],
      color: "#FF6B6B"
    },
    {
      icon: <Box className="w-5 h-5" />,
      title: "Procedural Tech",
      desc: "Algorithmic generation for infinite worlds & assets.",
      tags: ["PCG", "Houdini", "Runtime"],
      color: "#FFD93D"
    },
    {
      icon: <Layers className="w-5 h-5" />,
      title: "Render Pipelines",
      desc: "Customizing scriptable render pipelines (URP/HDRP).",
      tags: ["SRP", "Render Passes", "PostFX"],
      color: "#A78BFA"
    },
    {
      icon: <Server className="w-5 h-5" />,
      title: "Asset Pipelines",
      desc: "Automated import/export & validation workflows.",
      tags: ["CI/CD", "Validation", "SDKs"],
      color: "#EC4899"
    }
  ];

  // --- Data: Pipeline (Workflow) ---
  const pipeline = [
    {
      id: "01",
      icon: <Search className="w-5 h-5" />,
      title: "Discovery & Scope",
      desc: "Clarify goals, constraints, and success metrics. Define budgets for frame time, memory, and visual targets before building.",
      output: "Tech Brief + Budgets",
      color: "#64FFDA"
    },
    {
      id: "02",
      icon: <GitMerge className="w-5 h-5" />,
      title: "Prototype & Benchmark",
      desc: "Build a focused prototype to validate feasibility. Benchmark early to de-risk performance and visual quality on target hardware.",
      output: "Proof of Concept + Benchmark Report",
      color: "#4A9EFF"
    },
    {
      id: "03",
      icon: <Code2 className="w-5 h-5" />,
      title: "Implementation",
      desc: "Develop modular, production-ready systems with clean interfaces. Keep it maintainable, testable, and easy to iterate on.",
      output: "Production System",
      color: "#FF6B6B"
    },
    {
      id: "04",
      icon: <Monitor className="w-5 h-5" />,
      title: "Quality & Performance Pass",
      desc: "Polish the experience to meet both visual and technical targets—readability, consistency, and frame-time stability. Iterate with profiling and visual reviews to make sure it feels right and runs well.",
      output: "Quality-Approved Build",
      color: "#FFD93D"
    },
    {
      id: "05",
      icon: <Rocket className="w-5 h-5" />,
      title: "Delivery & Handoff",
      desc: "Polish, document, and hand off with clear usage notes. Ensure the team can extend and troubleshoot confidently.",
      output: "Shipped Feature + Documentation",
      color: "#A78BFA"
    }
  ];

  return (
    <div className="min-h-screen px-6 py-24 flex items-center justify-center overflow-hidden relative">
      
      <div className="max-w-5xl w-full relative z-10">
        
        {/* Header Area */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row items-center justify-between mb-16 gap-8"
        >
          <div>
            <div className="flex items-center gap-3 mb-4">
               {/* Terminal Output Box */}
               <div 
                 onClick={() => {
                   const contactSection = document.getElementById('contact');
                   if (contactSection) {
                     contactSection.scrollIntoView({ behavior: 'smooth' });
                   }
                 }}
                 onMouseEnter={() => setIsHovered(true)}
                 onMouseLeave={() => setIsHovered(false)}
                 className="bg-black border border-[#233554] rounded px-4 py-2 flex items-center gap-3 shadow-[0_0_15px_rgba(0,0,0,0.5)] min-w-[240px] cursor-pointer hover:border-[#64FFDA] transition-colors group/terminal"
               >
                  <Terminal className={`w-4 h-4 transition-colors ${
                    text.startsWith("execute") ? "text-[#FF6B6B]" : "text-[#64FFDA]"
                  }`} />
                  <span className="font-mono text-sm text-[#64FFDA] min-h-[20px]">
                     {text.startsWith("execute") ? (
                       <span className="text-[#FF6B6B]">{text}</span>
                     ) : (
                       text
                     )}
                     <span className="animate-pulse inline-block w-2 h-4 bg-[#64FFDA] ml-1 align-middle"></span>
                  </span>
               </div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#E6F1FF] tracking-tight">
              ENGINEERING SYSTEMS
            </h2>
            <p className="text-[#8892B0] mt-2 max-w-md">
              Bridging the gap between creative vision and technical reality.
            </p>
          </div>

          {/* Toggle Interface */}
          <div className="bg-[#112240] p-1.5 rounded-lg flex items-center shadow-lg border border-[#233554]">
             <button
               onClick={() => setActiveTab("capabilities")}
               className={`relative px-6 py-2.5 rounded-md text-sm font-mono font-medium transition-all duration-300 ${
                 activeTab === "capabilities" 
                   ? "text-[#0a192f]" 
                   : "text-[#8892B0] hover:text-[#E6F1FF]"
               }`}
             >
               {activeTab === "capabilities" && (
                 <motion.div
                   layoutId="tab-bg"
                   className="absolute inset-0 bg-[#64FFDA] rounded-md"
                   transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                 />
               )}
               <span className="relative z-10 flex items-center gap-2">
                  <Database className="w-4 h-4" />
                  CAPABILITIES
               </span>
             </button>

             <button
               onClick={() => setActiveTab("pipeline")}
               className={`relative px-6 py-2.5 rounded-md text-sm font-mono font-medium transition-all duration-300 ${
                 activeTab === "pipeline" 
                   ? "text-[#E6F1FF]" 
                   : "text-[#8892B0] hover:text-[#E6F1FF]"
               }`}
             >
               {activeTab === "pipeline" && (
                 <motion.div
                   layoutId="tab-bg"
                   className="absolute inset-0 bg-[#112240] border border-[#64FFDA] rounded-md shadow-[0_0_15px_rgba(100,255,218,0.15)]"
                   transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                 />
               )}
               <span className="relative z-10 flex items-center gap-2">
                  <GitMerge className="w-4 h-4" />
                  PIPELINE
               </span>
             </button>
          </div>
        </motion.div>

        {/* Content Area */}
        <div className="min-h-[500px]">
           <AnimatePresence mode="wait">
             
             {/* VIEW 1: CAPABILITIES (GRID) */}
             {activeTab === "capabilities" ? (
               <motion.div
                 key="capabilities"
                 initial={{ opacity: 0, scale: 0.98 }}
                 animate={{ opacity: 1, scale: 1 }}
                 exit={{ opacity: 0, scale: 0.98 }}
                 transition={{ duration: 0.4 }}
                 className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
               >
                 {capabilities.map((item, index) => (
                   <motion.div
                     key={item.title}
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ delay: index * 0.05 }}
                     className="group bg-[#112240]/50 hover:bg-[#112240] border border-[#233554] hover:border-[#64FFDA] rounded-xl p-6 transition-all duration-300 relative overflow-hidden"
                   >
                     {/* Hover Glow */}
                     <div 
                       className="absolute -right-10 -top-10 w-20 h-20 rounded-full blur-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none"
                       style={{ backgroundColor: item.color }}
                     />

                     <div className="flex items-start justify-between mb-4">
                        <div 
                          className="w-10 h-10 rounded-lg flex items-center justify-center bg-[#0a192f] border border-[#233554] group-hover:border-[#E6F1FF]/30 transition-colors"
                          style={{ color: item.color }}
                        >
                           {item.icon}
                        </div>
                        <div className="text-[#8892B0] opacity-20 group-hover:opacity-100 transition-opacity">
                           <Code2 className="w-4 h-4" />
                        </div>
                     </div>

                     <h3 className="text-[#E6F1FF] font-semibold text-lg mb-2 group-hover:text-[#64FFDA] transition-colors">
                       {item.title}
                     </h3>
                     <p className="text-[#8892B0] text-sm leading-relaxed mb-6">
                       {item.desc}
                     </p>

                     <div className="flex flex-wrap gap-2 mt-auto">
                       {item.tags.map(tag => (
                         <span 
                           key={tag} 
                           className="text-[10px] font-mono px-2 py-1 rounded bg-[#0a192f] text-[#64FFDA] border border-[#233554]"
                         >
                           {tag}
                         </span>
                       ))}
                     </div>
                   </motion.div>
                 ))}
               </motion.div>
             ) : (
               
             /* VIEW 2: PIPELINE (TIMELINE) */
               <motion.div
                 key="pipeline"
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: -20 }}
                 transition={{ duration: 0.4 }}
                 className="space-y-6"
               >
                 {pipeline.map((step, index) => (
                   <motion.div
                     key={step.id}
                     initial={{ opacity: 0, x: -20 }}
                     animate={{ opacity: 1, x: 0 }}
                     transition={{ delay: index * 0.1 }}
                     className="relative flex gap-6"
                   >
                     {/* Timeline Line */}
                     <div className="flex flex-col items-center">
                        <div 
                          className="w-8 h-8 rounded-full bg-[#112240] border border-[#233554] flex items-center justify-center text-[10px] font-mono text-[#8892B0] z-10"
                        >
                          {step.id}
                        </div>
                        {index !== pipeline.length - 1 && (
                          <div className="w-[1px] flex-grow bg-[#233554] my-2" />
                        )}
                     </div>

                     {/* Card Content */}
                     <div className="flex-1 bg-[#112240]/30 border border-[#233554] p-6 rounded-xl">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
                           <div className="flex items-center gap-3">
                              <span style={{ color: step.color }}>{step.icon}</span>
                              <h3 className="text-[#E6F1FF] font-semibold text-lg">{step.title}</h3>
                           </div>
                           <div className="flex items-center gap-2 text-xs font-mono text-[#8892B0] bg-[#0a192f] px-3 py-1 rounded-full border border-[#233554]">
                              <CheckCircle className="w-3 h-3 text-[#64FFDA]" />
                              OUTPUT: {step.output}
                           </div>
                        </div>
                        <p className="text-[#8892B0] text-sm leading-relaxed pl-8 md:pl-0">
                           {step.desc}
                        </p>
                     </div>
                   </motion.div>
                 ))}
               </motion.div>
             )}

           </AnimatePresence>
        </div>
        
      </div>
    </div>
  );
}