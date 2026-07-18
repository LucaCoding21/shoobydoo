"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { transitionTargetMounted } from "@/lib/eventTransition";

type Props = {
  photos: readonly string[];
  eventTitle: string;
  /** The event's home-page thumbnail — shown as the FIRST grid tile so the
      homepage shared-element transition has a real in-grid landing slot. */
  leadPhoto?: string;
};

export default function PhotoGallery({ photos, eventTitle, leadPhoto }: Props) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const firstTileRef = useRef<HTMLButtonElement>(null);

  // Lead with the home thumbnail (unless it's already one of the photos), so
  // the image the visitor clicked is the first thing the grid opens with.
  const allPhotos = useMemo(
    () =>
      leadPhoto && !photos.includes(leadPhoto)
        ? [leadPhoto, ...photos]
        : [...photos],
    [photos, leadPhoto],
  );

  // Report the first tile to the transition layer: the homepage morphs the
  // clicked thumbnail onto this exact box. No-op on direct page loads.
  useEffect(() => {
    console.debug("[transition] gallery reporting first tile:", !!firstTileRef.current);
    if (firstTileRef.current) transitionTargetMounted(firstTileRef.current);
  }, []);

  const close = useCallback(() => setOpenIdx(null), []);
  const prev = useCallback(
    () =>
      setOpenIdx((i) =>
        i === null ? i : (i - 1 + allPhotos.length) % allPhotos.length,
      ),
    [allPhotos.length],
  );
  const next = useCallback(
    () => setOpenIdx((i) => (i === null ? i : (i + 1) % allPhotos.length)),
    [allPhotos.length],
  );

  useEffect(() => {
    if (openIdx === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [openIdx, close, prev, next]);

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-[6px]">
        {allPhotos.map((src, i) => (
          <button
            key={src + i}
            ref={i === 0 ? firstTileRef : undefined}
            type="button"
            onClick={() => setOpenIdx(i)}
            className="relative aspect-[3/4] overflow-hidden bg-black/30 group cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            aria-label={`Open photo ${i + 1} of ${allPhotos.length}`}
          >
            <Image
              src={src}
              alt={`${eventTitle} — photo ${i + 1}`}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              quality={75}
              style={{ objectFit: "cover" }}
              preload={i < 3}
              className="transition-transform duration-500 ease-out group-hover:scale-[1.03]"
            />
          </button>
        ))}
      </div>

      {openIdx !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${eventTitle} photo ${openIdx + 1} of ${allPhotos.length}`}
          className="fixed inset-0 z-[70] bg-black/90 backdrop-blur-sm flex items-center justify-center"
          onClick={close}
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              close();
            }}
            aria-label="Close"
            className="absolute top-4 right-4 sm:top-6 sm:right-6 w-10 h-10 flex items-center justify-center text-white/80 hover:text-white text-2xl leading-none focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 rounded"
          >
            ×
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            aria-label="Previous photo"
            className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-white/80 hover:text-white text-3xl leading-none focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 rounded"
          >
            ‹
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            aria-label="Next photo"
            className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-white/80 hover:text-white text-3xl leading-none focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 rounded"
          >
            ›
          </button>

          <div className="relative w-[92vw] h-[82vh] sm:w-[88vw] sm:h-[86vh] pointer-events-none">
            <Image
              key={allPhotos[openIdx]}
              src={allPhotos[openIdx]}
              alt={`${eventTitle} — photo ${openIdx + 1}`}
              fill
              sizes="92vw"
              quality={90}
              style={{ objectFit: "contain" }}
              preload
            />
          </div>

          <div
            className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 text-xs text-white/60 tabular-nums"
            style={{
              fontFamily: "Arial, Helvetica, sans-serif",
              letterSpacing: "0.2em",
            }}
          >
            {openIdx + 1} / {allPhotos.length}
          </div>
        </div>
      )}
    </>
  );
}
