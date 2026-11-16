"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { gsap, SplitText, prefersReducedMotion } from "@/lib/gsap";
import { onIntroDone } from "@/lib/intro";
import { business } from "@/content/business";
import { useIsoLayoutEffect } from "@/hooks/useIsoLayoutEffect";
import { useReducedMotion } from "@/hooks/useMedia";
import { StarField } from "@/components/ui/StarField";
import { HoursBadge } from "@/components/ui/HoursBadge";
import { Magnetic } from "@/components/ui/Magnetic";
import { ButtonLink, Arrow } from "@/components/ui/Button";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { Star } from "@/components/ui/Star";

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  // The star canvas is decorative: start it only once the intro has played and the main thread is idle.
  const [stars, setStars] = useState(false);
  useEffect(() => {
    let idle = 0;
    const off = onIntroDone(() => {
      const ric = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 600));
      idle = ric(() => setStars(true)) as number;
    });
    return () => {
      off();
      (window.cancelIdleCallback ?? window.clearTimeout)(idle);
    };
  }, []);

  useIsoLayoutEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;

    let split: SplitText | null = null;
    const ctx = gsap.context(() => {
      split = SplitText.create("[data-hero-title] [data-line]", { type: "chars", mask: "chars", aria: "none" });
      gsap.set("[data-intro]", { autoAlpha: 1 });
      gsap.set(split.chars, { yPercent: 115 });
      gsap.set("[data-hero-fade]", { autoAlpha: 0, y: 24 });
      gsap.set("[data-hero-media]", { clipPath: "inset(12% 12% 12% 12%)" });
      gsap.set("[data-hero-img]", { scale: 1.35 });

      const intro = gsap.timeline({ paused: true, defaults: { ease: "expo.out" } });
      intro
        .to("[data-hero-media]", { clipPath: "inset(0% 0% 0% 0%)", duration: 1.8 }, 0)
        .to("[data-hero-img]", { scale: 1, duration: 2.6 }, 0)
        .to(split.chars, { yPercent: 0, duration: 1.3, stagger: 0.028 }, 0.15)
        .to("[data-hero-fade]", { autoAlpha: 1, y: 0, duration: 1.2, stagger: 0.08, ease: "starlight" }, 0.7);

      const off = onIntroDone(() => intro.play());

      // Scroll-out parallax (transform only)
      gsap.to("[data-hero-img]", {
        yPercent: 12,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: 0.5 },
      });
      gsap.to("[data-hero-copy]", {
        y: -80,
        opacity: 0.2,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: 0.5 },
      });

      return off;
    }, el);

    return () => {
      ctx.revert();
      split?.revert();
    };
  }, []);

  return (
    <section
      ref={root}
      id="top"
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[100svh] items-end overflow-hidden pb-24 pt-28 sm:pb-16 lg:items-center lg:pb-0"
    >
      {/* Portrait: full-bleed on mobile, right-hand editorial panel on desktop */}
      <div
        data-hero-media
        className="absolute inset-0 -z-20 lg:inset-y-0 lg:left-auto lg:right-0 lg:w-[46%]"
      >
        <div data-hero-img className="absolute inset-0 will-change-transform">
          <Image
            src="/images/hero.jpg"
            alt="Portrait of a woman with voluminous natural hair against a soft peach backdrop"
            fill
            priority
            fetchPriority="high"
            sizes="(min-width: 1024px) 46vw, 100vw"
            className="object-cover object-[50%_30%]"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-midnight via-midnight/55 to-midnight/20 lg:bg-gradient-to-r lg:from-midnight lg:via-midnight/30 lg:to-transparent" />
      </div>

      {!reduce && stars && <StarField className="absolute inset-0 -z-10 h-full w-full" />}

      <div data-hero-copy className="relative mx-auto w-full max-w-[1600px] px-4 sm:px-8">
        <p data-intro data-hero-fade className="eyebrow mb-6 flex items-center gap-3">
          <Star className="h-3 w-3" /> Wood Green · North London
        </p>

        <h1
          id="hero-title"
          data-intro
          data-hero-title
          className="font-display text-display font-light leading-[0.92] tracking-[-0.03em] text-pearl"
        >
          <span className="sr-only">Hair that shines like starlight</span>
          <span aria-hidden="true">
            <span data-line className="block">Hair that</span>
            <span data-line className="block lg:pl-[0.9em]">shines like</span>
            <span data-line className="block italic text-gold">starlight</span>
          </span>
        </h1>

        {/* Deliberately not animated: paints with the first frame so it can serve as the LCP element */}
        <p className="mt-6 max-w-md text-base leading-relaxed text-mist sm:mt-8 md:text-lg">
          {business.tagline}. Cuts for every budget, colour that catches the light, and beauty under one roof.
        </p>

        <div data-intro data-hero-fade className="mt-8 grid grid-cols-1 gap-3 min-[420px]:flex min-[420px]:flex-wrap min-[420px]:items-center sm:mt-10 sm:gap-4">
          <Magnetic className="w-full min-[420px]:w-auto">
            <ButtonLink href={business.phone.href} icon={<Arrow />} className="w-full min-[420px]:w-auto">
              Book an appointment
            </ButtonLink>
          </Magnetic>
          <Magnetic className="w-full min-[420px]:w-auto">
            <TransitionLink
              href="/#services"
              className="group relative inline-flex w-full items-center justify-center gap-3 min-[420px]:w-auto overflow-hidden rounded-full border border-gold/50 px-7 py-4 text-[0.8rem] font-semibold uppercase tracking-[0.18em] text-pearl transition-colors duration-500 hover:text-midnight"
            >
              <span
                aria-hidden
                className="absolute inset-0 translate-y-full rounded-full bg-gold transition-transform duration-500 ease-[var(--ease-starlight)] group-hover:translate-y-0"
              />
              <span className="relative">View services</span>
            </TransitionLink>
          </Magnetic>
        </div>

        <div data-intro data-hero-fade className="mt-8 flex items-center justify-between gap-6 sm:mt-10 lg:mt-16">
          <HoursBadge />
          <TransitionLink
            href="/#marquee"
            className="group hidden items-center gap-4 text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-mist hover:text-gold lg:flex"
          >
            Scroll
            <span className="relative block h-12 w-px overflow-hidden bg-pearl/15" aria-hidden>
              <span className="absolute inset-x-0 top-0 h-1/2 animate-[scrollcue_2.2s_var(--ease-curtain)_infinite] bg-gold" />
            </span>
          </TransitionLink>
        </div>
      </div>
    </section>
  );
}
