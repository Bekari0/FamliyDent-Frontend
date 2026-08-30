import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { EditorialPageHero } from "../components/shared/editorial-page-hero";
import { Camera, Cpu, ArrowRight } from "lucide-react";

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

        <section className="grid gap-8 border-y border-rule py-10 lg:grid-cols-[5fr_7fr]" aria-labelledby="about-story-title">
          <h2 id="about-story-title" className="text-balance font-display text-3xl font-semibold leading-tight text-ink sm:text-4xl">Family Dent — стоматология, созданная с любовью к своему делу</h2>
          <div className="flex max-w-3xl flex-col gap-5 text-base leading-relaxed text-muted">
            <p>История Family Dent началась в 2018 году с желания создать клинику, где качество лечения всегда будет стоять на первом месте. Основатели клиники — врачи, искренне любящие свою профессию и стремящиеся постоянно развиваться. Благодаря поддержке семьи эта идея превратилась в современную стоматологическую клинику, которой сегодня доверяют тысячи пациентов.</p>
            <p>Мы начинали с небольшой команды и трёх стоматологических кресел. Шаг за шагом развивались, внедряли современные технологии, расширяли команду специалистов и создавали комфортные условия для пациентов. Сегодня Family Dent — это клиника, где можно получить комплексное стоматологическое лечение для всей семьи в одном месте.</p>
          </div>
        </section>

        <section className="grid gap-8 rounded-3xl bg-ink p-8 text-paper sm:p-10 lg:grid-cols-[4fr_8fr]" aria-labelledby="mission-title">
          <h2 id="mission-title" className="font-display text-2xl font-semibold">Наша миссия</h2>
          <p className="max-w-3xl text-pretty text-lg leading-relaxed text-paper/75">Помогать людям сохранять здоровье зубов и красивую улыбку, предоставляя качественное, безопасное и современное стоматологическое лечение по справедливой цене.</p>
        </section>

        <section aria-labelledby="values-title">
          <h2 id="values-title" className="font-display text-2xl font-semibold text-ink">Наши ценности</h2>
          <div className="mt-6 grid gap-px overflow-hidden rounded-2xl border border-rule bg-rule sm:grid-cols-2 lg:grid-cols-5">
            {[
              ["Забота", "Мы внимательно относимся к каждому пациенту и стремимся сделать лечение максимально комфортным."],
              ["Честность", "Мы предлагаем только необходимое лечение, подробно объясняем план и стоимость до начала работы."],
              ["Качество", "Используем современные материалы, проверенные технологии и придерживаемся международных стандартов лечения."],
              ["Развитие", "Наши врачи регулярно проходят обучение, чтобы применять самые эффективные современные методики."],
              ["Ответственность", "Мы отвечаем за качество своей работы и сопровождаем пациента на всех этапах лечения."],
            ].map(([title, text]) => <article key={title} className="bg-surface p-6"><h3 className="font-display text-lg font-semibold text-ink">{title}</h3><p className="mt-3 text-sm leading-relaxed text-muted">{text}</p></article>)}
          </div>
        </section>

        <section className="border-t border-rule py-10" aria-labelledby="belief-title">
          <div className="grid gap-8 lg:grid-cols-[5fr_7fr]">
            <div><h2 id="belief-title" className="font-display text-3xl font-semibold text-ink">Во что мы верим</h2><p className="mt-4 text-pretty leading-relaxed text-muted">Мы считаем, что хорошая стоматология — это не самое дорогое лечение. Это правильное лечение, выполненное качественно, безопасно и с заботой о пациенте.</p></div>
            <div className="grid gap-5 sm:grid-cols-2">{[
              ["Не назначаем лишнего", "Предлагаем лечение, которое действительно необходимо."],
              ["Объясняем понятным языком", "Пациент должен понимать, что происходит с его здоровьем и зачем нужно лечение."],
              ["Не экономим на качестве", "Используем современные технологии и качественные материалы, сохраняя разумную стоимость лечения."],
              ["Продолжаем учиться", "Мы убеждены, что в медицине невозможно остановиться в развитии."],
            ].map(([title, text]) => <article key={title} className="border-t-2 border-accent pt-4"><h3 className="font-display text-base font-semibold text-ink">{title}</h3><p className="mt-2 text-sm leading-relaxed text-muted">{text}</p></article>)}</div>
          </div>
        </section>
      </div>
    </div>
  );
}
