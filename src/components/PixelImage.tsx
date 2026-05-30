"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Locomotive-style pixel-loading reveal (after Olivier Larose's canvas
// pixel-loading tutorial). The cover-cropped photo is downscaled into a tiny
// offscreen buffer and blown back up onto the visible canvas with image
// smoothing OFF, so it reads as chunky blocks; stepping the buffer size up over
// a few frames resolves the blocks into the full photo, ending on a crisp
// full-resolution draw.
//
// Why an offscreen buffer instead of drawing the canvas onto itself: a
// self-referential drawImage can leave a stale sub-frame composited on the
// canvas (a ghost thumbnail). Here every frame does a single clear + paint from
// the source image, so a frame can never be left half-drawn.
//
// pxSteps are block sizes in percent. The defaults match the reference: a very
// coarse first block, then progressively finer, then full resolution (100).
const DEFAULT_PX_STEPS = [2, 5, 6, 8, 100];

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

type Props = {
  /** Public path to the photo, e.g. "/sselfie.jpg". Loaded raw for the canvas. */
  src: string;
  /** Accessible name. Empty string marks the image decorative. */
  alt: string;
  /** Block-size sequence in percent; last entry should be 100 (full res). */
  pxSteps?: number[];
  /** ScrollTrigger start for kicking off the reveal. */
  triggerStart?: string;
  /** ms between pixel steps. */
  speed?: number;
  /** ms before the first step fires once scrolled into view. */
  initialDelay?: number;
  /** Extra classes for the fill container (sizing comes from the parent). */
  className?: string;
};

// Fills its positioned parent (the existing `relative aspect-[…] overflow-hidden`
// figure wrappers), so it's a drop-in for `<Image fill>` on the photo tiles.
export default function PixelImage({
  src,
  alt,
  pxSteps = DEFAULT_PX_STEPS,
  triggerStart = "top+=20% bottom",
  speed = 80,
  initialDelay = 300,
  className = "",
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Offscreen buffer used to downscale the photo before the blocky upscale.
    const buffer = document.createElement("canvas");
    const bctx = buffer.getContext("2d");
    if (!bctx) return;

    // Cap DPR so the backing store stays sane on 3x phones while finals stay
    // crisp on retina. Block proportions are scale ratios, so DPR doesn't change
    // how blocky each step looks — only the final-frame sharpness.
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const img = new Image();
    img.crossOrigin = "anonymous";

    let loaded = false;
    let started = false; // the resolve runs exactly once
    // The block size currently painted. Always a valid percent (starts at the
    // coarsest step, ends at 100), so a resize redraw never hits an undefined
    // step → NaN → blank canvas.
    let currentPct = pxSteps[0] ?? 100;
    let timer: ReturnType<typeof setTimeout> | undefined;

    // Paint one frame at the given block size (100 = crisp full resolution).
    const draw = (pct: number) => {
      const cw = container.offsetWidth;
      const ch = container.offsetHeight;
      if (!loaded || !cw || !ch || !img.width || !img.height) return;

      const W = Math.round(cw * dpr);
      const H = Math.round(ch * dpr);
      canvas.width = W; // assigning width/height also clears the canvas
      canvas.height = H;

      // Cover-crop the source to the canvas aspect, centred on both axes (keeps
      // portraits from being top-cropped), so blocks represent the real framing
      // rather than a squished full image.
      const canvasRatio = W / H;
      let sx = 0;
      let sy = 0;
      let sW = img.width;
      let sH = img.height;
      if (img.width / img.height > canvasRatio) {
        sW = Math.round(img.height * canvasRatio);
        sx = Math.round((img.width - sW) / 2);
      } else {
        sH = Math.round(img.width / canvasRatio);
        sy = Math.round((img.height - sH) / 2);
      }

      const frac = pct * 0.01;
      if (frac >= 1) {
        // Final frame: draw the cover-crop straight to the canvas, smoothed.
        ctx.imageSmoothingEnabled = true;
        ctx.drawImage(img, sx, sy, sW, sH, 0, 0, W, H);
        return;
      }

      // Pixelate: downscale the cover-crop into a tiny buffer (smoothed, so each
      // block is an averaged colour), then upscale blocky with smoothing off.
      const bw = Math.max(1, Math.round(W * frac));
      const bh = Math.max(1, Math.round(H * frac));
      buffer.width = bw;
      buffer.height = bh;
      bctx.imageSmoothingEnabled = true;
      bctx.clearRect(0, 0, bw, bh);
      bctx.drawImage(img, sx, sy, sW, sH, 0, 0, bw, bh);

      ctx.imageSmoothingEnabled = false;
      ctx.clearRect(0, 0, W, H);
      ctx.drawImage(buffer, 0, 0, bw, bh, 0, 0, W, H);
    };

    const animate = () => {
      if (started) return; // guard against a double trigger (e.g. refresh + scroll)
      started = true;
      let i = 0;
      const tick = () => {
        currentPct = pxSteps[Math.min(i, pxSteps.length - 1)] ?? 100;
        draw(currentPct);
        i++;
        if (i < pxSteps.length) timer = setTimeout(tick, speed);
      };
      timer = setTimeout(tick, initialDelay);
    };

    const onResize = () => draw(currentPct);

    const triggers: ScrollTrigger[] = [];
    const reduce = prefersReducedMotion();

    img.onload = () => {
      loaded = true;

      if (reduce) {
        // No animation: paint the crisp final frame and reveal immediately.
        currentPct = 100;
        draw(100);
        gsap.set(container, { opacity: 1 });
        return;
      }

      draw(currentPct); // first frame = coarsest block, held behind opacity 0
      window.addEventListener("resize", onResize);

      triggers.push(
        ScrollTrigger.create({
          trigger: container,
          start: triggerStart,
          onEnter: animate,
          once: true,
        }),
        ScrollTrigger.create({
          trigger: container,
          start: "top bottom",
          onEnter: () => gsap.set(container, { opacity: 1 }),
          once: true,
        }),
      );
      // Above-the-fold tiles are already past their start on load; refresh so
      // ScrollTrigger evaluates that and fires onEnter without needing a scroll.
      ScrollTrigger.refresh();
    };

    img.src = src;

    return () => {
      if (timer) clearTimeout(timer);
      window.removeEventListener("resize", onResize);
      img.onload = null;
      // Kill only this instance's triggers — never ScrollTrigger.getAll(), which
      // would tear down other components' scroll animations on the page.
      triggers.forEach((t) => t.kill());
    };
  }, [src, pxSteps, triggerStart, speed, initialDelay]);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden opacity-0 ${className}`}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full"
        role={alt ? "img" : undefined}
        aria-label={alt || undefined}
        aria-hidden={alt ? undefined : true}
      />
    </div>
  );
}
