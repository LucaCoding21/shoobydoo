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

// Hand-written SEO strings per event. All copy rules: no em dashes anywhere,
// titles ~60 chars where the venue name allows, descriptions under 155 chars,
// blurbs 100-150 words of crawlable text rendered on the gallery page.
export type EventSeo = {
  /** Full <title> text, set via title.absolute (the "| Shoobydoo" suffix from
      the root template would double the name, so it's baked in here). */
  title: string;
  /** Meta description. */
  description: string;
  /** Alt text applied to every photo in the gallery, following
      "{Artist} performing at {Venue}, {City}, {Year}" (or the crowd variant
      for festivals, where frames mix performers and audience). */
  photoAlt: string;
  /** Crawlable intro paragraph rendered on the gallery page. */
  blurb: string;
  /** Venue for the JSON-LD Place. Omitted for festivals that are their own
      place; the city then names the location. */
  venueName?: string;
  locality: string;
  region: string;
};

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
  seo: EventSeo;
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
    seo: {
      title: "NGHTMRE at Harbour Event Centre 2025 | Concert Photos by Shoobydoo",
      description:
        "NGHTMRE live at Harbour Event Centre, Vancouver, BC, 2025. Full photo gallery by Vancouver concert photographer Shoobydoo.",
      photoAlt: "NGHTMRE performing at Harbour Event Centre, Vancouver, BC, 2025",
      venueName: "Harbour Event Centre",
      locality: "Vancouver",
      region: "BC",
      blurb:
        "NGHTMRE at Harbour Event Centre, Vancouver, BC, 2025. This gallery collects photos from a night of heavyweight bass at one of Vancouver's busiest waterfront venues. Shot from the pit and from inside the crowd, the set covered everything a NGHTMRE show promises: hard drops, a relentless light rig, and a floor that never stopped moving. The frames here follow the full arc of the evening, from the first build to the final drop, with as much attention on the crowd as on the stage. Every image was photographed live, with no staging and no reshoots. Shoobydoo is a concert and live music photographer based in Vancouver, BC, shooting club shows, festivals, and tours across the city and beyond. For bookings or print inquiries, get in touch through the contact page.",
    },
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
    seo: {
      title: "PHRVA at Village Studios 2025 | Concert Photos by Shoobydoo",
      description:
        "PHRVA live at Village Studios, Vancouver, BC, 2025. Full photo gallery by Vancouver concert photographer Shoobydoo.",
      photoAlt: "PHRVA performing at Village Studios, Vancouver, BC, 2025",
      venueName: "Village Studios",
      locality: "Vancouver",
      region: "BC",
      blurb:
        "PHRVA at Village Studios, Vancouver, BC, 2025. Village Studios trades big-room scale for something closer and louder, and this set leaned into that. The gallery below was shot in the middle of it, close enough to catch the sweat on the rail and the light bleeding through the haze. Smaller rooms are where live photography gets interesting: the light is harder, the crowd is tighter, and every frame has to be earned. These photos follow PHRVA's set from the opening tracks to the closing run, alongside the crowd that kept the floor moving all night. Photographed live by Shoobydoo, a concert and live music photographer based in Vancouver, BC, available for club shows, festivals, tours, and editorial work. For bookings, reach out through the contact page.",
    },
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
    seo: {
      title: "Restricted at Harbour Event Centre 2025 | Photos by Shoobydoo",
      description:
        "Restricted live at Harbour Event Centre, Vancouver, BC, 2025. Full photo gallery by Vancouver concert photographer Shoobydoo.",
      photoAlt: "Restricted performing at Harbour Event Centre, Vancouver, BC, 2025",
      venueName: "Harbour Event Centre",
      locality: "Vancouver",
      region: "BC",
      blurb:
        "Restricted at Harbour Event Centre, Vancouver, BC, 2025. A tight set of frames from a heavy night of bass music on Vancouver's waterfront. Harbour Event Centre gives a show two things a photographer loves: a high stage that silhouettes an artist against the rig, and a floor packed close enough that the energy reads in every shot. This gallery pulls the strongest moments from Restricted's set, from full-room light moments to the faces in the front row. Every photo was taken live during the show, unposed and unstaged. Shoobydoo is a concert and live music photographer based in Vancouver, BC, shooting club nights, festivals, and tours. If you want this kind of coverage for your own show, booking details are on the contact page.",
    },
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
    seo: {
      title: "Viperactive at Harbour Event Centre 2025 | Photos by Shoobydoo",
      description:
        "Viperactive live at Harbour Event Centre, Vancouver, BC, 2025. Full photo gallery by Vancouver concert photographer Shoobydoo.",
      photoAlt: "Viperactive performing at Harbour Event Centre, Vancouver, BC, 2025",
      venueName: "Harbour Event Centre",
      locality: "Vancouver",
      region: "BC",
      blurb:
        "Viperactive at Harbour Event Centre, Vancouver, BC, 2025. Heavy bass in a room built for it. This gallery was shot over the course of Viperactive's set at Harbour Event Centre, from the rail and from deep in the crowd, chasing the split seconds when the lights, the artist, and the floor all line up. Low light and hard strobes make bass shows some of the toughest rooms to photograph and some of the most rewarding, and these frames aim to put you back in the middle of it. All images were captured live during the show. Shoobydoo is a concert and live music photographer based in Vancouver, BC, covering club shows, festivals, and tours. Available for bookings through the contact page.",
    },
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
    seo: {
      title: "Insomnia Festival 2025 | Concert Photos by Shoobydoo",
      description:
        "Insomnia Festival 2025 in Vancouver, BC. Full festival photo gallery by Vancouver concert photographer Shoobydoo.",
      photoAlt: "Crowd and stage at Insomnia Festival 2025, Vancouver, BC",
      locality: "Vancouver",
      region: "BC",
      blurb:
        "Insomnia Festival 2025, Vancouver, BC. Festivals ask a different kind of photography than club shows: bigger stages, bigger crowds, and light that changes by the hour. This gallery collects frames from across Insomnia 2025, from main stage sets under full production to the quieter moments between them, the lineups, the lasers, and the sea of people that make a festival what it is. Shot over the full run of the event, these photos try to hold on to the scale of the thing: the moment the beat cuts, the crowd goes up, and the whole field moves at once. Photographed by Shoobydoo, a concert and live music photographer based in Vancouver, BC, covering festivals, club shows, and tours. For coverage of your event, get in touch through the contact page.",
    },
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
    seo: {
      title: "Insomnia Festival 2026 | Concert Photos by Shoobydoo",
      description:
        "Insomnia Festival 2026 in Vancouver, BC. Full festival photo gallery by Vancouver concert photographer Shoobydoo.",
      photoAlt: "Crowd and stage at Insomnia Festival 2026, Vancouver, BC",
      locality: "Vancouver",
      region: "BC",
      blurb:
        "Insomnia Festival 2026, Vancouver, BC. Insomnia returned in 2026, and this gallery is the record of it. Shot across the festival from the pit, the crowd, and the edges of the field, these frames cover headline sets under full lasers, wide shots of the stage design, and the crowd that filled the space between. Some of these photos are among the most shared work on this site, including the wide stage frame that became the site's own cover image. Everything here was captured live during the festival with no staging. Shoobydoo is a concert and live music photographer based in Vancouver, BC, shooting festivals, club shows, and tours across the region. Booking inquiries for festivals and events are open through the contact page.",
    },
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
    seo: {
      title: "SVDDEN DEATH at Harbour Event Centre 2026 | Photos by Shoobydoo",
      description:
        "SVDDEN DEATH live at Harbour Event Centre, Vancouver, BC, 2026. Full photo gallery by Vancouver concert photographer Shoobydoo.",
      photoAlt: "SVDDEN DEATH performing at Harbour Event Centre, Vancouver, BC, 2026",
      venueName: "Harbour Event Centre",
      locality: "Vancouver",
      region: "BC",
      blurb:
        "SVDDEN DEATH at Harbour Event Centre, Vancouver, BC, 2026. Few names in dubstep bring the kind of low end SVDDEN DEATH does, and this show at Harbour Event Centre hit as hard as expected. This is one of the largest galleries on the site: a full night of frames from the rail, the pit, and the floor, tracking the set through strobes, haze, and a crowd that never let up. The aim in every shot is the same: make it feel the way it sounded. All photos were taken live during the performance. Shoobydoo is a concert and live music photographer based in Vancouver, BC, available for club shows, festivals, tours, and editorial commissions. For booking details, head to the contact page.",
    },
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
    seo: {
      title: "FVDED in the Park 2026 at Holland Park | Photos by Shoobydoo",
      description:
        "FVDED in the Park 2026 at Holland Park, Surrey, BC. Full festival photo gallery by Vancouver concert photographer Shoobydoo.",
      photoAlt: "Crowd and stage at FVDED in the Park 2026, Holland Park, Surrey, BC",
      venueName: "Holland Park",
      locality: "Surrey",
      region: "BC",
      blurb:
        "FVDED in the Park 2026 at Holland Park, Surrey, BC. An open-air festival brings its own rhythm: daylight sets that turn golden, then full production after dark. This gallery follows FVDED in the Park across that whole arc, from afternoon crowds on the grass to headline sets under the night sky. Outdoor stages give photography room to breathe, and these frames use it, mixing wide shots that show the scale of the park with close moments from the rail. Every image was shot live over the course of the festival. Shoobydoo is a concert and live music photographer based in Vancouver, BC, shooting festivals, club shows, and tours across Metro Vancouver and beyond. To talk about covering your festival or event, get in touch through the contact page.",
    },
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
    seo: {
      title: "Barely Alive at Harbour Event Centre 2026 | Photos by Shoobydoo",
      description:
        "Barely Alive live at Harbour Event Centre, Vancouver, BC, 2026. Full photo gallery by Vancouver concert photographer Shoobydoo.",
      photoAlt: "Barely Alive performing at Harbour Event Centre, Vancouver, BC, 2026",
      venueName: "Harbour Event Centre",
      locality: "Vancouver",
      region: "BC",
      blurb:
        "Barely Alive at Harbour Event Centre, Vancouver, BC, 2026. Dubstep shows reward photographers who wait: the best frames land in the half second between the build and the drop, when the lights flare and the whole floor jumps at once. This gallery is built from those moments across Barely Alive's set at Harbour Event Centre, along with the crowd shots that carry the other half of the story. Everything was shot from the pit and from inside the audience, unposed and in the moment. Shoobydoo is a concert and live music photographer based in Vancouver, BC, covering club shows, festivals, tours, and editorial work across the city. Booking inquiries are always open through the contact page.",
    },
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
    seo: {
      title: "SISI at Harbour Event Centre 2025 | Concert Photos by Shoobydoo",
      description:
        "SISI live at Harbour Event Centre, Vancouver, BC, 2025. Full photo gallery by Vancouver concert photographer Shoobydoo.",
      photoAlt: "SISI performing at Harbour Event Centre, Vancouver, BC, 2025",
      venueName: "Harbour Event Centre",
      locality: "Vancouver",
      region: "BC",
      blurb:
        "SISI at Harbour Event Centre, Vancouver, BC, 2025. This gallery collects frames from SISI's set at Harbour Event Centre, shot from the rail and the floor over the course of the night. Club shows on this scale sit in a sweet spot for live photography: enough production to paint the room in colour, and a crowd close enough to the stage that both fit in a single frame. These photos chase that overlap, the artist mid-set with the audience right there in the shot. Everything here was captured live, with no posing and no reshoots. Shoobydoo is a concert and live music photographer based in Vancouver, BC, available for club shows, festivals, tours, and press coverage. For bookings, reach out through the contact page.",
    },
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
    seo: {
      title: "Koji Aiken at Harbour Event Centre 2026 | Photos by Shoobydoo",
      description:
        "Koji Aiken live at Harbour Event Centre, Vancouver, BC, 2026. Photos by Vancouver concert photographer Shoobydoo.",
      photoAlt: "Koji Aiken performing at Harbour Event Centre, Vancouver, BC, 2026",
      venueName: "Harbour Event Centre",
      locality: "Vancouver",
      region: "BC",
      blurb:
        "Koji Aiken at Harbour Event Centre, Vancouver, BC, 2026. This gallery currently holds a single frame from Koji Aiken's set at Harbour Event Centre: the artist, the light, and the room, all caught in the same instant. Sometimes one photo carries a whole night. Live sets move fast, and the job is to be ready when the moment that defines them arrives. More of Shoobydoo's recent work is on Instagram and across the other galleries on this site, from club shows on Vancouver's waterfront to full festival weekends. Shoobydoo is a concert and live music photographer based in Vancouver, BC, shooting club shows, festivals, tours, and editorial commissions. For booking inquiries or prints, head to the contact page.",
    },
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
