"use client";

import { useEffect, useRef, useState } from "react";
import { getImageProps } from "next/image";
import { openIntroGate, isIntroGateOpen } from "@/lib/introGate";
import {
  RUSH_SLIDE_SRCS,
  MOBILE_RUSH_SLIDE_SRCS,
} from "@/components/HeroSequence";

/**
 * First-load curtain. A Sharingan spins in the centre of the brand black (the
 * same artwork as the custom cursor), then the curtain lifts away to reveal the
 * hero rush underneath (the gate is opened the instant the curtain starts
 * moving, so the rush IS the reveal).
 *
 * The wait is REAL: it preloads the exact optimized image variants the rush
 * will render (same srcSet/sizes the hero uses, via getImageProps, so the
 * browser caches the very bytes the page requests). The curtain doesn't lift
 * until the rush images are ready AND the display font is ready — so there's
 * no pop-in when the rush starts.
 *
 * Safety: a hard MAX_WAIT_MS cap lifts the curtain even if an image stalls, and
 * a failed image counts as "done" — the curtain can never hang.
 *
 * Plays once per runtime on a hard load; skipped on client-side nav back to
 * home and under prefers-reduced-motion (see `preloaderPlayed` + the gate).
 */

// Per-runtime guard — mirrors HeroSequence's `introPlayed`. Set when the curtain
// lifts so a client-nav remount skips it.
let preloaderPlayed = false;

// Hard ceiling: never hold the curtain longer than this, even if images stall.
const MAX_WAIT_MS = 6000;

// Floor on how long the Sharingan shows, even when everything is already cached:
// the length of its wind-up spin (preloader-spin-up in globals.css), so it reads
// as a deliberate beat instead of a flash.
const MIN_SHOW_MS = 1400;

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
  const [contentOut, setContentOut] = useState(false); // fade the Sharingan first
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

    // ── Real load sources ────────────────────────────────────────────────────
    const fontsReady = document.fonts?.ready ?? Promise.resolve();
    const srcs = Array.from(
      new Set(mobile ? MOBILE_RUSH_SLIDE_SRCS : RUSH_SLIDE_SRCS),
    );
    const imagesReady = Promise.all(srcs.map((src) => warmRushImage(src, mobile)));
    const minShow = new Promise<void>((resolve) => setTimeout(resolve, MIN_SHOW_MS));

    // ── Wait for everything (or the cap), then hand off ──────────────────────
    let finished = false;
    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];

    const finish = () => {
      if (finished || cancelled) return;
      finished = true;
      // Fade the Sharingan, then lift the curtain. Open the gate as the curtain
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

    Promise.all([fontsReady, imagesReady, minShow]).then(finish);
    timers.push(setTimeout(finish, MAX_WAIT_MS));

    return () => {
      cancelled = true;
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
        <div className="preloader__sharingan" />
      </div>
    </div>
  );
}
