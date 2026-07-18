// Gallery events. Each event maps to one Dropbox subfolder under
// /Website pictures. Photos are resized exports (max 2000px, JPEG q80) under
// /public/events/<slug>/. To refresh: re-download the Dropbox folder zip,
// re-run the resize script (or sips by hand), and update the photo arrays.

export type EventSlug =
  | "nghtmre"
  | "viperactive"
  | "restricted"
  | "phrva"
  | "insomnia-2025"
  | "insomnia-2026"
  | "svdden-death"
  | "fvded-in-the-park"
  | "barely-alive"
  | "sisi"
  | "koji-aiken";

export type EventData = {
  slug: EventSlug;
  title: string;
  // Path of the corresponding tile in HeroSequence's GRID (used to link each
  // home-page photo to its gallery).
  homeThumbSrc: string;
  venue: string;
  date: string;
  // Relative paths under /public.
  photos: readonly string[];
  // True when homeThumbSrc is a re-export of photos[0] (verified by perceptual
  // hash). The gallery then skips prepending the thumbnail — the first photo
  // already IS that shot, so prepending would show it twice. Events without
  // this flag have a thumbnail that isn't among the photos, and the gallery
  // leads with the thumbnail itself.
  thumbIsFirstPhoto?: boolean;
};

function withSlug(slug: EventSlug, files: readonly string[]): string[] {
  return files.map((f) => `/events/${slug}/${f}`);
}

