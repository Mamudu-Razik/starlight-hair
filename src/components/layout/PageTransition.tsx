"use client";

import { createContext, useCallback, useContext, useEffect, useRef, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import { scrollToTarget, useLenis } from "./SmoothScroll";

type Navigate = (href: string) => void;
const TransitionContext = createContext<Navigate | null>(null);
export const usePageTransition = () => useContext(TransitionContext);

/**
 * Gold curtain wipe between routes:
 * cover (rises from the bottom) → router.push → reveal (continues up and away).
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const lenis = useLenis();
  const curtain = useRef<HTMLDivElement>(null);
  const pending = useRef(false);

  const navigate = useCallback<Navigate>(
    (href) => {
      const el = curtain.current;
      if (!el || prefersReducedMotion()) {
        router.push(href);
        return;
      }
      pending.current = true;
      lenis?.stop();
      gsap
        .timeline()
        .set(el, { yPercent: 100, autoAlpha: 1 })
        .to(el, { yPercent: 0, duration: 0.65, ease: "curtain" })
        .add(() => router.push(href));
    },
    [router, lenis],
  );

  useEffect(() => {
    if (!pending.current) return;
    pending.current = false;
    const el = curtain.current;
    const hash = window.location.hash;

    if (lenis) {
      lenis.start();
      lenis.scrollTo(hash || 0, { immediate: true, force: true });
    } else if (hash) {
      scrollToTarget(null, hash);
    } else {
      window.scrollTo(0, 0);
    }
    ScrollTrigger.refresh();

    gsap.to(el, {
      yPercent: -100,
      duration: 0.8,
      delay: 0.15,
      ease: "curtain",
      onComplete: () => void gsap.set(el, { autoAlpha: 0 }),
    });
  }, [pathname, lenis]);

  return (
    <TransitionContext.Provider value={navigate}>
      {children}
      <div
        ref={curtain}
        aria-hidden
        className="no-print pointer-events-none invisible fixed inset-0 z-[90] flex items-center justify-center bg-gold"
      >
        <svg viewBox="0 0 24 24" className="h-8 w-8 text-midnight" aria-hidden>
          <path fill="currentColor" d="M12 0c.6 6.6 5.4 11.4 12 12-6.6.6-11.4 5.4-12 12-.6-6.6-5.4-11.4-12-12C6.6 11.4 11.4 6.6 12 0Z" />
        </svg>
      </div>
    </TransitionContext.Provider>
  );
}
