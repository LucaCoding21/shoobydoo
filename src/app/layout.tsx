import type { Metadata } from "next";
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

// The description doubles as the search snippet, so it carries the Instagram
// handle — "shoobydoofruitsnacks" is a globally unique string, and having it in
// indexable metadata is what lets a search for the handle land here.
const DESCRIPTION =
  "Concert and live-music photography by Shoobydoo — @shoobydoofruitsnacks on Instagram. From the harbour's main stages, the festival fields, and the small rooms in between.";

// The share card itself is `opengraph-image.jpg` in this folder — Next's file
// convention emits og:image (plus type/width/height) from it automatically, and
// covers every route below `/`. Don't also set `openGraph.images` here or the
// tags get emitted twice. `twitter.card` is what upgrades X to the wide layout;
// X falls back to og:image, so no separate twitter-image file is needed.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Shoobydoo",
  description: DESCRIPTION,
  openGraph: {
    title: "Shoobydoo",
    description: "Concert photography from the harbour and beyond.",
    siteName: "Shoobydoo",
    type: "website",
    locale: "en_US",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shoobydoo",
    description: "Concert photography from the harbour and beyond.",
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
  jobTitle: "Concert and live-music photographer",
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
    </html>
  );
}
