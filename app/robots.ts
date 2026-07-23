import type { MetadataRoute } from "next";

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
