"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { EVENT_BY_HOME_THUMB, EVENTS, type EventData } from "@/data/events";
import HamburgerMenu from "@/components/HamburgerMenu";
import { onIntroGateOpen } from "@/lib/introGate";
import { beginEventTransition } from "@/lib/eventTransition";

gsap.registerPlugin(useGSAP, ScrollTrigger);

// Photos that rush past during the intro. The optimized /thumbnails are
// interleaved with a handful of full-size event-gallery shots so the rush
// rotates through more variety than the 6 grid thumbnails alone. Next.js
// downscales each to ~20vw, so the larger source files don't cost much.
// IMPORTANT: the LAST entry must be the landing photo (LANDING_SRC) — on
// mobile the rush column morphs its final slide into the grid, and that
// measurement assumes the last slide is the landing thumbnail.
const RUSH_SLIDES = [
  { src: "/thumbnails/nghtmre-harbour.jpg", alt: "NGHTMRE at Harbour" },
  { src: "/events/insomnia-2026/_7R46204-Enhanced-NR.jpg", alt: "Insomnia 2026" },
  { src: "/thumbnails/viperactive-harbour.jpg", alt: "viperactive at Harbour" },
  { src: "/events/nghtmre/_DSC9126-Enhanced-NR.jpg", alt: "NGHTMRE at Harbour" },
  { src: "/thumbnails/insomnia-2026.jpg", alt: "Insomnia 2026" },
  { src: "/events/restricted/7R403147-Enhanced-NR.jpg", alt: "Restricted at Harbour" },
  { src: "/thumbnails/restricted-harbour.jpg", alt: "Restricted at Harbour" },
  { src: "/events/viperactive/_7R48078-Enhanced-NR.jpg", alt: "viperactive at Harbour" },
  { src: "/thumbnails/phrva-village-studios.jpg", alt: "PHRVA at Village Studios" },
  { src: "/events/insomnia-2025/_DSC3556-Enhanced-NR.jpg", alt: "Insomnia 2025" },
  { src: "/events/insomnia-2026/_7R46714.jpg", alt: "Insomnia 2026" },
  { src: "/thumbnails/insomnia-2025.jpg", alt: "Insomnia 2025" },
] as const;

const LANDING_SRC = "/thumbnails/insomnia-2025.jpg";

// Mobile rushes a shorter column: phones pay full-viewport-width decode cost
// per slide, and the 3s rush flies past too fast to register 12 distinct
// photos anyway. Must still END on the landing slide — the morph into the
// grid measures the last slide. Desktop keeps the full set for its 3 strips.
const MOBILE_RUSH_SLIDES = [
  ...RUSH_SLIDES.slice(0, 7),
  RUSH_SLIDES[RUSH_SLIDES.length - 1],
] as const;

// The rush is the first thing revealed when the preloader curtain lifts, so the
// Preloader warms exactly these sources (at the rush's render sizes) to decode
// them before the hand-off — single source of truth so the two never drift.
export const RUSH_SLIDE_SRCS = RUSH_SLIDES.map((s) => s.src);
export const MOBILE_RUSH_SLIDE_SRCS = MOBILE_RUSH_SLIDES.map((s) => s.src);

// Grid + hover metadata are DERIVED from EVENTS so every event gets its own
// unique tile (no repeats) and new events appear on the home page automatically
// with no extra wiring here. Order follows EVENTS, except the landing photo is
// pulled up to index 1 (top row) so the mobile intro morph always lands in view.
const EVENT_LIST = Object.values(EVENTS) as EventData[];

// "NGHTMRE at Harbour" -> "NGHTMRE"; "INSOMNIA 2025" -> "INSOMNIA".
function displayName(title: string): string {
  return title.split(" at ")[0].replace(/\s+\d{4}$/, "").toUpperCase();
}

// Per-photo metadata shown under each tile on hover. Keyed by thumbnail src.
// Tagline format is "Venue Date" — one template for concerts, festivals, and
// future editorial galleries.
const PHOTO_META: Record<string, { name: string; tagline: string }> =
  Object.fromEntries(
    EVENT_LIST.map((e) => [
      e.homeThumbSrc,
      { name: displayName(e.title), tagline: `${e.venue} ${e.date}` },
    ]),
  );

