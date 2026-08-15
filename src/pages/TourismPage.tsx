import { Plane, ShieldCheck } from "lucide-react";
import { EditorialPageHero } from "@/components/shared/editorial-page-hero";
import { ScrollAnimate } from "@/components/shared/scroll-animate";
import { tourismFeatures } from "@/lib/reference-content/tourism";

export function TourismPage() {
  return <main className="min-h-screen bg-paper"><EditorialPageHero badge="Dental tourism" title="Лечение в Душанбе без лишних забот" description="Поможем заранее спланировать лечение, график визитов и пребывание в городе." /><section className="mx-auto max-w-7xl px-5 pb-20"><div className="grid gap-5 md:grid-cols-2">{tourismFeatures.map((item, index) => <ScrollAnimate key={item.id} as="article" className="rounded-2xl border border-rule bg-surface p-6 shadow-card"><span className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-accent/15 text-accent">{index === 0 ? <Plane aria-hidden="true" /> : <ShieldCheck aria-hidden="true" />}</span><h2 className="font-display text-xl font-bold text-ink">{item.title}</h2><p className="mt-2 text-sm leading-relaxed text-editorial-muted">{item.description}</p></ScrollAnimate>)}</div></section></main>;
}
