import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cache Components is left OFF for the MVP: we want predictable SSG/SSR.
  // `searchParams` and current-time reads (freshness checks) are normal dynamic
  // behaviour here, not errors to design around. Revisit if caching is needed.
  cacheComponents: false,
  // Allow the Playwright dev server (loopback) to fetch dev resources.
  allowedDevOrigins: ["127.0.0.1"],
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
