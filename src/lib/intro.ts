"use client";

/**
 * Tiny signal so the hero waits for the preloader curtain before playing its entrance.
 * The preloader calls `markIntroDone()`; the hero calls `onIntroDone(cb)`.
 */
type Cb = () => void;
let done = false;
const listeners = new Set<Cb>();

export { PRELOADER_KEY } from "./constants";

export function markIntroDone() {
  if (done) return;
  done = true;
  listeners.forEach((cb) => cb());
  listeners.clear();
}

export function onIntroDone(cb: Cb): () => void {
  if (done) {
    cb();
    return () => {};
  }
  listeners.add(cb);
  return () => listeners.delete(cb);
}
