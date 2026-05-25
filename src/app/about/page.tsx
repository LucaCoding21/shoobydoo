import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import HamburgerMenu from "@/components/HamburgerMenu";
import AsciiCat from "@/components/AsciiCat";
import AboutParallax from "@/components/AboutParallax";

export const metadata: Metadata = {
  title: "About — Shoobydoo",
  description:
    "Shoobydoo — concert and live-music photography from the harbour and beyond.",
};

// Brand accent. One toxic green, used sparingly (rules, labels, brackets,
// hover) so it ties the page to the site without pulling focus from the work.
const ACCENT = "#9ef01a";

// TODO: the photographer's real full name. Leave as "" to show the marked
// placeholder below; set it (e.g. "First Last") and the placeholder is
// replaced by the real name automatically.
const FULL_NAME = "";

// Person/brand details for the right rail. Hard facts that aren't confirmed
// are bracketed so they read as clear fill-in blanks rather than asserted fact.
const DETAILS: { label: string; value: string }[] = [
  { label: "Based", value: "[ city ]" },
  { label: "Shooting since", value: "[ year ]" },
  { label: "For", value: "Live · Festival · Editorial" },
];

export default function AboutPage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#0e0f12] text-[#ededeb]">
      {/* Scroll-driven gothic backdrop + grain (decorative, sits at z-0). */}
      <AboutParallax />

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

      {/* ── Title block ─────────────────────────────────────────────────── */}
      <section className="relative z-10 px-[6vw] pt-[7vh] pb-[5vh]">
        {/* Green index + hairline rule — the first accent touch. */}
        <div className="flex items-center gap-4">
          <span
            className="block text-[0.65rem] sm:text-xs"
            style={{
              color: ACCENT,
              fontFamily: "Arial, Helvetica, sans-serif",
              textTransform: "uppercase",
              letterSpacing: "0.3em",
            }}
          >
            01 — About
          </span>
          <span
            aria-hidden
            className="h-px flex-1 max-w-[40vw]"
            style={{
              background: `linear-gradient(90deg, ${ACCENT}66, transparent)`,
            }}
          />
        </div>

        {/* The wordmark IS the logo — site Fraunces display cut. */}
        <h1
          className="mt-5 leading-[0.92]"
          style={{
            fontFamily: "var(--font-fraunces), Georgia, serif",
            fontWeight: 400,
            fontVariationSettings: "'opsz' 144, 'SOFT' 100",
            textTransform: "uppercase",
            letterSpacing: "0.04em",
            fontSize: "clamp(3rem, 13vw, 11rem)",
          }}
        >
          Shoobydoo
        </h1>

        {/* Photographer's full name, paired with the wordmark. Shows a clearly
            marked placeholder until FULL_NAME is filled in above. */}
        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
          <span
            className="text-[0.65rem] opacity-50"
            style={{
              fontFamily: "Arial, Helvetica, sans-serif",
              textTransform: "uppercase",
              letterSpacing: "0.28em",
            }}
          >
            Photographer
          </span>
          {FULL_NAME ? (
            <span
              className="text-base sm:text-lg"
              style={{
                fontFamily: "var(--font-fraunces), Georgia, serif",
                fontVariationSettings: "'opsz' 144, 'SOFT' 100",
                letterSpacing: "0.06em",
              }}
            >
              {FULL_NAME}
            </span>
          ) : (
            <span
              className="rounded-sm px-2.5 py-1 text-[0.7rem]"
              style={{
                color: ACCENT,
                border: `1px dashed ${ACCENT}80`,
                fontFamily: "Arial, Helvetica, sans-serif",
                textTransform: "uppercase",
                letterSpacing: "0.18em",
              }}
            >
              Full name — TODO
            </span>
          )}
        </div>

        <p
          className="mt-6 max-w-2xl text-base sm:text-lg opacity-70"
          style={{
            fontFamily: "var(--font-instrument), Georgia, serif",
            fontStyle: "italic",
            letterSpacing: "0.01em",
          }}
        >
          Concert photography from the harbour and beyond.
        </p>
      </section>

      {/* ── Editorial body ──────────────────────────────────────────────── */}
      <section className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 px-[6vw] pb-[10vh]">
        {/* Portrait — corner-bracket frame in the accent green echoes the home
            grid's selection motif. */}
        <div className="lg:col-span-5">
          <div className="relative aspect-[2/3] w-full max-w-md">
            <div className="absolute inset-0 overflow-hidden rounded-sm shadow-2xl">
              <Image
                src="/events/insomnia-2026/_7R46402-Enhanced-NR.jpg"
                alt="Shoobydoo behind the lens at Insomnia 2026"
                fill
                quality={95}
                sizes="(max-width: 1024px) 90vw, 40vw"
                style={{ objectFit: "cover" }}
              />
            </div>
            {/* L-shaped corner brackets, accent green. */}
            <span
              className="pointer-events-none absolute -top-[8px] -left-[8px] w-5 h-5 border-t-2 border-l-2"
              style={{ borderColor: ACCENT }}
            />
            <span
              className="pointer-events-none absolute -top-[8px] -right-[8px] w-5 h-5 border-t-2 border-r-2"
              style={{ borderColor: ACCENT }}
            />
            <span
              className="pointer-events-none absolute -bottom-[8px] -left-[8px] w-5 h-5 border-b-2 border-l-2"
              style={{ borderColor: ACCENT }}
            />
            <span
              className="pointer-events-none absolute -bottom-[8px] -right-[8px] w-5 h-5 border-b-2 border-r-2"
              style={{ borderColor: ACCENT }}
            />
          </div>
        </div>

        {/* Bio + details */}
        <div className="lg:col-span-7 flex flex-col gap-10 min-w-0">
          {/* ───────────────────────────────────────────────────────────────
              PLACEHOLDER BIO — about the PERSON, not the gear.
              Personality/story prose with bracketed [ blanks ] for any hard
              fact that needs confirming. Replace with Shoobydoo's real story;
              fill or delete every [ ... ] before publishing.
              ─────────────────────────────────────────────────────────────── */}
          <div className="flex flex-col gap-5 max-w-2xl text-[0.95rem] sm:text-base leading-relaxed opacity-80">
            <p>
              Shoobydoo started as a name and turned into a habit. Raised in
              {" "}[ hometown ], he was always the one hovering at the edge of
              the crowd — too restless to stand still, too curious to look
              away. The camera came later; the instinct for the room came first.
            </p>
            <p>
              Quiet in a crowd, loud in the edit. He&apos;s the kind of person
              who&apos;ll wait out a whole set for the one second everyone else
              blinks through, then disappear before the lights come up. Driven
              by the music, the late trains home, and the people who keep
              showing up for both — [ add a real detail or two that makes him
              him ].
            </p>
            <p>
              No persona, no pretending. Just someone who loves the noise and
              wants you to feel like you were standing right there in it.
            </p>
          </div>

          <dl
            className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-5 max-w-xl text-[0.7rem]"
            style={{
              fontFamily: "Arial, Helvetica, sans-serif",
              textTransform: "uppercase",
              letterSpacing: "0.2em",
            }}
          >
            {DETAILS.map((d) => (
              <div key={d.label} className="flex flex-col gap-1.5">
                <dt style={{ color: ACCENT, opacity: 0.7 }}>{d.label}</dt>
                <dd className="opacity-90 tracking-[0.12em]">{d.value}</dd>
              </div>
            ))}
          </dl>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
            <Link
              href="/contact"
              className="group inline-flex items-center gap-3 text-sm uppercase tracking-[0.2em] opacity-90 hover:opacity-100 transition-opacity"
              style={{ fontFamily: "Arial, Helvetica, sans-serif" }}
            >
              Get in touch
              <span
                className="transition-transform duration-300 group-hover:translate-x-1"
                style={{ color: ACCENT }}
              >
                →
              </span>
            </Link>
            <Link
              href="/"
              className="group inline-flex items-center gap-3 text-sm uppercase tracking-[0.2em] opacity-60 hover:opacity-100 transition-opacity"
              style={{ fontFamily: "Arial, Helvetica, sans-serif" }}
            >
              View the work
              <span
                className="transition-transform duration-300 group-hover:translate-x-1"
                style={{ color: ACCENT }}
              >
                →
              </span>
            </Link>
          </div>

          {/* ASCII cat — same easter-egg signature as the gallery rail. */}
          <div className="mt-auto pt-4 opacity-90">
            <AsciiCat />
          </div>
        </div>
      </section>
    </main>
  );
}
