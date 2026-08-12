import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Every quality actually requested must be listed or Next rounds it to the
    // nearest configured value: 75 thumbnails/decor, 80 next-gallery card,
    // 90 lightbox.
    qualities: [75, 80, 90],
  },
  async redirects() {
    return [
      // The production deployment stays reachable at shoobydoo.vercel.app,
      // which Google would index as a duplicate site. 308 it to the real
      // domain. Preview deploys (*-git-*.vercel.app etc.) don't match this
      // host, keeping them usable; Vercel already noindexes previews.
      {
        source: "/:path*",
        has: [{ type: "host", value: "shoobydoo.vercel.app" }],
        destination: "https://www.shoobydoo.ca/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
