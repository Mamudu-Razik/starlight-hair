"use client";

import { useEffect, useState } from "react";
import { getOpenStatus, type OpenStatus } from "@/lib/hours";

/** Live "Open today until 7pm" pill, computed in Europe/London time on the client (refreshes every minute). */
export function HoursBadge({ className = "" }: { className?: string }) {
  const [status, setStatus] = useState<OpenStatus | null>(null);

  useEffect(() => {
    const update = () => setStatus(getOpenStatus());
    update();
    const id = window.setInterval(update, 60_000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <p
      className={`inline-flex items-center gap-2.5 rounded-full border border-pearl/15 bg-midnight/70 px-4 py-2 text-[0.72rem] font-medium uppercase tracking-[0.2em] text-pearl sm:bg-midnight/40 sm:backdrop-blur-md ${className}`}
      aria-live="polite"
    >
      <span className="relative flex h-2 w-2" aria-hidden>
        {status?.isOpen && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300/70" />}
        <span className={`relative inline-flex h-2 w-2 rounded-full ${status?.isOpen ? "bg-emerald-300" : "bg-rose"}`} />
      </span>
      {/* Static fallback for SSR / no-JS, swapped for the live status after hydration */}
      <span>{status ? status.label : "Open 7 days a week"}</span>
    </p>
  );
}
