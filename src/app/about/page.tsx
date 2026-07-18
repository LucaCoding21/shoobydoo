import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import HamburgerMenu from "@/components/HamburgerMenu";
import SiteWordmark from "@/components/SiteWordmark";
import PixelImage from "@/components/PixelImage";

export const metadata: Metadata = {
  title: "About · Shoobydoo",
  description:
    "Shoobydoo: concert and live-music photography from the harbour and beyond.",
};

// ── Shared type tokens ──────────────────────────────────────────────────────
// The reference is built on two faces: a light display serif for the name and
// the two pull-quotes, and a plain grotesque (Arial) for every small label and
// body run. We keep the site's Fraunces display cut for the serif so the page
// reads as part of the brand.
const SERIF: React.CSSProperties = {
  fontFamily: "var(--font-fraunces), Georgia, serif",
  fontWeight: 400,
  fontVariationSettings: "'opsz' 144, 'SOFT' 100",
  textTransform: "uppercase",
  letterSpacing: "0.01em",
};
const SANS = "Arial, Helvetica, sans-serif";

// Captioned gallery thumbnails — colour concert photos, each with a three-line
// caption (title / context / year) echoing the reference's "Girl with cat /
// Charcoal on canvas / 2012".
const THUMBS: { src: string; title: string; line2: string; line3: string }[] = [
  {
    src: "/events/nghtmre/_DSC8872-Enhanced-NR.jpg",
    title: "NGHTMRE",
    line2: "Harbour Stage",
    line3: "2025",
  },
  {
    src: "/events/insomnia-2026/_7R46402-Enhanced-NR.jpg",
    title: "Insomnia Festival",
    line2: "Main Tent",
    line3: "2026",
  },
];

// The four things Shoobydoo shoots, each shown as a captioned photo (used for
// the simple mobile stack). The desktop row below is laid out explicitly to
// reproduce the reference's irregular spacing. Filler concert images for now.
const CATEGORIES: { name: string; desc: string; src: string }[] = [
  { name: "Concerts", desc: "Club shows, headline sets", src: "/events/insomnia-2025/_DSC2977-Enhanced-NR.jpg" },
  { name: "Festivals", desc: "Main stages, tents", src: "/events/insomnia-2026/_7R46147.jpg" },
  { name: "Tours & Residencies", desc: "Multi-night runs", src: "/events/nghtmre/_DSC9116-Enhanced-NR.jpg" },
  { name: "Editorial & Press", desc: "Portraits, covers", src: "/events/insomnia-2025/_DSC2886-Enhanced-NR.jpg" },
];

