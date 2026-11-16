"use client";

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="no-print inline-flex items-center gap-3 rounded-full border border-gold/50 px-6 py-3 text-[0.75rem] font-semibold uppercase tracking-[0.18em] text-pearl transition-colors hover:border-gold hover:text-gold"
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
        <path d="M6 9V3h12v6M6 18H4v-7h16v7h-2M7 14h10v7H7z" />
      </svg>
      Print price list
    </button>
  );
}
