# Starlight Hair & Beauty — redesign concept

A speculative redesign of the website for **Starlight Hair & Beauty**, 65 Westbury Ave, Wood Green, London N22 6SA. The concept is "night sky meets luxury editorial salon": midnight backgrounds, champagne-gold hairlines, a twinkling star field and big serif type.

> This is an unsolicited pitch concept, not the salon's official site. Photography is placeholder stock from Unsplash, and the testimonials are clearly labelled placeholders.

## Stack

- **Next.js 15** (App Router), **TypeScript**, **Tailwind CSS v4**
- **GSAP** + ScrollTrigger + SplitText + CustomEase for all scroll and text animation
- **Lenis** smooth scrolling, driven by GSAP's ticker and synced with ScrollTrigger
- **Framer Motion** only for small UI state (menu overlay, service tabs). It's loaded through `LazyMotion` so it stays out of the critical bundle
- **next/font/local** with vendored woff2 files, so there are no font CDN requests at build or run time
- **next/image** for every image
- No CMS and no backend. All content lives in typed files under `src/content`

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

## Editing content

| What | Where |
| --- | --- |
| Name, address, phone, email, socials, map links, opening hours, about copy | `src/content/business.ts` |
| **Services and prices.** Set `price: null` to show "Price on consultation" | `src/content/services.ts` |
| Testimonials. **Placeholders: replace with real Google reviews** | `src/content/testimonials.ts` |
| Nav links, marquee words, gallery looks, "Why Starlight" cards | `src/content/site.ts` |

The "Open today until 7pm" badge and the highlighted row in the hours table are computed live in **Europe/London** time from `openingHours` (`src/lib/hours.ts`). They stay correct whatever timezone the visitor is in.

## Structure

```
src/
  app/
    layout.tsx            fonts, metadata, JSON-LD (HairSalon), global chrome
    page.tsx              home: Hero → Marquee → About → Services → Gallery → Why → Testimonials → Visit
    services/page.tsx     printable full price list (/services)
    globals.css           Tailwind v4 theme tokens, grain, print + reduced-motion rules
  components/
    layout/               Header, MenuOverlay, Footer, Preloader, Cursor, SmoothScroll (Lenis), PageTransition, MobileCallBar
    sections/             one file per home-page section
    ui/                   Reveal, StarField (canvas), Magnetic, Counter, HoursBadge, HoursTable, TransitionLink, Button, Star
  content/                all copy, prices and hours (typed)
  hooks/                  useReveal, useMedia (reduced motion / fine pointer), useIsoLayoutEffect
  lib/                    gsap registration + custom eases, hours logic, intro signal
```

### Animation system

- `useReveal(ref, { variant })` and `<Reveal variant="…">` handle every scroll reveal. The variants are `fade-up`, `clip`, `split-lines`, `split-chars` and `words-scrub`. Each runs inside a `gsap.context` and is reverted on unmount.
- Only `transform` and `opacity` are animated. The exceptions are clip-path reveals, which the brief asks for.
- Custom eases: `starlight` (0.16, 1, 0.3, 1) and `curtain` (0.76, 0, 0.24, 1), plus `power4.out` and `expo.out`. Only the marquee is linear.
- **Preloader** runs once per session (sessionStorage) and lasts about 1.5s. An inline head script hides it before first paint for returning visitors.
- **Page transitions** use a gold curtain wipe between routes (`PageTransition` + `TransitionLink`). In-page anchors scroll smoothly through Lenis.
- **Custom cursor and magnetic buttons** only run on devices with a fine pointer.

### Accessibility

- With `prefers-reduced-motion`, Lenis, the particles, the cursor, parallax, pinning and the preloader are all disabled, and content shows instantly.
- The page has semantic landmarks, a skip link, visible focus rings, keyboard-operable tabs (arrow keys, Home and End), and a menu dialog with a focus trap that closes on Escape.
- SplitText runs with `aria: "none"`. The hero headline has a screen-reader-only copy, so it is never read letter by letter.
- The scroll-scrubbed About text never drops below WCAG AA contrast (minimum opacity 0.5).

### Mobile

- The horizontal gallery becomes a native swipe carousel with scroll-snap.
- Service hover previews become inline thumbnails.
- The particle count drops from about 160 to 35.
- A "Call now" bar stays fixed at the bottom of the screen.

## Performance

Mobile Lighthouse 12 run against a local production build (`next start`), simulated throttling, three runs:

| Performance | Accessibility | Best practices | SEO |
| --- | --- | --- | --- |
| 90 | 100 | 100 | 100 |

TBT was 30 ms and CLS 0. The observed LCP was about 90 ms (the hero paragraph). Lighthouse's simulated LCP comes out at about 3.6 s because its model charges the initial JS download to the LCP path. Scores on a real host will vary with network and CDN.

What keeps it fast:
- The hero copy paints with the first frame.
- The star canvas starts only after the intro, on idle, and pauses when off-screen.
- The menu loads on demand.
- Framer Motion features are loaded lazily.
- Only the font weights actually used are shipped.

## Images

All images are stored locally in `public/images/`. They are free-to-use placeholder photos from [Unsplash](https://unsplash.com/license) and should be **replaced with the salon's own photography** before launch. To re-download or swap them, edit the ids in `scripts/fetch-images.mjs` and run `npm run fetch-images -- --force`.

| File | Used for | Unsplash photo id |
| --- | --- | --- |
| `hero.jpg` | Hero portrait, social share image | `photo-1519699047748-de8e457a634e` |
| `salon.jpg` | About section | `photo-1560066984-138dadb4c035` |
| `haircut.jpg` | Hair services preview | `photo-1562322140-8baeececf3df` |
| `blow-dry.jpg` | Blow-dry look, hair services preview | `photo-1580618672591-eb180b1a973f` |
| `balayage.jpg` | Balayage look, colour preview | `photo-1522337360788-8b13dee7a37e` |
| `colour.jpg` | Colour look, colour preview | `photo-1492106087820-71f1a00d2b11` |
| `treatment.jpg` | Treatments preview | `photo-1634449571010-02389ed0f9b0` |
| `nails.jpg` | Nails look, nails preview | `photo-1604654894610-df63bc536371` |
| `facial.jpg` | Beauty preview | `photo-1570172619644-dfd03ed5d881` |
| `makeup.jpg` | Makeup look, beauty preview | `photo-1487412947147-5cebf100ffc2` |
| `beauty-room.jpg` | Waxing preview | `photo-1633681926022-84c23e8cb2d6` |
| `massage.jpg` | Massage preview | `photo-1544161515-4ab6ce6db874` |
| `bridal.jpg` | Bridal look | `photo-1525258946800-98cfd641d0de` |
| `curls.jpg` | Natural curls look | `photo-1589156280159-27698a70f29e` |

Note: the brief mentioned a braids look, but no suitable placeholder photo was found, so the gallery uses a natural-curls look instead. Swap in a real braids photo from the salon if they offer that service.

## Fonts

Cormorant Garamond (display) and Manrope (body). Both are licensed under the SIL Open Font License 1.1 and are vendored as latin-subset woff2 files in `src/fonts/`.

## Before launch: to-do

- [ ] Replace placeholder testimonials with real Google reviews (with permission)
- [ ] Replace Unsplash photos with the salon's own work
- [ ] Confirm the prices marked "Price on consultation" with the owner
- [ ] Set the real domain in `metadataBase` (`src/app/layout.tsx`)
- [ ] Decide on online booking. "Book" currently dials the salon
