import type { Metadata } from "next";
import { ContactForm } from "./contact-form";
import { PageIntro } from "@/components/layout/page-intro";
import { toServiceOption } from "@/lib/contact-options";
import { absoluteUrl, SITE_NAME } from "@/lib/site";

const TITLE = "Contact Kiwik — Talk to the team";
const DESCRIPTION =
  "Tell Kiwik about the website, app, AI system or online store you want to build. Send a message and we'll reply to you directly.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: absoluteUrl("/contact") },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: absoluteUrl("/contact"),
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: TITLE }],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: ["/og-image.png"] },
};

const CONTACT_EMAIL = "praneeth@kiwik.one";

const NEXT = [
  { title: "We read it and reply", text: "Usually within two working days, with any questions we have." },
  { title: "We talk it through", text: "Until we both understand the problem and what would fix it." },
  { title: "You get a plan", text: "What we would build, the time and the cost. Then you decide." },
];

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string }>;
}) {
  // ?service= lets CTAs elsewhere open the form with their service already
  // chosen. Validated against the same list the dropdown is built from, so an
  // arbitrary query value cannot inject text into the select.
  const { service } = await searchParams;
  const initialService = toServiceOption(service);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ContactPage",
            name: TITLE,
            description: DESCRIPTION,
            url: absoluteUrl("/contact"),
            mainEntity: {
              "@type": "Organization",
              name: SITE_NAME,
              url: absoluteUrl("/"),
              email: CONTACT_EMAIL,
            },
          }),
        }}
      />

      <div className="pb-12">
        <PageIntro
          title="Tell us what is going wrong"
          lead="Or what you want to build. Plain words are enough. Your message reaches the team directly, and we usually reply within two working days."
        />
        <div className="mx-auto grid max-w-[1400px] gap-12 px-4 sm:px-6 md:px-8 lg:grid-cols-[1.5fr_1fr] lg:gap-20">
          <ContactForm initialService={initialService} />
          <aside className="h-fit rounded-[28px] bg-[#1a2150] p-8 text-white sm:p-10 lg:sticky lg:top-28">
            <h2 className="text-3xl font-serif font-bold tracking-tight">What happens next</h2>
            <ol className="mt-6 space-y-6">
              {NEXT.map(({ title, text }, i) => (
                <li key={title} className="grid grid-cols-[2.25rem_1fr]">
                  <span aria-hidden="true" className="text-2xl font-serif font-bold text-[#8fe3dd] lining-nums">{i + 1}</span>
                  <div>
                    <h3 className="text-lg font-bold">{title}</h3>
                    <p className="mt-1 text-base leading-relaxed text-white/80">{text}</p>
                  </div>
                </li>
              ))}
            </ol>
            <p className="mt-8 border-t border-white/20 pt-6 text-base text-white/80">
              Rather write an email?{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="break-all font-bold text-white underline underline-offset-4">{CONTACT_EMAIL}</a>
            </p>
          </aside>
        </div>
      </div>
    </>
  );
}
