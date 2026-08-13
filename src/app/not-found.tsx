import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found",
  // A 404 must never be indexed, but its links should still be followed so
  // crawlers can find their way back into the real site.
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center">
      <span className="text-[11px] font-mono font-bold uppercase tracking-[0.2em] text-text-muted">
        404
      </span>
      <h1 className="mt-3 text-3xl sm:text-4xl font-serif font-bold text-text-primary">
        This page doesn&apos;t exist
      </h1>
      <p className="mt-3 max-w-md text-sm sm:text-base text-text-secondary leading-relaxed">
        The page you were looking for has been moved, renamed, or never existed.
        Here are the places worth trying instead.
      </p>

      <nav className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="px-5 py-2.5 rounded-full bg-accent-blue text-white font-bold text-sm hover:scale-[1.02] transition-transform"
        >
          Home
        </Link>
        <Link
          href="/projects"
          className="px-5 py-2.5 rounded-full bg-glass-bg border border-glass-border text-text-primary font-bold text-sm hover:bg-bg-secondary transition-colors"
        >
          Projects
        </Link>
        <Link
          href="/docs"
          className="px-5 py-2.5 rounded-full bg-glass-bg border border-glass-border text-text-primary font-bold text-sm hover:bg-bg-secondary transition-colors"
        >
          Documentation
        </Link>
        <Link
          href="/about"
          className="px-5 py-2.5 rounded-full bg-glass-bg border border-glass-border text-text-primary font-bold text-sm hover:bg-bg-secondary transition-colors"
        >
          About Kiwik
        </Link>
      </nav>
    </div>
  );
}
