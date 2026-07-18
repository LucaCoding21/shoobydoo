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
