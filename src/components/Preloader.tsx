"use client";

import { useEffect, useRef, useState } from "react";
import { getImageProps } from "next/image";
import { openIntroGate, isIntroGateOpen } from "@/lib/introGate";
import {
  RUSH_SLIDE_SRCS,
  MOBILE_RUSH_SLIDE_SRCS,
} from "@/components/HeroSequence";

/**
 * 0→100 first-load curtain. Counts up in the display serif over the brand black,
 * then lifts away to reveal the hero rush underneath (the gate is opened the
 * instant the curtain starts moving, so the rush IS the reveal).
 *
 * The count is REAL: it preloads the exact optimized image variants the rush
 * will render (same srcSet/sizes the hero uses, via getImageProps, so the
 * browser caches the very bytes the page requests) and the number tracks how
 * many have decoded. The curtain doesn't lift until the rush images are ready
 * AND the display font is ready — so there's no pop-in when the rush starts.
 *
 * Safety: a hard MAX_WAIT_MS cap force-completes the count even if an image
 * stalls, and a failed image counts as "done" — the curtain can never hang.
 *
 * Plays once per runtime on a hard load; skipped on client-side nav back to
 * home and under prefers-reduced-motion (see `preloaderPlayed` + the gate).
 */

// Per-runtime guard — mirrors HeroSequence's `introPlayed`. Set when the count
// completes so a client-nav remount skips the curtain.
let preloaderPlayed = false;

// Hard ceiling: never hold the curtain longer than this, even if images stall.
const MAX_WAIT_MS = 6000;

// Per-frame easing factor for the displayed number. Smooths the steps as images
// land. 0.16 puts the floor at ~0.5s when everything is already cached — quick
// enough not to feel like an artificial queue, slow enough to read as a count.
const LERP = 0.16;

// Warm one image as the rush will actually request it: build the same optimized
// srcSet/sizes via getImageProps so the browser fetches the identical variant
// (cache hit later), then resolve when it loads. Resolves on error too, so a
// broken/missing image never blocks the reveal.
function warmRushImage(src: string, mobile: boolean): Promise<void> {
  return new Promise((resolve) => {
    const img = new Image();
    let settled = false;
    const done = () => {
      if (settled) return;
      settled = true;
      resolve();
    };
    img.onload = done;
    img.onerror = done;
    try {
      // Mirror the hero rush's <Image> so getImageProps (the same internal
      // function <Image> uses) yields the identical srcSet/src → the warmed
      // bytes are the very ones the rush requests → a cache hit, no pop-in.
      // Both rush variants render at quality={75}; keep this in lock-step with
      // RushColumn / the mobile rush in HeroSequence.tsx or the warmed URLs
      // stop matching the requested ones.
      const { props } = getImageProps({
        src,
        alt: "",
        fill: true,
        sizes: mobile ? "92vw" : "20vw",
        quality: 75,
      });
      if (props.srcSet) img.srcset = props.srcSet;
      if (props.sizes) img.sizes = props.sizes;
      img.src = props.src as string;
    } catch {
      // getImageProps unavailable for some reason → warm the raw source.
      img.src = src;
    }
    // Already in cache (e.g. warm reload) → resolve right away.
    if (img.complete && img.naturalWidth > 0) done();
  });
}

export default function Preloader() {
  // Render the curtain from the very first paint (server + first client render)
  // so the hero's rush is never visible underneath for a frame — that peek was
  // the "flash on refresh". The only case we start hidden is a client-side nav
  // back to home, where the gate is already open this runtime. (Server and a
  // fresh client load both see the gate closed, so they agree → no hydration
  // mismatch. Reduced-motion is handled in the effect + a CSS display:none.)
  const [active, setActive] = useState(
    () => !(typeof window !== "undefined" && isIntroGateOpen()),
  );
  const [count, setCount] = useState(0);
  const [contentOut, setContentOut] = useState(false); // fade the readout first
  const [leaving, setLeaving] = useState(false); // then lift the curtain
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Already played this runtime, or motion is reduced → no curtain. Hide it
    // (it may have rendered for the initial paint) and free the hero to start.
    if (preloaderPlayed || isIntroGateOpen() || reduce) {
      setActive(false);
      openIntroGate();
      return;
    }

    const mobile = window.innerWidth < 768;

    // ── Real progress sources ────────────────────────────────────────────────
    let fontsReady = false;
    if (document.fonts?.ready) document.fonts.ready.then(() => (fontsReady = true));
    else fontsReady = true;

    const srcs = Array.from(
      new Set(mobile ? MOBILE_RUSH_SLIDE_SRCS : RUSH_SLIDE_SRCS),
    );
    const total = srcs.length;
    let loaded = 0;
    srcs.forEach((src) =>
      warmRushImage(src, mobile).then(() => {
        loaded += 1;
      }),
    );

    // ── Drive the count toward real progress, then hand off ──────────────────
    const start = performance.now();
    let displayed = 0; // smoothed, monotonic
    let raf = 0;
    let finished = false;
    const timers: ReturnType<typeof setTimeout>[] = [];

    const finish = () => {
      if (finished) return;
      finished = true;
      setCount(100);
      // Fade the readout, then lift the curtain. Open the gate as the curtain
      // begins to move so the hero's rush is what gets revealed beneath it.
      setContentOut(true);
      timers.push(
        setTimeout(() => {
          setLeaving(true);
          preloaderPlayed = true;
          openIntroGate();
          // Unmount once the lift transition (1s) has finished.
          timers.push(setTimeout(() => setActive(false), 1000));
        }, 150),
      );
    };

    const tick = (now: number) => {
      const elapsed = now - start;
      const imagesDone = total === 0 || loaded >= total;
      const ready = (fontsReady && imagesDone) || elapsed >= MAX_WAIT_MS;

      // Target tracks the real load fraction; capped at 99 until fully ready so
      // the number never claims 100 before the rush is actually decoded.
      const realFrac = total === 0 ? 1 : loaded / total;
      const target = ready ? 100 : Math.min(realFrac * 100, 99);

      displayed = Math.max(displayed, displayed + (target - displayed) * LERP);
      const n = Math.round(displayed);
      setCount(n);

      if (ready && displayed >= 99.4) {
        finish();
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      timers.forEach(clearTimeout);
    };
  }, []);

  if (!active) return null;

  return (
    <div
      ref={rootRef}
      aria-hidden
      className={`preloader${leaving ? " is-leaving" : ""}`}
    >
      <div className={`preloader__inner${contentOut ? " is-out" : ""}`}>
        <span className="preloader__wordmark">Shoobydoo</span>
        <span className="preloader__count">
          {String(count).padStart(3, "0")}
        </span>
        <div className="preloader__bar">
          <div
            className="preloader__fill"
            style={{ transform: `scaleX(${count / 100})` }}
          />
        </div>
      </div>
    </div>
  );
}
