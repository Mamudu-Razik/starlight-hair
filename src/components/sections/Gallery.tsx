"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { looks } from "@/content/site";
import { business } from "@/content/business";
import { useIsoLayoutEffect } from "@/hooks/useIsoLayoutEffect";
import { Star } from "@/components/ui/Star";

const PIN_QUERY = "(min-width: 1024px) and (prefers-reduced-motion: no-preference)";

function Intro({ titleId }: { titleId?: string }) {
  return (
    <>
      <p className="eyebrow mb-5 flex items-center gap-3 sm:mb-6">
        <Star className="h-3 w-3" /> Looks we love
      </p>
      <h2 id={titleId} className="font-display text-headline font-light leading-[0.95] tracking-[-0.02em]">
        Made to <span className="italic text-gold">catch</span> the light
      </h2>
      <p className="mt-5 max-w-sm text-mist sm:mt-6">
        A few of the finishes we create every week — from soft balayage to bridal styling and shellac.
      </p>
    </>
  );
}

/**
 * Desktop (≥1024px): pinned section that scrolls horizontally, with skew + scale driven by scroll velocity.
 * Phones / tablets / reduced motion: heading above a native, swipeable scroll-snap carousel.
 */
export function Gallery() {
  const root = useRef<HTMLElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLUListElement>(null);

  useIsoLayoutEffect(() => {
    if (!root.current) return;
    const mm = gsap.matchMedia();

    mm.add(PIN_QUERY, () => {
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
          anticipatePin: 1,
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
          scrollTrigger: { trigger: root.current, start: "top top", end: () => `+=${distance()}`, scrub: 0.8 },
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
      className="relative overflow-hidden py-20 sm:py-28 lg:flex lg:min-h-[100svh] lg:flex-col lg:justify-center lg:py-0"
    >
      {/* Phones / tablets: heading sits above the carousel so photos are visible straight away */}
      <div className="mb-10 px-4 sm:px-8 lg:hidden">
        <Intro titleId="looks-title" />
      </div>

      <div
        ref={viewport}
        className="no-scrollbar snap-x snap-mandatory scroll-px-4 overflow-x-auto overscroll-x-contain sm:scroll-px-8"
      >
        <ul ref={track} className="flex w-max items-start gap-4 px-4 sm:gap-6 sm:px-8 lg:items-center lg:gap-10 lg:pr-[10vw]">
          {/* Desktop: the intro is the first panel of the horizontal journey.
              aria-hidden because the same heading is already in the document (shown below lg). */}
          <li className="hidden w-[34vw] shrink-0 flex-col justify-center pr-10 lg:flex" aria-hidden>
            <Intro />
          </li>

          {looks.map((look, i) => (
            <li key={look.src} className="shrink-0 snap-start">
              <figure
                data-look
                data-cursor="view"
                className="w-[78vw] max-w-[340px] will-change-transform sm:w-[44vw] sm:max-w-none md:w-[36vw] lg:w-[min(30vw,52vh)]"
              >
                <div className="relative aspect-[4/5] overflow-hidden rounded-[2px] bg-ink">
                  <div data-look-img className="absolute -inset-x-[8%] inset-y-0">
                    <Image
                      src={look.src}
                      alt={look.alt}
                      fill
                      sizes="(min-width: 1024px) 30vw, (min-width: 640px) 44vw, 78vw"
                      className="object-cover"
                    />
                  </div>
                </div>
                <figcaption className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1 sm:mt-5 sm:gap-x-4">
                  <span className="text-xs font-semibold tracking-[0.25em] text-gold">{String(i + 1).padStart(2, "0")}</span>
                  <span className="font-display text-2xl text-pearl sm:text-3xl">{look.title}</span>
                  <span className="font-display text-base italic text-mist sm:text-lg">— {look.caption}</span>
                </figcaption>
              </figure>
            </li>
          ))}

          <li className="flex w-[60vw] max-w-[260px] shrink-0 snap-start flex-col justify-center self-center sm:w-[30vw] lg:w-[22vw] lg:max-w-none">
            <p className="font-display text-3xl italic leading-tight text-pearl">More on Instagram</p>
            <a
              href={business.socials.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 py-2 text-[0.8rem] font-semibold uppercase tracking-[0.18em] text-gold hover:underline"
            >
              @mystarlighthair ↗
            </a>
          </li>
        </ul>
      </div>

      <p className="mt-6 px-4 text-xs uppercase tracking-[0.2em] text-gold/80 sm:px-8 lg:hidden" aria-hidden>
        Swipe to explore →
      </p>
    </section>
  );
}
