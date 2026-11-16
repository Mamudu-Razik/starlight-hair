"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { prefersReducedMotion } from "@/lib/gsap";
import { AnimatePresence, LazyMotion, m } from "framer-motion";
import { loadMotionFeatures } from "@/lib/motion";
import { gsap } from "@/lib/gsap";
import { serviceCategories, serviceImages, formatPrice, type ImageKey } from "@/content/services";
import { business } from "@/content/business";
import { useFinePointer, useReducedMotion } from "@/hooks/useMedia";
import { Reveal } from "@/components/ui/Reveal";
import { Star } from "@/components/ui/Star";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { Arrow } from "@/components/ui/Button";

const ease = [0.16, 1, 0.3, 1] as const;
const imageKeys = Object.keys(serviceImages) as ImageKey[];

/** Floating image that trails the cursor with eased lag (desktop / fine pointer only). */
function HoverPreview({ active, container }: { active: ImageKey | null; container: React.RefObject<HTMLElement | null> }) {
  const box = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = box.current;
    const area = container.current;
    if (!el || !area) return;
    const dur = reduce ? 0 : 0.7;
    const x = gsap.quickTo(el, "x", { duration: dur, ease: "power3.out" });
    const y = gsap.quickTo(el, "y", { duration: dur, ease: "power3.out" });
    const move = (e: PointerEvent) => {
      x(e.clientX + 32);
      y(e.clientY - 140);
    };
    area.addEventListener("pointermove", move);
    return () => area.removeEventListener("pointermove", move);
  }, [container, reduce]);

  return (
    <div ref={box} aria-hidden className="pointer-events-none fixed left-0 top-0 z-40 hidden md:block">
      <div
        className="relative h-[280px] w-[220px] overflow-hidden rounded-[2px] shadow-[0_30px_80px_-20px_rgb(0_0_0/.8)] transition-[opacity,transform] duration-500 ease-[var(--ease-starlight)]"
        style={{ opacity: active ? 1 : 0, transform: active ? "scale(1) rotate(-3deg)" : "scale(.85) rotate(0deg)" }}
      >
        {imageKeys.map((k) => (
          <Image
            key={k}
            src={serviceImages[k].src}
            alt=""
            fill
            sizes="220px"
            className="object-cover transition-opacity duration-500"
            style={{ opacity: active === k ? 1 : 0 }}
          />
        ))}
        <div className="absolute inset-0 ring-1 ring-inset ring-gold/30" />
      </div>
    </div>
  );
}

