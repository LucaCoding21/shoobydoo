"use client";

import { useEffect, useRef } from "react";

/**
 * Sharingan cursor. Replaces the native pointer with the three-tomoe Sharingan
 * and, when hovering anything interactive, spins for 0.3s and crossfades into the
 * Mangekyo Sharingan (the "pointer" state).
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

// Anything that should trigger the Mangekyo "pointer" state on hover.
const INTERACTIVE_SELECTOR =
  'a, button, input, textarea, select, label, summary, [role="button"], [role="link"], [contenteditable="true"], [data-cursor="pointer"]';

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

    // Whether the element under the pointer is interactive.
    const isInteractive = (target: EventTarget | null) =>
      target instanceof Element && !!target.closest(INTERACTIVE_SELECTOR);

    const over = (e: PointerEvent) => {
      if (isInteractive(e.target) && !spinner.classList.contains("is-pointer")) {
        // Re-trigger the spin keyframe from the top each time we enter.
        spinner.classList.remove("is-pointer");
        // Force reflow so the animation restarts even on rapid re-entry.
        void spinner.offsetWidth;
        spinner.classList.add("is-pointer");
      }
    };

    const out = (e: PointerEvent) => {
      // Only drop the pointer state when moving to something non-interactive
      // (relatedTarget is where the pointer is heading).
      if (
        spinner.classList.contains("is-pointer") &&
        !isInteractive(e.relatedTarget)
      ) {
        spinner.classList.remove("is-pointer");
      }
    };

    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerover", over, { passive: true });
    document.addEventListener("pointerout", out, { passive: true });
    document.addEventListener("pointerleave", leaveWindow);
    window.addEventListener("blur", leaveWindow);

    return () => {
      document.documentElement.classList.remove("sharingan-cursor-active");
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerover", over);
      document.removeEventListener("pointerout", out);
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
