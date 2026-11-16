/**
 * Price list — the single source of truth for every service and price.
 * To update a price, change `price` (in GBP). `null` renders as "Price on consultation".
 */

export type ImageKey =
  | "blowdry"
  | "cut"
  | "balayage"
  | "colour"
  | "treatment"
  | "nails"
  | "beauty"
  | "makeup"
  | "waxing"
  | "massage";

export interface Service {
  name: string;
  price: number | null;
  /** Prefix "from" before the price */
  from?: boolean;
  image: ImageKey;
}

export interface ServiceCategory {
  id: string;
  label: string;
  intro: string;
  services: Service[];
}

export const PRICE_ON_CONSULTATION = "Price on consultation";

export const formatPrice = (s: Pick<Service, "price" | "from">) =>
  s.price === null ? PRICE_ON_CONSULTATION : `${s.from ? "from " : ""}£${s.price}`;

export const serviceImages: Record<ImageKey, { src: string; alt: string }> = {
  blowdry: { src: "/images/blow-dry.jpg", alt: "Stylist blow-drying a client's hair with a round brush" },
  cut: { src: "/images/haircut.jpg", alt: "Smiling stylist at work in a bright salon" },
  balayage: { src: "/images/balayage.jpg", alt: "Long wavy hair with soft, sun-kissed balayage" },
  colour: { src: "/images/colour.jpg", alt: "Long wavy hair in a multi-tonal lilac colour" },
  treatment: { src: "/images/treatment.jpg", alt: "Client having her hair washed at the basin" },
  nails: { src: "/images/nails.jpg", alt: "Manicured nails in glossy black and tortoiseshell" },
  beauty: { src: "/images/facial.jpg", alt: "Client relaxing as a face mask is applied" },
  makeup: { src: "/images/makeup.jpg", alt: "Close-up of a soft glam makeup look with winged liner" },
  waxing: { src: "/images/beauty-room.jpg", alt: "Dark, modern salon interior with marble floors" },
  massage: { src: "/images/massage.jpg", alt: "Massage oil being poured during a full body massage" },
};

export const serviceCategories: ServiceCategory[] = [
  {
    id: "hair",
    label: "Hair",
    intro: "Cuts for every budget and blow dries with real staying power.",
    services: [
      { name: "Wash, cut & blow dry", price: 24, image: "cut" },
      { name: "Dry cut", price: null, image: "cut" },
      { name: "Brazilian blow-dry", price: null, image: "blowdry" },
      { name: "Hairstyle", price: null, image: "blowdry" },
      { name: "Hair up", price: null, image: "blowdry" },
    ],
  },
  {
    id: "colour",
    label: "Colour",
    intro: "Balayage, ombré and multi-tonal highlights that catch the light.",
    services: [
      { name: "Half highlight", price: null, image: "balayage" },
      { name: "Full highlight", price: null, image: "balayage" },
      { name: "Root colour", price: null, image: "colour" },
      { name: "Full colour", price: null, image: "colour" },
      { name: "Balayage", price: null, image: "balayage" },
      { name: "Ombré", price: null, image: "colour" },
    ],
  },
  {
    id: "treatments",
    label: "Treatments",
    intro: "Smoothing, shaping and deep care for healthier hair.",
    services: [
      { name: "Permanent straightening", price: null, image: "treatment" },
      { name: "Perm", price: null, image: "treatment" },
      { name: "Deep conditioning", price: null, image: "treatment" },
    ],
  },
  {
    id: "nails",
    label: "Nails",
    intro: "Long-wear shellac and classic hand and foot care.",
    services: [
      { name: "Shellac", price: 18, image: "nails" },
      { name: "Manicure", price: null, image: "nails" },
      { name: "Pedicure", price: null, image: "nails" },
    ],
  },
  {
    id: "beauty",
    label: "Beauty",
    intro: "Threading, tints, facials and makeup for every occasion.",
    services: [
      { name: "Full face threading", price: 12, image: "beauty" },
      { name: "Eyebrow tint", price: null, image: "beauty" },
      { name: "Eyelash tint", price: null, image: "makeup" },
      { name: "Basic facial", price: null, image: "beauty" },
      { name: "Makeup", price: null, image: "makeup" },
    ],
  },
  {
    id: "waxing",
    label: "Waxing",
    intro: "Smooth, precise hair removal.",
    services: [
      { name: "Full arm wax", price: null, image: "waxing" },
      { name: "Full face waxing", price: null, image: "waxing" },
      { name: "Hollywood", price: null, image: "waxing" },
    ],
  },
  {
    id: "massage",
    label: "Massage",
    intro: "Time to switch off completely.",
    services: [{ name: "Full body massage", price: null, image: "massage" }],
  },
];

export const totalServices = serviceCategories.reduce((n, c) => n + c.services.length, 0);
