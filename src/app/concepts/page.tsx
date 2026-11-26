import Link from "next/link";
import { CONCEPTS, type Concept } from "@/components/concepts/list";

function Grid({ items }: { items: Concept[] }) {
  return (
    <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((c) => (
        <li key={c.id}>
          <Link href={`/concepts/${c.id}`} className="group flex h-full flex-col overflow-hidden rounded-[24px] border border-text-primary/12 transition-transform duration-300 hover:-translate-y-1">
            <span aria-hidden="true" className="flex h-36">
              {c.swatch.map((s, i) => <span key={s} className="transition-[flex-grow] duration-500" style={{ background: s, flexGrow: i === 0 ? 3 : 1 }} />)}
            </span>
            <span className="flex flex-1 flex-col p-6">
              <span className="text-2xl font-serif font-bold text-text-primary">{c.id}. {c.name}</span>
              <span className="mt-2 text-base leading-relaxed text-text-secondary">{c.idea}</span>
              <span className="mt-auto pt-4 text-sm font-semibold text-[#007a78] dark:text-[#4fc3bd]">{c.motion}</span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default function ConceptsIndex() {
  return (
    <div className="mx-auto max-w-[1400px] px-5 pt-36 pb-24 md:px-8">
      <h1 className="text-4xl font-serif font-bold tracking-tight text-text-primary sm:text-6xl">Twenty ways in</h1>
      <p className="mt-4 max-w-2xl text-lg text-text-secondary">Open one, then use the arrow keys to move through them.</p>
      <h2 className="mt-16 text-2xl font-serif font-bold text-text-primary sm:text-3xl">The live hero, a new picture</h2>
      <p className="mt-2 max-w-2xl text-base text-text-secondary">Same badge, headline and words as kiwik.one today. Only the photo ribbon is replaced.</p>
      <Grid items={CONCEPTS.filter((c) => c.id > 10)} />
      <h2 className="mt-20 text-2xl font-serif font-bold text-text-primary sm:text-3xl">Whole new landing pages</h2>
      <Grid items={CONCEPTS.filter((c) => c.id <= 10)} />
    </div>
  );
}
