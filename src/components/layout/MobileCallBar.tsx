import { business } from "@/content/business";

/** Fixed "Call now" bar on small screens. */
export function MobileCallBar() {
  return (
    <div className="no-print fixed inset-x-0 bottom-0 z-[60] px-4 pb-[max(env(safe-area-inset-bottom),12px)] md:hidden">
      <a
        href={business.phone.href}
        className="flex w-full items-center justify-center gap-3 rounded-full bg-gold py-4 text-[0.8rem] font-bold uppercase tracking-[0.2em] text-midnight shadow-[0_12px_40px_-8px_rgb(0_0_0/.7)]"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
          <path
            fill="currentColor"
            d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1L6.6 10.8Z"
          />
        </svg>
        Call now · {business.phone.display}
      </a>
    </div>
  );
}
