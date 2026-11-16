"use client";

import { AnimatePresence, LazyMotion } from "framer-motion";
import { loadMotionFeatures } from "@/lib/motion";
import { MenuOverlay } from "./MenuOverlay";

/** Loaded lazily by the header on first open, so the menu's motion code isn't in the initial bundle. */
export default function Menu({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <LazyMotion features={loadMotionFeatures} strict>
      <AnimatePresence>{open && <MenuOverlay onClose={onClose} />}</AnimatePresence>
    </LazyMotion>
  );
}
