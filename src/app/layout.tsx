import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { business, openingHours } from "@/content/business";
import { PRELOADER_KEY } from "@/lib/constants";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { PageTransition } from "@/components/layout/PageTransition";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Cursor } from "@/components/layout/Cursor";
import { Preloader } from "@/components/layout/Preloader";
import { MobileCallBar } from "@/components/layout/MobileCallBar";

// Self-hosted via next/font/local (latin subsets, SIL OFL) — no font CDN at build or run time.
const display = localFont({
  src: [
    { path: "../fonts/cormorant-300.woff2", weight: "300", style: "normal" },
    { path: "../fonts/cormorant-300-italic.woff2", weight: "300", style: "italic" },
    { path: "../fonts/cormorant-400.woff2", weight: "400", style: "normal" },
    { path: "../fonts/cormorant-400-italic.woff2", weight: "400", style: "italic" },
  ],
  variable: "--font-cormorant",
  display: "swap",
  fallback: ["Georgia", "Times New Roman", "serif"],
});
const sans = localFont({
  src: [{ path: "../fonts/manrope-variable.woff2", weight: "200 800", style: "normal" }],
  variable: "--font-manrope",
  display: "swap",
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://starlight-hair.example"),
  title: {
    default: `${business.name} — Wood Green, London`,
    template: `%s · ${business.name}`,
  },
  description: `${business.tagline}. Cuts, blow dries, balayage, ombré, shellac nails, threading, facials and massage at ${business.address.street}, ${business.address.postcode}. Open 7 days.`,
  openGraph: {
    title: business.name,
    description: business.tagline,
    images: ["/images/hero.jpg"],
    locale: "en_GB",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0B0B14",
  colorScheme: "dark",
};

const DAY_SCHEMA = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "HairSalon",
  name: business.name,
  telephone: "+442033028787",
  email: business.email,
  image: "/images/hero.jpg",
  address: {
    "@type": "PostalAddress",
    streetAddress: business.address.street,
    addressLocality: business.address.city,
    postalCode: business.address.postcode,
    addressCountry: "GB",
  },
  openingHoursSpecification: openingHours.map((h) => ({
    "@type": "OpeningHoursSpecification",
    dayOfWeek: DAY_SCHEMA[h.day],
    opens: h.open,
    closes: h.close,
  })),
  sameAs: [business.socials.instagram, business.socials.facebook],
};

// Runs before first paint: enables JS-only styles and skips the preloader for returning visitors.
const bootScript = `(function(){var d=document.documentElement;d.classList.add('js');try{if(sessionStorage.getItem('${PRELOADER_KEY}')==='1')d.setAttribute('data-preloaded','');}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={`${display.variable} ${sans.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
        <noscript>
          <style>{`.preloader{display:none!important}[data-intro]{visibility:visible!important}`}</style>
        </noscript>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body className="min-h-screen">
        <SmoothScroll>
          <PageTransition>
            <Preloader />
            <Header />
            <main id="main">{children}</main>
            <Footer />
            <MobileCallBar />
            <Cursor />
            <div className="grain" aria-hidden />
          </PageTransition>
        </SmoothScroll>
      </body>
    </html>
  );
}
