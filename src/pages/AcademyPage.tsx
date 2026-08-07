import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { EditorialPageHero } from "../components/shared/editorial-page-hero";
import { GraduationCap, ArrowRight, BookOpen, Target } from "lucide-react";
import { getAcademyPrograms } from "../lib/data/academy";
import type { AcademyProgram } from "../lib/data/types";

export function AcademyPage() {
  const [programs, setPrograms] = useState<AcademyProgram[]>([]);

  useEffect(() => {
    document.title = "Академия Family Dent — Обучение стоматологов на практике";
    async function loadPrograms() {
      const data = await getAcademyPrograms();
      setPrograms(data);
    }
    loadPrograms();
  }, []);

  return (
    <div className="w-full flex flex-col min-h-screen bg-paper text-ink">
      <EditorialPageHero
        badge="Образовательный центр"
        title="Обучение стоматологов на практике"
        description="Академия Family Dent создана для молодых и практикующих специалистов, которые хотят развивать свои навыки под руководством опытных преподавателей."
      />

      <div className="max-w-5xl mx-auto px-5 my-8 w-full">
        {/* Goal Card */}
        <div className="bg-surface border border-rule rounded-3xl p-8 sm:p-10 mb-10 shadow-card flex items-start gap-5">
          <div className="w-12 h-12 rounded-2xl bg-accent/15 border border-accent/25 flex items-center justify-center text-accent flex-shrink-0">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-accent block mb-1 font-mono">
              Миссия Академии
            </span>
            <p className="font-display text-base sm:text-lg font-bold text-ink leading-relaxed">
              Наша цель — помогать стоматологам расти профессионально и уверенно применять знания на практике.
            </p>
          </div>
        </div>

        {/* Directions List */}
        <h2 className="font-display text-xl sm:text-2xl font-bold text-ink mb-6">
          Ключевые направления программ
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-6">
          {programs.map((prog) => (
            <div
              key={prog.id}
              className="bg-surface border border-rule rounded-2xl p-6 shadow-card flex flex-col gap-2 hover:border-accent/40 transition-colors"
            >
              <div className="flex items-center gap-2 text-accent mb-1">
                <BookOpen className="w-4 h-4" />
                <h3 className="font-display text-base font-bold text-ink">{prog.title}</h3>
              </div>
              <p className="text-xs sm:text-sm text-muted font-normal leading-relaxed">
                {prog.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA to contacts */}
        <div className="my-12 p-8 rounded-3xl bg-surface border border-rule text-center flex flex-col items-center gap-4 shadow-card">
          <GraduationCap className="w-10 h-10 text-accent" />
          <h3 className="font-display text-xl sm:text-2xl font-bold text-ink">
            Хотите развить профессиональные навыки?
          </h3>
          <p className="text-xs sm:text-sm text-muted max-w-lg font-normal">
            Свяжитесь с куратором Академии Family Dent для уточнения дат ближайших мастер-классов и наличия свободных мест.
          </p>
          <Link
            to="/contacts"
            className="mt-2 inline-flex min-h-11 items-center gap-2 px-8 py-3.5 rounded-pill bg-ink text-paper font-semibold text-xs sm:text-sm hover:bg-accent hover:text-accent-ink transition-all cursor-pointer shadow-md"
          >
            <span>Узнать о ближайших программах</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
