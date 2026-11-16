import { business } from "@/content/business";
import { Reveal } from "@/components/ui/Reveal";
import { Star } from "@/components/ui/Star";
import { HoursTable } from "@/components/ui/HoursTable";
import { HoursBadge } from "@/components/ui/HoursBadge";
import { Magnetic } from "@/components/ui/Magnetic";
import { ButtonLink, Arrow } from "@/components/ui/Button";

const actions = [
  { label: "Call", href: business.phone.href, variant: "gold" as const },
  { label: "Email", href: `mailto:${business.email}`, variant: "outline" as const },
  { label: "Directions", href: business.maps.directions, variant: "outline" as const, external: true },
  { label: "Instagram", href: business.socials.instagram, variant: "outline" as const, external: true },
];

export function Visit() {
  return (
    <section id="visit" aria-labelledby="visit-title" className="mx-auto max-w-[1600px] px-4 py-20 sm:px-8 sm:py-28 lg:py-40">
      <div className="grid gap-16 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-7">
          <Reveal as="p" className="eyebrow mb-8 flex items-center gap-3">
            <Star className="h-3 w-3" /> Visit us
          </Reveal>
          <Reveal as="h2" id="visit-title" variant="split-lines" className="font-display text-display font-light leading-[0.9] tracking-[-0.03em]">
            <span className="block">{business.address.street}</span>
            <span className="block italic text-gold">
              {business.address.city} {business.address.postcode}
            </span>
          </Reveal>
          <Reveal as="p" className="mt-6 max-w-md text-base text-mist sm:mt-8 sm:text-lg">
            {business.address.area}. {business.address.note} — on the Piccadilly line.
          </Reveal>

          <Reveal staggerChildren className="mt-10 grid grid-cols-2 gap-3 sm:mt-12 sm:flex sm:flex-wrap">
            {actions.map((a) => (
              <Magnetic key={a.label} strength={0.25} className="w-full sm:w-auto">
                <ButtonLink
                  href={a.href}
                  variant={a.variant}
                  className="w-full px-4! sm:w-auto sm:px-7!"
                  icon={a.variant === "gold" ? <Arrow /> : undefined}
                  {...(a.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                >
                  {a.label}
                  {a.external && <span className="sr-only"> (opens in a new tab)</span>}
                </ButtonLink>
              </Magnetic>
            ))}
          </Reveal>

          <dl className="mt-12 grid gap-8 text-sm sm:mt-14 sm:grid-cols-2">
            <div>
              <dt className="eyebrow mb-2">Phone</dt>
              <dd>
                <a href={business.phone.href} className="inline-block py-1 font-display text-3xl text-pearl hover:text-gold">
                  {business.phone.display}
                </a>
              </dd>
            </div>
            <div>
              <dt className="eyebrow mb-2">Email</dt>
              <dd>
                <a href={`mailto:${business.email}`} className="inline-block break-all py-1 font-display text-[1.4rem] text-pearl hover:text-gold sm:text-2xl">
                  {business.email}
                </a>
              </dd>
            </div>
          </dl>
        </div>

        <div className="space-y-10 lg:col-span-5">
          <Reveal variant="clip" className="relative aspect-[4/3] overflow-hidden rounded-[4px] border border-line bg-ink">
            <iframe
              title={`Map showing ${business.name}, ${business.address.street}, ${business.address.postcode}`}
              src={business.maps.embed}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 h-full w-full [filter:grayscale(1)_invert(0.92)_contrast(0.9)_brightness(0.95)_sepia(0.15)]"
            />
            <span aria-hidden className="pointer-events-none absolute inset-0 bg-gold/5 mix-blend-color" />
          </Reveal>
          <div>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h3 className="eyebrow">Opening hours</h3>
              <HoursBadge className="!py-1.5 !text-[0.62rem]" />
            </div>
            <HoursTable />
          </div>
        </div>
      </div>
    </section>
  );
}
