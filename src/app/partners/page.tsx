"use client";

import Link from "next/link";
import * as LucideIcons from "lucide-react";
import { ArrowRight, Radar, Layers, Handshake, Activity } from "lucide-react";
import { PageIntro, primaryButton, textLink } from "@/components/layout/page-intro";
import { cn } from "@/lib/utils";
import { useProducts } from "@/stores/products-store";
import { useSiteCMS } from "@/stores/site-cms-store";

const CONTACT = "/contact?service=Digital%20Market%20Partnership";

// Distinctive, non-generic defaults. Overridable via the admin (cms.partnersPage).
const DEFAULTS = {
  headline: "Bring more customers",
  headlineAccent: "to your brand",
  subhead:
    "For businesses with something good to sell and not enough people seeing it. We plan the campaign, build the website or app it needs, and keep improving it with you.",
  servicesTitle: "What we do for a brand",
  servicesSub: "From finding your customers to measuring what worked.",
  showcaseTitle: "A brand we work with",
};

const SERVICES = [
  {
    icon: Radar,
    name: "Audience research",
    body: "We find where your customers already are and what brings them to a decision.",
  },
  {
    icon: Layers,
    name: "Creative and content",
    body: "Campaigns, pages and content designed to keep working after launch.",
  },
  {
    icon: Handshake,
    name: "Shared upside",
    body: "Affiliate arrangements tied to revenue, so we earn when you grow.",
  },
  {
    icon: Activity,
    name: "Measurement",
    body: "We keep measuring the results and change what is not working.",
  },
];

export default function PartnersPage() {
  const products = useProducts();
  const cms = useSiteCMS();
  const p = (cms as any).partnersPage || {};
  const copy = { ...DEFAULTS, ...p };
  const services = Array.isArray(p.services) && p.services.length > 0 ? p.services : SERVICES;

  return (
    <div className="pb-8">
      <PageIntro title={<>{copy.headline} <span className="block">{copy.headlineAccent}</span></>} lead={copy.subhead}>
        {/* Opens the contact form with the service already chosen, so the
            enquiry lands in the studio inbox rather than a mail client. */}
        <Link href={CONTACT} className={primaryButton}>Talk about your brand <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
        {products.length > 0 && <a href="#showcase" className={textLink}>See a brand we work with</a>}
      </PageIntro>

      <section className="mx-auto grid max-w-[1400px] gap-8 px-4 py-12 sm:px-6 md:px-8 md:py-16 lg:grid-cols-[1fr_2fr]">
        <div>
          <h2 className="text-3xl md:text-4xl font-serif font-bold tracking-tight text-text-primary">{copy.servicesTitle}</h2>
          <p className="mt-3 text-lg text-text-secondary">{copy.servicesSub}</p>
        </div>
        <ul className="grid gap-x-10 sm:grid-cols-2">
          {services.map((s: any, i: number) => {
            const Icon = (s.iconName && (LucideIcons as any)[s.iconName]) || s.icon || LucideIcons.Activity;
            return (
              <li key={s.name || i} className="border-t border-text-primary/10 py-6">
                <Icon className="h-6 w-6 text-[#007a78] dark:text-[#4fc3bd]" aria-hidden="true" />
                <h3 className="mt-3 text-lg font-bold text-text-primary">{s.name}</h3>
                <p className="mt-1 text-base leading-relaxed text-text-secondary text-pretty">{s.body}</p>
              </li>
            );
          })}
        </ul>
      </section>

      {products.length > 0 && (
        <section id="showcase" className="mx-auto max-w-[1400px] scroll-mt-24 px-4 py-12 sm:px-6 md:px-8 md:py-16">
          <h2 className="text-3xl md:text-4xl font-serif font-bold tracking-tight text-text-primary">{copy.showcaseTitle}</h2>
          <ul className={cn("mt-8 grid gap-8", products.length > 1 && "md:grid-cols-2")}>
            {products.map((product) => (
              <li key={product.id}>
                <Link href={`/partners/${product.slug}`} className={cn("group grid overflow-hidden rounded-[28px] border border-text-primary/10 bg-bg-elevated dark:bg-bg-secondary", products.length === 1 && "lg:grid-cols-[1.4fr_1fr]")}>
                  {product.coverImage && (
                    <img src={product.coverImage} alt="" loading="lazy" className="aspect-[16/10] h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.02]" />
                  )}
                  <div className="flex flex-col justify-center p-8 sm:p-12">
                    {product.category && <p className="text-base font-semibold text-[#007a78] dark:text-[#4fc3bd]">{product.category}</p>}
                    <h3 className="mt-1 text-3xl sm:text-4xl font-serif font-bold tracking-tight text-text-primary">{product.name}</h3>
                    <p className="mt-4 text-lg leading-relaxed text-text-secondary text-pretty">{product.summary || product.tagline}</p>
                    <span className="mt-6 inline-flex items-center gap-2 text-base font-bold text-text-primary">See {product.name} <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" /></span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
