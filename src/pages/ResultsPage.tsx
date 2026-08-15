import { EditorialPageHero } from "@/components/shared/editorial-page-hero";
import { TreatmentCaseCard } from "@/components/results/treatment-case-card";
import { treatmentCases } from "@/lib/reference-content/treatment-cases";

export function ResultsPage() {
  return <main className="min-h-screen bg-paper"><EditorialPageHero badge="До и после" title="Результаты лечения" description="Клинические случаи наших специалистов. Каждый план лечения индивидуален." /><section className="mx-auto grid max-w-7xl gap-6 px-5 pb-20 md:grid-cols-2">{treatmentCases.map((item) => <TreatmentCaseCard key={item.id} treatmentCase={item} />)}</section></main>;
}
