"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import {
  onEventTransitionBegin,
  onTransitionTargetMount,
  type EventTransitionPayload,
} from "@/lib/eventTransition";

// Shared-element page transition (after Codrops' WebGPU page-transitions
// pattern, done with a DOM clone instead of a canvas plane): the clicked grid
// tile keeps living as a fixed clone while the route swaps underneath a scrim,
// then the clone tweens (position + size, object-cover recropping in flight)
// onto the gallery grid's first tile — which shows the same thumbnail — and
// dissolves. Mounted once in the root layout so it survives the navigation.

// If the destination tile never reports (slow compile, nav interrupted),
// dissolve gracefully instead of stranding a black scrim.
const HERO_TIMEOUT_MS = 3000;

export default function EventTransitionLayer() {
  const router = useRouter();
  const [payload, setPayload] = useState<EventTransitionPayload | null>(null);
  // Mirror for the hero listener (registered once, must see the live value).
  const payloadRef = useRef<EventTransitionPayload | null>(null);
  const scrimRef = useRef<HTMLDivElement>(null);
  const cloneRef = useRef<HTMLDivElement>(null);
  // Set once the morph (or the timeout fallback) has claimed this payload, so
  // a late target report can't start a second morph.
  const claimedRef = useRef(false);

  useEffect(
    () =>
      onEventTransitionBegin((p) => {
        console.debug("[transition] begin", p.href);
        claimedRef.current = false;
        payloadRef.current = p;
        setPayload(p);
      }),
    [],
  );

  // Overlay just mounted for this payload: fade the scrim in over the homepage
  // (the clone sits above it, so the clicked photo is the one thing that
  // persists), and only THEN navigate — the route swap must happen under a
  // fully opaque scrim, or the old page visibly flips to the new one behind a
  // half-transparent veil.
  useEffect(() => {
    if (!payload) return;
    const scrim = scrimRef.current;
    const clone = cloneRef.current;
    if (!scrim || !clone) return;

    const href = payload.href;
    gsap.fromTo(
      scrim,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 0.3,
        ease: "power2.out",
        onComplete: () => {
          console.debug("[transition] scrim opaque, pushing", href);
          router.push(href);
        },
      },
    );

    // No target reported in time → dissolve gracefully.
    const timeout = setTimeout(() => {
      console.debug("[transition] timeout fired, claimed:", claimedRef.current);
      if (claimedRef.current) return;
      claimedRef.current = true;
      gsap.to([scrim, clone], {
        opacity: 0,
        duration: 0.5,
        ease: "power2.inOut",
        onComplete: () => {
          payloadRef.current = null;
          setPayload(null);
        },
      });
    }, HERO_TIMEOUT_MS);
    return () => clearTimeout(timeout);
  }, [payload]);

  // Target handshake — measure the destination tile and morph the clone onto it.
  useEffect(
    () =>
      onTransitionTargetMount((el) => {
        console.debug(
          "[transition] target reported; payload:",
          !!payloadRef.current,
          "claimed:",
          claimedRef.current,
        );
        if (!payloadRef.current || claimedRef.current) return;
        claimedRef.current = true;

        // Double rAF: let the new page paint/settle before measuring, so the
        // rect reflects the final layout (fonts are already loaded on
        // client-side nav).
        requestAnimationFrame(() =>
          requestAnimationFrame(() => {
            const scrim = scrimRef.current;
            const clone = cloneRef.current;
            console.debug("[transition] morph rAF; refs:", !!scrim, !!clone);
            if (!scrim || !clone) return;
            const target = el.getBoundingClientRect();
            console.debug("[transition] morph to", JSON.stringify(target));

            // The clone may only dissolve once the tile under it has real
            // pixels — the gallery requests a different optimized variant than
            // the homepage, so a fresh load is likely. Until then the clone
            // sits pixel-aligned on top; without this the dissolve exposes a
            // blank tile that pops in later.
            const dissolveWhenTargetReady = () => {
              const clone = cloneRef.current;
              const done = () => {
                payloadRef.current = null;
                setPayload(null);
              };
              if (!clone) return done();
              const dissolve = () =>
                gsap.to(clone, {
                  opacity: 0,
                  duration: 0.35,
                  ease: "power1.out",
                  onComplete: done,
                });
              const img = el.querySelector("img");
              if (!img || (img.complete && img.naturalWidth > 0)) {
                dissolve();
                return;
              }
              let fired = false;
              const go = () => {
                if (fired) return;
                fired = true;
                dissolve();
              };
              img.addEventListener("load", go, { once: true });
              img.addEventListener("error", go, { once: true });
              // Backstop: never strand the clone if the load event is missed.
              setTimeout(go, 2500);
            };

            const tl = gsap.timeline({ onComplete: dissolveWhenTargetReady });
            // Morph tile-rect → hero-rect. Animating the box (not a scale
            // transform) keeps the object-cover crop honest mid-flight, like
            // the canvas plane resizing in the reference.
            // Morph home-tile rect → grid-tile rect.
            tl.to(
              clone,
              {
                top: target.top,
                left: target.left,
                width: target.width,
                height: target.height,
                duration: 1.05,
                ease: "power3.inOut",
              },
              0,
            );
            // Reveal the destination page while the image is still traveling,
            // so the morph lands on a page that's already there.
            tl.to(
              scrim,
              { opacity: 0, duration: 0.65, ease: "power2.inOut" },
              0.25,
            );
          }),
        );
      }),
    [],
  );

  if (!payload) return null;

  return (
    <div aria-hidden className="fixed inset-0 z-[80]">
      {/* Scrim — masks the route swap and blocks interaction mid-transition. */}
      <div
        ref={scrimRef}
        className="absolute inset-0 bg-[#0e0f12]"
        style={{ opacity: 0 }}
      />
      {/* The traveling photo. Plain <img> with the tile's exact currentSrc so
          it paints instantly from cache. */}
      <div
        ref={cloneRef}
        className="fixed overflow-hidden rounded-sm"
        style={{
          top: payload.rect.top,
          left: payload.rect.left,
          width: payload.rect.width,
          height: payload.rect.height,
          willChange: "top, left, width, height",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={payload.src}
          alt=""
          className="h-full w-full"
          style={{ objectFit: "cover" }}
        />
      </div>
    </div>
  );
}
