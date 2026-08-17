import type { Metadata } from "next";
import { Mail, MessageSquare, Clock } from "lucide-react";
import { ContactForm } from "./contact-form";
import { absoluteUrl, SITE_NAME } from "@/lib/site";

const TITLE = "Contact Kiwik — Talk to the team";
const DESCRIPTION =
  "Get in touch with Kiwik about a project, a partnership, or the platform. Send a message and we'll reply to you directly.";

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

export default function ContactPage() {
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

      <main className="mx-auto max-w-6xl px-4 pt-24 pb-20 sm:px-6 lg:px-8">
        <header className="mb-12 max-w-2xl">
          <p className="mb-3 text-[11px] font-mono font-bold uppercase tracking-[0.2em] text-text-muted">
            Contact
          </p>
          <h1 className="text-4xl font-serif font-semibold leading-[1.1] tracking-tight text-text-primary sm:text-5xl">
            Talk to us
          </h1>
          {/* Server-rendered prose, so this page says something to a crawler
              even before any JavaScript runs. */}
          <p className="mt-5 text-lg leading-relaxed text-text-secondary">
            Kiwik is the operating system for digital products. Whether you have a project to
            build, a partnership in mind, or a question about the platform, send it here and it
            reaches us directly.
          </p>
        </header>

        <div className="grid gap-12 lg:grid-cols-[1fr_320px] lg:gap-16">
          <div className="order-2 lg:order-1">
            <ContactForm />
          </div>

          <aside className="order-1 space-y-6 lg:order-2">
            <div className="rounded-2xl border border-glass-border bg-bg-secondary/50 p-6">
              <Mail className="mb-3 h-5 w-5 text-accent-blue" />
              <h2 className="text-sm font-bold text-text-primary">Email us</h2>
              <p className="mt-1 text-xs leading-relaxed text-text-secondary">
                Prefer your own mail client?
              </p>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="mt-2 inline-block break-all text-xs font-semibold text-accent-blue hover:underline"
              >
                {CONTACT_EMAIL}
              </a>
            </div>

            <div className="rounded-2xl border border-glass-border bg-bg-secondary/50 p-6">
              <Clock className="mb-3 h-5 w-5 text-accent-blue" />
              <h2 className="text-sm font-bold text-text-primary">Response time</h2>
              <p className="mt-1 text-xs leading-relaxed text-text-secondary">
                We read everything that comes in and usually reply within two working days.
              </p>
            </div>

            <div className="rounded-2xl border border-glass-border bg-bg-secondary/50 p-6">
              <MessageSquare className="mb-3 h-5 w-5 text-accent-blue" />
              <h2 className="text-sm font-bold text-text-primary">Looking for the work?</h2>
              <p className="mt-1 text-xs leading-relaxed text-text-secondary">
                The{" "}
                <a href="/projects" className="text-accent-blue hover:underline">
                  projects
                </a>{" "}
                and{" "}
                <a href="/partners" className="text-accent-blue hover:underline">
                  partner
                </a>{" "}
                pages cover what Kiwik runs today.
              </p>
            </div>
          </aside>
        </div>
      </main>
    </>
  );
}