// Grid order, left-to-right, top-to-bottom, `cols` across (4 desktop / 2 mobile).
// The grid grows as many rows as needed and scrolls; the section height below
// scales with the row count. Landing photo (LANDING_SRC) is placed at index 1.
const GRID: { src: string; alt: string }[] = (() => {
  const landing = EVENT_LIST.find((e) => e.homeThumbSrc === LANDING_SRC);
  const others = EVENT_LIST.filter((e) => e.homeThumbSrc !== LANDING_SRC);
  const ordered = landing
    ? [others[0], landing, ...others.slice(1)].filter(Boolean)
    : EVENT_LIST;
  return (ordered as EventData[]).map((e) => ({
    src: e.homeThumbSrc,
    alt: e.title,
  }));
})();

// Desktop rush column motion. Shared between the initial inline transform (so
// the first painted frame already matches the rush start — no jump when GSAP
// takes over after the fonts load) and the GSAP timeline itself. `travel` is
// RUSH_TRAVEL_VH% of the viewport height; each column eases from `start` to
// `end` (as fractions of travel). Columns 1 & 3 net upward, column 2 downward —
// the up / down / up rhythm. Stagger keeps the three off the same row.
const RUSH_TRAVEL_VH = 260;
const RUSH_COLS = [
  { offset: 0, start: 0.6, end: -0.6 },
  { offset: 2, start: -0.6, end: 0.6 },
  { offset: 4, start: 0.5, end: -0.7 },
] as const;

// Build a column's photo stack for the desktop 3-strip rush: rotate the slide
// order by `offset` so adjacent columns don't show the same photo in the same
// row, then double it so the column is always taller than the viewport plus the
// scroll travel (no edge is ever exposed mid-rush).
function rushColumn(offset: number) {
  const rotated = RUSH_SLIDES.map(
    (_, i) => RUSH_SLIDES[(i + offset) % RUSH_SLIDES.length],
  );
  return [...rotated, ...rotated];
}

