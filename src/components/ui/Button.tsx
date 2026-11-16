import type { ComponentPropsWithoutRef, ReactNode } from "react";

type Variant = "gold" | "outline" | "ghost";

const base =
  "group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-full px-7 py-4 text-[0.8rem] font-semibold uppercase tracking-[0.18em] transition-[color,box-shadow,background-color] duration-500 ease-[var(--ease-starlight)]";

const variants: Record<Variant, string> = {
  gold: "bg-gold text-midnight hover:shadow-[0_0_0_1px_rgb(216_182_122/.4),0_14px_50px_-12px_rgb(216_182_122/.7)]",
  outline: "border border-gold/50 text-pearl hover:border-gold hover:text-midnight",
  ghost: "text-pearl hover:text-gold",
};

/** Pill button rendered as an <a>. The gold fill sweeps up on hover (transform only). */
export function ButtonLink({
  variant = "gold",
  children,
  className = "",
  icon,
  ...rest
}: ComponentPropsWithoutRef<"a"> & { variant?: Variant; icon?: ReactNode }) {
  return (
    <a className={`${base} ${variants[variant]} ${className}`} {...rest}>
      {variant === "outline" && (
        <span
          aria-hidden
          className="absolute inset-0 translate-y-full rounded-full bg-gold transition-transform duration-500 ease-[var(--ease-starlight)] group-hover:translate-y-0"
        />
      )}
      <span className="relative z-10 flex items-center gap-3">
        {children}
        {icon}
      </span>
    </a>
  );
}

export function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={`h-4 w-4 transition-transform duration-500 group-hover:translate-x-1 ${className}`} aria-hidden>
      <path d="M4 12h15m-6-6 6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
