import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/community/beware/goa", destination: "/community/beware/goa-india", permanent: false },
    ];
  },
};

export default nextConfig;
