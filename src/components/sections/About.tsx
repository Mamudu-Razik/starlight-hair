"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { about } from "@/content/business";
import { totalServices } from "@/content/services";
import { useIsoLayoutEffect } from "@/hooks/useIsoLayoutEffect";
import { Reveal } from "@/components/ui/Reveal";
import { Counter } from "@/components/ui/Counter";
import { Star } from "@/components/ui/Star";

const stats = [
  { value: 7, label: "days a week" },
  { value: 2, suffix: " min", label: "walk from Turnpike Lane" },
  { value: totalServices, label: "hair & beauty services" },
  { value: 24, prefix: "£", label: "wash, cut & blow dry" },
];

export function About() {
  const media = useRef<HTMLDivElement>(null);

  // Parallax on the inner image (transform only), separate from the clip-path reveal on the frame.
  useIsoLayoutEffect(() => {
    if (!media.current || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-parallax]",
        { yPercent: -8 },
        {
          yPercent: 8,
          ease: "none",
          scrollTrigger: { trigger: media.current, start: "top bottom", end: "bottom top", scrub: true },
        },
      );
    }, media);
    return () => ctx.revert();
  }, []);

  return (
    <section id="about" aria-labelledby="about-title" className="relative mx-auto max-w-[1600px] px-4 py-28 sm:px-8 md:py-44">
      <div className="grid gap-16 md:grid-cols-12 md:gap-10">
        <div className="md:col-span-7 md:pr-10">
          <Reveal as="p" className="eyebrow mb-8 flex items-center gap-3">
            <Star className="h-3 w-3" /> {about.eyebrow}
          </Reveal>
          <Reveal
            as="h2"
            id="about-title"
            variant="split-lines"
            className="font-display text-headline font-light leading-[1] tracking-[-0.02em] text-pearl"
          >
            {about.heading}
          </Reveal>
          <div className="hairline my-12 w-full" />
          <Reveal as="p" variant="words-scrub" className="max-w-2xl text-lg leading-[1.75] text-pearl md:text-xl">
            {about.body}
          </Reveal>

          <Reveal as="dl" staggerChildren className="mt-16 grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="border-t border-line pt-5">
                <dt className="sr-only">{s.label}</dt>
                <dd className="font-display text-5xl font-light text-gold md:text-6xl">
                  <Counter value={s.value} prefix={s.prefix} suffix={s.suffix} />
                </dd>
                <dd className="mt-2 text-xs font-medium uppercase tracking-[0.2em] text-mist">{s.label}</dd>
              </div>
            ))}
          </Reveal>
        </div>

        <div ref={media} className="relative md:col-span-5">
          <Reveal variant="clip" className="relative aspect-[4/5] w-full overflow-hidden rounded-[2px]">
            <div data-parallax className="absolute -inset-y-[10%] inset-x-0 will-change-transform">
              <Image
                src="/images/salon.jpg"
                alt="Black-and-white photo of a modern salon with styling chairs and tall windows"
                fill
                sizes="(min-width: 768px) 40vw, 100vw"
                className="object-cover grayscale-[30%]"
              />
            </div>
          </Reveal>
          <p className="mt-5 flex items-center justify-between text-xs uppercase tracking-[0.25em] text-mist">
            <span>65 Westbury Ave</span>
            <span className="font-display text-base normal-case italic tracking-normal text-gold">Wood Green, N22</span>
          </p>
        </div>
      </div>
    </section>
  );
}
