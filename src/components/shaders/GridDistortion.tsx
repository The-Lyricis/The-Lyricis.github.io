import React, { useEffect, useRef } from 'react';

interface GridDistortionProps {
  gridSize?: number;
  color?: string;
  lineWidth?: number;
  distortionRadius?: number;
}

export function GridDistortion({
  gridSize = 40,
  color = '#64FFDA',
  lineWidth = 1,
  distortionRadius = 150
}: GridDistortionProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Mouse tracking
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Draw grid with distortion
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;

      const cols = Math.ceil(canvas.width / gridSize);
      const rows = Math.ceil(canvas.height / gridSize);

      // Draw vertical lines
      for (let i = 0; i <= cols; i++) {
        ctx.beginPath();
        for (let j = 0; j <= rows; j++) {
          const x = i * gridSize;
          const y = j * gridSize;

          // Calculate distortion
          const dx = mouseRef.current.x - x;
          const dy = mouseRef.current.y - y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          let offsetX = 0;
          let offsetY = 0;

          if (distance < distortionRadius) {
            const force = (1 - distance / distortionRadius) * 20;
            offsetX = (dx / distance) * force;
            offsetY = (dy / distance) * force;
          }

          if (j === 0) {
            ctx.moveTo(x + offsetX, y + offsetY);
          } else {
            ctx.lineTo(x + offsetX, y + offsetY);
          }
        }
        ctx.stroke();
      }

      // Draw horizontal lines
      for (let j = 0; j <= rows; j++) {
        ctx.beginPath();
        for (let i = 0; i <= cols; i++) {
          const x = i * gridSize;
          const y = j * gridSize;

          // Calculate distortion
          const dx = mouseRef.current.x - x;
          const dy = mouseRef.current.y - y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          let offsetX = 0;
          let offsetY = 0;

          if (distance < distortionRadius) {
            const force = (1 - distance / distortionRadius) * 20;
            offsetX = (dx / distance) * force;
            offsetY = (dy / distance) * force;
          }

          if (i === 0) {
            ctx.moveTo(x + offsetX, y + offsetY);
          } else {
            ctx.lineTo(x + offsetX, y + offsetY);
          }
        }
        ctx.stroke();
      }
    };

    // Animation loop
    const animate = () => {
      draw();
      requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [gridSize, color, lineWidth, distortionRadius]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ opacity: 0.15 }}
    />
  );
}