export const EVENTS: Record<EventSlug, EventData> = {
  nghtmre: {
    slug: "nghtmre",
    title: "NGHTMRE at Harbour",
    homeThumbSrc: "/thumbnails/nghtmre-harbour.jpg",
    venue: "Harbour",
    date: "2025",
    thumbIsFirstPhoto: true,
    photos: withSlug("nghtmre", [
      "_DSC9096-Enhanced-NR.jpg",
      "_DSC8872-Enhanced-NR.jpg",
      "_DSC8872-Enhanced-NR-2.jpg",
      "_DSC8883.jpg",
      "_DSC8905.jpg",
      "_DSC9026-Enhanced-NR.jpg",
      "_DSC9116-Enhanced-NR.jpg",
      "_DSC9126-Enhanced-NR.jpg",
      "_DSC9129-Enhanced-NR.jpg",
      "_DSC9190-Enhanced-NR.jpg",
      "_DSC9190-Enhanced-NR-2.jpg",
      "_DSC9193-Enhanced-NR.jpg",
      "_DSC9337-Enhanced-NR.jpg",
      "_DSC9337.jpg",
    ]),
  },
  phrva: {
    slug: "phrva",
    title: "PHRVA at Village Studios",
    homeThumbSrc: "/thumbnails/phrva-village-studios.jpg",
    venue: "Village Studios",
    date: "2025",
    thumbIsFirstPhoto: true,
    // 7R403305 leads: it's the shot the home-page thumbnail was exported from.
    photos: withSlug("phrva", [
      "7R403305-Enhanced-NR.jpg",
      "7R403291-Enhanced-NR.jpg",
      "7R403318-Enhanced-NR.jpg",
      "7R403513-Enhanced-NR.jpg",
      "7R403872-Enhanced-NR-2.jpg",
      "7R403930-Enhanced-NR.jpg",
      "7R404020-Enhanced-NR.jpg",
      "7R404034-Enhanced-NR.jpg",
      "7R404066-Enhanced-NR.jpg",
    ]),
  },
  restricted: {
    slug: "restricted",
    title: "Restricted at Harbour",
    homeThumbSrc: "/thumbnails/restricted-harbour.jpg",
    venue: "Harbour",
    date: "2025",
    photos: withSlug("restricted", [
      "7R402845-Enhanced-NR.jpg",
      "7R402872-Enhanced-NR.jpg",
      "7R402914-Enhanced-NR.jpg",
      "7R403147-Enhanced-NR.jpg",
      "7R403232-Enhanced-NR.jpg",
    ]),
  },
  viperactive: {
    slug: "viperactive",
    title: "viperactive at Harbour",
    homeThumbSrc: "/thumbnails/viperactive-harbour.jpg",
    venue: "Harbour",
    date: "2025",
    thumbIsFirstPhoto: true,
    photos: withSlug("viperactive", [
      "_7R48068-Enhanced-NR.jpg",
      "_7R48078-Enhanced-NR.jpg",
      "_7R48087.jpg",
      "_7R48365-Enhanced-NR.jpg",
      "_7R48380-Enhanced-NR.jpg",
    ]),
  },
  "insomnia-2025": {
    slug: "insomnia-2025",
    title: "INSOMNIA 2025",
    homeThumbSrc: "/thumbnails/insomnia-2025.jpg",
    venue: "Insomnia",
    date: "2025",
    photos: withSlug("insomnia-2025", [
      "_DSC2208-Enhanced-NR.jpg",
      "_DSC2728-Enhanced-NR.jpg",
      "_DSC2886-Enhanced-NR.jpg",
      "_DSC2904-Enhanced-NR.jpg",
      "_DSC2904-Enhanced-NR-2.jpg",
      "_DSC2977-Enhanced-NR.jpg",
      "_DSC3015-Enhanced-NR-4.jpg",
      "_DSC3556-Enhanced-NR.jpg",
      "_DSC3802-Enhanced-NR.jpg",
      "_DSC3916-Enhanced-NR-3.jpg",
    ]),
  },
  "insomnia-2026": {
    slug: "insomnia-2026",
    title: "INSOMNIA 2026",
    homeThumbSrc: "/thumbnails/insomnia-2026.jpg",
    venue: "Insomnia",
    date: "2026",
    photos: withSlug("insomnia-2026", [
      "_7R45554-Enhanced-NR.jpg",
      "_7R45982.jpg",
      "_7R45983-Enhanced-NR.jpg",
      "_7R46147.jpg",
      "_7R46162.jpg",
      "_7R46196.jpg",
      "_7R46201-Enhanced-NR.jpg",
      "_7R46204-Enhanced-NR.jpg",
      "_7R46213.jpg",
      "_7R46283-Enhanced-NR.jpg",
      "_7R46313-Enhanced-NR.jpg",
      "_7R46402-Enhanced-NR.jpg",
      "_7R46555.jpg",
      "_7R46584.jpg",
      "_7R46606.jpg",
      "_7R46651.jpg",
      "_7R46687.jpg",
      "_7R46714.jpg",
      "_7R46841-Enhanced-NR.jpg",
      "_7R46864-Enhanced-NR.jpg",
      "_7R46874-Enhanced-NR.jpg",
      "_7R46919-Enhanced-NR.jpg",
      "_7R46937-Enhanced-NR.jpg",
      "_7R46955-Enhanced-NR.jpg",
      "_7R46958-Enhanced-NR.jpg",
      "_7R46969-Enhanced-NR.jpg",
    ]),
  },
  "svdden-death": {
    slug: "svdden-death",
    title: "SVDDEN DEATH at Harbour",
    homeThumbSrc: "/thumbnails/svdden-death.jpg",
    venue: "Harbour",
    date: "2026",
    thumbIsFirstPhoto: true,
    photos: withSlug("svdden-death", [
      "_7R40327.jpg",
      "_7R40818.jpg",
      "_7R40368.jpg",
      "_7R40229.jpg",
      "_7R40999-2.jpg",
      "_7R40117-2.jpg",
      "_7R40303-2.jpg",
      "_7R40909.jpg",
      "_7R40908.jpg",
      "_7R40338-3.jpg",
      "_7R41030.jpg",
      "_7R41053-2.jpg",
      "_7R40911.jpg",
      "_7R40333-2.jpg",
      "_7R40890.jpg",
      "_7R40379.jpg",
      "_7R40879.jpg",
      "_7R40370.jpg",
      "_7R40294-2.jpg",
    ]),
  },
  "fvded-in-the-park": {
    slug: "fvded-in-the-park",
    title: "FVDED IN THE PARK",
    homeThumbSrc: "/thumbnails/fvded-in-the-park.jpg",
    venue: "Holland Park",
    date: "2026",
    thumbIsFirstPhoto: true,
    photos: withSlug("fvded-in-the-park", [
      "_7R42592.jpg",
      "_7R41632.jpg",
      "_7R41604.jpg",
      "_7R42875-Enhanced-NR.jpg",
      "_7R41611.jpg",
      "_7R42845.jpg",
      "_7R41640.jpg",
      "_7R42731.jpg",
      "_7R42804-Enhanced-NR-2.jpg",
      "_7R42601.jpg",
      "_7R42533.jpg",
      "_7R42465.jpg",
    ]),
  },
  "barely-alive": {
    slug: "barely-alive",
    title: "BARELY ALIVE",
    homeThumbSrc: "/thumbnails/barely-alive.jpg",
    venue: "Harbour",
    date: "2026",
    thumbIsFirstPhoto: true,
    photos: withSlug("barely-alive", [
      "_DSC0056.jpg",
      "_DSC9944.jpg",
      "_DSC0236.jpg",
      "_DSC0060-Enhanced-NR.jpg",
      "_DSC9923-2.jpg",
      "_DSC9639-Enhanced-NR.jpg",
      "_DSC0167-3.jpg",
      "_DSC9905-2.jpg",
      "_DSC9988-Enhanced-NR.jpg",
      "_DSC0184-Enhanced-NR.jpg",
    ]),
  },
  sisi: {
    slug: "sisi",
    title: "SISI",
    homeThumbSrc: "/thumbnails/sisi.jpg",
    venue: "Harbour",
    date: "2025",
    thumbIsFirstPhoto: true,
    photos: withSlug("sisi", [
      "7R404963-Enhanced-NR.jpg",
      "7R404841-Enhanced-NR.jpg",
      "7R404923-Enhanced-NR.jpg",
      "_7R48642-Enhanced-NR.jpg",
      "7R404822-Enhanced-NR.jpg",
      "7R404830-Enhanced-NR.jpg",
      "7R404912-Enhanced-NR.jpg",
      "7R404945-Enhanced-NR.jpg",
      "7R404851-Enhanced-NR.jpg",
    ]),
  },
  "koji-aiken": {
    slug: "koji-aiken",
    title: "KOJI AIKEN",
    homeThumbSrc: "/thumbnails/koji-aiken.jpg",
    venue: "Harbour",
    date: "2026",
    thumbIsFirstPhoto: true,
    photos: withSlug("koji-aiken", [
      "_DSC3468-Enhanced-NR.jpg",
    ]),
  },
};

// Reverse index for HeroSequence: given a tile's src, find its event slug.
export const EVENT_BY_HOME_THUMB: Record<string, EventSlug> = Object.fromEntries(
  (Object.values(EVENTS) as EventData[]).map((e) => [e.homeThumbSrc, e.slug]),
) as Record<string, EventSlug>;

export function getEvent(slug: string): EventData | undefined {
  return (EVENTS as Record<string, EventData>)[slug];
}

export function allEventSlugs(): EventSlug[] {
  return Object.keys(EVENTS) as EventSlug[];
}
