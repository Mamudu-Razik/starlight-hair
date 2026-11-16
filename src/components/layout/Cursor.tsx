"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { useFinePointer, useReducedMotion } from "@/hooks/useMedia";

type Mode = "default" | "link" | "view";

/** Gold dot + lagging ring. Desktop (fine pointer) only; never rendered for touch or reduced motion. */
export function Cursor() {
  const fine = useFinePointer();
  const reduce = useReducedMotion();
  const enabled = fine && !reduce;

  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<Mode>("default");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!enabled || !dot.current || !ring.current) return;
    document.documentElement.classList.add("has-cursor");

    const dx = gsap.quickTo(dot.current, "x", { duration: 0.12, ease: "power3.out" });
    const dy = gsap.quickTo(dot.current, "y", { duration: 0.12, ease: "power3.out" });
    const rx = gsap.quickTo(ring.current, "x", { duration: 0.55, ease: "power3.out" });
    const ry = gsap.quickTo(ring.current, "y", { duration: 0.55, ease: "power3.out" });

    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      setVisible(true);
      dx(e.clientX);
      dy(e.clientY);
      rx(e.clientX);
      ry(e.clientY);
    };
    const over = (e: PointerEvent) => {
      const t = e.target as HTMLElement | null;
      if (!t) return;
      if (t.closest('[data-cursor="view"]')) setMode("view");
      else if (t.closest("a, button, [role='tab'], [data-cursor='link']")) setMode("link");
      else setMode("default");
    };
    const leave = () => setVisible(false);

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", over, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, [enabled]);

  if (!enabled) return null;

  const ringScale = mode === "view" ? 2.6 : mode === "link" ? 1.7 : 1;
  return (
    <div aria-hidden className="no-print pointer-events-none fixed inset-0 z-[100]">
      <div
        ref={ring}
        className="absolute left-0 top-0 -ml-5 -mt-5 h-10 w-10"
        style={{ opacity: visible ? 1 : 0, transition: "opacity .3s" }}
      >
        <div
          className="flex h-full w-full items-center justify-center rounded-full border border-gold/70 transition-[transform,background-color] duration-500 ease-[var(--ease-starlight)]"
          style={{
            transform: `scale(${ringScale})`,
            backgroundColor: mode === "view" ? "rgb(216 182 122 / 0.92)" : "transparent",
          }}
        >
          <span
            className="text-[0.32rem] font-semibold uppercase tracking-[0.2em] text-midnight transition-opacity duration-300"
            style={{ opacity: mode === "view" ? 1 : 0 }}
          >
            View
          </span>
        </div>
      </div>
      <div
        ref={dot}
        className="absolute left-0 top-0 -ml-[3px] -mt-[3px] h-1.5 w-1.5 rounded-full bg-gold"
        style={{ opacity: visible && mode !== "view" ? 1 : 0, transition: "opacity .2s" }}
      />
    </div>
  );
}
