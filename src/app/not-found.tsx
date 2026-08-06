import Link from "next/link";
import type { Metadata } from "next";
import HamburgerMenu from "@/components/HamburgerMenu";
import SiteWordmark from "@/components/SiteWordmark";

export const metadata: Metadata = {
  title: "Not found · Shoobydoo",
};

// Root 404 — renders for any unmatched URL and for notFound() throws (e.g. a
// bad /events/[slug]). Same type tokens as the about page so it reads as part
// of the site rather than a browser error.
const SERIF: React.CSSProperties = {
  fontFamily: "var(--font-fraunces), Georgia, serif",
  fontWeight: 400,
  fontVariationSettings: "'opsz' 144, 'SOFT' 100",
  textTransform: "uppercase",
  letterSpacing: "0.01em",
};

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen flex-col justify-center bg-[#0e0f12] px-[5vw] text-[#ededeb]">
      <SiteWordmark />
      <HamburgerMenu />

      <h1 style={{ ...SERIF, fontSize: "clamp(3rem, 12.5vw, 9.5rem)" }} className="leading-[0.92]">
        Lost frame
      </h1>
      <p
        className="mt-8 max-w-[40ch] text-[0.82rem] leading-relaxed opacity-60"
        style={{ fontFamily: "Arial, Helvetica, sans-serif" }}
      >
        This page doesn&rsquo;t exist — the shot you&rsquo;re after isn&rsquo;t
        here.
      </p>

      <div className="mt-12">
        <Link href="/" className="group inline-flex items-baseline gap-3">
          <span
            className="border-b border-white/30 pb-1 text-2xl transition-colors group-hover:border-white/90 sm:text-3xl"
            style={{
              fontFamily: "var(--font-fraunces), Georgia, serif",
              fontVariationSettings: "'opsz' 144, 'SOFT' 100",
              letterSpacing: "0.02em",
            }}
          >
            Back to the work
          </span>
          <span className="text-xl opacity-60 transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </Link>
      </div>
    </main>
  );
}
