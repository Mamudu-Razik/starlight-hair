"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  phase: number;
  speed: number;
  gold: boolean;
  ox: number;
  oy: number;
}

/**
 * Canvas of slowly drifting, twinkling stars that ease away from the cursor.
 * - ~140 particles on desktop, ~35 on small screens
 * - pauses off-screen and in background tabs, DPR capped at 2
 * - not mounted at all with prefers-reduced-motion (handled by the parent)
 */
export function StarField({ className = "" }: { className?: string }) {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cvs = canvas.current;
    const ctx = cvs?.getContext("2d");
    if (!cvs || !ctx) return;

    let w = 0;
    let h = 0;
    let dpr = 1;
    let particles: Particle[] = [];
    let raf = 0;
    let running = false;
    const mouse = { x: -9999, y: -9999, tx: -9999, ty: -9999 };

    const seed = () => {
      const count = w < 768 ? 35 : Math.min(160, Math.round((w * h) / 9000));
      particles = Array.from({ length: count }, () => {
        const big = Math.random() < 0.08;
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          r: big ? 1.4 + Math.random() * 1.2 : 0.4 + Math.random() * 0.9,
          vx: (Math.random() - 0.5) * 0.06,
          vy: -0.02 - Math.random() * 0.08,
          phase: Math.random() * Math.PI * 2,
          speed: 0.6 + Math.random() * 1.6,
          gold: Math.random() < 0.35,
          ox: 0,
          oy: 0,
        };
      });
    };

    const resize = () => {
      const rect = cvs.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      cvs.width = Math.round(w * dpr);
      cvs.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };

    const sparkle = (x: number, y: number, r: number) => {
      // Four-point glint for the brightest stars
      ctx.beginPath();
      ctx.moveTo(x, y - r * 4);
      ctx.quadraticCurveTo(x, y, x + r * 4, y);
      ctx.quadraticCurveTo(x, y, x, y + r * 4);
      ctx.quadraticCurveTo(x, y, x - r * 4, y);
      ctx.quadraticCurveTo(x, y, x, y - r * 4);
      ctx.fill();
    };

    const draw = (t: number) => {
      raf = requestAnimationFrame(draw);
      const time = t / 1000;
      mouse.x += (mouse.tx - mouse.x) * 0.08;
      mouse.y += (mouse.ty - mouse.y) * 0.08;
      ctx.clearRect(0, 0, w, h);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -10) p.y = h + 10;
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;

        // Gentle repulsion from the cursor, eased back to rest
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.hypot(dx, dy);
        const radius = 140;
        if (dist < radius && dist > 0.01) {
          const f = (1 - dist / radius) * 18;
          p.ox += ((dx / dist) * f - p.ox) * 0.08;
          p.oy += ((dy / dist) * f - p.oy) * 0.08;
        } else {
          p.ox *= 0.94;
          p.oy *= 0.94;
        }

        const twinkle = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(time * p.speed + p.phase));
        ctx.globalAlpha = twinkle * (p.r > 1.3 ? 0.95 : 0.7);
        ctx.fillStyle = p.gold ? "#D8B67A" : "#F4EFE8";
        const x = p.x + p.ox;
        const y = p.y + p.oy;
        if (p.r > 1.3) sparkle(x, y, p.r);
        else {
          ctx.beginPath();
          ctx.arc(x, y, p.r, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
    };

    const play = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(draw);
    };
    const pause = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const onMove = (e: PointerEvent) => {
      const rect = cvs.getBoundingClientRect();
      mouse.tx = e.clientX - rect.left;
      mouse.ty = e.clientY - rect.top;
      if (mouse.x < -9000) {
        mouse.x = mouse.tx;
        mouse.y = mouse.ty;
      }
    };
    const onLeave = () => {
      mouse.tx = mouse.ty = -9999;
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(cvs);
    const io = new IntersectionObserver(([entry]) => (entry.isIntersecting ? play() : pause()));
    io.observe(cvs);
    const onVis = () => (document.hidden ? pause() : play());
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);

    return () => {
      pause();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <canvas ref={canvas} aria-hidden className={`pointer-events-none ${className}`} />;
}
