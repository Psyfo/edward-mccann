import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";

const nextConfig: NextConfig = {
  // Self-hosted on Coolify: standalone bundles only the runtime files needed,
  // which keeps the container small and the boot fast.
  output: "standalone",

  // Imagery is pre-processed to fixed widths and formats by
  // tools/prepare-media.mjs and served straight from the bucket, so the app
  // server never optimises an image at request time.
  images: { unoptimized: true },

  async redirects() {
    return [
      // The legacy site's About page. Every other legacy route keeps its path,
      // including all 27 /projects/<slug> URLs.
      { source: "/about", destination: "/practice", permanent: true },
      // Legacy concrete5 dispatcher aliases.
      { source: "/index.php", destination: "/", permanent: true },
      { source: "/index.php/:path*", destination: "/:path*", permanent: true },
      { source: "/page_not_found", destination: "/", permanent: true },
    ];
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
        ],
      },
    ];
  },
};

export default withPayload(nextConfig);
