"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ScrollTrigger } from "@/lib/gsap";
import { business } from "@/content/business";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { Star } from "@/components/ui/Star";
import { Magnetic } from "@/components/ui/Magnetic";
import dynamic from "next/dynamic";

const Menu = dynamic(() => import("./Menu"), { ssr: false });
import { useLenis } from "./SmoothScroll";

export function Header() {
  const [hidden, setHidden] = useState(false);
  const [glass, setGlass] = useState(false);
  const [open, setOpen] = useState(false);
  const [menuLoaded, setMenuLoaded] = useState(false);
  const pathname = usePathname();
  const lenis = useLenis();

  useEffect(() => {
    const st = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate(self) {
        const y = self.scroll();
        setHidden(self.direction === 1 && y > 160);
        // On the home page, turn to glass once the hero is behind us; elsewhere almost immediately.
        setGlass(y > (pathname === "/" ? window.innerHeight * 0.85 : 40));
      },
    });
    return () => st.kill();
  }, [pathname]);

  useEffect(() => setOpen(false), [pathname]);

  // Lock page scroll while the menu is open; released the moment it starts closing.
  useEffect(() => {
    if (!open) return;
    lenis?.stop();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
      lenis?.start();
    };
  }, [open, lenis]);

  const show = !hidden || open;

  return (
    <>
      <a
        href="#main"
        className="sr-only z-[120] rounded-full bg-gold px-5 py-3 text-sm font-semibold text-midnight focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <header
        className="no-print fixed inset-x-0 top-0 z-[70] transition-transform duration-700 ease-[var(--ease-starlight)]"
        style={{ transform: show ? "translateY(0)" : "translateY(-110%)" }}
      >
        {/* Glass layer fades in via opacity only */}
        <div
          aria-hidden
          className="absolute inset-0 border-b border-line bg-midnight/65 backdrop-blur-xl transition-opacity duration-500"
          style={{ opacity: glass && !open ? 1 : 0 }}
        />
        <div className="relative mx-auto flex h-18 max-w-[1600px] items-center justify-between px-4 sm:px-8 md:h-20">
          <TransitionLink
            href="/#top"
            className="group flex items-center gap-2 font-display text-2xl tracking-tight text-pearl md:text-[1.7rem]"
            aria-label={`${business.name} — home`}
          >
            <Star className="h-3.5 w-3.5 text-gold transition-transform duration-700 group-hover:rotate-90" />
            <span>
              Starlight<span className="hidden text-mist sm:inline"> · Hair &amp; Beauty</span>
            </span>
          </TransitionLink>

          <div className="flex items-center gap-2 sm:gap-4">
            <span className="hidden sm:block">
              <Magnetic>
              <a
                href={business.phone.href}
                className="inline-flex items-center rounded-full bg-gold px-5 py-2.5 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-midnight transition-shadow duration-500 hover:shadow-[0_10px_40px_-10px_rgb(216_182_122/.8)]"
              >
                Book now
              </a>
              </Magnetic>
            </span>
            <button
              type="button"
              onClick={() => {
                setMenuLoaded(true);
                setOpen((o) => !o);
              }}
              onPointerEnter={() => setMenuLoaded(true)}
              aria-expanded={open}
              aria-controls="site-menu"
              className="group flex h-11 items-center gap-3 rounded-full border border-pearl/20 px-4 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-pearl transition-colors hover:border-gold"
            >
              <span className="hidden sm:inline">{open ? "Close" : "Menu"}</span>
              <span className="relative block h-2.5 w-5" aria-hidden>
                <span
                  className="absolute left-0 top-0 h-px w-full bg-current transition-transform duration-500"
                  style={{ transform: open ? "translateY(5px) rotate(45deg)" : "none" }}
                />
                <span
                  className="absolute bottom-0 left-0 h-px w-full bg-current transition-transform duration-500"
                  style={{ transform: open ? "translateY(-4px) rotate(-45deg)" : "scaleX(.6)", transformOrigin: "left" }}
                />
              </span>
              <span className="sr-only sm:hidden">{open ? "Close menu" : "Open menu"}</span>
            </button>
          </div>
        </div>
      </header>
      {menuLoaded && <Menu open={open} onClose={() => setOpen(false)} />}
    </>
  );
}
