import { useState, type SyntheticEvent } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { treatmentCases } from '@/lib/reference-content/treatment-cases';
import type { TreatmentCase } from '@/lib/reference-content/types';
import { clampComparisonPosition, getAfterRevealPercent } from './home-behavior';

const categoryLabels: Record<TreatmentCase['category'], string> = {
  veneers: 'Виниры', braces: 'Ортодонтия', implantation: 'Имплантация', restoration: 'Реставрация', orthodontics: 'Ортодонтия',
};

function useFallbackImage(event: SyntheticEvent<HTMLImageElement>) {
  const image = event.currentTarget;
  if (!image.src.endsWith('/images/clinic_about.jpg')) image.src = '/images/clinic_about.jpg';
}

function TreatmentCaseCard({ treatmentCase }: { treatmentCase: TreatmentCase }) {
  const [position, setPosition] = useState(50);
  const afterReveal = getAfterRevealPercent(position);

  return (
    <article className="flex h-full flex-col rounded-3xl border border-rule bg-surface p-5 shadow-whisper sm:p-7">
      <div className="mb-3 flex items-center justify-between gap-3">
        <span className="rounded-md border border-rule bg-accent-soft px-2.5 py-1 text-[11px] font-bold uppercase text-accent">{categoryLabels[treatmentCase.category]}</span>
        <span className="flex items-center gap-1 text-[11px] font-medium text-muted"><Sparkles className="h-3.5 w-3.5 text-accent" /> Цифровой протокол</span>
      </div>
      <h3 className="text-lg font-extrabold text-ink">{treatmentCase.title}</h3>
      <p className="mb-6 mt-2 text-xs leading-relaxed text-muted">{treatmentCase.shortDescription}</p>

      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-rule bg-ink shadow-md">
        <img src={treatmentCase.beforeImage} alt={`До лечения: ${treatmentCase.title}`} loading="lazy" decoding="async" onError={useFallbackImage} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-y-0 right-0 overflow-hidden" style={{ width: `${afterReveal}%` }}>
          <img src={treatmentCase.afterImage} alt={`После лечения: ${treatmentCase.title}`} loading="lazy" decoding="async" onError={useFallbackImage} className="absolute inset-y-0 right-0 h-full max-w-none object-cover" style={{ width: `${10000 / Math.max(1, afterReveal)}%` }} />
        </div>
        <div className="pointer-events-none absolute inset-y-0 w-0.5 bg-accent shadow-[0_0_12px_rgba(216,200,163,0.8)]" style={{ left: `${position}%` }} />
        <span className="pointer-events-none absolute left-3 top-3 rounded-lg border border-white/20 bg-ink/75 px-2.5 py-1 font-mono text-[11px] font-bold uppercase text-paper backdrop-blur-md">До</span>
        <span className="pointer-events-none absolute right-3 top-3 rounded-lg border border-accent/30 bg-ink/75 px-2.5 py-1 font-mono text-[11px] font-bold uppercase text-accent-2 backdrop-blur-md">После</span>
        <input type="range" min="0" max="100" value={position} onChange={(event) => setPosition(clampComparisonPosition(Number(event.target.value)))} aria-label={`Сравнить результат: ${treatmentCase.title}`} className="absolute inset-x-4 bottom-4 z-10 cursor-ew-resize accent-[var(--color-accent)]" />
      </div>
      <p className="mt-2 px-1 text-[11px] italic leading-normal text-muted">{treatmentCase.disclaimer}</p>
    </article>
  );
}

export function TreatmentResultsSection() {
  return (
    <section className="w-full border-b border-rule bg-paper px-5 py-16 text-ink sm:px-8 sm:py-20">
      <div className="mx-auto max-w-7xl">
        <header className="mb-12 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <span className="mb-2 block font-mono text-xs font-bold uppercase tracking-wider text-accent">Клинические кейсы</span>
            <h2 className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl lg:text-4xl">Результаты лечения «До / После»</h2>
            <p className="mt-2 text-xs text-muted sm:text-sm">Перемещайте ползунок для наглядного сравнения результатов.</p>
          </div>
          <Link to="/contact" className="inline-flex min-h-11 items-center gap-2 self-start rounded-xl border border-rule bg-surface px-5 py-2.5 text-xs font-bold text-ink shadow-whisper transition-colors hover:bg-paper-2 md:self-auto">
            Обсудить лечение <ArrowRight className="h-4 w-4 text-accent" />
          </Link>
        </header>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {treatmentCases.map((treatmentCase) => <TreatmentCaseCard key={treatmentCase.id} treatmentCase={treatmentCase} />)}
        </div>
      </div>
    </section>
  );
}
