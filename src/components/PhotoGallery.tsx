"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";

type Props = {
  photos: readonly string[];
  eventTitle: string;
};

export default function PhotoGallery({ photos, eventTitle }: Props) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const close = useCallback(() => setOpenIdx(null), []);
  const prev = useCallback(
    () => setOpenIdx((i) => (i === null ? i : (i - 1 + photos.length) % photos.length)),
    [photos.length],
  );
  const next = useCallback(
    () => setOpenIdx((i) => (i === null ? i : (i + 1) % photos.length)),
    [photos.length],
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
        {photos.map((src, i) => (
          <button
            key={src + i}
            type="button"
            onClick={() => setOpenIdx(i)}
            className="relative aspect-[3/4] overflow-hidden bg-black/30 group cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            aria-label={`Open photo ${i + 1} of ${photos.length}`}
          >
            <Image
              src={src}
              alt={`${eventTitle} — photo ${i + 1}`}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              quality={75}
              style={{ objectFit: "cover" }}
              priority={i < 3}
              className="transition-transform duration-500 ease-out group-hover:scale-[1.03]"
            />
          </button>
        ))}
      </div>

      {openIdx !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${eventTitle} photo ${openIdx + 1} of ${photos.length}`}
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
              key={photos[openIdx]}
              src={photos[openIdx]}
              alt={`${eventTitle} — photo ${openIdx + 1}`}
              fill
              sizes="92vw"
              quality={90}
              style={{ objectFit: "contain" }}
              priority
            />
          </div>

          <div
            className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 text-xs text-white/60 tabular-nums"
            style={{
              fontFamily: "Arial, Helvetica, sans-serif",
              letterSpacing: "0.2em",
            }}
          >
            {openIdx + 1} / {photos.length}
          </div>
        </div>
      )}
    </>
  );
}
