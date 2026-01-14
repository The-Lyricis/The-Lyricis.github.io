import React, { useEffect, useRef } from "react";

interface RGB {
  r: number;
  g: number;
  b: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseSize: number; // The intrinsic random size of the star
  currentSize: number; // Actual rendered size based on lifecycle
  color: RGB; // Current color
  targetColor: RGB; // Target color to lerp to
  glow: number;
  
  // Lifecycle properties
  age: number;
  maxAge: number; // How long this particle lives in frames
  opacity: number; // Calculated based on age (0 to 1)
  
  connectDist: number; // Max connection distance based on size
}

interface ThemeConfig {
  colors: { color: string; weight: number }[];
}

const THEMES: ThemeConfig[] = [
  // 组 A：经典冷色
  {
    colors: [
      { color: '#5EF0CF', weight: 60 },
      { color: '#47B7A7', weight: 25 },
      { color: '#489AF7', weight: 10 },
      { color: '#E2A74D', weight: 3 },
      { color: '#F77270', weight: 2 },
    ]
  },
  // 组 B：更“科技蓝”
  {
    colors: [
      { color: '#4A9EFF', weight: 50 },
      { color: '#64FFDA', weight: 30 },
      { color: '#E6F1FF', weight: 15 },
      { color: '#E2A74D', weight: 3 },
      { color: '#F77270', weight: 2 },
    ]
  },
  // 组 C：青绿极光
  {
    colors: [
      { color: '#64FFDA', weight: 55 },
      { color: '#2C7071', weight: 25 },
      { color: '#276467', weight: 15 },
      { color: '#E2A74D', weight: 3 },
      { color: '#F77270', weight: 2 },
    ]
  },
  // 组 D：紫蓝星云
  {
    colors: [
      { color: '#7C83FF', weight: 45 },
      { color: '#489AF7', weight: 30 },
      { color: '#E6F1FF', weight: 20 },
      { color: '#E2A74D', weight: 3 },
      { color: '#F77270', weight: 2 },
    ]
  },
  // 组 E：暖冷对比
  {
    colors: [
      { color: '#E6F1FF', weight: 45 },
      { color: '#64FFDA', weight: 35 },
      { color: '#489AF7', weight: 10 },
      { color: '#FFB35C', weight: 7 },
      { color: '#F77270', weight: 3 },
    ]
  },
];

// Helper: Hex to RGB
const hexToRgb = (hex: string): RGB => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 100, g: 255, b: 218 };
};

// Helper: Get random color based on weights
const getRandomColorFromTheme = (themeIndex: number): RGB => {
  const theme = THEMES[themeIndex % THEMES.length];
  const totalWeight = theme.colors.reduce((acc, c) => acc + c.weight, 0);
  let random = Math.random() * totalWeight;
  
  for (const c of theme.colors) {
    if (random < c.weight) {
      return hexToRgb(c.color);
    }
    random -= c.weight;
  }
  return hexToRgb(theme.colors[0].color);
};

// Helper: Linear interpolation for color
const lerpColor = (start: RGB, end: RGB, t: number): RGB => {
  return {
    r: start.r + (end.r - start.r) * t,
    g: start.g + (end.g - start.g) * t,
    b: start.b + (end.b - start.b) * t,
  };
};

interface ParticleFieldProps {
  themeIndex?: number;
}

