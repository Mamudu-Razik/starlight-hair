export interface NavLink {
  label: string;
  href: string;
  image: string;
}

export const navLinks: NavLink[] = [
  { label: "Home", href: "/#top", image: "/images/hero.jpg" },
  { label: "Salon", href: "/#about", image: "/images/salon.jpg" },
  { label: "Services", href: "/#services", image: "/images/balayage.jpg" },
  { label: "Looks", href: "/#looks", image: "/images/bridal.jpg" },
  { label: "Visit", href: "/#visit", image: "/images/blow-dry.jpg" },
  { label: "Price list", href: "/services", image: "/images/nails.jpg" },
];

export const marqueeItems = [
  "Balayage",
  "Brazilian Blow-dry",
  "Shellac",
  "Threading",
  "Bridal Hair",
];

export interface Look {
  title: string;
  caption: string;
  src: string;
  alt: string;
}

export const looks: Look[] = [
  { title: "Balayage", caption: "sun-kissed, hand-painted", src: "/images/balayage.jpg", alt: "Long wavy hair with soft, sun-kissed balayage" },
  { title: "Blow-dry", caption: "glossy movement", src: "/images/blow-dry.jpg", alt: "Stylist blow-drying a client's hair with a round brush" },
  { title: "Bridal", caption: "for the big day", src: "/images/bridal.jpg", alt: "Bride holding a bouquet of peach and white roses" },
  { title: "Curls", caption: "natural texture, defined", src: "/images/curls.jpg", alt: "Woman with natural curls at dusk above the city lights" },
  { title: "Colour", caption: "multi-tonal, made to shine", src: "/images/colour.jpg", alt: "Long wavy hair in a multi-tonal lilac colour" },
  { title: "Nails", caption: "shellac shine", src: "/images/nails.jpg", alt: "Manicured nails in glossy black and tortoiseshell" },
  { title: "Makeup", caption: "soft glam", src: "/images/makeup.jpg", alt: "Close-up of a soft glam makeup look with winged liner" },
];

export const features = [
  {
    title: "Every budget",
    body: "Cuts and colour priced for real life — a wash, cut & blow dry is just £24.",
  },
  {
    title: "Hair & beauty under one roof",
    body: "From balayage to brows, shellac to massage — one appointment, one place.",
  },
  {
    title: "Open 7 days",
    body: "Monday to Saturday 10am–7pm, and Sundays 11am–5pm.",
  },
  {
    title: "Late evenings",
    body: "Open until 7pm six days a week, so you can come after work.",
  },
];
