import type { MetadataRoute } from "next";
import { allEventSlugs } from "@/data/events";
import { SITE_URL } from "@/lib/siteUrl";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/about`, changeFrequency: "yearly", priority: 0.8 },
    { url: `${SITE_URL}/contact`, changeFrequency: "yearly", priority: 0.8 },
    ...allEventSlugs().map((slug) => ({
      url: `${SITE_URL}/events/${slug}`,
      changeFrequency: "yearly" as const,
      priority: 0.7,
    })),
  ];
}