export function ParticleField({ themeIndex = 0 }: ParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const animationFrameRef = useRef<number>();
  const sizeRef = useRef({ w: 0, h: 0, dpr: 1 });

  // Constants for behavior
  const MIN_PARTICLES = 120;
  const MAX_PARTICLES = 200;
  const GLOBAL_MAX_SCALE = 2.5; // The absolute maximum size a star can reach
  // CONNECTION_DISTANCE removed in favor of dynamic calculation
  
  // Update particle colors when theme changes
  useEffect(() => {
    particlesRef.current.forEach(p => {
      p.targetColor = getRandomColorFromTheme(themeIndex);
    });
  }, [themeIndex]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const createParticle = (
      w: number,
      h: number,
      isInitial: boolean = false
    ): Particle => {
      const initialColor = getRandomColorFromTheme(themeIndex);
      
      // Exponential distribution for life span
      // Most particles will have a life around 400-600 frames
      // A few rare ones will live much longer (up to ~1400 frames)
      // Math.pow(Math.random(), 3) biases heavily towards 0
      const maxAge = 400 + Math.floor(Math.pow(Math.random(), 3) * 1000);
      
      // If initial, randomize age so they don't all die at once
      const age = isInitial ? Math.random() * maxAge : 0;

      // Base size: Exponential distribution
      // Modified to reduce the number of very small stars
      // Power reduced from 4 to 2, min size increased from 0.5 to 0.8
      const baseSize = 0.8 + Math.pow(Math.random(), 2) * 2.2;
      
      // Connection Distance: Exponentially influenced by size
      // Reduced ranges:
      // Small stars (0.8) -> ~75px
      // Large stars (3.0) -> ~285px
      const connectDist = 60 + Math.pow(baseSize, 2) * 25;

      return {
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        baseSize,
        currentSize: 0, // Will be calculated in animate
        color: initialColor,
        targetColor: initialColor,
        // Glow also follows exponential distribution: most are subtle, few are very bright
        glow: 2 + Math.pow(Math.random(), 3) * 8,
        age,
        maxAge,
        opacity: 0, // Will be calculated in animate
        connectDist,
      };
    };

    const setCanvasSize = () => {
      const dpr = Math.max(1, window.devicePixelRatio || 1);
      const rect = canvas.getBoundingClientRect();
      const cssW = Math.max(1, Math.floor(rect.width));
      const cssH = Math.max(1, Math.floor(rect.height));
      const prev = { ...sizeRef.current };

      canvas.width = Math.floor(cssW * dpr);
      canvas.height = Math.floor(cssH * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      sizeRef.current = { w: cssW, h: cssH, dpr };

      if (particlesRef.current.length > 0 && prev.w > 0 && prev.h > 0) {
        const sx = cssW / prev.w;
        const sy = cssH / prev.h;
        particlesRef.current.forEach((p) => {
          p.x *= sx;
          p.y *= sy;
        });
      }
    };

    setCanvasSize();
    
    // Initial population
    if (particlesRef.current.length === 0) {
      particlesRef.current = Array.from(
        { length: MIN_PARTICLES + Math.floor(Math.random() * (MAX_PARTICLES - MIN_PARTICLES)) },
        () => createParticle(sizeRef.current.w, sizeRef.current.h, true),
      );
    }

    const handleResize = () => {
      setCanvasSize();
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);

    const animate = () => {
      const { w, h } = sizeRef.current;

      ctx.clearRect(0, 0, w, h);

      // 1. Manage Population
      // Remove dead particles
      particlesRef.current = particlesRef.current.filter(p => p.age < p.maxAge);

      // Spawn new particles
      const currentCount = particlesRef.current.length;
      if (currentCount < MIN_PARTICLES) {
        // Force spawn if below min
        particlesRef.current.push(createParticle(w, h));
      } else if (currentCount < MAX_PARTICLES) {
        // Chance to spawn
        if (Math.random() < 0.05) { // Adjust spawn rate
           particlesRef.current.push(createParticle(w, h));
        }
      }

      const particles = particlesRef.current;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Lifecycle updates
        p.age++;
        
        // Calculate lifecycle factor (0 -> 1 -> 0) using Sine wave
        // Math.sin(0) = 0, Math.sin(PI/2) = 1, Math.sin(PI) = 0
        const lifeProgress = p.age / p.maxAge;
        const lifeFactor = Math.sin(lifeProgress * Math.PI); // Smooth fade in and out

        // Update opacity and size based on lifecycle
        p.opacity = lifeFactor;
        p.currentSize = Math.min(p.baseSize * lifeFactor * 2, GLOBAL_MAX_SCALE); // Grow up to 2x base or global max

        // Color interpolation (theme)
        p.color = lerpColor(p.color, p.targetColor, 0.02);
        
        // Update position
        p.x += p.vx;
        p.y += p.vy;

        p.vx += (Math.random() - 0.5) * 0.02;
        p.vy += (Math.random() - 0.5) * 0.02;

        const dx = mouseRef.current.x - p.x;
        const dy = mouseRef.current.y - p.y;
        const dist2 = dx * dx + dy * dy;

        // Interaction with mouse uses fixed distance for consistency
        const MOUSE_DIST = 150;
        if (dist2 < MOUSE_DIST * MOUSE_DIST) {
          const dist = Math.sqrt(dist2) || 0.0001;
          const force = (MOUSE_DIST - dist) / MOUSE_DIST;
          p.vx -= (dx / dist) * force * 0.2;
          p.vy -= (dy / dist) * force * 0.2;
        }

        // Boundary checks
        if (p.x < 0) { p.x = 0; p.vx *= -1; }
        else if (p.x > w) { p.x = w; p.vx *= -1; }

        if (p.y < 0) { p.y = 0; p.vy *= -1; }
        else if (p.y > h) { p.y = h; p.vy *= -1; }

        p.vx *= 0.99;
        p.vy *= 0.99;

        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        const maxSpeed = 3;
        if (speed > maxSpeed) {
          p.vx = (p.vx / speed) * maxSpeed;
          p.vy = (p.vy / speed) * maxSpeed;
        }

        // Draw Star
        // Use rgba for opacity control
        const colorString = `rgba(${Math.round(p.color.r)}, ${Math.round(p.color.g)}, ${Math.round(p.color.b)}, ${p.opacity})`;
        
        // Optimization: Only apply shadowBlur (glow) to larger stars to save performance
        const isLarge = p.currentSize > 1.5;
        
        if (isLarge) {
          ctx.shadowBlur = p.glow * p.opacity;
          ctx.shadowColor = colorString;
        } else {
          ctx.shadowBlur = 0;
        }
        
        ctx.fillStyle = colorString;
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0, p.currentSize), 0, Math.PI * 2);
        ctx.fill();

        // Draw Connections
        // Optimization: Check connections only if particle is visible enough
        if (p.opacity < 0.1) continue;

        for (let j = i + 1; j < particles.length; j++) {
          const o = particles[j];
          // Optimization: Skip connection if other particle is too faint
          if (o.opacity < 0.1) continue;

          const ddx = o.x - p.x;
          const ddy = o.y - p.y;
          // Pre-check squared distance to avoid Math.sqrt if not needed
          // Using the larger connectDist is safer for the broad check
          const maxDist = Math.max(p.connectDist, o.connectDist);
          if (Math.abs(ddx) > maxDist || Math.abs(ddy) > maxDist) continue; // Bounding box check

          const d2 = ddx * ddx + ddy * ddy;
          const dynamicLimit = (p.connectDist + o.connectDist) / 2;

          if (d2 < dynamicLimit * dynamicLimit) {
            const d = Math.sqrt(d2);
            const distFactor = (dynamicLimit - d) / dynamicLimit;
            
            const baseAlpha = 0.2;
            
            // Optimization: Use solid average color instead of Gradient
            // Gradients are very expensive to create per-frame for hundreds of lines
            const avgR = Math.round((p.color.r + o.color.r) / 2);
            const avgG = Math.round((p.color.g + o.color.g) / 2);
            const avgB = Math.round((p.color.b + o.color.b) / 2);
            const avgAlpha = Math.min(p.opacity, o.opacity) * distFactor * baseAlpha;

            // Don't draw invisible lines
            if (avgAlpha < 0.01) continue;

            const avgSize = (p.currentSize + o.currentSize) / 2;
            ctx.lineWidth = 0.5 * (avgSize / 1.5); 
            
            ctx.strokeStyle = `rgba(${avgR}, ${avgG}, ${avgB}, ${avgAlpha})`;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(o.x, o.y);
            ctx.stroke();
          }
        }
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      if (animationFrameRef.current)
        cancelAnimationFrame(animationFrameRef.current);
    };
  }, []); // Theme handled separately

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full z-0 pointer-events-none"
    />
  );
}