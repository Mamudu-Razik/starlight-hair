"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { PRELOADER_KEY, markIntroDone } from "@/lib/intro";

const WORD = "Starlight".split("");

/**
 * First-visit intro (≈1.5s): a gold star draws itself, the wordmark rises letter by letter,
 * then the curtain wipes up into the hero. Skipped for returning visitors (sessionStorage)
 * and for prefers-reduced-motion — the inline head script hides it before first paint.
 */
export function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(PRELOADER_KEY) === "1";
    } catch {}
    if (seen || prefersReducedMotion() || !root.current) {
      markIntroDone();
      setGone(true);
      return;
    }

    const el = root.current;
    const ctx = gsap.context(() => {
      gsap
        .timeline({
          defaults: { ease: "expo.out" },
          onComplete: () => {
            try {
              sessionStorage.setItem(PRELOADER_KEY, "1");
            } catch {}
            setGone(true);
          },
        })
        .fromTo("[data-star-stroke]", { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.6, ease: "power2.inOut" })
        .fromTo("[data-star-fill]", { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.4, transformOrigin: "50% 50%" }, 0.45)
        .fromTo("[data-letter]", { y: 0, yPercent: 110 }, { y: 0, yPercent: 0, duration: 0.55, stagger: 0.035 }, 0.2)
        .add(markIntroDone, 0.95)
        .to(el, { yPercent: -100, duration: 0.55, ease: "curtain" }, 0.95);
    }, el);

    return () => ctx.revert();
  }, []);

  if (gone) return null;

  return (
    <div
      ref={root}
      className="preloader no-print fixed inset-0 z-[110] flex flex-col items-center justify-center gap-6 bg-midnight"
      aria-hidden
    >
      <svg viewBox="0 0 24 24" className="h-12 w-12 overflow-visible text-gold">
        <path
          data-star-stroke
          pathLength={1}
          strokeDasharray="1"
          strokeDashoffset="1"
          d="M12 0c.6 6.6 5.4 11.4 12 12-6.6.6-11.4 5.4-12 12-.6-6.6-5.4-11.4-12-12C6.6 11.4 11.4 6.6 12 0Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.5"
        />
        <path
          data-star-fill
          opacity="0"
          d="M12 0c.6 6.6 5.4 11.4 12 12-6.6.6-11.4 5.4-12 12-.6-6.6-5.4-11.4-12-12C6.6 11.4 11.4 6.6 12 0Z"
          fill="currentColor"
        />
      </svg>
      <p className="flex overflow-hidden font-display text-5xl tracking-tight text-pearl md:text-7xl">
        {WORD.map((ch, i) => (
          <span key={i} data-letter className="inline-block">
            {ch}
          </span>
        ))}
      </p>
      <span className="hairline absolute bottom-0 left-0 right-0" />
    </div>
  );
}
