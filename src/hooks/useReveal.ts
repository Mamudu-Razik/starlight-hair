"use client";

import { type RefObject } from "react";
import { gsap, ScrollTrigger, SplitText, prefersReducedMotion } from "@/lib/gsap";
import { useIsoLayoutEffect } from "./useIsoLayoutEffect";

export type RevealVariant = "fade-up" | "clip" | "split-lines" | "split-chars" | "words-scrub";

export interface RevealOptions {
  variant?: RevealVariant;
  delay?: number;
  duration?: number;
  stagger?: number;
  /** ScrollTrigger start, e.g. "top 85%" */
  start?: string;
  /** Animate direct children one after another instead of the element itself (fade-up only) */
  children?: boolean;
}

/**
 * One hook for every scroll reveal on the site.
 * - Runs inside a gsap.context so everything (tweens, triggers, SplitText) is reverted on unmount.
 * - With prefers-reduced-motion the element is simply left in its final, visible state.
 * - Only transform / opacity are animated (clip uses clip-path on a single wrapper, by design).
 */
export function useReveal<T extends HTMLElement>(ref: RefObject<T | null>, opts: RevealOptions = {}) {
  const { variant = "fade-up", delay = 0, duration, stagger, start = "top 85%", children = false } = opts;

  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    let split: SplitText | null = null;
    const ctx = gsap.context(() => {
      const trigger = { trigger: el, start, once: true } as const;

      switch (variant) {
        case "fade-up": {
          const targets = children ? Array.from(el.children) : el;
          gsap.from(targets, {
            yPercent: children ? 30 : 0,
            y: children ? 0 : 48,
            autoAlpha: 0,
            duration: duration ?? 1.2,
            delay,
            stagger: stagger ?? 0.08,
            ease: "starlight",
            scrollTrigger: trigger,
          });
          break;
        }
        case "clip": {
          gsap.fromTo(
            el,
            { clipPath: "inset(100% 0% 0% 0%)" },
            {
              clipPath: "inset(0% 0% 0% 0%)",
              duration: duration ?? 1.6,
              delay,
              ease: "expo.out",
              scrollTrigger: trigger,
            },
          );
          break;
        }
        case "split-lines":
        case "split-chars": {
          const byChars = variant === "split-chars";
          split = SplitText.create(el, {
            type: byChars ? "lines,chars" : "lines",
            aria: "none",
            mask: "lines",
            linesClass: "split-line",
            autoSplit: true,
            onSplit(self) {
              return gsap.from(byChars ? self.chars : self.lines, {
                yPercent: 110,
                duration: duration ?? (byChars ? 1.1 : 1.3),
                delay,
                stagger: stagger ?? (byChars ? 0.025 : 0.1),
                ease: "expo.out",
                scrollTrigger: trigger,
              });
            },
          });
          break;
        }
        case "words-scrub": {
          split = SplitText.create(el, { type: "words", wordsClass: "split-word", aria: "none" });
          gsap.fromTo(
            split.words,
            // 0.5 keeps even the dimmed words above WCAG AA (≈4.8:1 on midnight)
            { opacity: 0.5 },
            {
              opacity: 1,
              ease: "none",
              stagger: 0.1,
              scrollTrigger: { trigger: el, start: "top 80%", end: "bottom 45%", scrub: 0.6 },
            },
          );
          break;
        }
      }
    }, el);

    // Fonts can shift line breaks — re-measure once they've loaded.
    document.fonts?.ready.then(() => ScrollTrigger.refresh());

    return () => {
      ctx.revert();
      split?.revert();
    };
  }, [variant, delay, duration, stagger, start, children]);
}
