"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

// The menu is a fixed three-item set styled as a film frame. Each word hides a
// photo behind its "O" glyph that's revealed on hover ("w[o]rk", "ab[o]ut",
// "c[o]ntact").
type MenuItem = { word: string; href: string };

const MENU: readonly MenuItem[] = [
  { word: "WORK", href: "/" },
  { word: "ABOUT", href: "/about" },
  { word: "CONTACT", href: "/contact" },
];

// Photos cycled through the revealed "O". Each hover advances to the next one,
// so the picture changes every time and never repeats back-to-back. Add or
// swap paths here to change the rotation.
const POOL: readonly string[] = [
  "/events/insomnia-2026/_7R46147.jpg",
  "/events/insomnia-2025/_DSC2208-Enhanced-NR.jpg",
  "/events/insomnia-2026/_7R46402-Enhanced-NR.jpg",
  "/events/insomnia-2025/_DSC2728-Enhanced-NR.jpg",
  "/events/insomnia-2026/_7R46201-Enhanced-NR.jpg",
  "/events/insomnia-2025/_DSC2886-Enhanced-NR.jpg",
  "/events/insomnia-2026/_7R46555.jpg",
  "/events/insomnia-2025/_DSC2977-Enhanced-NR.jpg",
];

// Sprocket holes punched into the film strips, top and bottom.
const HOLES = Array.from({ length: 7 });

