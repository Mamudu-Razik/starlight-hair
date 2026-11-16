"use client";

import { useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { useIsoLayoutEffect } from "@/hooks/useIsoLayoutEffect";

/** Counts up from 0 when scrolled into view. SSR / reduced motion render the final value. */
export function Counter({ value, prefix = "", suffix = "" }: { value: number; prefix?: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const state = { v: 0 };
    const render = () => (el.textContent = `${prefix}${Math.round(state.v)}${suffix}`);
    render();
    const tween = gsap.to(state, {
      v: value,
      duration: 2,
      ease: "expo.out",
      onUpdate: render,
      scrollTrigger: { trigger: el, start: "top 90%", once: true },
    });
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      el.textContent = `${prefix}${value}${suffix}`;
    };
  }, [value, prefix, suffix]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {value}
      {suffix}
    </span>
  );
}
