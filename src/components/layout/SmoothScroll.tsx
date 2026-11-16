"use client";

import Lenis from "lenis";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";

const LenisContext = createContext<Lenis | null>(null);
export const useLenis = () => useContext(LenisContext);

/** Scroll to a selector / element / y-offset, through Lenis when it's running. */
export function scrollToTarget(lenis: Lenis | null, target: string | HTMLElement | number) {
  if (lenis) {
    lenis.scrollTo(target, { offset: 0, duration: 1.4 });
    return;
  }
  const reduce = prefersReducedMotion();
  if (typeof target === "number") {
    window.scrollTo({ top: target, behavior: reduce ? "auto" : "smooth" });
    return;
  }
  const el = typeof target === "string" ? document.querySelector(target) : target;
  el?.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
}

export function SmoothScroll({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    let instance: Lenis | null = null;
    let tick: ((time: number) => void) | null = null;

    const start = () => {
      instance = new Lenis({ lerp: 0.1, wheelMultiplier: 1, anchors: false });
      instance.on("scroll", ScrollTrigger.update);
      tick = (time: number) => instance?.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      setLenis(instance);
    };
    const stop = () => {
      if (tick) gsap.ticker.remove(tick);
      instance?.destroy();
      instance = null;
      setLenis(null);
    };

    if (!mql.matches) start();
    const onChange = () => (mql.matches ? stop() : start());
    mql.addEventListener("change", onChange);
    return () => {
      mql.removeEventListener("change", onChange);
      stop();
    };
  }, []);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
