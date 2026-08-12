import type { Metadata } from "next";
import HamburgerMenu from "@/components/HamburgerMenu";
import SiteWordmark from "@/components/SiteWordmark";
import ContactForm from "@/components/ContactForm";
import ContactAscii from "@/components/ContactAscii";
import { OG_IMAGE } from "@/lib/ogImage";

const PAGE_TITLE = "Contact Shoobydoo | Book a Concert Photographer in Vancouver";
const PAGE_DESCRIPTION =
  "Book Shoobydoo for concert, festival, and event photography in Vancouver, BC. Get in touch by email or Instagram for bookings, press, and collaborations.";

export const metadata: Metadata = {
  // title.absolute: the phrasing already carries the brand, so the root
  // layout's "%s | Shoobydoo" template must not suffix it again.
  title: { absolute: PAGE_TITLE },
  description: PAGE_DESCRIPTION,
  alternates: { canonical: "/contact" },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: "/contact",
    images: [OG_IMAGE],
  },
};

// Direct channels mirrored from the site footer so the brand stays consistent.
const CHANNELS: { label: string; value: string; href: string; external?: boolean }[] = [
  { label: "Email", value: "shoobydoofruitsnacks@gmail.com", href: "mailto:shoobydoofruitsnacks@gmail.com" },
  { label: "Instagram", value: "@shoobydoofruitsnacks", href: "https://instagram.com/shoobydoofruitsnacks", external: true },
];

export default function ContactPage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#0e0f12] text-[#ededeb]">
      {/* Fixed height reserves the same top-bar space the old "Home" link gave
          the row (kept identical to the gallery header). */}
      <header className="relative z-20 flex items-center px-[3vw] sm:px-[4vw] h-14 sm:h-[3.75rem]">
        <SiteWordmark />
        <HamburgerMenu />
      </header>

      {/* Two columns: title + direct channels on the left, the mailto form on
          the right. Collapses to a single column on mobile. */}
      <section className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 px-[6vw] pt-[9vh] lg:pt-[16vh] pb-[6vh]">
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

          {/* ASCII signature — same shimmer/glitch as the gallery rail.
              Mirrored on its vertical axis (-scale-x-100) and parked on the
              right side of the screen, behind the copy (-z-10), as a sigil.
              Desktop/tablet only: at full size it's wider than a phone. */}
          <div className="pointer-events-none absolute bottom-0 right-0 -z-10 -mr-[3vw] hidden -scale-x-100 sm:block">
            <ContactAscii />
          </div>
        </div>

        <div className="lg:col-span-7 lg:max-w-2xl w-full lg:mt-2">
          <ContactForm />
        </div>

        {/* Mobile signature — same sigil, parked bottom-right BEHIND the form
            (the fields are transparent underlines, so it reads through them as
            a watermark), mirroring the desktop's behind-the-copy placement
            instead of sitting in-flow below the page. */}
        <div className="pointer-events-none absolute bottom-0 right-[-8vw] -z-10 -scale-x-100 sm:hidden">
          <ContactAscii fontSize="0.34rem" opacity={0.22} />
        </div>
      </section>
    </main>
  );
}
