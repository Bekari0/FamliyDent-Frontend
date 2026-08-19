import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { getTreatmentCases } from "../../lib/data/treatment-cases";
import type { TreatmentCase } from "../../lib/data/types";
import { BeforeAfterSlider } from "../results/before-after-slider";
import { ScrollAnimate, StaggerContainer, StaggerItem } from "../shared/scroll-animate";

export function TreatmentResultsSection() {
  const [cases, setCases] = useState<TreatmentCase[]>([]);

  useEffect(() => {
    async function load() {
      const data = await getTreatmentCases();
      setCases(data.slice(0, 2));
    }
    load();
  }, []);

  return (
    <section className="w-full border-b border-[var(--color-rule)] bg-[var(--color-paper)] py-16 text-[var(--color-ink)] sm:py-20">
      <div className="page-container">
        {/* Header */}
        <ScrollAnimate className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs uppercase font-bold text-[var(--color-accent)] tracking-wider mb-2 block font-mono">
              Клинические кейсы
            </span>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-semibold text-[var(--color-ink)] tracking-tight">
              Результаты лечения «До / После»
            </h2>
            <p className="text-xs sm:text-sm text-[var(--color-muted)] font-normal mt-1">
              Перемещайте ползунок влево и вправо для наглядного сравнения эстетических результатов.
            </p>
          </div>
          <Link
            to="/results"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--color-surface)] text-[var(--color-ink)] border border-[var(--color-rule)] text-xs font-bold hover:bg-[var(--color-paper-2)] transition-all self-start md:self-auto group shadow-2xs"
          >
            <span>Все результаты</span>
            <ArrowRight className="w-4 h-4 text-[var(--color-accent)] group-hover:translate-x-1 transition-transform" />
          </Link>
        </ScrollAnimate>

        {/* Treatment Case Cards Grid */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {cases.map((c) => (
            <StaggerItem
              key={c.id}
              className="bg-[var(--color-surface)] rounded-3xl p-6 sm:p-7 border border-[var(--color-rule)] shadow-[var(--shadow-whisper)] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] uppercase font-bold text-[var(--color-accent)] bg-[var(--color-accent-soft)] px-2.5 py-1 rounded-md border border-[var(--color-rule)]">
                    {c.category}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] text-[var(--color-muted)] font-medium">
                    <Sparkles className="w-3.5 h-3.5 text-[var(--color-accent)]" />
                    <span>Цифровая протоколизация</span>
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-[var(--color-ink)] mb-2">
                  {c.title}
                </h3>
                <p className="text-xs text-[var(--color-muted)] font-normal leading-relaxed mb-6">
                  {c.shortDescription}
                </p>

                {/* Interactive Slider */}
                <BeforeAfterSlider
                  beforeImage={c.beforeImage}
                  afterImage={c.afterImage}
                  title={c.title}
                  disclaimer={c.disclaimer}
                />
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
