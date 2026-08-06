// Absolute base for og:image, the sitemap, robots.txt, and JSON-LD. Vercel
// injects the URL vars itself, so deploys resolve absolute URLs without any
// dashboard config:
//   NEXT_PUBLIC_SITE_URL          — set this by hand once a custom domain exists
//   VERCEL_PROJECT_PRODUCTION_URL — the stable production domain
//   VERCEL_URL                    — per-deploy URL, so preview builds work too
// Vercel's vars carry no protocol, hence the https:// prefix.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000");
