"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { EVENT_BY_HOME_THUMB } from "@/data/events";
import HamburgerMenu from "@/components/HamburgerMenu";

const RUSH_SLIDES = [
  { src: "/thumbnails/nghtmre-harbour.jpg", alt: "NGHTMRE at Harbour" },
  { src: "/thumbnails/viperactive-harbour.jpg", alt: "viperactive at Harbour" },
  { src: "/thumbnails/insomnia-2026.jpg", alt: "Insomnia 2026" },
  { src: "/thumbnails/restricted-harbour.jpg", alt: "Restricted at Harbour" },
  { src: "/thumbnails/phrva-village-studios.jpg", alt: "PHRVA at Village Studios" },
  { src: "/thumbnails/insomnia-2025.jpg", alt: "Insomnia 2025" },
] as const;

const LANDING_SRC = "/thumbnails/insomnia-2025.jpg";

// Per-photo metadata shown under each tile on hover. Keyed by src so the
// repeated thumbnails in GRID stay in sync. Tagline format is "Venue · Date" —
// kept consistent so the same template works for concerts, festivals, and
// future fashion/editorial galleries.
const PHOTO_META: Record<string, { name: string; tagline: string }> = {
  "/thumbnails/insomnia-2025.jpg":         { name: "INSOMNIA",    tagline: "Insomnia 2025" },
  "/thumbnails/insomnia-2026.jpg":         { name: "INSOMNIA",    tagline: "Insomnia 2026" },
  "/thumbnails/nghtmre-harbour.jpg":       { name: "NGHTMRE",     tagline: "Harbour 2025" },
  "/thumbnails/viperactive-harbour.jpg":   { name: "VIPERACTIVE", tagline: "Harbour 2025" },
  "/thumbnails/restricted-harbour.jpg":    { name: "RESTRICTED",  tagline: "Harbour 2025" },
  "/thumbnails/phrva-village-studios.jpg": { name: "PHRVA",       tagline: "Village Studios 2025" },
};