export function Services() {
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState<ImageKey | null>(null);
  const fine = useFinePointer();
  const listArea = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const category = serviceCategories[index];
  const firstRender = useRef(true);

  // Keep the selected tab visible in the horizontally scrolling tab bar (phones / tablets).
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const tab = tabRefs.current[index];
    const bar = tab?.parentElement;
    if (!tab || !bar || bar.scrollWidth <= bar.clientWidth) return;
    const target = tab.offsetLeft - (bar.clientWidth - tab.offsetWidth) / 2;
    bar.scrollTo({ left: target, behavior: prefersReducedMotion() ? "auto" : "smooth" });
  }, [index]);

  const onTabKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const last = serviceCategories.length - 1;
    let next = index;
    if (e.key === "ArrowRight") next = index === last ? 0 : index + 1;
    else if (e.key === "ArrowLeft") next = index === 0 ? last : index - 1;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = last;
    else return;
    e.preventDefault();
    setIndex(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <LazyMotion features={loadMotionFeatures} strict>
    <section id="services" aria-labelledby="services-title" className="relative bg-ink py-20 sm:py-28 lg:py-40">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-8">
        <div className="grid gap-10 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <Reveal as="p" className="eyebrow mb-6 flex items-center gap-3">
              <Star className="h-3 w-3" /> The menu
            </Reveal>
            <Reveal
              as="h2"
              id="services-title"
              variant="split-lines"
              className="font-display text-headline font-light leading-[0.95] tracking-[-0.02em]"
            >
              Services <span className="italic text-gold">&amp;</span> prices
            </Reveal>
          </div>
          <Reveal as="p" className="max-w-sm text-mist md:col-span-5 md:justify-self-end">
            Every service, priced honestly. Where a price depends on your hair, we&rsquo;ll quote it in a quick, free
            consultation.
          </Reveal>
        </div>

        {/* Tabs */}
        <div
          role="tablist"
          aria-label="Service categories"
          onKeyDown={onTabKey}
          className="no-scrollbar relative -mx-4 mt-12 flex snap-x gap-1.5 overflow-x-auto overscroll-x-contain scroll-px-4 px-4 [mask-image:linear-gradient(90deg,transparent,#000_16px,#000_calc(100%-40px),transparent)] sm:-mx-8 sm:mt-16 sm:scroll-px-8 sm:px-8 lg:mx-0 lg:flex-wrap lg:overflow-visible lg:px-0 lg:[mask-image:none]"
        >
          {serviceCategories.map((c, i) => {
            const selected = i === index;
            return (
              <button
                key={c.id}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                role="tab"
                id={`tab-${c.id}`}
                aria-selected={selected}
                aria-controls={`panel-${c.id}`}
                tabIndex={selected ? 0 : -1}
                onClick={() => setIndex(i)}
                className={`relative shrink-0 snap-start rounded-full px-5 py-3 text-[0.75rem] font-semibold uppercase tracking-[0.18em] transition-colors duration-300 ${
                  selected ? "text-midnight" : "text-mist hover:text-pearl"
                }`}
              >
                {selected && (
                  <m.span
                    layoutId="tab-pill"
                    className="absolute inset-0 rounded-full bg-gold"
                    transition={{ type: "spring", stiffness: 380, damping: 34 }}
                  />
                )}
                <span className="relative">{c.label}</span>
              </button>
            );
          })}
        </div>

        {/* Panel */}
        <div ref={listArea} className="mt-8 min-h-[22rem] sm:mt-10" onPointerLeave={() => setHovered(null)}>
          <AnimatePresence mode="wait" initial={false}>
            <m.div
              key={category.id}
              role="tabpanel"
              id={`panel-${category.id}`}
              aria-labelledby={`tab-${category.id}`}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.6, ease } }}
              exit={{ opacity: 0, y: -12, transition: { duration: 0.25 } }}
            >
              <p className="mb-4 font-display text-lg italic leading-snug text-gold-soft sm:mb-6 sm:text-xl md:text-2xl">{category.intro}</p>
              <ul>
                {category.services.map((s, i) => (
                  <m.li
                    key={s.name}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0, transition: { delay: 0.05 * i, duration: 0.6, ease } }}
                    onPointerEnter={() => fine && setHovered(s.image)}
                    className="group flex items-center gap-4 border-b border-line py-4 sm:py-5 md:py-6"
                  >
                    {/* Touch devices: inline thumbnail replaces the cursor-following preview */}
                    <span className="relative h-14 w-11 shrink-0 overflow-hidden rounded-[2px] [@media(hover:hover)_and_(pointer:fine)]:hidden">
                      <Image src={serviceImages[s.image].src} alt="" fill sizes="44px" className="object-cover" />
                    </span>
                    {/* Phones: name above price. sm+: luxury-menu row with dotted leader */}
                    <span className="flex min-w-0 flex-1 flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
                    <span className="font-display text-[1.45rem] leading-tight text-pearl transition-[color,transform] duration-500 ease-[var(--ease-starlight)] group-hover:translate-x-2 group-hover:text-gold sm:text-[1.75rem] md:text-4xl">
                      {s.name}
                    </span>
                    <span aria-hidden className="mb-2 hidden min-w-8 flex-1 self-end border-b border-dotted border-gold/40 sm:block" />
                    <span
                      className={`shrink-0 sm:text-right ${
                        s.price === null
                          ? "text-[0.66rem] uppercase leading-snug tracking-[0.18em] text-mist"
                          : "font-display text-xl leading-none text-gold sm:text-2xl md:text-3xl"
                      }`}
                    >
                      {formatPrice(s)}
                    </span>
                    </span>
                  </m.li>
                ))}
              </ul>
            </m.div>
          </AnimatePresence>
        </div>

        <div className="mt-14 flex flex-wrap items-center gap-x-10 gap-y-5">
          <TransitionLink
            href="/services"
            className="group inline-flex items-center gap-3 text-[0.8rem] font-semibold uppercase tracking-[0.18em] text-gold"
          >
            Full printable price list <Arrow />
          </TransitionLink>
          <a href={business.phone.href} className="text-sm text-mist underline-offset-4 hover:text-pearl hover:underline">
            Questions? Call {business.phone.display}
          </a>
        </div>
      </div>

      {fine && <HoverPreview active={hovered} container={listArea} />}
    </section>
    </LazyMotion>
  );
}
