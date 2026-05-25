import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { EVENTS, allEventSlugs, getEvent } from "@/data/events";
import PhotoGallery from "@/components/PhotoGallery";
import AsciiCat from "@/components/AsciiCat";
import HamburgerMenu from "@/components/HamburgerMenu";

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

  // Next gallery in the EVENTS order; wraps around at the end so users can keep moving forward.
  const allEvents = Object.values(EVENTS);
  const currentIdx = allEvents.findIndex((e) => e.slug === slug);
  const nextEvent = allEvents[(currentIdx + 1) % allEvents.length];

  return (
    <main className="min-h-screen bg-[#0e0f12] text-[#ededeb]">
      <header className="flex items-center px-[3vw] sm:px-[4vw] pt-6 pb-4">
        <Link
          href="/"
          aria-label="Home"
          className="text-xs sm:text-sm uppercase tracking-[0.2em] opacity-70 hover:opacity-100 transition-opacity"
        >
          Home
        </Link>
        <HamburgerMenu />
      </header>

      {/* Two-column layout: sticky info rail on the left, photo grid on the
          right. Collapses to single-column on mobile (lg breakpoint = 1024px).
          Left rail uses self-start so its sticky positioning works inside the
          grid track. */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 lg:gap-12 px-[4vw] pb-16">
        <aside className="lg:col-span-1 lg:sticky lg:top-2 lg:self-start lg:h-[calc(100vh-5rem)] lg:overflow-hidden flex flex-col gap-4 min-w-0">
          <div className="flex flex-col gap-4">
            <h1
              className="text-4xl sm:text-5xl lg:text-4xl xl:text-5xl leading-[0.95] font-bold"
              style={{
                fontFamily: "var(--font-geist-sans), Arial, Helvetica, sans-serif",
                textTransform: "uppercase",
                letterSpacing: "0.02em",
              }}
            >
              {event.title}
            </h1>

            <dl
              className="flex flex-col gap-1.5 text-[0.7rem]"
              style={{
                fontFamily: "Arial, Helvetica, sans-serif",
                textTransform: "uppercase",
                letterSpacing: "0.2em",
              }}
            >
              <div className="flex gap-3">
                <dt className="opacity-40 w-14">Venue</dt>
                <dd>{event.venue}</dd>
              </div>
              <div className="flex gap-3">
                <dt className="opacity-40 w-14">Date</dt>
                <dd>{event.date}</dd>
              </div>
            </dl>
          </div>

          {/* ASCII cat — pushed to the bottom of the rail by mt-auto. */}
          <div className="mt-auto">
            <AsciiCat />
          </div>
        </aside>

        <section className="lg:col-span-3">
          {event.photos.length === 0 ? (
            <p className="text-center opacity-60 py-32 text-sm uppercase tracking-[0.2em]">
              Photos coming soon.
            </p>
          ) : (
            <PhotoGallery photos={event.photos} eventTitle={event.title} />
          )}

          {nextEvent && nextEvent.slug !== slug && (
            <Link
              href={`/events/${nextEvent.slug}`}
              aria-label={`Next gallery: ${nextEvent.title}`}
              className="group mt-16 block relative overflow-hidden aspect-[16/9] sm:aspect-[21/9] bg-black/30"
            >
              <Image
                src={nextEvent.homeThumbSrc}
                alt=""
                aria-hidden="true"
                fill
                sizes="(max-width: 1024px) 100vw, 75vw"
                quality={80}
                style={{ objectFit: "cover" }}
                className="opacity-50 group-hover:opacity-70 transition-opacity duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 gap-3">
                <span
                  className="text-[0.65rem] sm:text-xs opacity-70"
                  style={{
                    fontFamily: "Arial, Helvetica, sans-serif",
                    textTransform: "uppercase",
                    letterSpacing: "0.3em",
                  }}
                >
                  Next Gallery
                </span>
                <span
                  className="text-2xl sm:text-3xl lg:text-4xl leading-[0.95]"
                  style={{
                    fontFamily: "var(--font-fraunces), Georgia, serif",
                    fontVariationSettings: "'opsz' 144, 'SOFT' 100",
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                  }}
                >
                  {nextEvent.title}
                </span>
                <span
                  className="text-xs sm:text-sm opacity-80 group-hover:opacity-100 transition-opacity"
                  style={{
                    fontFamily: "Arial, Helvetica, sans-serif",
                    textTransform: "uppercase",
                    letterSpacing: "0.2em",
                  }}
                >
                  View →
                </span>
              </div>
            </Link>
          )}
        </section>
      </div>
    </main>
  );
}
