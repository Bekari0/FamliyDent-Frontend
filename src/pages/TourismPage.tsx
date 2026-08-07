import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { EditorialPageHero } from "../components/shared/editorial-page-hero";
import { Plane, Calendar, CheckCircle2, ShieldAlert } from "lucide-react";
import { getTourismFeatures } from "../lib/data/tourism";
import type { TourismFeature } from "../lib/data/types";

export function TourismPage() {
  const [features, setFeatures] = useState<TourismFeature[]>([]);

  useEffect(() => {
    document.title = "Стоматологический туризм — Лечение зубов в Таджикистане | Family Dent";
    async function loadData() {
      const data = await getTourismFeatures();
      setFeatures(data);
    }
    loadData();
  }, []);

  return (
    <div className="w-full flex flex-col min-h-screen bg-paper text-ink">
      <EditorialPageHero
        badge="Международный сервис"
        title="Лечение зубов в Таджикистане"
        description="Family Dent предлагает качественное стоматологическое лечение для пациентов из других стран по доступным ценам."
      />

      <div className="max-w-5xl mx-auto px-5 my-8 w-full">
        {/* Main Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-8">
          {features.map((feat) => (
            <div
              key={feat.id}
              className="bg-surface border border-rule rounded-2xl p-6 shadow-card flex flex-col gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-accent/15 border border-accent/25 flex items-center justify-center text-accent">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="font-display text-lg font-bold text-ink">{feat.title}</h3>
              <p className="text-xs sm:text-sm text-muted font-normal leading-relaxed">
                {feat.description}
              </p>
            </div>
          ))}
        </div>

        {/* Final Tourism Banner */}
        <div className="my-10 bg-surface border border-rule rounded-3xl p-8 sm:p-10 shadow-card text-center">
          <Plane className="w-10 h-10 text-accent mx-auto mb-4" />
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-ink mb-3">
            Совместите заботу о здоровье с путешествием и знакомством с гостеприимным Таджикистаном.
          </h2>
          <p className="text-xs sm:text-sm text-muted font-normal max-w-xl mx-auto mb-6">
            Наши менеджеры службы заботы организуют вашу поездку от консультации по снимку КТ до бронирования отеля.
          </p>
          <div className="inline-flex items-center gap-2 p-3 rounded-xl bg-accent/10 border border-accent/20 text-accent text-xs font-normal max-w-lg mx-auto">
            <ShieldAlert className="w-4 h-4 text-accent flex-shrink-0" />
            <span>Окончательный план и сроки лечения определяются врачом после диагностики.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