export default function HamburgerMenu() {
  const [open, setOpen] = useState(false);
  // One pool index per word, staggered so the words start on different photos.
  const [photoIdx, setPhotoIdx] = useState<number[]>(() =>
    MENU.map((_, i) => i % POOL.length),
  );
  const pathname = usePathname();

  // Refs for focus management: the toggle/close button and each word link.
  const buttonRef = useRef<HTMLButtonElement>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  // Advance one word to its next photo (called as hover/focus begins). Skips
  // any photo currently shown by another word, so no two words ever display the
  // same picture at once.
  const cyclePhoto = (i: number) =>
    setPhotoIdx((prev) => {
      const taken = new Set(prev.filter((_, j) => j !== i));
      let n = (prev[i] + 1) % POOL.length;
      while (taken.has(n)) n = (n + 1) % POOL.length;
      const next = [...prev];
      next[i] = n;
      return next;
    });

  useEffect(() => {
    if (!open) return;

    // Move focus into the dialog (first item) when it opens.
    linkRefs.current[0]?.focus();

    // Tab order through the open menu: close button, then the word links.
    const order = (): HTMLElement[] =>
      [buttonRef.current, ...linkRefs.current].filter(Boolean) as HTMLElement[];

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      if (e.key === "Tab") {
        // Trap focus: wrap at the ends, and pull it back in if it escaped.
        const els = order();
        if (els.length === 0) return;
        const idx = els.indexOf(document.activeElement as HTMLElement);
        if (idx === -1) {
          e.preventDefault();
          els[0].focus();
        } else if (e.shiftKey && idx === 0) {
          e.preventDefault();
          els[els.length - 1].focus();
        } else if (!e.shiftKey && idx === els.length - 1) {
          e.preventDefault();
          els[0].focus();
        }
        return;
      }
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        // Cycle focus between the word links.
        const links = linkRefs.current.filter(Boolean) as HTMLAnchorElement[];
        const cur = links.indexOf(document.activeElement as HTMLAnchorElement);
        if (cur === -1) return;
        e.preventDefault();
        const dir = e.key === "ArrowDown" ? 1 : -1;
        links[(cur + dir + links.length) % links.length].focus();
      }
    };

    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const toggle = buttonRef.current;
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      // Return focus to the toggle when the menu closes.
      toggle?.focus();
    };
  }, [open]);

  const Strip = () => (
    <div className="film-strip" aria-hidden>
      {HOLES.map((_, i) => (
        <span key={i} className="film-hole" />
      ))}
    </div>
  );

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        className="hamburger-btn fixed top-5 right-5 sm:top-7 sm:right-7 z-[60] flex items-center justify-center w-10 h-10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 rounded"
      >
        <span aria-hidden className="hamburger-icon" data-open={open}>
          <span className="bar bar-top" />
          <span className="bar bar-mid" />
          <span className="bar bar-bot" />
        </span>
      </button>

      {/* Full-screen film frame slides in from the right (right-to-left). */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        inert={!open}
        data-open={open}
        className={`film-panel fixed inset-0 z-50 flex flex-col bg-[#0e0f12] ${
          open ? "" : "pointer-events-none"
        }`}
      >
        <Strip />

        <div className="flex-1 flex flex-col px-[7vw] py-[5vh] min-h-0">
          <nav className="flex-1 flex flex-col justify-center gap-1 sm:gap-2 min-h-0">
          {MENU.map((item, i) => {
            const active = item.href !== "#" && pathname === item.href;
            // Split the word at its "O": the two halves slide apart on hover,
            // opening a gap where the photo is revealed.
            const oIdx = item.word.indexOf("O");
            const pre = item.word.slice(0, oIdx);
            const post = item.word.slice(oIdx + 1);
            return (
              <Link
                key={item.word}
                ref={(el) => {
                  linkRefs.current[i] = el;
                }}
                href={item.href}
                onClick={() => setOpen(false)}
                onMouseEnter={() => cyclePhoto(i)}
                onFocus={() => cyclePhoto(i)}
                aria-current={active ? "page" : undefined}
                data-open={open}
                className="word-link group focus:outline-none"
                style={{ transitionDelay: open ? `${180 + i * 90}ms` : "0ms" }}
              >
                <span className="word" data-active={active || undefined}>
                  <span className="seg seg-pre">{pre}</span>
                  <span className="o-slot">
                    <span className="o-letter">O</span>
                    <span className="o-photo">
                      <Image
                        src={POOL[photoIdx[i]]}
                        alt=""
                        fill
                        sizes="240px"
                        quality={75}
                        style={{ objectFit: "cover" }}
                      />
                    </span>
                  </span>
                  <span className="seg seg-post">{post}</span>
                </span>
              </Link>
            );
          })}
          </nav>

          {/* Wordmark footer — mirrors the site Footer for continuity. */}
          <div className="menu-foot">
            <span className="menu-wordmark">Shoobydoo</span>
            <span className="menu-tagline">
              Concert photography from the harbour and beyond.
            </span>
          </div>
        </div>

        <Strip />

        {/* Preload the whole pool once the menu opens so cycling is instant.
            Same sizes/quality as the visible photo to guarantee a cache hit. */}
        {open && (
          <div aria-hidden className="photo-preload">
            {POOL.map((src) => (
              <Image
                key={src}
                src={src}
                alt=""
                width={240}
                height={170}
                sizes="240px"
                quality={75}
              />
            ))}
          </div>
        )}
      </div>

      <style>{`
        .hamburger-icon {
          position: relative;
          display: block;
          width: 22px;
          height: 14px;
        }
        .hamburger-icon .bar {
          position: absolute;
          left: 0;
          width: 100%;
          height: 1.5px;
          background: #ededeb;
          border-radius: 1px;
          transition: transform 240ms cubic-bezier(0.22, 1, 0.36, 1),
                      opacity 180ms ease-out,
                      background 200ms ease-out,
                      top 240ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .hamburger-icon .bar-top { top: 0; }
        .hamburger-icon .bar-mid { top: 50%; transform: translateY(-50%); }
        .hamburger-icon .bar-bot { top: 100%; transform: translateY(-100%); }

        /* When open, the icon sits on the black film strip — stay light so it reads. */
        .hamburger-icon[data-open="true"] .bar { background: #ededeb; }
        .hamburger-icon[data-open="true"] .bar-top {
          top: 50%;
          transform: translateY(-50%) rotate(45deg);
        }
        .hamburger-icon[data-open="true"] .bar-mid { opacity: 0; }
        .hamburger-icon[data-open="true"] .bar-bot {
          top: 50%;
          transform: translateY(-50%) rotate(-45deg);
        }

        .hamburger-btn { opacity: 0.85; transition: opacity 200ms ease-out; }
        .hamburger-btn:hover,
        .hamburger-btn:focus-visible { opacity: 1; }

        /* Panel slide — opaque full-screen takeover, right to left. */
        .film-panel {
          transform: translateX(100%);
          transition: transform 480ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .film-panel[data-open="true"] { transform: translateX(0); }

        /* Off-screen pool preloader — fetched but never seen. */
        .photo-preload {
          position: absolute;
          width: 0;
          height: 0;
          overflow: hidden;
          opacity: 0;
          pointer-events: none;
        }

        /* Strips blend into the panel background; only the white perforations
           show, floating top and bottom like a film-negative edge. */
        .film-strip {
          flex: none;
          height: clamp(40px, 7vh, 70px);
          background: #0e0f12;
          display: flex;
          align-items: center;
          justify-content: space-around;
          padding: 0 4vw;
          overflow: hidden;
        }
        .film-hole {
          flex: none;
          width: clamp(26px, 5vw, 56px);
          height: 46%;
          background: #ededeb;
          border-radius: 5px;
        }

        /* Wordmark footer — same Fraunces / Arial-caps treatment as the site
           Footer, so the menu reads as part of the brand. */
        .menu-foot {
          flex: none;
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          padding-top: 1.25rem;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }
        .menu-wordmark {
          font-family: var(--font-fraunces), Georgia, serif;
          font-variation-settings: "opsz" 144, "SOFT" 100;
          font-size: 1.05rem;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: #ededeb;
          opacity: 0.7;
        }
        .menu-tagline {
          font-family: Arial, Helvetica, sans-serif;
          font-size: 0.7rem;
          letter-spacing: 0.04em;
          color: #ededeb;
          opacity: 0.32;
        }

        /* Stacked display words — the brand's Fraunces display cut. */
        .word-link {
          transition: opacity 420ms ease, transform 420ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .film-panel[data-open="false"] .word-link { opacity: 0; transform: translateX(40px); }
        .film-panel[data-open="true"] .word-link { opacity: 1; transform: translateX(0); }

        .word {
          display: inline-flex;
          align-items: baseline;
          font-family: var(--font-fraunces), Georgia, serif;
          font-weight: 400;
          font-variation-settings: "opsz" 144, "SOFT" 100;
          font-size: clamp(2.5rem, 10vw, 7rem);
          line-height: 1.06;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #ededeb;
          transition: opacity 200ms ease-out;
        }
        .word-link:hover .word,
        .word-link:focus-visible .word { opacity: 0.92; }

        /* The "O" splits the word in two. On hover the halves slide outward and
           the photo is revealed in the gap they open. The "O" slot keeps its
           glyph width in flow at all times, so the halves part via transform
           only — no reflow, no horizontal scroll. */
        .seg {
          display: inline-block;
          transition: transform 460ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .o-slot {
          position: relative;
          display: inline-block;
        }
        .o-letter {
          display: inline-block;
          transition: opacity 200ms ease-out;
        }
        .o-photo {
          position: absolute;
          top: 50%;
          left: 50%;
          z-index: 2;
          width: 1.55em;
          height: 1.1em;
          border-radius: 0.08em;
          overflow: hidden;
          transform: translate(-50%, -50%) scale(0.75);
          opacity: 0;
          transition: opacity 220ms ease-out,
                      transform 460ms cubic-bezier(0.22, 1, 0.36, 1);
          pointer-events: none;
        }
        /* Slide the halves apart and fade the "O" out to clear the gap. */
        .word-link:hover .seg-pre,
        .word-link:focus-visible .seg-pre { transform: translateX(-0.55em); }
        .word-link:hover .seg-post,
        .word-link:focus-visible .seg-post { transform: translateX(0.55em); }
        .word-link:hover .o-letter,
        .word-link:focus-visible .o-letter { opacity: 0; }
        .word-link:hover .o-photo,
        .word-link:focus-visible .o-photo {
          opacity: 1;
          transform: translate(-50%, -50%) scale(1);
        }

        @media (prefers-reduced-motion: reduce) {
          .film-panel,
          .word-link,
          .seg,
          .o-photo { transition: opacity 200ms ease; }
          .word-link { transform: none !important; }
          .o-photo { transform: translate(-50%, -50%) scale(1) !important; }
        }
      `}</style>
    </>
  );
}
