import React, { useEffect, useState } from "react";
import { EditorialPageHero } from "../components/shared/editorial-page-hero";
import { ClinicTour } from "../components/clinic/clinic-tour";
import { getClinicSpaces } from "../lib/data/clinic-spaces";
import type { ClinicSpace } from "../lib/data/types";

const clinicValues = [
  ["Забота", "Мы внимательно относимся к каждому пациенту и стремимся сделать лечение максимально комфортным."],
  ["Честность", "Мы предлагаем только необходимое лечение, подробно объясняем план и стоимость до начала работы."],
  ["Качество", "Используем современные материалы, проверенные технологии и придерживаемся международных стандартов лечения."],
  ["Развитие", "Наши врачи регулярно проходят обучение, чтобы применять самые эффективные современные методики."],
  ["Ответственность", "Мы отвечаем за качество своей работы и сопровождаем пациента на всех этапах лечения."],
] as const;

export function AboutPage() {
  const [spaces, setSpaces] = useState<ClinicSpace[]>([]);
  const [activeValueIndex, setActiveValueIndex] = useState(0);

  useEffect(() => {
    document.title = "О клинике — Family Dent Душанбе";
    getClinicSpaces().then(setSpaces);
  }, []);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveValueIndex((currentIndex) => (currentIndex + 1) % clinicValues.length);
    }, 3000);

    return () => window.clearInterval(intervalId);
  }, []);

  const activeValue = clinicValues[activeValueIndex];

  function showPreviousValue() {
    setActiveValueIndex((currentIndex) => (currentIndex - 1 + clinicValues.length) % clinicValues.length);
  }

  function showNextValue() {
    setActiveValueIndex((currentIndex) => (currentIndex + 1) % clinicValues.length);
  }

  return (
    <div className="w-full flex flex-col min-h-screen bg-paper text-ink">
      <EditorialPageHero
        badge="Семейные ценности"
        title="О клинике Family Dent"
        description="Современный медицинский центр в Душанбе, созданный для комфортного лечения всей семьи в атмосфере заботы и технологического превосходства."
        backgroundImage="/images/about-family-dent-reception.jpg"
      />

      <div className="page-container page-container--content my-8 flex flex-col gap-10">
        <section className="border-y border-rule py-10" aria-labelledby="about-story-title">
          <h2 id="about-story-title" className="max-w-4xl text-balance font-display text-3xl font-semibold leading-tight text-ink sm:text-4xl">Family Dent — стоматология, созданная с любовью к своему делу</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-[minmax(0,1fr)_18rem] md:items-center">
            <div className="flex flex-col gap-5 text-base leading-relaxed text-muted">
              <p>История Family Dent началась в 2018 году с желания создать клинику, где качество лечения всегда будет стоять на первом месте. Основатели клиники — врачи, искренне любящие свою профессию и стремящиеся постоянно развиваться. Благодаря поддержке семьи эта идея превратилась в современную стоматологическую клинику, которой сегодня доверяют тысячи пациентов.</p>
              <p>Мы начинали с небольшой команды и трёх стоматологических кресел. Шаг за шагом развивались, внедряли современные технологии, расширяли команду специалистов и создавали комфортные условия для пациентов. Сегодня Family Dent — это клиника, где можно получить комплексное стоматологическое лечение для всей семьи в одном месте.</p>
            </div>
            <video className="aspect-[9/16] w-full max-w-[18rem] justify-self-center rounded-xl border border-rule bg-ink object-cover shadow-card md:justify-self-end" controls playsInline preload="metadata">
              <source src="/videos/about-family-dent.mp4" type="video/mp4" />
              Ваш браузер не поддерживает воспроизведение видео.
            </video>
          </div>
        </section>
      </div>

      {spaces.length > 0 && <ClinicTour spaces={spaces} />}

      <div className="page-container page-container--content mb-8 flex flex-col gap-10">
        <section aria-labelledby="values-title">
          <h2 id="values-title" className="font-display text-2xl font-semibold text-ink">Наши ценности</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-[minmax(0,1fr)_18rem] md:items-center">
            <div className="min-h-[18rem] rounded-2xl border border-rule bg-surface p-6 sm:p-8" aria-live="polite">
              <p className="font-mono text-xs uppercase tracking-[0.14em] text-accent">0{activeValueIndex + 1} / 0{clinicValues.length}</p>
              <article key={activeValue[0]} className="mt-10">
                <h3 className="font-display text-3xl font-semibold text-ink">{activeValue[0]}</h3>
                <p className="mt-4 max-w-lg text-pretty leading-relaxed text-muted">{activeValue[1]}</p>
              </article>
              <div className="mt-10 flex items-center gap-3">
                <button type="button" onClick={showPreviousValue} className="min-h-11 rounded-full border border-rule px-4 text-sm font-semibold text-ink transition-colors hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent" aria-label="Предыдущая ценность">Назад</button>
                <button type="button" onClick={showNextValue} className="min-h-11 rounded-full bg-ink px-4 text-sm font-semibold text-paper transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2" aria-label="Следующая ценность">Далее</button>
              </div>
            </div>
            <video className="aspect-[9/16] w-full max-w-[18rem] justify-self-center rounded-xl border border-rule bg-ink object-cover shadow-card md:justify-self-end" controls playsInline preload="metadata">
              <source src="/videos/3d-tomography.mp4" type="video/mp4" />
              Ваш браузер не поддерживает воспроизведение видео.
            </video>
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
