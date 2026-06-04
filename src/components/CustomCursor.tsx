"use client";

import { useEffect, useRef } from "react";

/**
 * Sharingan cursor. Replaces the native pointer with the three-tomoe Sharingan.
 * Clicking plays a one-shot spin that crossfades into the Mangekyo Sharingan and
 * then settles back to the normal Sharingan.
 *
 * Why a JS follower instead of `cursor: url(...)`: native CSS cursors are static
 * images — they can't spin or crossfade. So we hide the OS cursor and track the
 * pointer with a fixed element.
 *
 * Perf notes:
 *  - Position is written straight to `transform` inside the pointermove handler
 *    (no React state, no rAF smoothing) so the cursor tracks with zero lag.
 *  - Hover state flips a className on the spinner via event delegation; it only
 *    changes when crossing an interactive boundary, so it's cheap.
 */

export default function CustomCursor() {
  const rootRef = useRef<HTMLDivElement>(null);
  const spinnerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only take over the cursor on devices with a precise pointer (mouse/trackpad).
    // Touch / coarse pointers keep their native behavior and we render nothing.
    const fine = window.matchMedia("(pointer: fine)");
    if (!fine.matches) return;

    const root = rootRef.current;
    const spinner = spinnerRef.current;
    if (!root || !spinner) return;

    document.documentElement.classList.add("sharingan-cursor-active");

    let pointerInside = false;

    const move = (e: PointerEvent) => {
      // Center the artwork on the real pointer position.
      root.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      if (!pointerInside) {
        pointerInside = true;
        root.style.opacity = "1";
      }
    };

    const leaveWindow = () => {
      pointerInside = false;
      root.style.opacity = "0";
    };

    // A click spins the Sharingan and morphs it into the Mangekyo, then settles
    // back. Re-trigger the keyframe from the top on every press; a timer clears
    // it after the 1s animation so the next press replays (and so it's robust
    // under prefers-reduced-motion, where animationend never fires).
    let revertTimer: ReturnType<typeof setTimeout> | undefined;
    const down = () => {
      clearTimeout(revertTimer);
      spinner.classList.remove("is-active");
      // Force reflow so the animation restarts even on rapid clicks.
      void spinner.offsetWidth;
      spinner.classList.add("is-active");
      revertTimer = setTimeout(() => spinner.classList.remove("is-active"), 1000);
    };

    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerdown", down, { passive: true });
    document.addEventListener("pointerleave", leaveWindow);
    window.addEventListener("blur", leaveWindow);

    return () => {
      clearTimeout(revertTimer);
      document.documentElement.classList.remove("sharingan-cursor-active");
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerdown", down);
      document.removeEventListener("pointerleave", leaveWindow);
      window.removeEventListener("blur", leaveWindow);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      aria-hidden
      className="sharingan-cursor pointer-events-none fixed left-0 top-0 z-[99999] opacity-0"
    >
      <div ref={spinnerRef} className="sharingan-cursor__spinner">
        {/* Normal state: three-tomoe Sharingan. Hover/pointer state (Mangekyo)
            is layered on top and crossfaded in via CSS. Both are CSS background
            images — purely decorative, so no DOM <img> / alt text is needed. */}
        <div className="sharingan-cursor__img sharingan-cursor__img--normal" />
        <div className="sharingan-cursor__img sharingan-cursor__img--pointer" />
      </div>
    </div>
  );
}
