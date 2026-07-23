import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Fully static site → `next build` emits `out/` for Cloudflare Pages to serve
  // as plain files (no adapter/wrangler needed). Uses plain <img>, so image
  // optimization is off.
  output: "export",
  images: { unoptimized: true },
};

export default nextConfig;
