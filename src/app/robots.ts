import type { MetadataRoute } from "next";
import { SITE_URL, absoluteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // The studio, the API and any auth surface carry no indexable content
        // and some of it is admin-only; keeping crawlers out avoids wasting
        // crawl budget and surfacing endpoints in search results.
        disallow: [
          "/admin",
          "/admin/",
          "/api/",
          "/login",
          "/auth",
          "/dashboard",
          "/private/",
        ],
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: SITE_URL,
  };
}
