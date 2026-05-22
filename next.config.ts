import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Defaults to [75]; we use 95 for the rush/grid photos and 100 for the
    // sword (a line illustration that benefits from no compression artifacts).
    qualities: [75, 95, 100],
    // Gallery photos are served from Dropbox shared links. The `www.dropbox.com`
    // host redirects to `dl.dropboxusercontent.com` for `?raw=1` URLs, so both
    // need to be allowed for next/image to optimize them.
    remotePatterns: [
      { protocol: "https", hostname: "www.dropbox.com" },
      { protocol: "https", hostname: "dl.dropboxusercontent.com" },
    ],
  },
};

export default nextConfig;
