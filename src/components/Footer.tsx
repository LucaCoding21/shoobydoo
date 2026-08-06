import Image from "next/image";
import Link from "next/link";

// Footer navigation. Internal routes use next/link; anything else (socials,
// mailto) falls through to a plain anchor below.
type FooterLink = { label: string; href: string };

const COLUMNS: { title: string; links: FooterLink[] }[] = [
  {
    title: "Navigate",
    links: [
      { label: "Work", href: "/" },
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Events",
    links: [
      { label: "Insomnia 2026", href: "/events/insomnia-2026" },
      { label: "Insomnia 2025", href: "/events/insomnia-2025" },
      { label: "NGHTMRE", href: "/events/nghtmre" },
    ],
  },
  {
    title: "Connect",
    links: [
      { label: "Instagram", href: "https://instagram.com/shoobydoofruitsnacks" },
      { label: "Email", href: "mailto:shoobydoofruitsnacks@gmail.com" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative w-full overflow-hidden border-t border-white/10 bg-[#0e0f12] text-[#ededeb]">
      {/* ── Decorative cyber-sigilism art ──────────────────────────────────
          Black line drawings inverted to white and screen-blended, so only the
          linework reads on the near-black footer. Each is masked to dissolve as
          it rises, echoing the reference's bottom-anchored fade. Purely
          decorative — aria-hidden and non-interactive. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 select-none"
      >
        {/* Bottom-left corner — chained sword, rotated to arc diagonally across
            the corner rather than run straight down the left wall. Pivots from
            its bottom-left so the chain-heavy lower portion hugs the corner.
            Mobile gets its own smaller sweep (the rotated blade spans roughly
            the image height horizontally, so ~64vh clears a phone width and
            bleeds off the right edge like the desktop composition). */}
        <div className="absolute bottom-[42vh] left-[2vw] aspect-[1152/2048] h-[64vh] max-h-[540px] origin-bottom-left rotate-[100deg] sm:bottom-[50vh] sm:left-[5vw] sm:h-[105vh] sm:max-h-[850px]">
          <Image
            src="/footer/chained-sword.png"
            alt=""
            fill
            sizes="40vw"
            className="object-contain object-left-bottom"
            style={{
              filter: "invert(1)",
              mixBlendMode: "screen",
              opacity: 0.24,
              transform: "scaleX(-1)",
            }}
          />
        </div>

        {/* Bottom-left corner — floral flourish, mirrored. Scaled down on
            mobile so it reads as corner filigree, not a wall. */}
        <div className="absolute bottom-[1vh] left-[-9vw] aspect-[736/1308] h-[40vh] max-h-[380px] sm:bottom-[2vh] sm:left-[-4vw] sm:h-[58vh] sm:max-h-[585px]">
          <Image
            src="/footer/flourish.png"
            alt=""
            fill
            sizes="20vw"
            className="object-contain object-left-bottom"
            style={{
              filter: "invert(1)",
              mixBlendMode: "screen",
              opacity: 0.34,
              transform: "scaleX(-1)",
            }}
          />
        </div>
      </div>

      {/* ── Content ─────────────────────────────────────────────────────── */}
      <div className="relative z-10 px-[6vw] pb-12 pt-16 lg:pt-20">
        <div className="flex flex-col gap-12 lg:flex-row lg:justify-between lg:gap-16">
          {/* Brand */}
          <div className="max-w-xs">
            {/* Logo mark — white linework (red Sharingan eyes preserved) on a
                transparent background, so it drops straight onto the dark footer. */}
            <Image
              src="/logo.png"
              alt="Shoobydoo"
              width={661}
              height={1418}
              sizes="64px"
              className="mb-5 h-auto w-[64px] select-none"
            />
            <span
              className="block select-none text-2xl"
              style={{
                fontFamily: "var(--font-fraunces), Georgia, serif",
                fontWeight: 400,
                fontVariationSettings: "'opsz' 144, 'SOFT' 100",
                textTransform: "uppercase",
                letterSpacing: "0.12em",
              }}
            >
              Shoobydoo
            </span>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 gap-x-12 gap-y-10 sm:grid-cols-3 lg:gap-x-16">
            {COLUMNS.map((col) => (
              <div key={col.title} className="flex flex-col gap-4">
                <h2
                  className="text-[0.65rem] opacity-60"
                  style={{
                    fontFamily: "Arial, Helvetica, sans-serif",
                    textTransform: "uppercase",
                    letterSpacing: "0.24em",
                  }}
                >
                  {col.title}
                </h2>
                <ul className="flex flex-col gap-2.5">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      {link.href.startsWith("/") ? (
                        <Link
                          href={link.href}
                          className="text-sm opacity-70 transition-opacity hover:opacity-100"
                        >
                          {link.label}
                        </Link>
                      ) : (
                        <a
                          href={link.href}
                          {...(link.href.startsWith("http")
                            ? { target: "_blank", rel: "noopener noreferrer" }
                            : {})}
                          className="text-sm opacity-70 transition-opacity hover:opacity-100"
                        >
                          {link.label}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Vertical room so the art can rise without crowding the links. */}
        <div className="h-[34vh] max-h-[420px] sm:h-[40vh] lg:h-[46vh]" />
      </div>
    </footer>
  );
}
