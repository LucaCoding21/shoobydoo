import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Defaults to [75]; we use 95 for the rush/grid photos and 100 for the
    // sword (a line illustration that benefits from no compression artifacts).
    qualities: [75, 95, 100],
  },
};

export default nextConfig;
