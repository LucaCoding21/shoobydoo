// Absolute base for canonicals, og:image, the sitemap, robots.txt, and JSON-LD.
// Hardcoded to the production domain so every absolute URL in metadata resolves
// to www.shoobydoo.ca (never the *.vercel.app deploy host, which next.config
// also 308-redirects here). NEXT_PUBLIC_SITE_URL remains as an escape hatch for
// staging environments that need a different base.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.shoobydoo.ca";
