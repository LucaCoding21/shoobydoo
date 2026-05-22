import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { allEventSlugs, getEvent } from "@/data/events";

export function generateStaticParams() {
  return allEventSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const event = getEvent(slug);
  if (!event) return { title: "Shoobydoo" };
  return {
    title: `${event.title} — Shoobydoo`,
    description: `Photos from ${event.title}.`,
  };
}

export default async function EventGalleryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = getEvent(slug);
  if (!event) notFound();

  return (
    <main className="min-h-screen bg-[#0e0f12] text-[#ededeb]">
      <header className="flex items-center justify-between px-[3vw] sm:px-[4vw] pt-6 pb-4">
        <Link
          href="/"
          aria-label="Back to home"
          className="text-xs sm:text-sm uppercase tracking-[0.2em] opacity-70 hover:opacity-100 transition-opacity"
        >
          ← Back
        </Link>
        <h1
          className="text-lg sm:text-2xl leading-none"
          style={{
            fontFamily: "var(--font-fraunces), Georgia, serif",
            fontVariationSettings: "'opsz' 144, 'SOFT' 100",
            textTransform: "uppercase",
            letterSpacing: "0.16em",
          }}
        >
          {event.title}
        </h1>
        {/* Spacer to keep the title visually centered. */}
        <span className="w-[3.5rem]" aria-hidden />
      </header>

      {event.photos.length === 0 ? (
        <p className="text-center opacity-60 py-32 text-sm uppercase tracking-[0.2em]">
          Photos coming soon.
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-[4px] sm:gap-[6px] px-[4px] sm:px-[6px] pb-[6px]">
          {event.photos.map((src, i) => (
            <div
              key={src}
              className="relative aspect-[3/4] overflow-hidden bg-black/30"
            >
              <Image
                src={src}
                alt={`${event.title} — photo ${i + 1}`}
                fill
                sizes="(max-width: 640px) 50vw, 33vw"
                quality={75}
                style={{ objectFit: "cover" }}
                priority={i < 3}
              />
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

