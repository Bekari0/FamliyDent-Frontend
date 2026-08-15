import { GraduationCap } from "lucide-react";
import { EditorialPageHero } from "@/components/shared/editorial-page-hero";
import { ScrollAnimate } from "@/components/shared/scroll-animate";
import { academyPrograms } from "@/lib/reference-content/academy";

export function AcademyPage() {
  return <main className="min-h-screen bg-paper"><EditorialPageHero badge="Family Dent Academy" title="Образование для стоматологов" description="Практические программы, клинические разборы и современные протоколы для профессионального роста." /><section className="mx-auto max-w-7xl px-5 pb-20"><div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{academyPrograms.map((item) => <ScrollAnimate key={item.id} as="article" className="rounded-2xl border border-rule bg-surface p-6 shadow-card"><GraduationCap aria-hidden="true" className="mb-5 h-9 w-9 text-accent"/><h2 className="font-display text-xl font-bold text-ink">{item.title}</h2><p className="mt-2 text-sm leading-relaxed text-editorial-muted">{item.description}</p></ScrollAnimate>)}</div></section></main>;
}
