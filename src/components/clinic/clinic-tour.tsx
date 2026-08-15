import { useState } from "react";
import { Camera } from "lucide-react";
import type { ClinicSpace } from "@/lib/reference-content/types";
import { ClinicSpaceSelector } from "./clinic-space-selector";

export function resolveClinicSpace(spaces: readonly ClinicSpace[], activeSpaceId?: string): ClinicSpace | undefined {
  return spaces.find((space) => space.id === activeSpaceId) ?? spaces[0];
}

interface ClinicTourProps {
  spaces: readonly ClinicSpace[];
  title?: string;
  subtitle?: string;
}

export function ClinicTour({
  spaces,
  title = "Фотоэкскурсия по клинике Family Dent",
  subtitle = "Современное стоматологическое пространство, спроектированное для комфорта пациентов.",
}: ClinicTourProps) {
  const [activeSpaceId, setActiveSpaceId] = useState(spaces[0]?.id ?? "");
  const activeSpace = resolveClinicSpace(spaces, activeSpaceId);

  if (!activeSpace) {
    return <p className="mx-auto max-w-7xl px-5 py-8 text-sm text-editorial-muted">Фотографии клиники скоро появятся.</p>;
  }

  return (
    <section className="mx-auto w-full max-w-7xl px-5 py-8" aria-labelledby="clinic-tour-title">
      <div className="mb-8 max-w-3xl">
        <span className="mb-3 inline-flex items-center gap-2 rounded-pill border border-accent/25 bg-accent/15 px-3 py-1 font-mono text-xs font-semibold text-accent">
          <Camera aria-hidden="true" className="h-3.5 w-3.5" /> Виртуальное знакомство
        </span>
        <h2 id="clinic-tour-title" className="font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl md:text-4xl">{title}</h2>
        <p className="mt-2 text-sm leading-relaxed text-editorial-muted">{subtitle}</p>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-12">
        <div className="rounded-2xl border border-rule bg-surface p-4 shadow-card lg:col-span-4">
          <h3 className="mb-3 px-1 font-mono text-xs font-semibold uppercase tracking-wider text-accent">Зоны клиники</h3>
          <ClinicSpaceSelector spaces={spaces} activeSpaceId={activeSpace.id} onSelectSpace={(space) => setActiveSpaceId(space.id)} />
        </div>

        <article id="clinic-space-detail" aria-live="polite" className="overflow-hidden rounded-2xl border border-rule bg-surface shadow-card lg:col-span-8">
          <div className="aspect-[16/10] overflow-hidden bg-paper sm:aspect-video">
            <img key={activeSpace.id} src={activeSpace.image} alt={activeSpace.title} loading="lazy" decoding="async" className="h-full w-full object-cover" />
          </div>
          <div className="border-t border-rule bg-paper p-6">
            <h3 className="font-display text-xl font-bold text-ink">{activeSpace.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-editorial-muted">{activeSpace.description}</p>
          </div>
        </article>
      </div>
    </section>
  );
}
