export interface Testimonial {
  quote: string;
  name: string;
  service: string;
  /** true while this is sample copy — the UI labels placeholders so they are never presented as real */
  placeholder: boolean;
}

// TODO: replace with real Google reviews (with the reviewer's permission) and set placeholder: false
export const testimonials: Testimonial[] = [
  {
    quote:
      "Placeholder review — this space is reserved for a real client's words about their colour appointment.",
    name: "Client name",
    service: "Balayage",
    placeholder: true,
  },
  {
    quote:
      "Placeholder review — a genuine Google review about a blow-dry or cut will go here once approved by the salon.",
    name: "Client name",
    service: "Wash, cut & blow dry",
    placeholder: true,
  },
  {
    quote:
      "Placeholder review — swap in a real review about nails, threading or another beauty treatment.",
    name: "Client name",
    service: "Shellac",
    placeholder: true,
  },
];
