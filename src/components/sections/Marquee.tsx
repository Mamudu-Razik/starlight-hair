"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import { marqueeItems } from "@/content/site";
import { useIsoLayoutEffect } from "@/hooks/useIsoLayoutEffect";

function Row({ hidden = false }: { hidden?: boolean }) {
  return (
    <div className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {marqueeItems.map((item) => (
        <span key={item} className="flex items-center">
          <span className="text-outline-gold px-6 font-display text-[clamp(3.5rem,9vw,8.5rem)] font-light italic leading-none tracking-tight md:px-10">
            {item}
          </span>
          <span className="text-[clamp(1.5rem,3vw,2.75rem)] text-gold" aria-hidden>
            ✦
          </span>
        </span>
      ))}
    </div>
  );
}

/** Infinite outlined marquee. Linear by design; speed and direction follow scroll velocity. */
export function Marquee() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useIsoLayoutEffect(() => {
    if (!root.current || !track.current || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const loop = gsap.to(track.current, { xPercent: -50, duration: 32, ease: "none", repeat: -1 });
      // Park the playhead far from 0 so reversing (scrolling up) never hits the start.
      loop.totalTime(loop.duration() * 1000);

      let dir = 1;
      ScrollTrigger.create({
        trigger: root.current,
        start: "top bottom",
        end: "bottom top",
        onUpdate(self) {
          dir = self.direction;
          const boost = 1 + Math.min(Math.abs(self.getVelocity()) / 250, 8);
          gsap.to(loop, { timeScale: dir * boost, duration: 0.25, overwrite: true });
          gsap.to(loop, { timeScale: dir, duration: 1.4, delay: 0.25, ease: "power3.out" });
        },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      id="marquee"
      aria-label={`Signature services: ${marqueeItems.join(", ")}`}
      className="relative overflow-hidden border-y border-line py-10 md:py-14"
    >
      <div ref={track} className="flex w-max will-change-transform">
        <Row />
        <Row hidden />
      </div>
    </section>
  );
}
