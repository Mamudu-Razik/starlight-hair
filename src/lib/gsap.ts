"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { CustomEase } from "gsap/CustomEase";

let registered = false;

if (typeof window !== "undefined" && !registered) {
  gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase);
  // House curves: a soft, editorial deceleration and a sharper "curtain" ease.
  CustomEase.create("starlight", "0.16, 1, 0.3, 1");
  CustomEase.create("curtain", "0.76, 0, 0.24, 1");
  gsap.defaults({ ease: "power4.out", duration: 1.1 });
  // Mobile browsers resize the viewport when the address bar collapses; don't re-measure
  // (and jump) on those resizes — only on real ones.
  ScrollTrigger.config({ ignoreMobileResize: true });
  registered = true;
}

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const isFinePointer = () =>
  typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches;

export { gsap, ScrollTrigger, SplitText };
