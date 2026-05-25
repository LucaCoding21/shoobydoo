"use client";

import Image from "next/image";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// Grunge film grain. A tiny feTurbulence tile, URL-encoded as a data URI and
// tiled across the page. Kept as a constant so it isn't re-serialized on every
// render. mixBlendMode + low opacity let it sit over everything without
// muddying the photography.
const GRAIN =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E";

// Backdrop that drifts as the page scrolls. The gothic sword art (same
// inverted/screen treatment as the rest of the site) and a green depth glow
// each move at their own rate via ScrollTrigger scrub, so the page reads with
// depth without pulling focus from the photography. Decorative only —
// aria-hidden, non-interactive, and disabled under reduced-motion.
export default function AboutParallax() {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      const layers = gsap.utils.toArray<HTMLElement>("[data-parallax]");
      const trigger = {
        trigger: document.documentElement,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.6,
      };

      layers.forEach((el) => {
        gsap.to(el, {
          // data-parallax is the total yPercent shift across the full scroll.
          yPercent: Number(el.dataset.parallax),
          ease: "none",
          scrollTrigger: trigger,
        });
      });
    },
    { scope },
  );

  return (
    <div
      ref={scope}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 select-none overflow-hidden"
    >
      {/* Green depth glow — the brand accent, drifting slowest so it reads as
          the furthest layer. */}
      <div
        data-parallax="-10"
        className="absolute left-1/2 top-[12vh] h-[65vh] w-[65vh] -translate-x-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(158,240,26,0.12) 0%, rgba(158,240,26,0) 68%)",
          filter: "blur(24px)",
        }}
      />

      {/* Primary sword — anchored behind the title, slow upward drift. */}
      <div
        data-parallax="-20"
        className="absolute left-1/2 top-[2vh] -translate-x-1/2"
        style={{
          height: "94vh",
          aspectRatio: "1080 / 1440",
          opacity: 0.1,
          filter: "invert(1)",
          mixBlendMode: "screen",
        }}
      >
        <Image
          src="/sword-original.png"
          alt=""
          fill
          quality={100}
          sizes="60vh"
          style={{ objectFit: "contain" }}
          preload
        />
      </div>

      {/* Floral sword — off to the right, faster opposite drift for depth.
          Hidden on small screens so the mobile layout stays clean. */}
      <div
        data-parallax="28"
        className="absolute right-[-8vw] top-[55vh] hidden md:block"
        style={{
          height: "78vh",
          aspectRatio: "736 / 1308",
          opacity: 0.06,
          filter: "invert(1)",
          mixBlendMode: "screen",
        }}
      >
        <Image
          src="/sword-floral.png"
          alt=""
          fill
          quality={100}
          sizes="44vh"
          style={{ objectFit: "contain" }}
        />
      </div>

      {/* Static grain — sits over the drifting layers for an underground,
          print-poster texture. Not parallaxed, so it never smears. */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url("${GRAIN}")`,
          backgroundRepeat: "repeat",
          mixBlendMode: "overlay",
          opacity: 0.1,
        }}
      />
    </div>
  );
}
