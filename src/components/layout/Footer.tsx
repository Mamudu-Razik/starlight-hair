"use client";

import { useRef } from "react";
import { gsap, SplitText, prefersReducedMotion } from "@/lib/gsap";
import { business } from "@/content/business";
import { navLinks } from "@/content/site";
import { useIsoLayoutEffect } from "@/hooks/useIsoLayoutEffect";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { Star } from "@/components/ui/Star";

export function Footer() {
  const root = useRef<HTMLElement>(null);
  const mark = useRef<HTMLParagraphElement>(null);

  // Giant wordmark rises letter by letter, scrubbed to scroll.
  useIsoLayoutEffect(() => {
    if (!mark.current || prefersReducedMotion()) return;
    let split: SplitText | null = null;
    const ctx = gsap.context(() => {
      split = SplitText.create(mark.current, { type: "chars", aria: "none" });
      gsap.from(split.chars, {
        yPercent: 100,
        ease: "power3.out",
        stagger: 0.06,
        scrollTrigger: { trigger: root.current, start: "top 85%", end: "bottom bottom", scrub: 0.8 },
      });
    }, root);
    return () => {
      ctx.revert();
      split?.revert();
    };
  }, []);

  return (
    <footer ref={root} className="no-print relative overflow-hidden border-t border-line pb-28 pt-20 md:pb-10">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-8">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="font-display text-3xl italic leading-tight text-pearl md:text-4xl">{business.footerTagline}</p>
            <a
              href={business.phone.href}
              className="mt-6 inline-flex items-center gap-3 text-[0.8rem] font-semibold uppercase tracking-[0.18em] text-gold hover:underline"
            >
              <Star className="h-3 w-3" /> Book on {business.phone.display}
            </a>
          </div>
          <nav aria-label="Footer" className="md:col-span-4">
            <ul className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <TransitionLink href={l.href} className="inline-block py-1 text-mist transition-colors hover:text-gold">
                    {l.label}
                  </TransitionLink>
                </li>
              ))}
            </ul>
          </nav>
          <div className="space-y-3 text-sm md:col-span-3">
            <a href={business.socials.instagram} target="_blank" rel="noopener noreferrer" className="block text-mist hover:text-gold">
              Instagram ↗
            </a>
            <a href={business.socials.facebook} target="_blank" rel="noopener noreferrer" className="block text-mist hover:text-gold">
              Facebook ↗
            </a>
            <a href={`mailto:${business.email}`} className="block break-all text-mist hover:text-gold">
              {business.email}
            </a>
          </div>
        </div>
      </div>

      <p
        ref={mark}
        aria-hidden
        className="mt-10 select-none overflow-hidden whitespace-nowrap pb-[0.14em] text-center font-display text-mega font-light leading-[0.85] tracking-[-0.05em] text-gold"
      >
        Starlight
      </p>

      <div className="mx-auto mt-8 flex max-w-[1600px] flex-wrap items-center justify-between gap-4 px-4 text-xs text-mist sm:px-8">
        <p>
          © {new Date().getFullYear()} {business.name} · {business.address.street}, {business.address.postcode}
        </p>
        <p>Concept redesign · Photography via Unsplash</p>
      </div>
    </footer>
  );
}
