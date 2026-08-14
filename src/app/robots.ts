import type { MetadataRoute } from "next";
import { SITE_URL, absoluteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  // The studio, the API and any auth surface carry no indexable content and
  // some of it is admin-only; keeping crawlers out avoids wasting crawl budget
  // and surfacing endpoints in search results.
  const disallow = ["/admin", "/admin/", "/api/", "/login", "/auth", "/dashboard", "/private/"];

  return {
    rules: [
      { userAgent: "*", allow: "/", disallow },

      // Answer engines are named explicitly rather than left to the wildcard.
      // Several of them only read a rule addressed to their own token, and a
      // site that wants to be quoted in AI answers has to be readable by the
      // crawlers that build those answers. Google-Extended governs Gemini and
      // AI Overviews grounding specifically — it is separate from Googlebot,
      // so allowing Googlebot does not by itself opt the site in.
      { userAgent: "Googlebot", allow: "/", disallow },
      { userAgent: "Googlebot-Image", allow: "/", disallow },
      { userAgent: "Google-Extended", allow: "/", disallow },
      { userAgent: "Bingbot", allow: "/", disallow },
      { userAgent: "GPTBot", allow: "/", disallow },
      { userAgent: "OAI-SearchBot", allow: "/", disallow },
      { userAgent: "ChatGPT-User", allow: "/", disallow },
      { userAgent: "ClaudeBot", allow: "/", disallow },
      { userAgent: "Claude-User", allow: "/", disallow },
      { userAgent: "PerplexityBot", allow: "/", disallow },
      { userAgent: "Applebot", allow: "/", disallow },
      { userAgent: "Applebot-Extended", allow: "/", disallow },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: SITE_URL,
  };
}
