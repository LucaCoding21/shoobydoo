import Link from "next/link";
import type { Metadata } from "next";
import HamburgerMenu from "@/components/HamburgerMenu";
import ContactForm from "@/components/ContactForm";
import ContactAscii from "@/components/ContactAscii";

export const metadata: Metadata = {
  title: "Contact · Shoobydoo",
  description:
    "Get in touch with Shoobydoo for concert, festival, tour, and editorial photography.",
};

// Direct channels mirrored from the site footer so the brand stays consistent.
const CHANNELS: { label: string; value: string; href: string; external?: boolean }[] = [
  { label: "Email", value: "hello@shoobydoo.com", href: "mailto:hello@shoobydoo.com" },
  { label: "Instagram", value: "@shoobydoo", href: "https://instagram.com/shoobydoo", external: true },
  { label: "TikTok", value: "@shoobydoo", href: "https://tiktok.com/@shoobydoo", external: true },
];

export default function ContactPage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#0e0f12] text-[#ededeb]">
      <header className="relative z-20 flex items-center px-[3vw] sm:px-[4vw] pt-6 pb-4">
        <Link
          href="/"
          aria-label="Home"
          className="text-xs sm:text-sm uppercase tracking-[0.2em] opacity-70 hover:opacity-100 transition-opacity"
        >
          Home
        </Link>
        <HamburgerMenu />
      </header>

      {/* Two columns: title + direct channels on the left, the mailto form on
          the right. Collapses to a single column on mobile. */}
      <section className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 px-[6vw] pt-[6vh] pb-[6vh]">
        <div className="lg:col-span-5 flex flex-col gap-9">
          <div>
            <h1
              className="leading-[0.92]"
              style={{
                fontFamily: "var(--font-fraunces), Georgia, serif",
                fontWeight: 400,
                fontVariationSettings: "'opsz' 144, 'SOFT' 100",
                textTransform: "uppercase",
                letterSpacing: "0.04em",
                fontSize: "clamp(2.25rem, 7vw, 5rem)",
              }}
            >
              Get in touch
            </h1>
            <p
              className="mt-5 max-w-md text-base sm:text-lg opacity-70"
              style={{
                fontFamily: "var(--font-geist-sans), Arial, Helvetica, sans-serif",
              }}
            >
              For bookings, press, collaborations, or just to say the night
              looked good. Drop a line.
            </p>
          </div>

          <div className="flex flex-col gap-7">
            {CHANNELS.map((c) => (
              <a
                key={c.label}
                href={c.href}
                {...(c.external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className="group flex flex-col gap-1.5"
              >
                <span
                  className="text-[0.65rem] opacity-40"
                  style={{
                    fontFamily: "Arial, Helvetica, sans-serif",
                    textTransform: "uppercase",
                    letterSpacing: "0.2em",
                  }}
                >
                  {c.label}
                </span>
                <span
                  className="text-base sm:text-lg opacity-85 group-hover:opacity-100 transition-opacity"
                  style={{
                    fontFamily: "var(--font-fraunces), Georgia, serif",
                    fontVariationSettings: "'opsz' 144, 'SOFT' 100",
                    letterSpacing: "0.02em",
                  }}
                >
                  <span className="underline decoration-white/20 decoration-1 underline-offset-[6px] group-hover:decoration-white/70 transition-colors">
                    {c.value}
                  </span>
                </span>
              </a>
            ))}
          </div>

          <p
            className="max-w-sm text-[0.7rem] leading-relaxed opacity-40"
            style={{
              fontFamily: "Arial, Helvetica, sans-serif",
              textTransform: "uppercase",
              letterSpacing: "0.12em",
            }}
          >
            Based in Sydney · Shooting worldwide · Replies within a few days
          </p>

          {/* ASCII signature — same shimmer/glitch as the gallery rail,
              nudged toward the page's left edge. */}
          <div className="mt-2 -ml-[3vw]">
            <ContactAscii />
          </div>
        </div>

        <div className="lg:col-span-7 lg:max-w-2xl w-full lg:-mt-12">
          <ContactForm />
        </div>
      </section>
    </main>
  );
}
