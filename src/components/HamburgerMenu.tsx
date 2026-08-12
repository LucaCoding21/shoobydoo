"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";

gsap.registerPlugin(useGSAP, CustomEase);

// The whole open state is a faithful port of olivierlarose/nav-menu: the panel
// drops in via height 0 -> auto, a backdrop dims the page downward, each word's
// letters rise from below (staggered per word), and the footer meta rises in
// last after a hold. The tutorial drives this with Framer Motion on
// cubic-bezier(0.76, 0, 0.24, 1); we reproduce the exact curve as a GSAP
// CustomEase so the motion matches with the project's own animation lib.
CustomEase.create("navMenu", "M0,0 C0.76,0 0.24,1 1,1");
const EASE = "navMenu";

// Real site routes. Each carries two portrait photos from one event folder,
// shown side by side on the right when the link is hovered/focused.
type NavLink = {
  title: string;
  href: string;
  imgs: readonly [string, string];
};

// Two portrait (2:3) shots per link, from the same folder, shown uncropped.
const LINKS: readonly NavLink[] = [
  {
    title: "WORK",
    href: "/",
    imgs: [
      "/events/insomnia-2025/_DSC2208-Enhanced-NR.jpg",
      "/events/insomnia-2025/_DSC2728-Enhanced-NR.jpg",
    ],
  },
  {
    title: "ABOUT",
    href: "/about",
    imgs: [
      "/events/nghtmre/_DSC9026-Enhanced-NR.jpg",
      "/events/nghtmre/_DSC9096-Enhanced-NR.jpg",
    ],
  },
  {
    title: "CONTACT",
    href: "/contact",
    imgs: [
      "/events/phrva/7R403291-Enhanced-NR.jpg",
      "/events/phrva/7R403318-Enhanced-NR.jpg",
    ],
  },
];

// Footer meta lines — mirror the site Footer's "Connect" column, in the same
// small-caps label/value form the tutorial's footer uses.
const META: readonly { label: string; value: string }[] = [
  { label: "Follow", value: "@shoobydoofruitsnacks" },
  { label: "Email", value: "shoobydoofruitsnacks@gmail.com" },
];

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// Each letter is its own inline-block span so it can be translated up out of the
// clipping <p>. Spaces become non-breaking so they keep their width in flex.
function splitChars(word: string) {
  return word.split("").map((c, i) => (
    <span key={i} className="nav-char">
      {c === " " ? " " : c}
    </span>
  ));
}

