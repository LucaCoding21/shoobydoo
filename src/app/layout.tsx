import type { Metadata } from "next";
import { Geist, Geist_Mono, DM_Serif_Display, Gasoek_One, Playfair_Display, Cinzel, Instrument_Serif, Noto_Serif, Fraunces } from "next/font/google";
import Footer from "@/components/Footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const dmSerif = DM_Serif_Display({
  variable: "--font-dm-serif",
  weight: "400",
  subsets: ["latin"],
});

const gasoekOne = Gasoek_One({
  variable: "--font-gasoek-one",
  weight: "400",
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  weight: ["400", "700", "900"],
  subsets: ["latin"],
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument",
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
});

const notoSerif = Noto_Serif({
  variable: "--font-noto-serif",
  weight: ["400", "500", "600", "700", "800", "900"],
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

export const metadata: Metadata = {
  title: "Shoobydoo",
  description: "Concert photography from the harbour and beyond.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${dmSerif.variable} ${gasoekOne.variable} ${playfairDisplay.variable} ${cinzel.variable} ${instrumentSerif.variable} ${notoSerif.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#0e0f12] text-[#ededeb] overflow-x-hidden overscroll-none">
        {children}
        <Footer />
      </body>
    </html>
  );
}
