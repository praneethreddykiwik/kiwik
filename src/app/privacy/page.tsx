import type { Metadata } from "next";
import { absoluteUrl, SITE_NAME } from "@/lib/site";

/**
 * Privacy notice.
 *
 * Every statement here was checked against the code before being written. If
 * the site starts collecting something new, this page has to change with it —
 * a notice that describes a system you no longer run is worse than none.
 */

const TITLE = "Privacy — what Kiwik collects and why";
const DESCRIPTION =
  "What data Kiwik collects, why, how long it is kept, and how to have it removed. No third-party analytics, no advertising trackers, no IP logging.";

const CONTACT_EMAIL = "praneeth@kiwik.one";
const UPDATED = "17 August 2026";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: absoluteUrl("/privacy") },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: absoluteUrl("/privacy"),
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: TITLE }],
  },
};

function Row({ what, why, kept }: { what: string; why: string; kept: string }) {
  return (
    <tr className="border-b border-divider/60 align-top">
      <td className="py-3 pr-4 text-text-primary">{what}</td>
      <td className="py-3 pr-4 text-text-secondary">{why}</td>
      <td className="py-3 text-text-secondary whitespace-nowrap">{kept}</td>
    </tr>
  );
}

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 pt-24 pb-20 sm:px-6 lg:px-8">
      <p className="mb-3 text-[11px] font-mono font-bold uppercase tracking-[0.2em] text-text-muted">
        Privacy
      </p>
      <h1 className="text-4xl font-serif font-semibold leading-[1.1] tracking-tight text-text-primary sm:text-5xl">
        What we collect, and why
      </h1>
      <p className="mt-5 text-lg leading-relaxed text-text-secondary">
        {SITE_NAME} collects the minimum needed to run this site and to reply when you write to
        us. There is no advertising, no profiling, and nothing here is sold or shared for
        marketing.
      </p>
      <p className="mt-2 text-xs text-text-muted">Last updated {UPDATED}.</p>

      <div className="mt-12 space-y-10 text-sm leading-relaxed text-text-secondary">
        <section>
          <h2 className="mb-4 text-lg font-serif font-bold text-text-primary">
            Everything we store
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-left text-xs">
              <thead>
                <tr className="border-b border-divider text-[10px] font-mono font-bold uppercase tracking-wider text-text-muted">
                  <th className="py-2 pr-4">Data</th>
                  <th className="py-2 pr-4">Purpose</th>
                  <th className="py-2">Kept for</th>
                </tr>
              </thead>
              <tbody>
                <Row
                  what="A random session ID"
                  why="Counts how many people are on the site at once. It is generated in your browser, held only for the current tab, and erased when you close it."
                  kept="30 days"
                />
                <Row
                  what="Device category and browser name"
                  why="Tells us whether pages need work on mobile. Stored as a word — “mobile”, “Chrome” — not as a device fingerprint."
                  kept="30 days"
                />
                <Row
                  what="Page path and view count"
                  why="Shows which pages are read. Paths only, such as /projects."
                  kept="30 days"
                />
                <Row
                  what="Contact form entries"
                  why="Your name, email, and message, plus company, phone and service if you fill them in — used only to answer you."
                  kept="Until the enquiry is closed"
                />
                <Row
                  what="Newsletter email"
                  why="Sending release notes, if you ask for them."
                  kept="Until you unsubscribe"
                />
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-serif font-bold text-text-primary">
            What we deliberately do not collect
          </h2>
          <ul className="list-disc space-y-1.5 pl-5">
            <li>
              <strong className="text-text-primary">Your IP address.</strong> It is not written to
              the database at any point. The column that once held it has been removed.
            </li>
            <li>
              <strong className="text-text-primary">Your browser&apos;s User-Agent string.</strong>{" "}
              It is read once to work out “mobile or desktop”, then discarded.
            </li>
            <li>Location, precise or approximate.</li>
            <li>Mouse movement, clicks, keystrokes, or session recordings.</li>
            <li>Any identifier that follows you between visits or across other websites.</li>
            <li>
              Third-party analytics or advertising. There is no Google Analytics, no Meta pixel,
              no Hotjar, and no tag manager on this site.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-serif font-bold text-text-primary">Cookies</h2>
          <p>
            This site sets no cookies for visitors. The single cookie we use,{" "}
            <code className="rounded bg-bg-secondary px-1.5 py-0.5 font-mono text-[11px]">
              kiwik_admin
            </code>
            , is created only when an administrator signs in to the studio, and it holds nothing
            but a signed, expiring session token.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-serif font-bold text-text-primary">
            Where it is stored
          </h2>
          <p>
            In a managed PostgreSQL database hosted by Supabase in the AWS Mumbai region
            (ap-south-1), inside India. The site itself is served by Vercel. Access to the database
            is restricted to the application and to named administrator accounts.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-serif font-bold text-text-primary">
            Your rights, and how to use them
          </h2>
          <p>
            You can ask what we hold about you, ask for it to be corrected, or ask for it to be
            deleted. Email{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-accent-blue hover:underline">
              {CONTACT_EMAIL}
            </a>{" "}
            and we will act on it.
          </p>
          <p className="mt-2">
            Site-usage records are anonymous — a random per-tab ID with no name or address attached
            — so we have no way to connect them back to you, and no way to single yours out. If
            you have written to us or subscribed, that record is identifiable and we can remove it
            on request.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-serif font-bold text-text-primary">
            Why we are allowed to hold it
          </h2>
          <p>
            Contact and newsletter details are processed because you gave them to us for that
            purpose — you asked us to reply, or to send you release notes. Site-usage counts are
            processed to keep the site working and secure. We do not process any of it for
            advertising, and we do not sell or share it.
          </p>
          <p className="mt-2">
            We do not knowingly collect anything from children. If you believe a child has sent us
            personal data, write to us and we will delete it.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-serif font-bold text-text-primary">
            Complaints
          </h2>
          <p>
            If you are unhappy with how we have handled your data, write to{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-accent-blue hover:underline">
              {CONTACT_EMAIL}
            </a>{" "}
            and we will respond. Under India&apos;s Digital Personal Data Protection Act you may
            also raise the matter with the Data Protection Board of India if our response does not
            resolve it.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-serif font-bold text-text-primary">Changes</h2>
          <p>
            If we begin collecting anything not listed above, this page changes first, and the date
            at the top changes with it.
          </p>
        </section>

        <section className="rounded-2xl border border-glass-border bg-bg-secondary/40 p-6">
          <h2 className="mb-2 text-sm font-bold text-text-primary">Questions</h2>
          <p className="text-xs">
            Write to{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-accent-blue hover:underline">
              {CONTACT_EMAIL}
            </a>{" "}
            or use the{" "}
            <a href="/contact" className="text-accent-blue hover:underline">
              contact form
            </a>
            .
          </p>
        </section>
      </div>
    </main>
  );
}
