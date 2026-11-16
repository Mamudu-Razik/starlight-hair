"use client";

import Link from "next/link";
import type { ComponentPropsWithoutRef, MouseEvent } from "react";
import { usePageTransition } from "@/components/layout/PageTransition";
import { scrollToTarget, useLenis } from "@/components/layout/SmoothScroll";

type Props = ComponentPropsWithoutRef<typeof Link> & { href: string; onNavigate?: () => void };

/**
 * Internal link that:
 *  - smooth-scrolls (via Lenis) for in-page hashes,
 *  - plays the gold curtain for route changes,
 *  - falls back to normal behaviour for modified clicks / new tabs.
 */
export function TransitionLink({ href, onClick, onNavigate, ...rest }: Props) {
  const navigate = usePageTransition();
  const lenis = useLenis();

  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    if (rest.target === "_blank") return;

    const url = new URL(href, window.location.href);
    if (url.origin !== window.location.origin) return;

    e.preventDefault();
    onNavigate?.();

    if (url.pathname === window.location.pathname) {
      const toTop = !url.hash || url.hash === "#top";
      history.replaceState(null, "", toTop ? url.pathname : url.hash);
      // Wait two frames so any scroll lock (e.g. the menu) has been released first.
      requestAnimationFrame(() =>
        requestAnimationFrame(() => scrollToTarget(lenis, toTop ? 0 : url.hash)),
      );
      return;
    }
    navigate ? navigate(url.pathname + url.hash) : (window.location.href = href);
  };

  return <Link href={href} onClick={handle} scroll={false} {...rest} />;
}
