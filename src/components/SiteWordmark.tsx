import Link from "next/link";

// Persistent site wordmark — the "Shoobydoo" logo, centred at the top of the
// viewport, in the exact same spot on every page. Styling mirrors the old
// homepage hero title: Fraunces display cut, opsz 144, uppercase. Links home.
// Sits at z-40 so the open nav panel covers it — the menu shows its own
// left-aligned logo instead.
export default function SiteWordmark() {
  return (
    <Link
      href="/"
      aria-label="Shoobydoo, home"
      className="fixed top-7 left-1/2 -translate-x-1/2 z-40 leading-none text-[#ededeb] whitespace-nowrap select-none text-[clamp(0.9rem,4vw,1.25rem)] md:text-[clamp(1rem,1.5vw,1.5rem)]"
      style={{
        fontFamily: "var(--font-fraunces), Georgia, serif",
        fontWeight: 400,
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        fontVariationSettings: "'opsz' 144, 'SOFT' 100",
      }}
    >
      Shoobydoo
    </Link>
  );
}
