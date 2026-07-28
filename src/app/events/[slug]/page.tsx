import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { EVENTS, allEventSlugs, getEvent } from "@/data/events";
import PhotoGallery from "@/components/PhotoGallery";
import AsciiCat from "@/components/AsciiCat";
import HamburgerMenu from "@/components/HamburgerMenu";
import SiteWordmark from "@/components/SiteWordmark";

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
      {/* Fixed height reserves the same top-bar space the old "Home" link gave
          the row, so removing it doesn't pull the gallery up under the
          (fixed) centred wordmark. */}
      <header className="flex items-center px-[3vw] sm:px-[4vw] h-14 sm:h-[3.75rem]">
        <SiteWordmark />
        <HamburgerMenu />
      </header>

      {/* Two-column layout: sticky info rail on the left, photo grid on the
          right. Collapses to single-column on mobile (lg breakpoint = 1024px).
          Left rail uses self-start so its sticky positioning works inside the
          grid track. */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 lg:gap-12 px-[4vw] pb-16">
        {/* relative z-0 makes the aside its own stacking context, so the mobile
            background cat's -z-10 lands behind the info text but still above
            the page background (a bare -z-10 would paint under <main>'s fill). */}
        <aside className="relative z-0 lg:col-span-1 lg:sticky lg:top-2 lg:self-start lg:h-[calc(100vh-5rem)] lg:overflow-hidden lg:[container-type:inline-size] flex flex-col gap-4 min-w-0">
          {/* Mobile — the rail cat as a background sigil behind the event info,
              bleeding off the right edge, same layering as the desktop rail
              art. The photo grid below paints over whatever hangs past. */}
          <div className="pointer-events-none absolute -top-4 right-[-8vw] -z-10 lg:hidden">
            <AsciiCat fontSize="0.8rem" opacity={0.25} />
          </div>
          <div className="flex flex-col gap-4">
            <h1
              // On desktop the title lives in a narrow 1/4-width rail, so long
              // single-word titles (e.g. "VIPERACTIVE") used to overflow and get
              // clipped by the aside's overflow-hidden. The aside is a container
              // (container-type: inline-size), so size the title in cqi to scale
              // it to the rail width — 28px floor up to a 48px cap. break-words
              // is a safety net for any title longer than the column.
              className="text-4xl sm:text-5xl lg:text-[length:clamp(1.75rem,14cqi,3rem)] leading-[0.95] font-bold break-words"
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

          {/* ASCII cat — pushed to the bottom of the rail by mt-auto. Desktop
              only here: on mobile the rail sits above the photos, so the cat
              would shove the photography down the page. It reappears after the
              grid below. */}
          <div className="mt-auto hidden lg:block">
            <AsciiCat />
          </div>
        </aside>

        <section className="lg:col-span-3">
          {event.photos.length === 0 ? (
            <p className="text-center opacity-60 py-32 text-sm uppercase tracking-[0.2em]">
              Photos coming soon.
            </p>
          ) : (
            <PhotoGallery
              photos={event.photos}
              eventTitle={event.title}
              // Events whose thumbnail is a re-export of photos[0] must not
              // prepend it again — the shot is already leading the grid.
              leadPhoto={
                event.thumbIsFirstPhoto ? undefined : event.homeThumbSrc
              }
            />
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
