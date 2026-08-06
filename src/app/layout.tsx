import type { Metadata } from "next";
import { Geist, Geist_Mono, Fraunces } from "next/font/google";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";
import EventTransitionLayer from "@/components/EventTransitionLayer";
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

// Absolute base for og:image and friends. Vercel injects the URL vars itself,
// so deploys resolve the share card without any dashboard config:
//   NEXT_PUBLIC_SITE_URL          — set this by hand once a custom domain exists
//   VERCEL_PROJECT_PRODUCTION_URL — the stable production domain
//   VERCEL_URL                    — per-deploy URL, so preview builds work too
// Vercel's vars carry no protocol, hence the https:// prefix.
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000");

// The share card itself is `opengraph-image.jpg` in this folder — Next's file
// convention emits og:image (plus type/width/height) from it automatically, and
// covers every route below `/`. Don't also set `openGraph.images` here or the
// tags get emitted twice. `twitter.card` is what upgrades X to the wide layout;
// X falls back to og:image, so no separate twitter-image file is needed.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Shoobydoo",
  description: "Concert photography from the harbour and beyond.",
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
        {children}
        <Footer />
        <EventTransitionLayer />
        <CustomCursor />
      </body>
    </html>
  );
}
