import { notFound } from "next/navigation";
import { ConceptBar } from "@/components/concepts/concept-bar";
import { ConceptView } from "@/components/concepts/view";
import { CONCEPTS } from "@/components/concepts/list";

export default async function ConceptPage({ params }: { params: Promise<{ id: string }> }) {
  const id = Number((await params).id);
  if (!CONCEPTS.some((c) => c.id === id)) notFound();
  return (
    <>
      <ConceptView id={id} />
      <ConceptBar id={id} />
    </>
  );
}
