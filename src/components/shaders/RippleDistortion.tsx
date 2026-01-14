import React, { useEffect, useRef } from "react";

type Particle = {
  a: number; // angle
  r: number; // radius
  vr: number; // radial speed
  size: number;
  alpha: number;
  color: string;
};

type Ripple = {
  x: number;
  y: number;
  t: number; // elapsed seconds
  duration: number; // seconds
  maxR: number;
  rot: number;
  rotSpeed: number;
  particles: Particle[];
};

const COLORS = ["#64FFDA", "#4A9EFF", "#FF6B6B", "#FFD700"];

function clamp01(v: number) {
  return Math.max(0, Math.min(1, v));
}
function easeOutCubic(t: number) {
  const x = 1 - t;
  return 1 - x * x * x;
}

export function RippleDistortion() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ripplesRef = useRef<Ripple[]>([]);
  const rafRef = useRef<number>(0);
  const lastTsRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const dpr = Math.max(1, window.devicePixelRatio || 1);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); // 之后都用 CSS 像素绘制
    };
    resize();
    window.addEventListener("resize", resize);

    const spawnRipple = (x: number, y: number) => {
      const maxR = 90 + Math.random() * 50; // 更小
      const duration = 0.55 + Math.random() * 0.18; // 更快
      const rotSpeed = (Math.random() * 2 - 1) * 4; // 虚线环旋转速度
      const pCount = 10 + Math.floor(Math.random() * 8);

      const particles: Particle[] = Array.from(
        { length: pCount },
        () => {
          const a = Math.random() * Math.PI * 2;
          return {
            a,
            r: 6 + Math.random() * 10,
            vr: 120 + Math.random() * 180, // px/s
            size: 1 + Math.random() * 1.5,
            alpha: 0.9,
            color:
              COLORS[Math.floor(Math.random() * COLORS.length)],
          };
        },
      );

      ripplesRef.current.push({
        x,
        y,
        t: 0,
        duration,
        maxR,
        rot: Math.random() * Math.PI * 2,
        rotSpeed,
        particles,
      });

      // 控制上限，避免堆太多
      if (ripplesRef.current.length > 10) {
        ripplesRef.current.splice(
          0,
          ripplesRef.current.length - 10,
        );
      }
    };

    const handleClick = (e: MouseEvent) =>
      spawnRipple(e.clientX, e.clientY);
    window.addEventListener("click", handleClick);

    const draw = (ts: number) => {
      const last = lastTsRef.current || ts;
      const dt = Math.min(0.033, (ts - last) / 1000);
      lastTsRef.current = ts;

      ctx.clearRect(
        0,
        0,
        window.innerWidth,
        window.innerHeight,
      );

      // 轻微加法混合更“科幻”
      ctx.globalCompositeOperation = "lighter";

      ripplesRef.current = ripplesRef.current.filter((rp) => {
        rp.t += dt;
        const p = clamp01(rp.t / rp.duration);
        const e = easeOutCubic(p);
        const r = e * rp.maxR;
        const alpha = 1 - p;

        rp.rot += rp.rotSpeed * dt;

        // ===== 1) 主细环（带渐变外发光）=====
        {
          const grad = ctx.createRadialGradient(
            rp.x,
            rp.y,
            Math.max(0, r - 10),
            rp.x,
            rp.y,
            r + 10,
          );
          grad.addColorStop(0, `rgba(100,255,218,0)`);
          grad.addColorStop(
            0.5,
            `rgba(100,255,218,${alpha * 0.35})`,
          );
          grad.addColorStop(1, `rgba(74,158,255,0)`);
          ctx.strokeStyle = grad;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.arc(rp.x, rp.y, r, 0, Math.PI * 2);
          ctx.stroke();
        }

        // ===== 2) 分段弧线（HUD感）=====
        {
          const segAlpha = alpha * 0.6;
          ctx.lineWidth = 1;
          ctx.setLineDash([]);
          ctx.strokeStyle = `rgba(74,158,255,${segAlpha})`;

          const segs = 3;
          for (let i = 0; i < segs; i++) {
            const start = rp.rot + i * ((Math.PI * 2) / segs);
            const len = 0.7; // 弧长
            ctx.beginPath();
            ctx.arc(rp.x, rp.y, r * 0.72, start, start + len);
            ctx.stroke();
          }
        }

        // ===== 3) 旋转虚线环（更科幻）=====
        {
          ctx.save();
          ctx.translate(rp.x, rp.y);
          ctx.rotate(rp.rot * 0.8);

          ctx.strokeStyle = `rgba(100,255,218,${alpha * 0.45})`;
          ctx.lineWidth = 1;
          ctx.setLineDash([4, 6]);
          ctx.beginPath();
          ctx.arc(0, 0, r * 0.52, 0, Math.PI * 2);
          ctx.stroke();

          ctx.restore();
          ctx.setLineDash([]);
        }

        // ===== 4) 小十字准星 =====
        {
          const s = 10 + r * 0.08;
          ctx.strokeStyle = `rgba(100,255,218,${alpha * 0.55})`;
          ctx.lineWidth = 1;

          ctx.beginPath();
          ctx.moveTo(rp.x - s, rp.y);
          ctx.lineTo(rp.x - s * 0.4, rp.y);
          ctx.moveTo(rp.x + s * 0.4, rp.y);
          ctx.lineTo(rp.x + s, rp.y);

          ctx.moveTo(rp.x, rp.y - s);
          ctx.lineTo(rp.x, rp.y - s * 0.4);
          ctx.moveTo(rp.x, rp.y + s * 0.4);
          ctx.lineTo(rp.x, rp.y + s);

          ctx.stroke();
        }

        // ===== 5) 能量碎片喷射 =====
        rp.particles.forEach((pt) => {
          pt.r += pt.vr * dt;
          pt.alpha *= 0.94;

          const px = rp.x + Math.cos(pt.a) * pt.r;
          const py = rp.y + Math.sin(pt.a) * pt.r;

          ctx.fillStyle = pt.color
            .replace(")", "")
            .replace("rgb", "rgba") as any;
          ctx.shadowBlur = 10;
          ctx.shadowColor = pt.color;
          ctx.globalAlpha = alpha * pt.alpha;

          // 细小“短线”比圆点更像火花/能量碎片
          ctx.save();
          ctx.translate(px, py);
          ctx.rotate(pt.a);
          ctx.fillStyle = pt.color;
          ctx.fillRect(0, -pt.size * 0.5, 8, pt.size);
          ctx.restore();
        });

        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;

        // 生命周期结束
        return p < 1;
      });

      ctx.globalCompositeOperation = "source-over";
      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("click", handleClick);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-40"
      style={{ mixBlendMode: "screen" }}
    />
  );
}