// `introMask`: only the homepage hero sets this. It makes the [MENU] button
// clip its label and start it hidden below the fold, so HeroSequence's intro
// timeline can rise the label in 1:1 sync with the centred nav logo. Elsewhere
// the button shows immediately (no mask), so the default is off.
export default function HamburgerMenu({
  introMask = false,
}: {
  introMask?: boolean;
}) {
  const [open, setOpen] = useState(false);
  // Which link is hovered/focused: drives the cross-link blur and the preview
  // image, exactly like the tutorial's selectedLink state.
  const [selected, setSelected] = useState<{ active: boolean; index: number }>({
    active: false,
    index: 0,
  });
  const pathname = usePathname();

  const scope = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);

  // Refs for focus management: the toggle/close button, the in-menu logo, and
  // each word link.
  const buttonRef = useRef<HTMLButtonElement>(null);
  const logoRef = useRef<HTMLAnchorElement>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  // Initial hidden state. GSAP owns the char/meta transforms (no CSS transform
  // to fight with), and the closed panel — height 0, overflow hidden — keeps
  // everything clipped before JS runs, so there's no flash.
  useGSAP(
    () => {
      gsap.set([".nav-menu", ".nav-backdrop"], { height: 0 });
      gsap.set([".nav-char", ".nav-meta-line"], { yPercent: 100, opacity: 0 });
      // Logo masks like the hero wordmark: 120% (not 100%) so the tops of the
      // letters don't peek past the clip box.
      gsap.set(".nav-logo-inner", { yPercent: 120, opacity: 0 });
    },
    { scope },
  );

  // Animate on every `open` flip. Each pass tweens from the current state to the
  // target, so rapid toggles redirect smoothly. Rebuilding per toggle (instead
  // of reversing one paused timeline) keeps it robust under React's dev
  // double-invocation — the prior approach left letters stuck at yPercent:100.
  useGSAP(
    () => {
      // Nothing to animate on the very first render (already hidden).
      if (firstRender.current) {
        firstRender.current = false;
        if (!open) return;
      }

      const root = scope.current!;
      const reduced = prefersReducedMotion();
      const tl = gsap.timeline({ defaults: { ease: EASE } });

      if (open) {
        const d = reduced ? 0.2 : 1;
        // Panel drops open; backdrop dims downward.
        tl.to(".nav-menu", { height: "auto", duration: d }, 0).to(
          ".nav-backdrop",
          { height: "100vh", duration: d },
          0,
        );
        // Logo rises in at top-left, in step with the panel.
        tl.to(".nav-logo-inner", { yPercent: 0, opacity: 1, duration: d }, 0);
        // Letters rise from y:100%, staggered within each word; every word
        // starts together at t=0 (tutorial restarts the stagger per link).
        gsap.utils.toArray<HTMLElement>(".nav-link", root).forEach((link) => {
          tl.to(
            link.querySelectorAll(".nav-char"),
            {
              yPercent: 0,
              opacity: 1,
              duration: d,
              stagger: reduced ? 0 : 0.02,
            },
            0,
          );
        });
        // Footer meta rises in last, after a hold.
        tl.to(
          ".nav-meta-line",
          {
            yPercent: 0,
            opacity: 1,
            duration: d,
            stagger: reduced ? 0 : 0.03,
          },
          reduced ? 0 : 0.3,
        );
      } else {
        // Close slow enough to actually watch each piece leave (the thing that
        // makes the inspiration feel good): letters slide back down and the
        // meta fades — staggered, so you see them go — while the panel and
        // backdrop take a full ~1s to collapse around them.
        const collapse = reduced ? 0.2 : 1;
        const content = reduced ? 0.2 : 0.7;
        gsap.utils.toArray<HTMLElement>(".nav-link", root).forEach((link) => {
          tl.to(
            link.querySelectorAll(".nav-char"),
            {
              yPercent: 100,
              opacity: 0,
              duration: content,
              stagger: reduced ? 0 : 0.02,
            },
            0,
          );
        });
        tl.to(
          ".nav-meta-line",
          {
            yPercent: 100,
            opacity: 0,
            duration: content,
            stagger: reduced ? 0 : 0.03,
          },
          0,
        )
          .to(
            ".nav-logo-inner",
            { yPercent: 120, opacity: 0, duration: content },
            0,
          )
          .to(".nav-backdrop", { height: 0, duration: collapse }, 0)
          .to(".nav-menu", { height: 0, duration: collapse }, 0);
      }
    },
    { scope, dependencies: [open] },
  );

  useEffect(() => {
    if (!open) return;

    // Move focus into the dialog (first item) when it opens.
    linkRefs.current[0]?.focus();

    // Tab order through the open menu: close button, then the word links.
    const order = (): HTMLElement[] =>
      [buttonRef.current, logoRef.current, ...linkRefs.current].filter(
        Boolean,
      ) as HTMLElement[];

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
    const toggle = buttonRef.current;
    return () => {
      window.removeEventListener("keydown", onKey);
      // Return focus to the toggle when the menu closes.
      toggle?.focus();
    };
  }, [open]);

  return (
    <div ref={scope} className="contents">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        className={`menu-toggle fixed top-7 right-5 sm:right-7 z-[60] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 rounded${
          introMask ? " menu-clip" : ""
        }`}
      >
        {/* [MENU] / [CLOSE]. The brackets are static; the word rolls between the
            two states on click — MENU on top, CLOSE below, the track pushes up
            one line when open so CLOSE rises from the bottom. */}
        <span
          aria-hidden
          className={`menu-label${introMask ? " menu-intro-initial" : ""}`}
        >
          <span className="menu-bracket">[</span>
          <span className="label-clip">
            <span className="label-track" data-open={open}>
              <span className="label-line">MENU</span>
              <span className="label-line">CLOSE</span>
            </span>
          </span>
          <span className="menu-bracket">]</span>
        </span>
      </button>

      {/* In-menu logo — the Shoobydoo wordmark on the LEFT, shown only while the
          menu is open (the centred site logo sits behind the panel). */}
      <Link
        ref={logoRef}
        href="/"
        onClick={() => setOpen(false)}
        aria-label="Shoobydoo, home"
        aria-hidden={!open}
        tabIndex={open ? 0 : -1}
        data-open={open}
        className="nav-logo fixed top-7 left-5 sm:left-7 z-[60] select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 rounded"
      >
        <span className="nav-logo-inner">Shoobydoo</span>
      </Link>

      {/* Dimming backdrop — grows downward behind the panel; click to close. */}
      <div
        className="nav-backdrop fixed inset-x-0 top-0 z-40"
        data-open={open}
        onClick={() => setOpen(false)}
        aria-hidden
      />

      {/* Full-width panel that drops in from the top. */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        inert={!open}
        data-open={open}
        className="nav-menu fixed inset-x-0 top-0 z-50 bg-[#0e0f12]"
      >
        <div className="nav-wrapper">
          <div className="nav-container">
            <div className="nav-body">
              {LINKS.map((item, i) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.title}
                    ref={(el) => {
                      linkRefs.current[i] = el;
                    }}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    onMouseEnter={() => setSelected({ active: true, index: i })}
                    onMouseLeave={() => setSelected({ active: false, index: i })}
                    aria-current={active ? "page" : undefined}
                    className="nav-link-wrap focus:outline-none"
                  >
                    {/* Other links blur out while one is hovered. */}
                    <p
                      className="nav-link"
                      data-dim={selected.active && selected.index !== i}
                    >
                      {splitChars(item.title)}
                    </p>
                  </Link>
                );
              })}
            </div>

            <div className="nav-foot">
              {META.map((m) => (
                <div className="nav-meta" key={m.label}>
                  <span className="nav-meta-line">
                    <span className="nav-meta-label">{m.label}:</span> {m.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Preview — two portrait shots from the focused link's event
              folder, side by side (desktop only). */}
          <div
            className="nav-image hidden lg:flex"
            data-active={selected.active}
            aria-hidden
          >
            {LINKS[selected.index].imgs.map((src) => (
              <div className="nav-photo" key={src}>
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="200px"
                  quality={75}
                  style={{ objectFit: "cover" }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .menu-toggle {
          display: inline-flex;
          align-items: flex-start;
          cursor: pointer;
        }

        /* Homepage-only intro mask. The button becomes the clip window and the
           label rises out of it via GSAP, mirroring the nav logo's wrapper
           (overflow hidden + 0.2em paddingBottom, with the label set to
           yPercent:120 so it clears the padded box). */
        .menu-toggle.menu-clip {
          overflow: hidden;
          padding-bottom: 0.2em;
        }
        /* No-flash backstop until GSAP flips visibility on (mirrors the hero
           title's .title-mask-initial). GSAP then owns the transform. */
        .menu-intro-initial {
          visibility: hidden;
        }

        /* [MENU] / [CLOSE] — same Fraunces display cut, weight, opsz and
           letter-spacing as the "SHOOBYDOO" wordmark, and aligned to the same
           top (1.75rem) so the two read as one line of type. */
        .menu-label {
          display: inline-flex;
          align-items: flex-start;
          line-height: 1;
          font-family: var(--font-fraunces), Georgia, serif;
          font-weight: 400;
          font-variation-settings: "opsz" 144, "SOFT" 100;
          font-size: clamp(0.78rem, 3.3vw, 1.05rem);
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #ededeb;
        }
        @media (min-width: 768px) {
          .menu-label { font-size: clamp(0.85rem, 1.2vw, 1.2rem); }
        }
        .menu-bracket {
          display: inline-block;
          line-height: 1;
        }
        /* One-line clip window; the track holds two stacked copies of the word
           so hover can roll a fresh one up from below. Only the word lives in
           here — the brackets sit outside and stay put. */
        .label-clip {
          display: inline-block;
          overflow: hidden;
          height: 1em;
          line-height: 1;
        }
        .label-track {
          display: block;
          /* Buttery ease-in-out: eases in gently so the roll starts slow and
             soft on click, glides through the middle, then settles without
             snapping at the end. */
          transition: transform 950ms cubic-bezier(0.62, 0.03, 0.26, 1);
        }
        .label-line {
          display: block;
          height: 1em;
          line-height: 1;
          white-space: nowrap;
        }
        /* Push-from-bottom flip: when open, roll the word up one line so CLOSE
           rises into view from below. */
        .label-track[data-open="true"] {
          transform: translateY(-1em);
        }

        /* ── Open state (olivierlarose/nav-menu) ─────────────────────────── */

        /* In-menu logo — top-left wordmark matching the site wordmark's type.
           The outer link is a clip mask; the inner span rises in via GSAP like
           the link words. Clicks are gated to the open state. */
        .nav-logo {
          overflow: hidden;
          font-family: var(--font-fraunces), Georgia, serif;
          font-weight: 400;
          font-variation-settings: "opsz" 144, "SOFT" 100;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          line-height: 1;
          color: #ededeb;
          font-size: clamp(0.9rem, 4vw, 1.25rem);
          white-space: nowrap;
          padding-bottom: 0.2em;
          pointer-events: none;
        }
        @media (min-width: 768px) {
          .nav-logo { font-size: clamp(1rem, 1.5vw, 1.5rem); }
        }
        .nav-logo[data-open="true"] { pointer-events: auto; }
        /* GSAP solely owns the transform (yPercent) — a CSS transform here would
           reappear when GSAP's context reverts and freeze the logo offscreen.
           opacity:0 is just the no-flash backstop until gsap.set runs. */
        .nav-logo-inner {
          display: inline-block;
          opacity: 0;
        }

        /* Dim layer behind the panel. Height is animated by GSAP 0 -> 100vh; it
           only catches clicks once open. */
        .nav-backdrop {
          height: 0;
          overflow: hidden;
          background: rgba(0, 0, 0, 0.5);
          pointer-events: none;
        }
        .nav-backdrop[data-open="true"] { pointer-events: auto; }

        /* The drop-down panel. Height is animated by GSAP 0 -> auto. */
        .nav-menu {
          height: 0;
          overflow: hidden;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .nav-wrapper {
          display: flex;
          gap: 50px;
          padding: 6.5rem 6vw 2.5rem;
          align-items: flex-start;
        }
        .nav-container {
          flex: 1 1 auto;
          min-width: 0;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        /* Big display words. Desktop flows them in a wrapping row, just like
           the tutorial; below lg they stack vertically at display size so the
           menu fills the phone screen instead of cramming three words into
           one line. */
        .nav-body {
          display: flex;
          flex-wrap: wrap;
          margin-top: 1rem;
        }
        @media (max-width: 1023px) {
          .nav-body {
            flex-direction: column;
            margin-top: 0.5rem;
          }
        }
        .nav-link-wrap {
          color: #ededeb;
          text-decoration: none;
          text-transform: uppercase;
        }
        .nav-link {
          margin: 0;
          display: flex;
          overflow: hidden;
          padding-right: 30px;
          padding-top: 10px;
          font-family: var(--font-fraunces), Georgia, serif;
          font-weight: 400;
          font-variation-settings: "opsz" 144, "SOFT" 100;
          font-size: 2rem;
          line-height: 1.05;
          letter-spacing: 0.02em;
          color: #ededeb;
          /* Blur out while another link is hovered. Slow, eased ramp (expo-out
             curve) so the focus pull-in glides rather than snapping. */
          transition: filter 650ms cubic-bezier(0.16, 1, 0.3, 1),
            opacity 650ms cubic-bezier(0.16, 1, 0.3, 1);
        }
        .nav-link[data-dim="true"] {
          filter: blur(4px);
          opacity: 0.55;
        }
        /* GSAP sets the hidden start state (yPercent:100, opacity:0); the
           closed panel clips it until then. */
        .nav-char {
          display: inline-block;
        }

        /* Footer meta — same Arial small-caps as the site Footer column labels;
           each line rides up out of its clip on open. */
        .nav-foot {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem 2.5rem;
          margin-top: 2.5rem;
        }
        .nav-meta { overflow: hidden; }
        .nav-meta-line {
          display: inline-block;
          font-family: Arial, Helvetica, sans-serif;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: #ededeb;
        }
        .nav-meta-label { color: rgba(237, 237, 235, 0.4); }

        /* Hover preview, right of the words (desktop only): two equal 2:3
           portrait frames side by side, matching the vertical event photos so
           each shot shows uncropped while staying compact. */
        .nav-image {
          gap: 14px;
          opacity: 0;
          transition: opacity 350ms ease;
        }
        .nav-image[data-active="true"] { opacity: 1; }
        .nav-photo {
          position: relative;
          flex: none;
          width: 200px;
          height: 300px;
          overflow: hidden;
        }

        /* Below lg the stacked words go display-size (see .nav-body above). */
        @media (max-width: 1023px) {
          .nav-link {
            font-size: clamp(2.7rem, 13vw, 4rem);
            padding-top: 1.1rem;
            padding-right: 0;
          }
        }

        @media (min-width: 1024px) {
          .nav-wrapper { justify-content: space-between; }
          .nav-body { max-width: 1200px; margin-top: 2rem; }
          .nav-link { font-size: 5vw; padding-right: 2vw; }
        }

        @media (prefers-reduced-motion: reduce) {
          .label-track { transition: none; }
          .nav-link, .nav-image { transition: opacity 200ms ease; }
        }
      `}</style>
    </div>
  );
}
