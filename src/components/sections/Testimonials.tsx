"use client";

import { useCallback, useEffect, useRef, useState, type PointerEvent } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { testimonials } from "@/content/testimonials";
import { Reveal } from "@/components/ui/Reveal";
import { Star } from "@/components/ui/Star";

const AUTOPLAY_MS = 6000;

/** Auto-playing, draggable carousel. Pauses on hover, focus, drag, and for reduced motion. */
export function Testimonials() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const track = useRef<HTMLDivElement>(null);
  const drag = useRef<{ startX: number; baseX: number; dx: number; id: number } | null>(null);
  const count = testimonials.length;

  const go = useCallback((i: number) => setIndex(((i % count) + count) % count), [count]);

  const targetX = useCallback(() => {
    const list = track.current;
    const el = list?.children[index] as HTMLElement | undefined;
    if (!list || !el) return 0;
    // Centre the active card in the full-width section. Both offsets share the section as offsetParent.
    const sectionWidth = (list.offsetParent as HTMLElement | null)?.clientWidth ?? window.innerWidth;
    const cardLeft = el.offsetLeft - list.offsetLeft;
    return sectionWidth / 2 - list.offsetLeft - (cardLeft + el.offsetWidth / 2);
  }, [index]);

  // Move the track whenever the index changes (or on resize)
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const move = (instant = false) =>
      gsap.to(el, { x: targetX(), duration: instant || prefersReducedMotion() ? 0 : 1.1, ease: "expo.out", overwrite: true });
    move();
    const onResize = () => move(true);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [targetX]);

  // Autoplay
  useEffect(() => {
    if (paused || prefersReducedMotion()) return;
    const id = window.setTimeout(() => go(index + 1), AUTOPLAY_MS);
    return () => window.clearTimeout(id);
  }, [index, paused, go]);

  const onDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    drag.current = { startX: e.clientX, baseX: targetX(), dx: 0, id: e.pointerId };
    e.currentTarget.setPointerCapture(e.pointerId);
    setPaused(true);
  };
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    d.dx = e.clientX - d.startX;
    gsap.set(e.currentTarget, { x: d.baseX + d.dx });
  };
  const onUp = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d) return;
    drag.current = null;
    setPaused(false);
    if (Math.abs(d.dx) > 60) go(index + (d.dx < 0 ? 1 : -1));
    else gsap.to(e.currentTarget, { x: targetX(), duration: 0.8, ease: "expo.out" });
  };

  return (
    <section
      aria-labelledby="reviews-title"
      aria-roledescription="carousel"
      className="relative overflow-hidden border-y border-line bg-ink py-28 md:py-40"
      onPointerEnter={(e) => e.pointerType === "mouse" && setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="mx-auto max-w-[1600px] px-4 sm:px-8">
        <div className="mb-14 flex flex-wrap items-end justify-between gap-8">
          <div>
            <Reveal as="p" className="eyebrow mb-6 flex items-center gap-3">
              <Star className="h-3 w-3" /> Kind words
            </Reveal>
            <Reveal as="h2" id="reviews-title" variant="split-lines" className="font-display text-headline font-light leading-[0.95] tracking-[-0.02em]">
              What clients <span className="italic text-gold">say</span>
            </Reveal>
          </div>
          <div className="flex items-center gap-3">
            {(["prev", "next"] as const).map((dir) => (
              <button
                key={dir}
                type="button"
                onClick={() => go(index + (dir === "next" ? 1 : -1))}
                aria-label={dir === "next" ? "Next review" : "Previous review"}
                className="flex h-14 w-14 items-center justify-center rounded-full border border-pearl/20 text-pearl transition-colors hover:border-gold hover:text-gold"
              >
                <svg viewBox="0 0 24 24" className={`h-5 w-5 ${dir === "prev" ? "rotate-180" : ""}`} aria-hidden>
                  <path d="M4 12h15m-6-6 6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </button>
            ))}
          </div>
        </div>

        <div
          ref={track}
          className="flex cursor-grab touch-pan-y select-none gap-5 will-change-transform active:cursor-grabbing md:gap-8"
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
          data-cursor="link"
        >
          {testimonials.map((t, i) => (
            <div
              key={i}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${count}`}
              aria-hidden={i !== index}
              className="w-[86vw] shrink-0 transition-opacity duration-700 sm:w-[70vw] md:w-[52vw]"
              style={{ opacity: i === index ? 1 : 0.3 }}
            >
              <figure className="relative h-full rounded-[4px] border border-line bg-midnight p-8 md:p-14">
                {t.placeholder && (
                  <span className="absolute right-6 top-6 rounded-full border border-rose/50 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-rose">
                    Placeholder
                  </span>
                )}
                <span aria-hidden className="block font-display text-7xl leading-none text-gold md:text-8xl">
                  &ldquo;
                </span>
                <blockquote className="mt-2 font-display text-2xl font-light leading-snug text-pearl md:text-4xl">
                  {t.quote}
                </blockquote>
                <figcaption className="mt-10 flex items-center gap-4 text-sm">
                  <span className="hairline w-10" />
                  <span className="font-semibold text-pearl">{t.name}</span>
                  <span className="text-mist">· {t.service}</span>
                </figcaption>
              </figure>
            </div>
          ))}
        </div>

        <div className="mt-10 flex items-center gap-3" aria-hidden>
          {testimonials.map((_, i) => (
            <span key={i} className="h-px w-12 overflow-hidden bg-pearl/20">
              <span
                className="block h-full w-full origin-left bg-gold transition-transform duration-700"
                style={{ transform: `scaleX(${i === index ? 1 : 0})` }}
              />
            </span>
          ))}
        </div>
        <p className="sr-only" aria-live={paused ? "polite" : "off"}>
          Review {index + 1} of {count}
        </p>
      </div>
    </section>
  );
}
