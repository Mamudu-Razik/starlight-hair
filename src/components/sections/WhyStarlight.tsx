"use client";

import type { PointerEvent } from "react";
import { features } from "@/content/site";
import { Reveal } from "@/components/ui/Reveal";
import { Star } from "@/components/ui/Star";

const icons = [
  // Every budget — coin
  <path key="a" d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm0 4v10m-3-7.5c0-1 1.3-1.5 3-1.5s3 .7 3 1.7c0 2.6-6 1.4-6 4 0 1 1.3 1.8 3 1.8s3-.6 3-1.6" />,
  // Under one roof
  <path key="b" d="M3 11 12 4l9 7M5 10v10h14V10M10 20v-5h4v5" />,
  // Open 7 days — calendar
  <path key="c" d="M4 6h16v14H4zM4 10h16M8 3v5m8-5v5" />,
  // Late evenings — moon
  <path key="d" d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5Z" />,
];

/** Spotlight card: a gold radial glow + border highlight that follows the cursor via CSS variables. */
function Card({ title, body, index }: { title: string; body: string; index: number }) {
  const onMove = (e: PointerEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };
  return (
    <article
      onPointerMove={onMove}
      className="group relative isolate overflow-hidden rounded-[4px] bg-ink p-6 sm:p-8 lg:p-10"
      style={{ ["--mx" as string]: "50%", ["--my" as string]: "0%" }}
    >
      {/* Border glow: a 1px ring masked to follow the cursor */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[4px] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          padding: 1,
          background: "radial-gradient(260px circle at var(--mx) var(--my), #D8B67A, transparent 70%)",
          WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />
      {/* Inner glow */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: "radial-gradient(420px circle at var(--mx) var(--my), rgb(216 182 122 / .10), transparent 60%)" }}
      />
      <span aria-hidden className="absolute inset-0 -z-20 rounded-[4px] border border-line" />

      <svg viewBox="0 0 24 24" className="h-9 w-9 text-gold" fill="none" stroke="currentColor" strokeWidth="1.1" aria-hidden>
        {icons[index % icons.length]}
      </svg>
      <h3 className="mt-8 font-display text-[1.75rem] leading-tight text-pearl sm:mt-14 sm:text-3xl xl:text-[2.4rem]">{title}</h3>
      <p className="mt-4 leading-relaxed text-mist">{body}</p>
      <span className="absolute right-6 top-6 text-xs sm:right-8 sm:top-8 font-semibold tracking-[0.25em] text-gold/70">0{index + 1}</span>
    </article>
  );
}

export function WhyStarlight() {
  return (
    <section aria-labelledby="why-title" className="mx-auto max-w-[1600px] px-4 py-20 sm:px-8 sm:py-28 lg:py-40">
      <div className="mb-10 max-w-3xl sm:mb-16">
        <Reveal as="p" className="eyebrow mb-6 flex items-center gap-3">
          <Star className="h-3 w-3" /> Why Starlight
        </Reveal>
        <Reveal as="h2" id="why-title" variant="split-lines" className="font-display text-headline font-light leading-[0.95] tracking-[-0.02em]">
          Everything you need, <span className="italic text-gold">a short walk</span> from Turnpike Lane
        </Reveal>
      </div>
      <Reveal staggerChildren className="grid gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
        {features.map((f, i) => (
          <Card key={f.title} title={f.title} body={f.body} index={i} />
        ))}
      </Reveal>
    </section>
  );
}
