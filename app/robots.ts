import type { MetadataRoute } from "next";

// Emit a static robots.txt at build time (required for `output: export`).
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/type-preview", "/api/"],
      },
    ],
    sitemap: "https://www.ockno.com/sitemap.xml",
  };
}
