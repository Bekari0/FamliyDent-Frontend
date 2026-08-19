import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { EditorialPageHero } from "../components/shared/editorial-page-hero";
import { ShieldCheck, Camera, Cpu, Award, ArrowRight } from "lucide-react";

export function AboutPage() {
  useEffect(() => {
    document.title = "О клинике — Family Dent Душанбе";
  }, []);

  return (
    <div className="w-full flex flex-col min-h-screen bg-paper text-ink">
      <EditorialPageHero
        badge="Семейные ценности"
        title="О клинике Family Dent"
        description="Современный медицинский центр в Душанбе, созданный для комфортного лечения всей семьи в атмосфере заботы и технологического превосходства."
      />

      <div className="page-container page-container--content my-8 flex flex-col gap-10">
        {/* Quick Links Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Link
            to="/about/clinic-tour"
            className="p-6 bg-surface border border-rule rounded-2xl shadow-card hover:border-accent/40 transition-all group flex items-start gap-4"
          >
            <div className="w-10 h-10 rounded-xl bg-accent/15 text-accent flex items-center justify-center flex-shrink-0">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display text-base font-bold text-ink group-hover:text-accent transition-colors flex items-center gap-1">
                <span>Фотоэкскурсия по клинике</span>
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </h3>
              <p className="text-xs text-muted font-normal mt-1">
                Взгляните на рецепцию, кабинеты и КТ-зону
              </p>
            </div>
          </Link>

          <Link
            to="/about/equipment"
            className="p-6 bg-surface border border-rule rounded-2xl shadow-card hover:border-accent/40 transition-all group flex items-start gap-4"
          >
            <div className="w-10 h-10 rounded-xl bg-accent/15 text-accent flex items-center justify-center flex-shrink-0">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display text-base font-bold text-ink group-hover:text-accent transition-colors flex items-center gap-1">
                <span>Современное оборудование</span>
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </h3>
              <p className="text-xs text-muted font-normal mt-1">
                Микроскопы, аксиограф, 3D-сканеры и КТ
              </p>
            </div>
          </Link>
        </div>

        {/* Philosophy */}
        <div className="bg-surface border border-rule rounded-3xl p-8 sm:p-10 shadow-card">
          <h2 className="font-display text-2xl font-bold text-ink mb-4">Наши главные принципы</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-6">
            <div className="p-4 rounded-xl bg-paper border border-rule">
              <ShieldCheck className="w-6 h-6 text-accent mb-2" />
              <h3 className="font-display text-sm font-bold text-ink mb-1">Безопасность</h3>
              <p className="text-xs text-muted font-normal">
                Многоступенчатая автоматическая стерилизация инструментов класса B.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-paper border border-rule">
              <Award className="w-6 h-6 text-accent mb-2" />
              <h3 className="font-display text-sm font-bold text-ink mb-1">Точность</h3>
              <p className="text-xs text-muted font-normal">
                Лечение под микроскопом с 25-кратным увеличением.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-paper border border-rule">
              <Cpu className="w-6 h-6 text-accent mb-2" />
              <h3 className="font-display text-sm font-bold text-ink mb-1">Безболезненность</h3>
              <p className="text-xs text-muted font-normal">
                Современные анестетики и мягкая адаптация для детей и взрослых.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
