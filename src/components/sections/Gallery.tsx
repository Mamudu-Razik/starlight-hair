"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { looks } from "@/content/site";
import { business } from "@/content/business";
import { useIsoLayoutEffect } from "@/hooks/useIsoLayoutEffect";
import { Star } from "@/components/ui/Star";

/**
 * Desktop: pinned section that scrolls horizontally, with skew + scale driven by scroll velocity.
 * Mobile / reduced motion: a native, swipeable scroll-snap carousel (no pinning).
 */
export function Gallery() {
  const root = useRef<HTMLElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLUListElement>(null);

  useIsoLayoutEffect(() => {
    if (!root.current) return;
    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      const vp = viewport.current!;
      const tr = track.current!;
      gsap.set(vp, { overflow: "visible" });

      const cards = gsap.utils.toArray<HTMLElement>("[data-look]", tr);
      const skewTo = cards.map((c) => gsap.quickTo(c, "skewX", { duration: 0.6, ease: "power3.out" }));
      const scaleTo = cards.map((c) => gsap.quickTo(c, "scale", { duration: 0.6, ease: "power3.out" }));
      const clamp = gsap.utils.clamp(-8, 8);
      let settle: gsap.core.Tween | null = null;

      const distance = () => tr.scrollWidth - window.innerWidth;

      gsap.to(tr, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
          onUpdate(self) {
            const v = self.getVelocity();
            const skew = clamp(v / -400);
            const scale = 1 - Math.min(Math.abs(v) / 25000, 0.06);
            skewTo.forEach((fn) => fn(skew));
            scaleTo.forEach((fn) => fn(scale));
            settle?.kill();
            settle = gsap.delayedCall(0.12, () => {
              skewTo.forEach((fn) => fn(0));
              scaleTo.forEach((fn) => fn(1));
            });
          },
        },
      });

      // Inner image parallax across the horizontal journey
      gsap.utils.toArray<HTMLElement>("[data-look-img]", tr).forEach((img) => {
        gsap.fromTo(img, { xPercent: -6 }, {
          xPercent: 6,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: () => `+=${distance()}`, scrub: true },
        });
      });

      return () => settle?.kill();
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={root}
      id="looks"
      aria-labelledby="looks-title"
      className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden py-24 md:py-0"
    >
      <div ref={viewport} className="no-scrollbar snap-x snap-mandatory scroll-px-4 overflow-x-auto sm:scroll-px-8">
        <ul ref={track} className="flex w-max items-center gap-5 px-4 sm:px-8 md:gap-10 md:pr-[10vw]">
          {/* Intro panel */}
          <li className="flex w-[78vw] shrink-0 snap-start flex-col justify-center pr-4 md:w-[34vw] md:pr-10">
            <p className="eyebrow mb-6 flex items-center gap-3">
              <Star className="h-3 w-3" /> Looks we love
            </p>
            <h2 id="looks-title" className="font-display text-headline font-light leading-[0.95] tracking-[-0.02em]">
              Made to <span className="italic text-gold">catch</span> the light
            </h2>
            <p className="mt-6 max-w-sm text-mist">
              A few of the finishes we create every week — from soft balayage to bridal styling and shellac.
              <span className="mt-3 block text-xs uppercase tracking-[0.2em] text-gold/80 md:hidden">Swipe →</span>
            </p>
          </li>

          {looks.map((look, i) => (
            <li key={look.src} className="shrink-0 snap-start">
              <figure data-look data-cursor="view" className="w-[72vw] will-change-transform sm:w-[48vw] md:w-[min(30vw,52vh)]">
                <div className="relative aspect-[4/5] overflow-hidden rounded-[2px]">
                  <div data-look-img className="absolute -inset-x-[8%] inset-y-0">
                    <Image src={look.src} alt={look.alt} fill sizes="(min-width: 768px) 30vw, 72vw" className="object-cover" />
                  </div>
                </div>
                <figcaption className="mt-5 flex items-baseline gap-4">
                  <span className="text-xs font-semibold tracking-[0.25em] text-gold">{String(i + 1).padStart(2, "0")}</span>
                  <span className="font-display text-3xl text-pearl">{look.title}</span>
                  <span className="font-display text-lg italic text-mist">— {look.caption}</span>
                </figcaption>
              </figure>
            </li>
          ))}

          <li className="flex w-[60vw] shrink-0 snap-start flex-col justify-center md:w-[22vw]">
            <p className="font-display text-3xl italic leading-tight text-pearl">More on Instagram</p>
            <a
              href={business.socials.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 text-[0.8rem] font-semibold uppercase tracking-[0.18em] text-gold hover:underline"
            >
              @mystarlighthair ↗
            </a>
          </li>
        </ul>
      </div>
    </section>
  );
}