// One vertical strip of the desktop rush. Taller than the viewport and
// vertically centred (justify-center) so the GSAP transform on `trackRef` can
// scroll it up or down without ever exposing a top/bottom edge.
function RushColumn({
  trackRef,
  colIndex,
}: {
  trackRef: React.RefObject<HTMLDivElement | null>;
  colIndex: number;
}) {
  const { offset, start } = RUSH_COLS[colIndex];
  // Pre-position at the rush START offset on first paint (same value GSAP sets,
  // expressed in vh) so the column doesn't jump to a different photo when the
  // timeline takes over.
  const startVh = RUSH_TRAVEL_VH * start;
  return (
    <div
      className="relative flex flex-col justify-center overflow-hidden"
      style={{ width: "30vh" }}
    >
      <div
        ref={trackRef}
        className="w-full flex flex-col items-center gap-[2vh]"
        style={{
          willChange: "transform",
          transform: `translate3d(0, ${startVh}vh, 0)`,
        }}
      >
        {rushColumn(offset).map((slide, i) => (
          <div
            key={`${offset}-${slide.src}-${i}`}
            className="relative w-full flex-shrink-0 aspect-[2/3] overflow-hidden rounded-sm"
          >
            <Image
              src={slide.src}
              alt=""
              aria-hidden
              fill
              preload={i < 2}
              quality={90}
              sizes="20vw"
              style={{ objectFit: "cover" }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// Module-scoped flag: persists across client-side navigations (going to an
// /events/[slug] page and back remounts this component but keeps the same JS
// runtime) yet resets on a hard refresh (new runtime). That gives us exactly
// the desired behaviour — intro plays on every reload, skips on back-nav.
// sessionStorage can't do this: it survives reloads too, so the intro would
// never replay after the first visit.
let introPlayed = false;

export default function HeroSequence() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const rushLayerRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const landingRushRef = useRef<HTMLDivElement>(null);
  // Desktop rush uses three side-by-side columns (mobile keeps the single
  // `trackRef` column). One ref per column so the timeline can scroll each
  // independently — up / down / up.
  const strip1Ref = useRef<HTMLDivElement>(null);
  const strip2Ref = useRef<HTMLDivElement>(null);
  const strip3Ref = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLSpanElement>(null);
  const swordRef = useRef<HTMLDivElement>(null);
  const cornerFrameRef = useRef<HTMLDivElement>(null);
  const hasFrameAppeared = useRef(false);

  const hasRunRush = useRef(false);
  const [phase, setPhase] = useState<"rush" | "reveal" | "done">("rush");
  const [isMobile, setIsMobile] = useState(false);
  const [isReady, setIsReady] = useState(false);
  // The rush doesn't begin until the 0→100 preloader lifts away. On a hard load
  // this opens when the curtain starts its exit; on client-nav (gate already
  // open) it resolves synchronously, so nothing waits. See lib/introGate.
  const [gateOpen, setGateOpen] = useState(false);
  // Photos are not hoverable during the intro: while the rush + wipes are
  // running there's no real photo under the cursor yet, so showing the corner
  // brackets over an unrevealed tile reads as broken. Flipped to true 1s after
  // the wipes complete.
  const [canHover, setCanHover] = useState(false);
  // Index of the photo currently under the cursor (or null). Drives the HUD
  // swap from nav buttons → photo name + description.
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  // Gates pointer events on the corner [MENU] button. Flipped on at the same
  // beat the menu starts its slide-up (settled+1.9) so it can't be clicked
  // while still clipped out of view. Visual reveal itself is GSAP-driven, in
  // the same tween as the nav logo — see the `introMask` wiring below.
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);

    // Wait for fonts (especially the custom Drowner display font) before starting the
    // intro so measurements and layout are stable.
    if (typeof document !== "undefined" && document.fonts?.ready) {
      document.fonts.ready.then(() => setIsReady(true));
    } else {
      setIsReady(true);
    }

    return () => window.removeEventListener("resize", check);
  }, []);

  // Hold the intro until the preloader opens the gate.
  useEffect(() => onIntroGateOpen(() => setGateOpen(true)), []);

  useEffect(() => {
    // Only lock scroll during the rush. Once the rush hands off ("reveal"),
    // let the user scroll even though the photo wipes / title slide-up are
    // still in flight — those animations don't care about scroll.
    if (phase !== "rush") {
      // Scroll just unlocked: the page was overflow:hidden during the rush, so
      // ScrollTrigger cached a zero scroll range. Re-measure so the third-row
      // reveal triggers fire as the visitor scrolls down.
      ScrollTrigger.refresh();
      return;
    }
    const prevHtml = document.documentElement.style.overflow;
    const prevBody = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = prevHtml;
      document.body.style.overflow = prevBody;
    };
  }, [phase]);

  // Shared corner-bracket frame: a single set of 4 L-shaped corners that
  // tracks the last-hovered photo. Stays on that photo after mouse-leave so
  // there is always a "selected" target visible; on next hover it glides to
  // the new photo with momentum (power3.out).
  const handlePhotoEnter = (e: React.MouseEvent<HTMLElement>) => {
    const photo = e.currentTarget;
    const frame = cornerFrameRef.current;
    const grid = gridRef.current;
    if (!frame || !grid) return;

    const photoRect = photo.getBoundingClientRect();
    const gridRect = grid.getBoundingClientRect();
    // Frame box is sized to the photo's NATURAL rect. The inner .corner-frame-scaler
    // is scaled to 1.04 via CSS (transition synced with the photo's hover scale),
    // so the brackets enlarge in lock-step with the photo instead of snapping to
    // the post-scale size.
    const w = photoRect.width;
    const h = photoRect.height;
    const cx = photoRect.left + photoRect.width / 2 - gridRect.left;
    const cy = photoRect.top + photoRect.height / 2 - gridRect.top;
    const x = cx - w / 2;
    const y = cy - h / 2;

    if (!hasFrameAppeared.current) {
      gsap.set(frame, { x, y, width: w, height: h });
      gsap.to(frame, { opacity: 1, duration: 0.3, ease: "power2.out" });
      hasFrameAppeared.current = true;
    } else {
      gsap.to(frame, {
        x,
        y,
        width: w,
        height: h,
        duration: 0.6,
        ease: "power3.out",
        overwrite: "auto",
      });
    }

    // Camera-follow: if the hovered photo (or the label beneath it) is
    // clipped by the viewport, smoothly scroll just enough to bring it
    // into view. We don't recenter — only nudge when something's cut off,
    // so the user keeps control of their own scrolling.
    const vh = window.innerHeight;
    const labelBuffer = 72; // px below the photo to fit the hover label + a little air
    const topBuffer = 48;   // px above the photo
    const bottomOverflow = photoRect.bottom + labelBuffer - vh;
    const topOverflow = topBuffer - photoRect.top;
    let scrollDelta = 0;
    if (bottomOverflow > 0) scrollDelta = bottomOverflow;
    else if (topOverflow > 0) scrollDelta = -topOverflow;
    if (scrollDelta !== 0) {
      window.scrollBy({ top: scrollDelta, behavior: "smooth" });
    }
  };

  useGSAP(
    () => {
      if (!isReady || !gateOpen || hasRunRush.current) return;
      hasRunRush.current = true;

      const rushLayer = rushLayerRef.current!;
      const frame = frameRef.current!;
      const grid = gridRef.current!;
      const gridItems = Array.from(grid.querySelectorAll<HTMLDivElement>(".grid-thumb"));
      const landingGridItem = gridItems.find(
        (el) => el.dataset.src === LANDING_SRC,
      )!;
      const otherGridItems = gridItems.filter((el) => el !== landingGridItem);

      const reduce = prefersReducedMotion();
      // Skip the intro when we've already played it in this runtime — i.e. the
      // user navigated to a gallery and came back. A hard refresh starts a new
      // runtime, so `introPlayed` is false again and the intro replays.
      const skipIntro = introPlayed;
      const rushDuration = isMobile ? 3.0 : 3.2;
      const ease = "power4.inOut";
      // Mobile: one centred column. Desktop: a wider window for the 3 strips.
      const initialClip = isMobile
        ? "inset(15% 8% round 12px)"
        : "inset(10% 5% round 14px)";

      const titleEl = titleRef.current!;
      // The corner [MENU] button's label (rendered by HamburgerMenu, which sits
      // inside this scope). Driven in the SAME tween as the title so the two
      // wordmarks rise in perfect 1:1 sync. Queried rather than ref'd since it
      // lives in a child component.
      const menuLabel =
        containerRef.current!.querySelector<HTMLElement>(".menu-label");

      gsap.set(frame, { clipPath: initialClip, force3D: true });
      gsap.set(grid, { opacity: 0 });
      gsap.set(gridItems, { opacity: 0 });
      // 120% (not 100%) because the wrapper's 0.2em paddingBottom expands the
      // clip box past the span — at yPercent:100 the top ~20% of letters peek out.
      gsap.set(titleEl, { yPercent: 120, visibility: "visible" });
      if (menuLabel) gsap.set(menuLabel, { yPercent: 120, visibility: "visible" });
      gsap.set(swordRef.current, { opacity: 0 });

      if (reduce || skipIntro) {
        gsap.set(rushLayer, { display: "none" });
        gsap.set([grid, ...gridItems], { opacity: 1, scale: 1, x: 0, y: 0 });
        gsap.set(titleEl, { yPercent: 0 });
        if (menuLabel) gsap.set(menuLabel, { yPercent: 0, visibility: "visible" });
        gsap.set(swordRef.current, { opacity: 0.15 });
        setPhase("done");
        setCanHover(true);
        setShowMenu(true);
        introPlayed = true;
        return;
      }

      // Directional clip-path wipes, shared by the intro reveal (top rows) and
      // the scroll-triggered reveal (below-fold rows) set up just below.
      const WIPES = [
        "inset(0% 100% 0% 0%)", // left-to-right
        "inset(0% 0% 0% 100%)", // right-to-left
        "inset(100% 0% 0% 0%)", // bottom-to-top
        "inset(0% 0% 100% 0%)", // top-to-bottom
        "inset(0% 0% 0% 100%)", // right-to-left
        "inset(0% 100% 0% 0%)", // left-to-right
        "inset(0% 0% 100% 0%)", // top-to-bottom
      ];
      const TARGET = "inset(0% 0% 0% 0%)";

      // Desktop crossfades the whole rush layer out, so the landing photo just
      // wipes in like every other tile. Mobile still morphs the landing photo
      // out of the rush column into its slot, so it's excluded from the wipes.
      const wipeSource = isMobile ? otherGridItems : gridItems;

      // Split the wipe thumbs by whether they sit in the opening fold.
      // The grid is centred in a 149vh section, so the third row lives ~107vh
      // down — well below the fold. Measured here, before anything moves and
      // while scroll is still pinned at the top, so the split reflects what the
      // visitor can actually see. Rows in view wipe as part of the intro; the
      // rest are held clipped and wipe in only when scrolled into view.
      const foldLine = window.innerHeight * 0.95;
      const introItems: HTMLDivElement[] = [];
      const scrollItems: HTMLDivElement[] = [];
      wipeSource.forEach((item) => {
        const inFold = item.getBoundingClientRect().top < foldLine;
        (inFold ? introItems : scrollItems).push(item);
      });

      // Below-the-fold thumbs: same clip-path wipe, fired by scroll position
      // rather than the intro timeline. once:true so they don't replay on
      // scroll-back. Created here (not inside the timeline's hand-off call) so
      // useGSAP's context owns and cleans up these ScrollTriggers on unmount.
      scrollItems.forEach((item, idx) => {
        const from = WIPES[idx % WIPES.length];
        gsap.set(item, { opacity: 1, clipPath: from, WebkitClipPath: from });
        gsap.to(item, {
          clipPath: TARGET,
          WebkitClipPath: TARGET,
          duration: 1.2,
          ease: "power3.inOut",
          scrollTrigger: { trigger: item, start: "top 82%", once: true },
        });
      });

      const tl = gsap.timeline();

      // Act 1 — Rush
      if (isMobile) {
        // Single centred column scrolls up until the landing photo is centred.
        const track = trackRef.current!;
        const landingRush = landingRushRef.current!;
        const slideCenter = landingRush.offsetTop + landingRush.offsetHeight / 2;
        const scrollTarget = window.innerHeight / 2 - slideCenter;
        gsap.set(track, { y: 0, force3D: true });
        tl.to(track, { y: scrollTarget, duration: rushDuration, ease }, 0);
      } else {
        // Three columns rush at once: outer two upward, middle one downward —
        // an up / down / up rhythm. Each column is taller than the viewport and
        // vertically centred, so translating it by a fraction of a screen never
        // exposes an edge. Start/end offsets are staggered so the columns don't
        // show the same row at the same moment.
        // Start/end offsets and travel come from RUSH_COLS so they match the
        // inline transform RushColumn paints on first load (no jump). The columns
        // are far taller than `travel`, so neither end ever exposes an edge.
        const strips = [strip1Ref.current!, strip2Ref.current!, strip3Ref.current!];
        const travel = window.innerHeight * (RUSH_TRAVEL_VH / 100);
        strips.forEach((strip, i) => {
          gsap.set(strip, { y: travel * RUSH_COLS[i].start, force3D: true });
          tl.to(strip, { y: travel * RUSH_COLS[i].end, duration: rushDuration, ease }, 0);
        });
      }
      tl.to(frame, { clipPath: "inset(0%)", duration: rushDuration, ease }, 0);

      // Trigger the hand-off slightly before the rush technically ends, so the
      // hand-off absorbs the rush's deceleration tail instead of waiting for it
      // to fully stop.
      tl.addLabel("settled", rushDuration - 0.4);

      // Hand-off to the grid.
      tl.call(
        () => {
          if (isMobile) {
            // Morph: measure the landing grid item's natural slot and fly the
            // rush-end photo into it.
            const landingRush = landingRushRef.current!;
            const rushRect = landingRush.getBoundingClientRect();
            const gridRect = landingGridItem.getBoundingClientRect();
            const dx =
              rushRect.left + rushRect.width / 2 - (gridRect.left + gridRect.width / 2);
            const dy =
              rushRect.top + rushRect.height / 2 - (gridRect.top + gridRect.height / 2);
            const scale = rushRect.height / gridRect.height;

            gsap.set(landingGridItem, { x: dx, y: dy, scale, opacity: 1, transformOrigin: "center center" });
            gsap.set(rushLayer, { display: "none" });
            gsap.set(grid, { opacity: 1 });

            gsap.to(landingGridItem, {
              x: 0,
              y: 0,
              scale: 1,
              duration: 1.2,
              ease: "power3.inOut",
            });
          } else {
            // Crossfade: reveal the grid underneath, then dissolve the still-
            // moving rush layer over it.
            gsap.set(grid, { opacity: 1 });
            gsap.to(rushLayer, {
              opacity: 0,
              duration: 0.8,
              ease: "power2.out",
              onComplete: () => gsap.set(rushLayer, { display: "none" }),
            });
          }

          // In-fold thumbs (the top rows) wipe now, as part of the intro; the
          // third row is held clipped and revealed on scroll (scrollItems above).
          // On desktop the wipe starts almost immediately so the grid is already
          // resolving as the rush fades; on mobile it trails the morph slightly.
          const wipeStart = isMobile ? 0.75 : 0.2;
          introItems.forEach((item, idx) => {
            const from = WIPES[idx % WIPES.length];
            gsap.set(item, {
              opacity: 1,
              clipPath: from,
              WebkitClipPath: from,
            });
            gsap.to(item, {
              clipPath: TARGET,
              WebkitClipPath: TARGET,
              duration: 1.5,
              ease: "power3.inOut",
              delay: wipeStart,
            });
          });
        },
        [],
        "settled",
      );

      // Mask + slide: title rises after the photo wipes finish (wipes end at
      // settled+1.85). settled+3.2 gives the grid ~1.35s of breathing room before
      // the title comes in, so the two reveals don't fight for attention. The
      // corner [MENU] label is animated in the SAME tween for an exact 1:1 sync.
      tl.to(
        menuLabel ? [titleEl, menuLabel] : titleEl,
        {
          yPercent: 0,
          duration: 2.3,
          ease: "expo.out",
        },
        "settled+=1.9",
      );
      // Enable clicks on the menu the instant it starts revealing.
      tl.call(() => setShowMenu(true), [], "settled+=1.9");

      // Fade sword in starting just before settled — by the time the rush layer
      // hands off, the sword is already at full opacity so it reads as if it
      // had always been there behind the photos.
      tl.to(
        swordRef.current,
        { opacity: 0.15, duration: 0.8, ease: "power2.out" },
        "settled-=0.2",
      );

      tl.call(() => setPhase("reveal"), [], "settled");
      // Wipes start at settled+0.75 and run 1.5s (end at settled+2.25). Give the
      // grid a 1s buffer after the wipes complete before enabling hover, so the
      // corner brackets can't appear over a still-unrevealed photo.
      tl.call(() => setCanHover(true), [], "settled+=3.25");
      tl.call(() => {
        setPhase("done");
        introPlayed = true;
      }, [], "settled+=4.4");
    },
    { scope: containerRef, dependencies: [isReady, gateOpen] },
  );

  return (
    <section
      ref={containerRef}
      className="relative w-full bg-[#0e0f12]"
      // Height scales with the number of grid rows so every event tile is
      // reachable by scrolling (4 tiles/row desktop, 2/row mobile). Calibrated
      // so the original 3-row (desktop) / 6-row (mobile) layout is unchanged.
      style={{
        minHeight: isMobile
          ? `${Math.ceil(GRID.length / 2) * 36 + 12}vh`
          : `${Math.ceil(GRID.length / 4) * 48 + 5}vh`,
      }}
      aria-label="Home"
    >
      {/* ════════════════════════════════════════════════════════════════════
          BACKGROUND LAYER — pinned to the viewport via position: sticky for
          the whole hero scroll. Persistent decorative elements live here so
          they stay in place while the photo grid scrolls past below.
          To add a new persistent bg element, drop it inside this wrapper.
          ════════════════════════════════════════════════════════════════════ */}
      <div className="sticky top-0 h-screen w-full overflow-hidden pointer-events-none z-10">
        {/* Sword — gothic backdrop, fades in once the rush ends. */}
        <div
          ref={swordRef}
          className="absolute pointer-events-none select-none"
          style={{
            top: "57vh",
            left: "50%",
            transform: "translate(-50%, -50%)",
            // Sword is 3:4 (1080×1440). Sizing by height with proportional
            // width keeps the aspect intact while letting it scale to the viewport.
            height: isMobile ? "55vh" : "75vh",
            aspectRatio: "1080 / 1440",
            opacity: 0,
            filter: "invert(1)",
            mixBlendMode: "screen",
          }}
        >
          <Image
            src="/sword-original.png"
            alt=""
            aria-hidden="true"
            fill
            quality={100}
            sizes={isMobile ? "55vh" : "75vh"}
            style={{ objectFit: "contain" }}
            preload
          />
        </div>

      </div>

      {/* Title — fixed top-centre logo: the homepage's animated counterpart to
          the static SiteWordmark used on other pages (same position + type so
          the logo reads identically). Outer div is the positioner + slide-up
          mask; the inner span is what GSAP drives. Wrapped in a Link so the
          logo navigates home. At z-40 so the open nav panel covers it — the
          menu shows its own left-aligned logo instead. */}
      <div
        className="fixed overflow-hidden text-[#ededeb] select-none leading-none z-40"
        style={{
          top: "1.75rem",
          left: "50%",
          transform: "translateX(-50%)",
          paddingBottom: "0.2em",
          fontFamily: "var(--font-fraunces), Georgia, serif",
          fontWeight: 400,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          // opsz 144 = display cut: more dramatic contrast, sharper details
          fontVariationSettings: "'opsz' 144, 'SOFT' 100",
          fontSize: isMobile ? "clamp(0.9rem, 4vw, 1.25rem)" : "clamp(1rem, 1.5vw, 1.5rem)",
          whiteSpace: "nowrap",
        }}
      >
        <Link href="/" aria-label="Shoobydoo — home" className="inline-block">
          <span
            ref={titleRef}
            className="title-mask-initial"
            style={{
              display: "inline-block",
              willChange: "transform",
            }}
          >
            Shoobydoo
          </span>
        </Link>
      </div>

      {/* ════════════════════════════════════════════════════════════════════
          SCROLLING CONTENT LAYER — photo grid that scrolls past the sticky
          background. Sits absolutely over the section so it occupies the
          full scroll height. Add other scroll-bound content here.
          ════════════════════════════════════════════════════════════════════ */}
      {/* Dim overlay — sits BELOW the photo grid (z-15) so it dims the sticky
          background (sword/title) and page behind the grid without ever covering
          a photo. Sibling photos are dimmed via filter brightness in CSS, not
          this overlay. Fades in/out via :has() in globals.css. */}
      <div
        aria-hidden
        className="dim-overlay fixed inset-0 z-[15] bg-black/70 pointer-events-none"
      />

      <div
        ref={gridRef}
        className={`photo-grid absolute inset-0 z-20 grid content-center justify-items-center ${
          isMobile
            ? "grid-cols-2 gap-x-[4vw] gap-y-[8vh] px-[5vw] pt-[11vh] pb-[8vh]"
            : "grid-cols-4 gap-x-[2.5vw] gap-y-[12vh] px-[6vw] pt-[11vh] pb-[6vh]"
        } ${canHover ? "" : "pointer-events-none"}`}
        style={{ opacity: 0 }}
      >
        {GRID.map((thumb, idx) => {
          const eventSlug = EVENT_BY_HOME_THUMB[thumb.src];
          const href = eventSlug ? `/events/${eventSlug}` : "/";
          return (
            <Link
              key={`${thumb.src}-${idx}`}
              href={href}
              prefetch={false}
              aria-label={`Open ${thumb.alt} gallery`}
              className="photo-card group relative aspect-[2/3] cursor-pointer hover:scale-[1.04] block"
              style={{ height: isMobile ? "28vh" : "36vh" }}
              onMouseEnter={(e) => {
                setHoveredIdx(idx);
                handlePhotoEnter(e);
                // Warm the destination route so the shared-element morph lands
                // on an already-rendered page (tiles opt out of viewport
                // prefetch; hover intent is the cheap middle ground).
                if (eventSlug) router.prefetch(href);
              }}
              onMouseLeave={() => setHoveredIdx(null)}
              onClick={(e) => {
                // Shared-element transition — desktop, plain left-click, motion
                // allowed. Everything else (mobile tap, cmd/ctrl/shift-click,
                // reduced motion, overlay not mounted) falls through to the
                // Link's default navigation.
                if (
                  isMobile ||
                  !eventSlug ||
                  prefersReducedMotion() ||
                  e.metaKey ||
                  e.ctrlKey ||
                  e.shiftKey ||
                  e.altKey ||
                  e.button !== 0
                )
                  return;
                const tile =
                  e.currentTarget.querySelector<HTMLDivElement>(".grid-thumb");
                const img = tile?.querySelector("img");
                if (!tile || !img) return;
                const r = tile.getBoundingClientRect();
                // The layer owns the navigation from here: it pushes the route
                // only once its scrim is fully opaque, so the page swap can
                // never flash through.
                const started = beginEventTransition({
                  src: img.currentSrc || thumb.src,
                  alt: thumb.alt,
                  rect: { top: r.top, left: r.left, width: r.width, height: r.height },
                  href,
                });
                if (started) e.preventDefault();
              }}
            >
              {/* Photo container — GSAP animates this (wipes, morph, fade). The
                  `grid-thumb` class and `data-src` attribute are what the
                  timeline queries to find/target each tile. */}
              <div
                data-src={thumb.src}
                className="grid-thumb absolute inset-0 overflow-hidden rounded-sm shadow-2xl"
                style={{ opacity: 0 }}
              >
                <Image
                  src={thumb.src}
                  alt={thumb.alt}
                  fill
                  quality={isMobile ? 75 : 95}
                  sizes={isMobile ? "40vw" : "15vw"}
                  style={{ objectFit: "cover" }}
                />
              </div>
              {/* Per-photo label — sits just below the image. Two-line
                  hierarchy: name (large serif) above tagline (small caps,
                  dimmed). Desktop: opacity driven by hoveredIdx so it can't
                  appear during the intro and only one shows at a time. Mobile
                  has no hover, so every label fades in once the intro's photo
                  wipes finish (canHover flips at the same beat) and stays —
                  the tiles read as a captioned index of events, not anonymous
                  photos. pointer-events-none so it never steals hover. */}
              <div
                aria-hidden
                className={`photo-label absolute left-1/2 -translate-x-1/2 pointer-events-none whitespace-nowrap flex flex-col items-center gap-1.5 transition-opacity duration-700 ${
                  canHover && (isMobile || hoveredIdx === idx)
                    ? "opacity-100"
                    : "opacity-0"
                }`}
                style={{ top: "calc(100% + 0.75rem)" }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-fraunces), Georgia, serif",
                    fontWeight: 400,
                    fontVariationSettings: "'opsz' 144, 'SOFT' 100",
                    textTransform: "uppercase",
                    letterSpacing: isMobile ? "0.12em" : "0.16em",
                    fontSize: isMobile ? "0.78rem" : "1.15rem",
                    color: "#ededeb",
                    lineHeight: 1,
                  }}
                >
                  {PHOTO_META[thumb.src]?.name}
                </span>
                <span
                  style={{
                    fontFamily: "Arial, Helvetica, sans-serif",
                    textTransform: "uppercase",
                    letterSpacing: "0.2em",
                    fontSize: isMobile ? "0.55rem" : "0.7rem",
                    color: "#ededeb",
                    opacity: 0.55,
                    lineHeight: 1,
                  }}
                >
                  {PHOTO_META[thumb.src]?.tagline}
                </span>
              </div>
            </Link>
          );
        })}

        {/* Shared corner-bracket frame. A single absolutely-positioned box
            sized + moved by GSAP to match the last-hovered photo. Lives
            inside the grid (z-[3] within grid's z-20 stacking context) so it
            scrolls with the photos and paints above both the dim overlay
            (z-[1]) and the hovered photo (z-[2]). */}
        <div
          ref={cornerFrameRef}
          aria-hidden
          className="absolute top-0 left-0 pointer-events-none z-[3] opacity-0"
          style={{ width: 0, height: 0, willChange: "transform, width, height" }}
        >
          {/* Inner scaler — CSS scales this to 1.04 (matching the photo's hover
              scale + timing) whenever any photo is hovered, so the brackets
              enlarge in sync with the photo instead of snapping to the final
              size. GSAP owns the outer div's translate/width/height for
              position; this inner div owns only the scale. */}
          <div className="corner-frame-scaler relative w-full h-full">
            <span className="pointer-events-none absolute -top-[8px] -left-[8px] w-5 h-5 border-t-2 border-l-2 border-[#ededeb]" />
            <span className="pointer-events-none absolute -top-[8px] -right-[8px] w-5 h-5 border-t-2 border-r-2 border-[#ededeb]" />
            <span className="pointer-events-none absolute -bottom-[8px] -left-[8px] w-5 h-5 border-b-2 border-l-2 border-[#ededeb]" />
            <span className="pointer-events-none absolute -bottom-[8px] -right-[8px] w-5 h-5 border-b-2 border-r-2 border-[#ededeb]" />
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════════
          RUSH OVERLAY — fixed-to-viewport intro animation. Stays put while its
          inner column(s) scroll and its frame clip-path opens up. Mobile uses a
          single centred column (which morphs its last photo into the grid);
          desktop uses three columns rushing up/down/up that crossfade out to
          reveal the grid. Hidden (display:none) once the hand-off completes.
          ════════════════════════════════════════════════════════════════════ */}
      <div ref={rushLayerRef} className="fixed inset-0 z-30">
        <div
          ref={frameRef}
          className="absolute inset-0"
          style={{
            clipPath: isMobile
              ? "inset(15% 8% round 12px)"
              : "inset(10% 5% round 14px)",
            WebkitClipPath: isMobile
              ? "inset(15% 8% round 12px)"
              : "inset(10% 5% round 14px)",
            willChange: "clip-path",
          }}
        >
          {isMobile ? (
            <div
              ref={trackRef}
              className="absolute inset-x-0 top-0 flex flex-col items-center"
              style={{ willChange: "transform" }}
            >
              <div className="w-full h-screen flex-shrink-0" aria-hidden />
              {MOBILE_RUSH_SLIDES.map((slide, i) => {
                const isLast = i === MOBILE_RUSH_SLIDES.length - 1;
                return (
                  <div
                    key={slide.src}
                    ref={isLast ? landingRushRef : undefined}
                    className="relative flex-shrink-0 mt-[5vh]"
                    style={{ width: "92vw", aspectRatio: "2 / 3" }}
                  >
                    <Image
                      src={slide.src}
                      alt={slide.alt}
                      fill
                      preload={i < 3 || isLast}
                      quality={75}
                      sizes="92vw"
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="absolute inset-0 flex items-stretch justify-center gap-[2.5vw]">
              <RushColumn trackRef={strip1Ref} colIndex={0} />
              <RushColumn trackRef={strip2Ref} colIndex={1} />
              <RushColumn trackRef={strip3Ref} colIndex={2} />
            </div>
          )}
        </div>
      </div>

      {/* Persistent corner menu. `introMask` makes the [MENU] label start
          clipped + hidden so this component's timeline can rise it in lock-step
          with the nav logo (same tween). pointer-events stay off until that
          reveal begins (showMenu). The component positions itself fixed. */}
      <div className={showMenu ? "" : "pointer-events-none"}>
        <HamburgerMenu introMask />
      </div>
    </section>
  );
}
