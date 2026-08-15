import { useState } from "react";
import { CheckCircle2, Sparkles } from "lucide-react";
import type { EquipmentItem } from "@/lib/reference-content/types";
import { ScrollAnimate } from "@/components/shared/scroll-animate";

export function resolveEquipmentItem(items: readonly EquipmentItem[], activeItemId?: string): EquipmentItem | undefined {
  return items.find((item) => item.id === activeItemId) ?? items[0];
}

export function EquipmentExplorer({ items }: { items: readonly EquipmentItem[] }) {
  const [activeItemId, setActiveItemId] = useState(items[0]?.id ?? "");
  const activeItem = resolveEquipmentItem(items, activeItemId);

  if (!activeItem) {
    return <p className="mx-auto max-w-7xl px-5 py-8 text-sm text-editorial-muted">Информация об оборудовании скоро появится.</p>;
  }

  return (
    <section className="mx-auto w-full max-w-7xl px-5 py-8" aria-label="Оборудование клиники">
      <ScrollAnimate className="hidden items-start gap-8 md:grid md:grid-cols-12">
        <div className="flex flex-col gap-2 rounded-2xl border border-rule bg-surface p-4 shadow-card md:col-span-5" role="list">
          <h2 className="mb-2 px-2 font-mono text-xs font-semibold uppercase tracking-wider text-accent">Инновационное оснащение</h2>
          {items.map((item) => {
            const isActive = item.id === activeItem.id;
            return (
              <button
                key={item.id}
                type="button"
                role="listitem"
                aria-pressed={isActive}
                aria-controls="equipment-detail"
                onClick={() => setActiveItemId(item.id)}
                className={`min-h-11 w-full rounded-xl border p-3.5 text-left transition-colors motion-reduce:transition-none ${
                  isActive ? "border-accent/40 bg-accent/15 text-ink shadow-sm" : "border-rule bg-paper text-editorial-muted hover:bg-paper-2 hover:text-ink"
                }`}
              >
                <span className="flex items-center gap-3 text-sm font-medium"><span aria-hidden="true" className={`h-2 w-2 rounded-full ${isActive ? "bg-accent" : "bg-rule"}`} />{item.name}</span>
              </button>
            );
          })}
        </div>

        <article id="equipment-detail" aria-live="polite" className="flex flex-col gap-5 overflow-hidden rounded-2xl border border-rule bg-surface p-6 shadow-card md:col-span-7">
          <div className="aspect-[16/10] overflow-hidden rounded-xl bg-paper">
            <img key={activeItem.id} src={activeItem.image} alt={activeItem.name} loading="lazy" decoding="async" className="h-full w-full object-cover" />
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold text-ink">{activeItem.name}</h2>
            <p className="mt-2 text-sm leading-relaxed text-editorial-muted">{activeItem.description}</p>
            <div className="mt-4 flex items-start gap-3 rounded-xl border border-accent/25 bg-accent/15 p-4">
              <Sparkles aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
              <div><span className="block font-mono text-xs font-semibold uppercase tracking-wide text-accent">Что получает пациент</span><p className="mt-1 text-xs leading-relaxed text-ink">{activeItem.patientBenefit}</p></div>
            </div>
          </div>
        </article>
      </ScrollAnimate>

      <div className="flex flex-col gap-6 md:hidden">
        {items.map((item) => (
          <ScrollAnimate key={item.id} as="article" className="flex flex-col gap-4 rounded-2xl border border-rule bg-surface p-5 shadow-card">
            <div className="aspect-[16/10] overflow-hidden rounded-xl bg-paper"><img src={item.image} alt={item.name} loading="lazy" decoding="async" className="h-full w-full object-cover" /></div>
            <div><h2 className="font-display text-lg font-bold text-ink">{item.name}</h2><p className="mt-1.5 text-xs leading-relaxed text-editorial-muted">{item.description}</p></div>
            <div className="flex items-start gap-2.5 rounded-xl border border-accent/25 bg-accent/15 p-3"><CheckCircle2 aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-accent" /><p className="text-xs leading-relaxed text-ink"><span className="font-semibold">Польза для вас: </span>{item.patientBenefit}</p></div>
          </ScrollAnimate>
        ))}
      </div>
    </section>
  );
}
