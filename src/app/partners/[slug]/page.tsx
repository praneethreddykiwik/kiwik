import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetailContent } from "@/components/partners/product-detail-content";
import { getProductBySlug } from "@/lib/seo-data";
import { absoluteUrl, SITE_NAME } from "@/lib/site";

/**
 * Server wrapper adding per-partner metadata. The client view is unchanged;
 * every field below comes from the same product record the page renders.
 */

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return { title: "Partner not found", robots: { index: false, follow: true } };
  }

  const seo = (product.seo || {}) as Record<string, any>;
  const canonical = seo.canonicalUrl || absoluteUrl(`/partners/${product.slug}`);
  const title = seo.title || `${product.name}${product.tagline ? ` — ${product.tagline}` : ""}`;
  const description =
    seo.description ||
    product.description ||
    product.tagline ||
    `${product.name} — a Kiwik brand partner.`;
  const image = seo.ogImage || product.coverImage;

  return {
    title,
    description,
    alternates: { canonical },
    robots: seo.noIndex === true ? { index: false, follow: true } : { index: true, follow: true },
    openGraph: {
      title: seo.ogTitle || title,
      description: seo.ogDescription || description,
      url: canonical,
      siteName: SITE_NAME,
      type: "article",
      images: image ? [{ url: image, alt: `${product.name} — ${product.tagline || "Kiwik partner"}` }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: seo.twitterTitle || title,
      description: seo.twitterDescription || description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function PartnerDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  // Unknown slug -> real 404 rather than a soft not-found at HTTP 200.
  if (!product) notFound();

  const jsonLd = product
    ? {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: product.name,
        description: product.description || product.tagline,
        url: product.liveUrl || absoluteUrl(`/partners/${product.slug}`),
        ...(product.coverImage ? { image: product.coverImage } : {}),
      }
    : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <ProductDetailContent />
    </>
  );
}
