"use client";

import { useEffect, useRef } from "react";

// Shared ASCII animation engine: a steady per-cell "shimmer" plus an occasional
// full-frame "glitch" burst, rendered into a <pre>. Both AsciiCat (the gallery
// rail) and the contact-page figure drive it — only the art + character pool
// differ. See AsciiCat for the original braille tuning.
type Props = {
  art: string[];
  /** Characters swapped in during shimmer/glitch — match the art's palette. */
  pool: string[];
  /** The "empty" character; trailing runs of it are trimmed per line. */
  blank?: string;
  /** Which edge the art hugs within its container. */
  align?: "left" | "right";
  fontSize?: string;
  opacity?: number;
};

const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export default function AsciiShimmer({
  art,
  pool,
  blank = " ",
  align = "right",
  fontSize = "1.5rem",
  opacity = 0.3,
}: Props) {
  const artRef = useRef<HTMLPreElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isInk = (ch: string) => ch !== blank && ch !== " ";
    const randPool = () => pool[Math.floor(Math.random() * pool.length)];
    const trailing = new RegExp(`${escapeRegExp(blank)}+$`);

    let grid = art.map((line) => Array.from(line));
    const rows = grid.length;
    let shimmerCells: { r: number; c: number; orig: string; ticks: number }[] = [];

    const render = (g: string[][]) => {
      if (artRef.current) {
        // Trim trailing blanks so the pre's box hugs the art's true edge —
        // combined with the auto margin this lets it sit flush left or right.
        artRef.current.textContent = g
          .map((r) => r.join("").replace(trailing, ""))
          .join("\n");
      }
    };

    const shimmerTick = () => {
      shimmerCells = shimmerCells.filter((cell) => {
        if (--cell.ticks <= 0) {
          grid[cell.r][cell.c] = cell.orig;
          return false;
        }
        return true;
      });
      for (let n = 0; n < 6; n++) {
        const r = Math.floor(Math.random() * rows);
        const c = Math.floor(Math.random() * grid[r].length);
        if (
          isInk(grid[r][c]) &&
          !shimmerCells.some((s) => s.r === r && s.c === c)
        ) {
          shimmerCells.push({
            r,
            c,
            orig: grid[r][c],
            ticks: 1 + Math.floor(Math.random() * 3),
          });
          grid[r][c] = randPool();
        }
      }
      render(grid);
    };

    let burst: ReturnType<typeof setInterval> | null = null;

    const glitch = () => {
      if (burst !== null) return; // one burst at a time
      const truth = art.map((line) => Array.from(line));
      let frame = 0;
      burst = setInterval(() => {
        frame++;
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < grid[r].length; c++) {
            if (truth[r] && isInk(truth[r][c])) {
              if (frame < 5) {
                if (Math.random() < 0.5) grid[r][c] = randPool();
              } else {
                if (Math.random() < 0.35) grid[r][c] = truth[r][c];
              }
            }
          }
        }
        if (artRef.current) {
          artRef.current.style.transform =
            frame < 6
              ? `translateX(${(Math.random() * 6 - 3).toFixed(1)}px)`
              : "translateX(0)";
        }
        render(grid);
        if (frame >= 9) {
          if (burst !== null) clearInterval(burst);
          burst = null;
          if (artRef.current) artRef.current.style.transform = "translateX(0)";
          grid = art.map((line) => Array.from(line));
          shimmerCells = [];
          render(grid);
        }
      }, 70);
    };

    render(grid);

    // Static art under reduced motion — no intervals at all.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // The intervals rewrite the whole <pre> (a full layout + paint of a
    // text-shadowed text block) ~9×/s, forever. Only pay that while the art is
    // actually on screen AND the tab is visible — offscreen instances (e.g. the
    // sign-off cat below a long photo grid) otherwise jank scrolling for the
    // entire page.
    let shimmerInterval: ReturnType<typeof setInterval> | null = null;
    let autoGlitch: ReturnType<typeof setInterval> | null = null;
    let inView = false;

    const stop = () => {
      if (shimmerInterval !== null) clearInterval(shimmerInterval);
      if (autoGlitch !== null) clearInterval(autoGlitch);
      shimmerInterval = null;
      autoGlitch = null;
      if (burst !== null) clearInterval(burst);
      burst = null;
      // Reset to the true art so a paused glitch never leaves garbage behind.
      if (artRef.current) artRef.current.style.transform = "translateX(0)";
      grid = art.map((line) => Array.from(line));
      shimmerCells = [];
      render(grid);
    };

    const start = () => {
      if (shimmerInterval !== null) return;
      shimmerInterval = setInterval(shimmerTick, 110);
      autoGlitch = setInterval(() => {
        if (Math.random() < 0.4) glitch();
      }, 4500);
    };

    const sync = () => {
      if (inView && !document.hidden) start();
      else stop();
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        sync();
      },
      { rootMargin: "10%" },
    );
    if (rootRef.current) io.observe(rootRef.current);
    document.addEventListener("visibilitychange", sync);

    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
      stop();
    };
  }, [art, pool, blank]);

  return (
    <div
      ref={rootRef}
      aria-hidden
      className="ascii-screen relative overflow-hidden select-none pointer-events-none"
      style={{ color: "#ededeb", opacity }}
    >
      <pre
        ref={artRef}
        className="ascii-art"
        style={{
          fontFamily: "var(--font-geist-mono), ui-monospace, monospace",
          fontSize,
          lineHeight: 1,
          margin: 0,
          marginLeft: align === "right" ? "auto" : 0,
          width: "fit-content",
          textShadow: "0 0 6px rgba(237,237,235,0.35)",
          transition: "transform 60ms",
        }}
      />
    </div>
  );
}
