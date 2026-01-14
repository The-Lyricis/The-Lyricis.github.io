import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';

interface WeldingSparksProps {
  x: number;
  y: number;
  isActive: boolean;
}

export function WeldingSparks({ x, y, isActive }: WeldingSparksProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const particlesRef = useRef<Particle[]>([]);

  interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    maxLife: number;
    size: number;
    color: string;
    trail: { x: number; y: number }[];
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    let lastSpawnTime = 0;

    const createParticle = (): Particle => {
      const angle = (Math.random() - 0.5) * Math.PI * 0.8; // Spread angle
      const speed = 2 + Math.random() * 4;
      const colors = ['#FFEB3B', '#FFD700', '#FF6B6B', '#FF8C00', '#FFA500'];
      
      return {
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2, // Upward bias
        life: 1,
        maxLife: 0.5 + Math.random() * 0.5,
        size: 2 + Math.random() * 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        trail: []
      };
    };

    const animate = (timestamp: number) => {
      if (!ctx) return;

      ctx.clearRect(0, 0, rect.width, rect.height);

      // Spawn new particles when welding is active
      if (isActive && timestamp - lastSpawnTime > 30) {
        for (let i = 0; i < 3; i++) {
          particlesRef.current.push(createParticle());
        }
        lastSpawnTime = timestamp;
      }

      // Update and draw particles
      particlesRef.current = particlesRef.current.filter((particle) => {
        // Physics
        particle.vy += 0.15; // Gravity
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vx *= 0.98; // Air resistance
        particle.vy *= 0.98;
        particle.life -= 0.02;

        // Trail
        particle.trail.push({ x: particle.x, y: particle.y });
        if (particle.trail.length > 8) particle.trail.shift();

        if (particle.life <= 0) return false;

        // Draw trail
        ctx.strokeStyle = particle.color;
        ctx.lineWidth = particle.size * 0.5;
        ctx.globalAlpha = particle.life * 0.3;
        ctx.beginPath();
        particle.trail.forEach((point, i) => {
          if (i === 0) {
            ctx.moveTo(point.x, point.y);
          } else {
            ctx.lineTo(point.x, point.y);
          }
        });
        ctx.stroke();

        // Draw particle core
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.size
        );
        gradient.addColorStop(0, particle.color);
        gradient.addColorStop(0.5, particle.color + 'AA');
        gradient.addColorStop(1, particle.color + '00');

        ctx.globalAlpha = particle.life;
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();

        // Glow
        ctx.globalAlpha = particle.life * 0.5;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2);
        ctx.fill();

        return true;
      });

      // Draw welding arc (bright center)
      if (isActive) {
        const arcGradient = ctx.createRadialGradient(x, y, 0, x, y, 15);
        arcGradient.addColorStop(0, '#FFFFFF');
        arcGradient.addColorStop(0.3, '#FFEB3B');
        arcGradient.addColorStop(0.6, '#FF6B6B');
        arcGradient.addColorStop(1, 'transparent');

        ctx.globalAlpha = 0.8 + Math.random() * 0.2;
        ctx.fillStyle = arcGradient;
        ctx.beginPath();
        ctx.arc(x, y, 15, 0, Math.PI * 2);
        ctx.fill();

        // Electric arcs
        for (let i = 0; i < 3; i++) {
          const angle = Math.random() * Math.PI * 2;
          const length = 5 + Math.random() * 10;
          const ex = x + Math.cos(angle) * length;
          const ey = y + Math.sin(angle) * length;

          ctx.globalAlpha = 0.6;
          ctx.strokeStyle = '#64FFDA';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(ex, ey);
          ctx.stroke();
        }
      }

      ctx.globalAlpha = 1;
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [x, y, isActive]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ width: '100%', height: '100%' }}
    />
  );
}
