import React, { useMemo, useState } from "react";
import { Camera, ChevronLeft, ChevronRight, Images } from "lucide-react";
import type { ClinicSpace } from "@/lib/data/types";

interface ClinicTourProps {
  spaces: ClinicSpace[];
  title?: string;
  subtitle?: string;
}

export function ClinicTour({
  spaces,
  title = "Фотоэкскурсия по клинике Family Dent",
  subtitle = "Познакомьтесь с интерьером и атмосферой наших филиалов до визита.",
}: ClinicTourProps) {
  const branches = useMemo(
    () => Array.from(new Set(spaces.map((space) => space.title))),
    [spaces],
  );
  const [activeBranch, setActiveBranch] = useState(branches[0] ?? "Айни");
  const branchSpaces = spaces.filter((space) => space.title === activeBranch);
  const [activeId, setActiveId] = useState(branchSpaces[0]?.id ?? "");
  const activeIndex = Math.max(0, branchSpaces.findIndex((space) => space.id === activeId));
  const activeSpace = branchSpaces[activeIndex] ?? branchSpaces[0];

  function selectBranch(branch: string) {
    const firstSpace = spaces.find((space) => space.title === branch);
    setActiveBranch(branch);
    setActiveId(firstSpace?.id ?? "");
  }

  function selectNext(direction: -1 | 1) {
    const nextIndex = (activeIndex + direction + branchSpaces.length) % branchSpaces.length;
    setActiveId(branchSpaces[nextIndex]?.id ?? "");
  }

  if (!activeSpace) return null;

  return (
    <section className="page-container py-8" aria-labelledby="clinic-tour-title">
      <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div className="max-w-2xl">
          <p className="mb-3 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-accent">
            <Camera className="size-4" aria-hidden="true" />
            Виртуальный тур
          </p>
          <h2 id="clinic-tour-title" className="font-display text-3xl font-semibold leading-tight text-ink sm:text-4xl">
            {title}
          </h2>
          <p className="mt-3 text-pretty leading-relaxed text-muted">{subtitle}</p>
        </div>
        <p className="inline-flex items-center gap-2 font-mono text-xs text-muted">
          <Images className="size-4" aria-hidden="true" />
          {branchSpaces.length} фотографий
        </p>
      </div>

      <div className="mb-6 flex flex-wrap gap-2" role="tablist" aria-label="Филиалы клиники">
        {branches.map((branch) => (
          <button
            key={branch}
            type="button"
            role="tab"
            aria-selected={activeBranch === branch}
            onClick={() => selectBranch(branch)}
            className={`min-h-11 rounded-full border px-5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/30 ${
              activeBranch === branch
                ? "border-accent bg-accent text-accent-ink"
                : "border-rule bg-surface text-ink hover:border-accent/60"
            }`}
          >
            Филиал «{branch}»
          </button>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.65fr)_minmax(17rem,0.8fr)]">
        <figure className="group relative overflow-hidden rounded-2xl border border-rule bg-ink shadow-card">
          <img
            key={activeSpace.id}
            src={activeSpace.image}
            alt={`Интерьер Family Dent, филиал «${activeSpace.title}», фотография ${activeIndex + 1}`}
            width={900}
            height={600}
            className="aspect-[3/2] w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
          />
          <figcaption className="flex items-center justify-between gap-4 border-t border-white/15 bg-ink px-5 py-4 text-paper">
            <span className="text-sm">Филиал «{activeSpace.title}»</span>
            <span className="font-mono text-xs text-paper/65">{String(activeIndex + 1).padStart(2, "0")} / {String(branchSpaces.length).padStart(2, "0")}</span>
          </figcaption>
          {branchSpaces.length > 1 && (
            <div className="absolute inset-x-4 top-1/2 flex -translate-y-1/2 justify-between">
              <button type="button" onClick={() => selectNext(-1)} className="grid size-11 place-items-center rounded-full bg-surface/95 text-ink shadow-card transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/50" aria-label="Предыдущая фотография">
                <ChevronLeft className="size-5" aria-hidden="true" />
              </button>
              <button type="button" onClick={() => selectNext(1)} className="grid size-11 place-items-center rounded-full bg-surface/95 text-ink shadow-card transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/50" aria-label="Следующая фотография">
                <ChevronRight className="size-5" aria-hidden="true" />
              </button>
            </div>
          )}
        </figure>

        <div className="grid max-h-[40rem] grid-cols-3 gap-2 overflow-y-auto rounded-2xl border border-rule bg-paper p-2 sm:grid-cols-4 lg:grid-cols-3" aria-label={`Фотографии филиала «${activeBranch}»`}>
          {branchSpaces.map((space, index) => (
            <button
              key={space.id}
              type="button"
              onClick={() => setActiveId(space.id)}
              className={`group relative aspect-[3/2] overflow-hidden rounded-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/50 ${
                space.id === activeSpace.id ? "ring-2 ring-accent ring-offset-2 ring-offset-paper" : ""
              }`}
              aria-label={`Показать фотографию ${index + 1}`}
              aria-current={space.id === activeSpace.id ? "true" : undefined}
            >
              <img src={space.image} alt="" width={900} height={600} loading="lazy" decoding="async" className="size-full object-cover transition-transform duration-300 group-hover:scale-105" />
              <span className="absolute inset-x-0 bottom-0 bg-ink/65 px-2 py-1 text-left font-mono text-[10px] text-paper">{String(index + 1).padStart(2, "0")}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
