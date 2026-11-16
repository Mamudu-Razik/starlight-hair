"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { m } from "framer-motion";
import { navLinks } from "@/content/site";
import { business } from "@/content/business";
import { TransitionLink } from "@/components/ui/TransitionLink";

const ease = [0.16, 1, 0.3, 1] as const;

export function MenuOverlay({ onClose }: { onClose: () => void }) {
  const [active, setActive] = useState(0);
  const panel = useRef<HTMLDivElement>(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    panel.current?.querySelector<HTMLElement>("a")?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeRef.current();
      // Simple focus trap
      if (e.key === "Tab" && panel.current) {
        const items = panel.current.querySelectorAll<HTMLElement>("a, button");
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      previouslyFocused?.focus?.();
    };
  }, []);

  return (
    <m.div
      id="site-menu"
      ref={panel}
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      className="fixed inset-0 z-[65] overflow-y-auto overscroll-contain bg-ink"
      data-lenis-prevent
      initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
      animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
      exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
      transition={{ duration: 0.8, ease }}
    >
      <div className="mx-auto grid min-h-full max-w-[1600px] grid-cols-1 gap-10 px-4 pb-28 pt-28 sm:px-8 md:grid-cols-[1.4fr_1fr] md:pb-16 md:pt-32">
        <nav aria-label="Primary">
          <ul className="flex flex-col">
            {navLinks.map((link, i) => (
              <li key={link.href} className="overflow-hidden border-b border-line">
                <m.div
                  initial={{ y: "110%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "110%" }}
                  transition={{ duration: 0.9, ease, delay: 0.15 + i * 0.06 }}
                >
                  <TransitionLink
                    href={link.href}
                    onNavigate={onClose}
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    className="group flex items-baseline gap-5 py-3 font-display text-[clamp(2.6rem,7vw,6rem)] leading-[1.05] tracking-tight text-pearl transition-colors duration-500 hover:text-gold focus-visible:text-gold"
                  >
                    <span className="font-sans text-xs tracking-[0.3em] text-gold/80">0{i + 1}</span>
                    <span className="transition-transform duration-700 ease-[var(--ease-starlight)] group-hover:translate-x-4 group-hover:italic">
                      {link.label}
                    </span>
                  </TransitionLink>
                </m.div>
              </li>
            ))}
          </ul>
        </nav>

        <m.aside
          className="flex flex-col justify-between gap-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 0.45, duration: 0.8 } }}
          exit={{ opacity: 0, transition: { duration: 0.2 } }}
        >
          <div className="relative hidden h-[52vh] w-full overflow-hidden rounded-[2px] md:block" aria-hidden>
            {navLinks.map((link, i) => (
              <Image
                key={link.href}
                src={link.image}
                alt=""
                fill
                sizes="35vw"
                className="object-cover transition-[opacity,transform] duration-700 ease-[var(--ease-starlight)]"
                style={{ opacity: active === i ? 1 : 0, transform: active === i ? "scale(1)" : "scale(1.08)" }}
              />
            ))}
            <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />
          </div>
          <div className="space-y-5 text-sm text-mist">
            <p className="eyebrow">Visit</p>
            <p className="font-display text-2xl text-pearl">
              {business.address.street}, {business.address.postcode}
            </p>
            <p>
              <a href={business.phone.href} className="text-pearl underline-offset-4 hover:text-gold hover:underline">
                {business.phone.display}
              </a>
              <span className="mx-3 text-gold">✦</span>
              <a href={`mailto:${business.email}`} className="text-pearl underline-offset-4 hover:text-gold hover:underline">
                {business.email}
              </a>
            </p>
            <p className="flex gap-6">
              <a href={business.socials.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-gold">
                Instagram ↗
              </a>
              <a href={business.socials.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-gold">
                Facebook ↗
              </a>
            </p>
          </div>
        </m.aside>
      </div>
    </m.div>
  );
}
