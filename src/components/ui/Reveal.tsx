"use client";

import { useRef, type ElementType, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { useReveal, type RevealOptions } from "@/hooks/useReveal";

type RevealProps<T extends ElementType> = Omit<RevealOptions, "children"> & {
  as?: T;
  /** Stagger the element's direct children instead of revealing it as one block (fade-up). */
  staggerChildren?: boolean;
  children?: ReactNode;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "children">;

/**
 * Declarative wrapper around `useReveal`.
 *   <Reveal variant="split-lines" as="h2">Big serif headline</Reveal>
 *   <Reveal variant="clip"><Image … /></Reveal>
 */
export function Reveal<T extends ElementType = "div">({
  as,
  variant,
  delay,
  duration,
  stagger,
  start,
  staggerChildren = false,
  children,
  ...rest
}: RevealProps<T>) {
  const Tag = (as ?? "div") as ElementType;
  const ref = useRef<HTMLElement>(null);
  useReveal(ref, { variant, delay, duration, stagger, start, children: staggerChildren });
  return (
    <Tag ref={ref} {...rest}>
      {children}
    </Tag>
  );
}
