import type { Metadata } from "next";
import { serviceCategories, formatPrice } from "@/content/services";
import { business } from "@/content/business";
import { formatTime } from "@/lib/hours";
import { openingHours } from "@/content/business";
import { Reveal } from "@/components/ui/Reveal";
import { Star } from "@/components/ui/Star";
import { PrintButton } from "./PrintButton";

export const metadata: Metadata = {
  title: "Price list",
  description: `Full hair and beauty price list for ${business.name}, ${business.address.street}, Wood Green.`,
};

export default function ServicesPage() {
  const weekday = openingHours.find((h) => h.day === 1)!;
  const sunday = openingHours.find((h) => h.day === 0)!;

  return (
    <article className="mx-auto max-w-5xl px-4 pb-24 pt-36 sm:px-8 md:pt-44 print:pt-0">
      <header className="mb-16 border-b border-line pb-12 print-plain">
        <p className="eyebrow mb-6 flex items-center gap-3 print-plain">
          <Star className="h-3 w-3" /> {business.name}
        </p>
        <Reveal as="h1" variant="split-lines" className="font-display text-display font-light leading-[0.9] tracking-[-0.03em] print-plain">
          Price <span className="italic text-gold print-plain">list</span>
        </Reveal>
        <div className="mt-8 flex flex-wrap items-end justify-between gap-6">
          <p className="max-w-md text-mist print-plain">
            Prices marked &ldquo;Price on consultation&rdquo; depend on hair length, thickness and the look you want —
            call us for a quick, free quote.
          </p>
          <PrintButton />
        </div>
      </header>

      <div className="grid gap-x-16 gap-y-14 md:grid-cols-2 print:grid-cols-2 print:gap-y-8">
        {serviceCategories.map((cat) => (
          <section key={cat.id} aria-labelledby={`pl-${cat.id}`} className="break-inside-avoid">
            <h2 id={`pl-${cat.id}`} className="font-display text-4xl text-gold print-plain">
              {cat.label}
            </h2>
            <p className="mt-1 text-sm italic text-mist print-plain">{cat.intro}</p>
            <ul className="mt-5">
              {cat.services.map((s) => (
                <li key={s.name} className="flex items-baseline gap-3 border-b border-line py-3 print-plain">
                  <span className="text-pearl print-plain">{s.name}</span>
                  <span aria-hidden className="flex-1 border-b border-dotted border-gold/40 print-plain" />
                  <span
                    className={`shrink-0 print-plain ${s.price === null ? "text-xs uppercase tracking-[0.12em] text-mist" : "font-display text-xl text-gold"}`}
                  >
                    {formatPrice(s)}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <footer className="mt-20 grid gap-6 border-t border-line pt-10 text-sm text-mist sm:grid-cols-3 print-plain">
        <p className="print-plain">
          <span className="eyebrow mb-2 block print-plain">Address</span>
          {business.address.street}, {business.address.city} {business.address.postcode}
        </p>
        <p className="print-plain">
          <span className="eyebrow mb-2 block print-plain">Book</span>
          <a href={business.phone.href} className="text-pearl hover:text-gold print-plain">
            {business.phone.display}
          </a>
          <br />
          {business.email}
        </p>
        <p className="print-plain">
          <span className="eyebrow mb-2 block print-plain">Hours</span>
          Mon–Sat {formatTime(weekday.open)}–{formatTime(weekday.close)}
          <br />
          Sun {formatTime(sunday.open)}–{formatTime(sunday.close)}
        </p>
      </footer>
    </article>
  );
}