// Grid order, left-to-right, top-to-bottom. 4 across, 3 down = 12 slots.
// Landing photo (insomnia-2025) sits at index 1 (top row, second from left) — close to center for a short morph.
// Photos repeat to fill the 12 slots since only 6 unique thumbnails exist.
const GRID = [
  { src: "/thumbnails/phrva-village-studios.jpg", alt: "PHRVA at Village Studios" },
  { src: "/thumbnails/insomnia-2025.jpg", alt: "Insomnia 2025" },
  { src: "/thumbnails/viperactive-harbour.jpg", alt: "viperactive at Harbour" },
  { src: "/thumbnails/nghtmre-harbour.jpg", alt: "NGHTMRE at Harbour" },
  { src: "/thumbnails/restricted-harbour.jpg", alt: "Restricted at Harbour" },
  { src: "/thumbnails/insomnia-2026.jpg", alt: "Insomnia 2026" },
  { src: "/thumbnails/phrva-village-studios.jpg", alt: "PHRVA at Village Studios" },
  { src: "/thumbnails/viperactive-harbour.jpg", alt: "viperactive at Harbour" },
  { src: "/thumbnails/nghtmre-harbour.jpg", alt: "NGHTMRE at Harbour" },
  { src: "/thumbnails/restricted-harbour.jpg", alt: "Restricted at Harbour" },
  { src: "/thumbnails/insomnia-2026.jpg", alt: "Insomnia 2026" },
  { src: "/thumbnails/insomnia-2025.jpg", alt: "Insomnia 2025" },
] as const;

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function HeroSequence() {
  const containerRef = useRef<HTMLDivElement>(null);
  const rushLayerRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const landingRushRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLSpanElement>(null);
  const swordRef = useRef<HTMLDivElement>(null);
  const cornerFrameRef = useRef<HTMLDivElement>(null);
  const hasFrameAppeared = useRef(false);

  const hasRunRush = useRef(false);
  const [phase, setPhase] = useState<"rush" | "reveal" | "done">("rush");
  const [isMobile, setIsMobile] = useState(false);
  const [isReady, setIsReady] = useState(false);
  // Photos are not hoverable during the intro: while the rush + wipes are
  // running there's no real photo under the cursor yet, so showing the corner
  // brackets over an unrevealed tile reads as broken. Flipped to true 1s after
  // the wipes complete.
  const [canHover, setCanHover] = useState(false);
  // Index of the photo currently under the cursor (or null). Drives the HUD
  // swap from nav buttons → photo name + description.
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

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

  useEffect(() => {
    // Only lock scroll during the rush. Once the rush hands off ("reveal"),
    // let the user scroll even though the photo wipes / title slide-up are
    // still in flight — those animations don't care about scroll.
    if (phase !== "rush") return;
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
      if (!isReady || hasRunRush.current) return;
      hasRunRush.current = true;

      const rushLayer = rushLayerRef.current!;
      const frame = frameRef.current!;
      const track = trackRef.current!;
      const landingRush = landingRushRef.current!;
      const grid = gridRef.current!;
      const gridItems = Array.from(grid.querySelectorAll<HTMLDivElement>(".grid-thumb"));
      const landingGridItem = gridItems.find(
        (el) => el.dataset.src === LANDING_SRC,
      )!;
      const otherGridItems = gridItems.filter((el) => el !== landingGridItem);

      const reduce = prefersReducedMotion();
      // Skip the intro on repeat visits within the same browser session
      // (e.g. navigating back to home from a gallery). Cleared automatically
      // when the tab closes, so each new session still gets the full reveal.
      const skipIntro =
        typeof window !== "undefined" &&
        window.sessionStorage.getItem("shoobydoo-intro-played") === "1";
      const rushDuration = isMobile ? 2.4 : 3.2;
      const ease = "power4.inOut";
      const initialClip = isMobile
        ? "inset(15% 8% round 12px)"
        : "inset(12% 32% round 14px)";

      const slideCenter = landingRush.offsetTop + landingRush.offsetHeight / 2;
      const viewportCenter = window.innerHeight / 2;
      const scrollTarget = viewportCenter - slideCenter;

      const titleEl = titleRef.current!;

      gsap.set(frame, { clipPath: initialClip, force3D: true });
      gsap.set(track, { y: 0, force3D: true });
      gsap.set(grid, { opacity: 0 });
      gsap.set(gridItems, { opacity: 0 });
      // 120% (not 100%) because the wrapper's 0.2em paddingBottom expands the
      // clip box past the span — at yPercent:100 the top ~20% of letters peek out.
      gsap.set(titleEl, { yPercent: 120, visibility: "visible" });
      gsap.set(swordRef.current, { opacity: 0 });

      if (reduce || skipIntro) {
        gsap.set(rushLayer, { display: "none" });
        gsap.set([grid, ...gridItems], { opacity: 1, scale: 1, x: 0, y: 0 });
        gsap.set(titleEl, { yPercent: 0 });
        gsap.set(swordRef.current, { opacity: 0.15 });
        setPhase("done");
        setCanHover(true);
        return;
      }

      const tl = gsap.timeline();

      // Act 1 — Rush
      tl.to(track, { y: scrollTarget, duration: rushDuration, ease }, 0);
      tl.to(frame, { clipPath: "inset(0%)", duration: rushDuration, ease }, 0);

      // Trigger the hand-off slightly before the rush technically ends, so the morph
      // absorbs the rush's deceleration tail instead of waiting for it to fully stop.
      tl.addLabel("settled", rushDuration - 0.4);

      // Hand-off: measure the landing grid item's natural position and morph from rush-end position.
      tl.call(
        () => {
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

          // 7 wipe directions for the 7 non-landing thumbs (4x2 grid minus landing).
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
          // Wipes start early in the morph so the reveal feels in sync.
          const wipeStart = 0.75;
          otherGridItems.forEach((item, idx) => {
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
      // the title comes in, so the two reveals don't fight for attention.
      tl.to(
        titleEl,
        {
          yPercent: 0,
          duration: 2.3,
          ease: "expo.out",
        },
        "settled+=1.9",
      );

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
        window.sessionStorage.setItem("shoobydoo-intro-played", "1");
      }, [], "settled+=4.4");
    },
    { scope: containerRef, dependencies: [isReady] },
  );

  return (
    <section
      ref={containerRef}
      className="relative w-full bg-[#0e0f12]"
      style={{ minHeight: isMobile ? "220vh" : "149vh" }}
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
            priority
          />
        </div>

        {/* Title — masked slide-up reveal. Sits as a small logo at the top
            center of the viewport. Outer div is positioner + mask; inner
            span is what slides up under GSAP control. */}
        <div
          className="absolute overflow-hidden text-[#ededeb] pointer-events-none select-none leading-none"
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
        </div>
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
            ? "grid-cols-2 grid-rows-6 gap-x-[4vw] gap-y-[7vh] px-[5vw] pt-[11vh] pb-[6vh]"
            : "grid-cols-4 grid-rows-3 gap-x-[2.5vw] gap-y-[12vh] px-[6vw] pt-[11vh] pb-[6vh]"
        } ${canHover ? "" : "pointer-events-none"}`}
        style={{ opacity: 0 }}
      >
        {GRID.map((thumb, idx) => {
          const eventSlug = EVENT_BY_HOME_THUMB[thumb.src];
          return (
            <Link
              key={`${thumb.src}-${idx}`}
              href={eventSlug ? `/events/${eventSlug}` : "/"}
              prefetch={false}
              aria-label={`Open ${thumb.alt} gallery`}
              className="photo-card group relative aspect-[2/3] cursor-pointer hover:scale-[1.04] block"
              style={{ height: isMobile ? "28vh" : "36vh" }}
              onMouseEnter={(e) => {
                setHoveredIdx(idx);
                handlePhotoEnter(e);
              }}
              onMouseLeave={() => setHoveredIdx(null)}
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
                  quality={95}
                  sizes={isMobile ? "40vw" : "15vw"}
                  style={{ objectFit: "cover" }}
                />
              </div>
              {/* Per-photo hover label — sits just below the image. Two-line
                  hierarchy: name (large serif) above tagline (small caps,
                  dimmed). Opacity driven by hoveredIdx so it can't appear
                  during the intro and only one shows at a time.
                  pointer-events-none so it never steals hover. */}
              <div
                aria-hidden
                className={`photo-label absolute left-1/2 -translate-x-1/2 pointer-events-none whitespace-nowrap flex flex-col items-center gap-1.5 transition-opacity duration-300 ${
                  canHover && hoveredIdx === idx ? "opacity-100" : "opacity-0"
                }`}
                style={{ top: "calc(100% + 0.75rem)" }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-fraunces), Georgia, serif",
                    fontWeight: 400,
                    fontVariationSettings: "'opsz' 144, 'SOFT' 100",
                    textTransform: "uppercase",
                    letterSpacing: "0.16em",
                    fontSize: isMobile ? "0.95rem" : "1.15rem",
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
                    fontSize: isMobile ? "0.6rem" : "0.7rem",
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
          RUSH OVERLAY — fixed-to-viewport intro animation. Stays put while
          its inner track scrolls and its frame clip-path opens up. Hidden
          (display:none) once the rush hands off to the grid reveal.
          ════════════════════════════════════════════════════════════════════ */}
      <div ref={rushLayerRef} className="fixed inset-0 z-30">
        <div
          ref={frameRef}
          className="absolute inset-0"
          style={{
            clipPath: "inset(12% 32% round 14px)",
            WebkitClipPath: "inset(12% 32% round 14px)",
            willChange: "clip-path",
          }}
        >
          <div
            ref={trackRef}
            className="absolute inset-x-0 top-0 flex flex-col items-center"
            style={{ willChange: "transform" }}
          >
            <div className="w-full h-screen flex-shrink-0" aria-hidden />
            {RUSH_SLIDES.map((slide, i) => {
              const isLast = i === RUSH_SLIDES.length - 1;
              return (
                <div
                  key={slide.src}
                  ref={isLast ? landingRushRef : undefined}
                  className="relative flex-shrink-0 mt-[5vh]"
                  style={
                    isMobile
                      ? { width: "92vw", aspectRatio: "2 / 3" }
                      : { height: "82vh", aspectRatio: "2 / 3" }
                  }
                >
                  <Image
                    src={slide.src}
                    alt={slide.alt}
                    fill
                    priority={i < 3 || isLast}
                    quality={95}
                    sizes={isMobile ? "92vw" : "55vh"}
                    style={{ objectFit: "cover" }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Persistent corner menu — fades in once the intro finishes (canHover).
          The component positions itself fixed to the viewport. */}
      <div
        className={`transition-opacity duration-500 ${
          canHover ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <HamburgerMenu />
      </div>
    </section>
  );
}
