import type { Metadata } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Geist, Geist_Mono, Fraunces } from "next/font/google";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";
import EventTransitionLayer from "@/components/EventTransitionLayer";
import { SITE_URL } from "@/lib/siteUrl";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Fraunces is a variable font with a wide weight range (100–900) and an
// optical-size axis (9–144). We use a single weight for the display title and
// drive `font-variation-settings` for opsz so big sizes render with the more
// dramatic display cuts.
const fraunces = Fraunces({
  variable: "--font-fraunces",
  weight: ["400", "700", "900"],
  subsets: ["latin"],
});

// Search-snippet copy. Location keywords (Vancouver, BC) do the local-SEO
// work; discoverability by the Instagram handle is handled by the Person
// JSON-LD below (alternateName + sameAs), so the handle no longer needs to
// occupy snippet characters.
const HOME_TITLE =
  "Shoobydoo | Concert and Live Music Photographer in Vancouver, BC";
const DESCRIPTION =
  "Concert and live music photography by Shoobydoo, based in Vancouver, BC. Shooting festivals, club shows, and everything in between.";

// The share card itself is `opengraph-image.jpg` in this folder — Next's file
// convention emits og:image (plus type/width/height) from it automatically, and
// covers every route below `/`. Don't also set `openGraph.images` here or the
// tags get emitted twice. `twitter.card` is what upgrades X to the wide layout;
// X falls back to og:image, so no separate twitter-image file is needed.
//
// Titles: the template suffixes "| Shoobydoo" onto any future child page that
// sets a plain string title. The existing inner pages (about, contact, events)
// each carry the brand in a specific phrasing, so they set title.absolute and
// bypass the template. alternates.canonical here covers the homepage; every
// inner page declares its own.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: HOME_TITLE,
    template: "%s | Shoobydoo",
  },
  description: DESCRIPTION,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: HOME_TITLE,
    description: DESCRIPTION,
    siteName: "Shoobydoo",
    type: "website",
    locale: "en_US",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: HOME_TITLE,
    description: DESCRIPTION,
  },
};

// Structured data: tells Google that shoobydoo.ca and the Instagram account are
// the same person, so a search for the handle surfaces this site. Rendered as a
// plain <script> in the root layout — it applies to every page. The payload is
// all constants (no user input), so JSON.stringify is safe here.
const PERSON_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Shoobydoo",
  alternateName: "shoobydoofruitsnacks",
  url: SITE_URL,
  jobTitle: "Concert Photographer",
  areaServed: "Vancouver, BC",
  email: "mailto:shoobydoofruitsnacks@gmail.com",
  sameAs: ["https://instagram.com/shoobydoofruitsnacks"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#0e0f12] text-[#ededeb] overflow-x-hidden overscroll-none">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(PERSON_JSON_LD) }}
        />
        {children}
        <Footer />
        <EventTransitionLayer />
        <CustomCursor />
      </body>
      {/* Google Analytics 4 via Next's first-party wrapper: same gtag.js +
          config as the stock snippet, but loaded after hydration and tracking
          client-side route changes an inline snippet would miss. */}
      <GoogleAnalytics gaId="G-4MYFP30NJ1" />
    </html>
  );
}
