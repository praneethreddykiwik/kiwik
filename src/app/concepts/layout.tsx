import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { conceptFonts } from "@/components/concepts/fonts";

export const metadata: Metadata = { title: "Landing page concepts", robots: { index: false, follow: false } };

/** For choosing between designs on a developer's machine. Not part of the live site. */
export default function ConceptsLayout({ children }: { children: React.ReactNode }) {
  if (process.env.NODE_ENV === "production") notFound();
  return <div className={`${conceptFonts} concept -mt-[72px]`}>{children}</div>;
}
