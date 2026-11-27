import { SITE_URL, SITE_DESCRIPTION } from "@/lib/site";
import { SERVICES } from "@/data/home-content";
import { getPublicProjects } from "@/lib/seo-data";

/**
 * /llms.txt — a plain-text summary for AI answer engines.
 *
 * Honest position on this: no major engine has committed to reading llms.txt,
 * so it is not why the site will get cited. It is here because it costs one
 * route, it is generated from the same database as the pages, and it states
 * plainly what Kiwik IS — which is the thing retrieval systems actually need
 * and which the client-rendered pages currently bury behind JavaScript.
 */
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  let projectLines = "";
  try {
    const projects = await getPublicProjects();
    projectLines = (projects || [])
      .filter((p) => p?.name)
      .map((p) => {
        const summary = p.tagline || p.description || "";
        return `- [${p.name}](${SITE_URL}/projects/${p.slug}): ${summary}`.trim();
      })
      .join("\n");
  } catch {
    // The file is still useful without the project list; never fail the route.
  }

  const body = `# Kiwik

> ${SITE_DESCRIPTION}

Kiwik is a software, app and AI development company, reachable at ${SITE_URL}.
It is not a physical product, a wearable, or a piece of jewellery, and is distinct from Kiwix.

## Services
${SERVICES.map((s) => `- ${s.title}: ${s.desc}`).join("\n")}

## Projects
${projectLines || "- Project list unavailable at time of generation."}

## Pages
- [Home](${SITE_URL}/): services, work and process.
- [Projects](${SITE_URL}/projects): products built by Kiwik.
- [About](${SITE_URL}/about): what Kiwik does, how it works and what it has built.
- [Digital Market Partner](${SITE_URL}/partners): brands that work with Kiwik.

## Contact
- info@kiwik.one
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