export default function AboutPage() {
  return (
    <main className="relative min-h-screen overflow-x-clip bg-[#0e0f12] text-[#ededeb]">
      {/* Site-wide nav: fixed centred wordmark + [MENU] toggle. */}
      <SiteWordmark />
      <HamburgerMenu />

      {/* ── HERO — huge left name + bio, cyber-sigil bleeding off the right ──── */}
      <section className="relative z-10 px-[5vw] pt-[12vh] pb-[9vh] lg:pt-[15vh]">
        <div className="grid grid-cols-1 lg:grid-cols-12 lg:items-start lg:gap-x-8">
          {/* Left — name + bio */}
          <div className="lg:col-span-7">
            <h1
              className="leading-[0.92]"
              style={{ ...SERIF, fontSize: "clamp(3rem, 12.5vw, 9.5rem)" }}
            >
              Shoobydoo
            </h1>

            {/* Bio sits indented to the right under the name, as in the
                reference — a short, factual grotesque run. */}
            <p
              className="mt-8 max-w-[36ch] text-[0.82rem] leading-relaxed opacity-60 lg:mt-10 lg:ml-[50%]"
              style={{ fontFamily: SANS }}
            >
              Concert and live-music photographer. Today, Shoobydoo&rsquo;s work
              can be seen across the harbour&rsquo;s main stages, the festival
              fields, and the small rooms in between.
            </p>
          </div>

          {/* Right — cyber-sigil hero art. ABSOLUTE so it floats as its own
              entity: tweak `right-[…]` to move horizontally, `top-[…]` to move
              vertically, `h-[…vh]` to resize. Nothing else on the page moves.
              White line-work via the same invert + screen treatment as the footer. */}
          <div className="relative mt-6 min-h-[44vh] lg:col-span-5 lg:mt-0 lg:min-h-[62vh]">
            <Image
              src="/about-sword.png"
              alt=""
              aria-hidden
              width={1152}
              height={2048}
              preload
              className="pointer-events-none absolute right-[-14%] top-[52%] h-[56vh] w-auto max-w-none -translate-y-1/2 select-none lg:right-[-30%] lg:top-[60%] lg:h-[102vh]"
              style={{ filter: "invert(1)", mixBlendMode: "screen", opacity: 0.28 }}
            />
          </div>
        </div>
      </section>

      {/* ── STATEMENT 1 — portrait + caption, then big left pull-quote ───────── */}
      <section className="relative z-10 px-[5vw] py-[8vh]">
        {/* Small colour photo + caption, pushed to centre-left like the ref. */}
        <div className="mb-[7vh] grid grid-cols-1 gap-y-6 lg:grid-cols-12 lg:items-start lg:gap-x-8">
          <div className="hidden lg:col-span-3 lg:block" aria-hidden />
          <figure className="lg:col-span-3">
            <div className="relative aspect-[4/5] w-full max-w-[16rem] overflow-hidden rounded-sm">
              <PixelImage src="/sselfie.jpg" alt="Shoobydoo" />
            </div>
          </figure>
          <div className="lg:col-span-5 lg:pt-1">
            <p
              className="text-[0.8rem] leading-relaxed"
              style={{ fontFamily: SANS }}
            >
              Shoobydoo (based on the harbour, shooting live since 2019)
            </p>
            <p
              className="mt-3 max-w-[40ch] text-[0.8rem] leading-relaxed opacity-55"
              style={{ fontFamily: SANS }}
            >
              Concert and editorial photographer. Self-taught in the pit, member
              of the harbour&rsquo;s live-music circuit, working its venues and
              the festival fields beyond.
            </p>
          </div>
        </div>

        {/* Pull-quote — left-aligned, ragged right, big serif. */}
        <p
          className="max-w-[18ch] leading-[1.1] sm:max-w-none"
          style={{ ...SERIF, fontSize: "clamp(1.55rem, 4.7vw, 3.35rem)" }}
        >
          A live show only happens once. The job is to catch the part worth
          keeping.
        </p>
      </section>

      {/* ── GALLERY — tall feature photo left, two captioned thumbs right ────── */}
      <section className="relative z-10 grid grid-cols-1 items-start gap-x-8 gap-y-12 px-[5vw] py-[6vh] lg:grid-cols-12">
        {/* Left feature photo */}
        <figure className="lg:col-span-5">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-sm shadow-2xl">
            <PixelImage
              src="/events/insomnia-2025/_DSC2728-Enhanced-NR.jpg"
              alt="Insomnia main stage"
            />
          </div>
          <figcaption
            className="mt-3 text-[0.62rem] opacity-50"
            style={{ fontFamily: SANS, textTransform: "uppercase", letterSpacing: "0.22em" }}
          >
            Insomnia / Main Stage / 2025
          </figcaption>
        </figure>

        {/* Spacer column, then the two thumbs sit high on the right. */}
        <div className="hidden lg:col-span-1 lg:block" aria-hidden />
        <div className="grid grid-cols-2 gap-6 self-start lg:col-span-6 lg:pt-[5vh]">
          {THUMBS.map((t) => (
            <figure key={t.src} className="flex flex-col">
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-sm">
                <PixelImage src={t.src} alt={t.title} />
              </div>
              <figcaption
                className="mt-3 text-[0.7rem] leading-snug"
                style={{ fontFamily: SANS }}
              >
                <span>{t.title}</span>
                <br />
                <span className="opacity-50">{t.line2}</span>
                <br />
                <span className="opacity-50">{t.line3}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* ── STATEMENT 2 + category row — pixel-matched to the reference editorial
            layout (measured from the source screenshot, 2918×1362). Everything
            desktop-side is sized in vw so the reference's exact proportions hold
            and the block just fills one fold:
              · left margin 1.5vw; title line-1 indents to 23.4vw, line-2 at margin
              · body justified, block right edge 50.1vw
              · four equal 20.5vw images, two pairs split by a 12.2vw centre gap
              · all images top-aligned; #3 is a short 3:2, the rest tall 598:721
              · title→body 3.9vw, body→row 5.8vw, caption gap 1.7vw ─────────── */}
      <section className="relative z-10 flex min-h-screen flex-col justify-center px-[5vw] py-[6vh] lg:px-0">
        {/* Title + body, inset to the reference's ~1.5% left margin on desktop. */}
        <div className="lg:pl-[1.5vw]">
          {/* Display title — first line indented, second falls back to the margin. */}
          <p
            className="max-w-[34ch] text-[clamp(1.3rem,4.6vw,2.2rem)] leading-[1.1] [text-indent:1.2em] lg:max-w-[86vw] lg:text-[3.3vw] lg:leading-[1.0] lg:[text-indent:21.9vw]"
            style={SERIF}
          >
            It&rsquo;s simple: I want the photos to feel like being there.
          </p>

          {/* Body — justified, half-width, no first-line indent (matches ref). */}
          <p
            className="mt-6 max-w-[60ch] text-[0.85rem] leading-relaxed opacity-55 lg:mt-[3.9vw] lg:max-w-[48.6vw] lg:text-[0.95vw] lg:leading-[1.55]"
            style={{ fontFamily: SANS, textAlign: "justify" }}
          >
            I shoot from the crowd, not above it, staying through the whole set
            for the few frames that really catch the night. No big production, no
            posing. Just someone who loves live music and wants you to remember
            how it looked.
          </p>
        </div>

        {/* The four categories — top-aligned row of equal-width images, the two
            pairs split by a wide centre gap. #3 (Tours) is the short 3:2 crop,
            so it leaves empty space below it exactly like the reference. */}
        <div className="mt-[5.8vw] hidden items-start lg:flex">
          {/* 1 — Concerts (tall 598:721) */}
          <figure className="ml-[1.5vw] w-[20.5vw]">
            <div className="relative aspect-[598/721] w-full overflow-hidden rounded-sm">
              <PixelImage src="/events/insomnia-2025/_DSC2977-Enhanced-NR.jpg" alt="Concerts" />
            </div>
            <figcaption className="mt-[1.7vw] text-[0.8vw] leading-snug" style={{ fontFamily: SANS }}>
              Concerts<br /><span className="opacity-50">Club shows, headline sets</span>
            </figcaption>
          </figure>

          {/* 2 — Festivals (tall 598:721) */}
          <figure className="ml-[1.4vw] w-[20.5vw]">
            <div className="relative aspect-[598/721] w-full overflow-hidden rounded-sm">
              <PixelImage src="/events/insomnia-2026/_7R46147.jpg" alt="Festivals" />
            </div>
            <figcaption className="mt-[1.7vw] text-[0.8vw] leading-snug" style={{ fontFamily: SANS }}>
              Festivals<br /><span className="opacity-50">Main stages, tents</span>
            </figcaption>
          </figure>

          {/* 3 — Tours & Residencies (short 3:2, leaves space below) */}
          <figure className="ml-[12.2vw] w-[20.5vw]">
            <div className="relative aspect-[598/398] w-full overflow-hidden rounded-sm">
              <PixelImage src="/events/nghtmre/_DSC9116-Enhanced-NR.jpg" alt="Tours and residencies" />
            </div>
            <figcaption className="mt-[1.7vw] text-[0.8vw] leading-snug" style={{ fontFamily: SANS }}>
              Tours &amp; Residencies<br /><span className="opacity-50">Multi-night runs</span>
            </figcaption>
          </figure>

          {/* 4 — Editorial & Press (tall 598:721) */}
          <figure className="ml-[1.4vw] w-[20.5vw]">
            <div className="relative aspect-[598/721] w-full overflow-hidden rounded-sm">
              <PixelImage src="/events/insomnia-2025/_DSC2886-Enhanced-NR.jpg" alt="Editorial and press" />
            </div>
            <figcaption className="mt-[1.7vw] text-[0.8vw] leading-snug" style={{ fontFamily: SANS }}>
              Editorial &amp; Press<br /><span className="opacity-50">Portraits, covers</span>
            </figcaption>
          </figure>
        </div>

        {/* Mobile fallback — simple two-up grid. */}
        <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-8 lg:hidden">
          {CATEGORIES.map((c) => (
            <figure key={c.name} className="flex flex-col">
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-sm">
                <PixelImage src={c.src} alt={c.name} />
              </div>
              <figcaption className="mt-3 text-[0.72rem] leading-snug" style={{ fontFamily: SANS }}>
                <span>{c.name}</span>
                <br />
                <span className="opacity-50">{c.desc}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* ── CTA — closing call to action ─────────────────────────────────────── */}
      <section className="relative z-10 overflow-hidden px-[5vw] pb-[16vh] pt-[12vh]">
        {/* Sigil floating behind the headline — black line-art rendered as glowing
            white linework via invert + screen on the page's black ground. */}
        <Image
          src="/cta-sigil.png"
          alt=""
          aria-hidden
          width={1152}
          height={2048}
          className="pointer-events-none absolute -z-0 top-[4vh] right-[-16vw] h-[52vh] w-auto max-w-none select-none lg:-top-[6vh] lg:right-[0vw] lg:h-[85vh]"
          style={{ filter: "invert(1)", mixBlendMode: "screen", opacity: 0.2 }}
        />

        <p
          className="relative z-10 max-w-[16ch] leading-[1.04]"
          style={{ ...SERIF, fontSize: "clamp(2.4rem, 7vw, 5.5rem)" }}
        >
          Bring me to your next show.
        </p>

        {/* Link row — primary route to /contact. */}
        <div className="relative z-10 mt-12 flex flex-col gap-7 sm:flex-row sm:items-end sm:gap-14">
          <Link href="/contact" className="group inline-flex items-baseline gap-3">
            <span
              className="border-b border-white/30 pb-1 text-2xl transition-colors group-hover:border-white/90 sm:text-3xl"
              style={{
                fontFamily: "var(--font-fraunces), Georgia, serif",
                fontVariationSettings: "'opsz' 144, 'SOFT' 100",
                letterSpacing: "0.02em",
              }}
            >
              Get in touch
            </span>
            <span className="text-xl opacity-60 transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>
      </section>
    </main>
  );
}
