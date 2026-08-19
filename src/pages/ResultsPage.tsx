import React, { useEffect, useState } from "react";
import { EditorialPageHero } from "../components/shared/editorial-page-hero";
import { TreatmentCaseCard } from "../components/results/treatment-case-card";
import { getTreatmentCases } from "../lib/data/treatment-cases";
import type { TreatmentCase } from "../lib/data/types";

const CATEGORIES = [
  { id: "all", label: "Все кейсы" },
  { id: "veneers", label: "Виниры" },
  { id: "braces", label: "Брекеты" },
  { id: "implantation", label: "Имплантация" },
  { id: "restoration", label: "Реставрации" },
  { id: "orthodontics", label: "Ортодонтия" },
];

export function ResultsPage() {
  const [allCases, setAllCases] = useState<TreatmentCase[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("all");

  useEffect(() => {
    document.title = "Результаты лечения — Family Dent До и После";
    async function loadCases() {
      const data = await getTreatmentCases();
      setAllCases(data);
    }
    loadCases();
  }, []);

  const filteredCases =
    activeCategory === "all"
      ? allCases
      : allCases.filter((c) => c.category === activeCategory);

  return (
    <div className="w-full flex flex-col min-h-screen bg-paper text-ink">
      <EditorialPageHero
        badge="Примеры работ"
        title="Результаты лечения"
        description="Интерактивное сравнение результатов до и после восстановления улыбки пациентам клиники Family Dent."
      />

      <div className="page-container my-6">
        {/* Category selector */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-pill text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer border ${
                activeCategory === cat.id
                  ? "bg-accent/15 border-accent/40 text-ink font-semibold shadow-sm"
                  : "bg-paper border-rule text-muted hover:text-ink hover:bg-paper-2"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Grid of case cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-8">
          {filteredCases.map((caseItem) => (
            <TreatmentCaseCard key={caseItem.id} treatmentCase={caseItem} />
          ))}
        </div>
      </div>
    </div>
  );
}
