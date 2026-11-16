/**
 * Core business facts for Starlight Hair & Beauty.
 * Everything here is sourced from the salon's existing public listing —
 * do not add claims that can't be verified with the owner.
 */

export type DayIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = Sunday (matches Date#getDay)

export interface OpeningHours {
  day: DayIndex;
  label: string;
  /** 24h "HH:MM" in Europe/London time */
  open: string;
  close: string;
}

export const business = {
  name: "Starlight Hair & Beauty",
  shortName: "Starlight",
  tagline: "Wood Green's one-stop shop for hair and beauty",
  footerTagline: "Hair & Beauty — Wood Green, London",
  address: {
    street: "65 Westbury Ave",
    city: "London",
    postcode: "N22 6SA",
    area: "Wood Green",
    note: "A few hundred metres from Turnpike Lane station",
  },
  phone: {
    display: "020 3302 8787",
    href: "tel:+442033028787",
  },
  email: "mystarlighthair@gmail.com",
  socials: {
    instagram: "https://instagram.com/mystarlighthair",
    facebook: "https://facebook.com/mystarlighthair",
  },
  maps: {
    embed:
      "https://www.google.com/maps?q=65+Westbury+Ave,+London+N22+6SA&z=16&output=embed",
    directions:
      "https://www.google.com/maps/dir/?api=1&destination=65+Westbury+Ave,+London+N22+6SA",
  },
  timeZone: "Europe/London",
} as const;

export const openingHours: OpeningHours[] = [
  { day: 1, label: "Monday", open: "10:00", close: "19:00" },
  { day: 2, label: "Tuesday", open: "10:00", close: "19:00" },
  { day: 3, label: "Wednesday", open: "10:00", close: "19:00" },
  { day: 4, label: "Thursday", open: "10:00", close: "19:00" },
  { day: 5, label: "Friday", open: "10:00", close: "19:00" },
  { day: 6, label: "Saturday", open: "10:00", close: "19:00" },
  { day: 0, label: "Sunday", open: "11:00", close: "17:00" },
];

export const about = {
  eyebrow: "The salon",
  heading: "A little constellation of care on Westbury Avenue.",
  body: "Starlight is a full-service hair and beauty salon specialising in women's hair — cuts for every budget, glossy blow dries and colour that catches the light, from balayage and ombré to multi-tonal highlights. Deep conditioning treatments and elegant updos sit alongside beauty: hair removal, nails, facials and massage. Everything, under one roof.",
};
