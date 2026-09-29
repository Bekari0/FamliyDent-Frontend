import React, { useEffect, useState } from "react";
import { EditorialPageHero } from "../components/shared/editorial-page-hero";
import { ClinicTour } from "../components/clinic/clinic-tour";
import { getClinicSpaces } from "../lib/data/clinic-spaces";
import type { ClinicSpace } from "../lib/data/types";

export function AboutPage() {
  const [spaces, setSpaces] = useState<ClinicSpace[]>([]);

  useEffect(() => {
    document.title = "О клинике — Family Dent Душанбе";
    getClinicSpaces().then(setSpaces);
  }, []);

  return (
    <div className="w-full flex flex-col min-h-screen bg-paper text-ink">
      <EditorialPageHero
        badge="Семейные ценности"
        title="О клинике Family Dent"
        description="Современный медицинский центр в Душанбе, созданный для комфортного лечения всей семьи в атмосфере заботы и технологического превосходства."
      />

      <div className="page-container page-container--content my-8 flex flex-col gap-10">
        <section className="grid gap-8 border-y border-rule py-10 lg:grid-cols-[5fr_7fr]" aria-labelledby="about-story-title">
          <h2 id="about-story-title" className="text-balance font-display text-3xl font-semibold leading-tight text-ink sm:text-4xl">Family Dent — стоматология, созданная с любовью к своему делу</h2>
          <div className="flex max-w-3xl flex-col gap-5 text-base leading-relaxed text-muted">
            <p>История Family Dent началась в 2018 году с желания создать клинику, где качество лечения всегда будет стоять на первом месте. Основатели клиники — врачи, искренне любящие свою профессию и стремящиеся постоянно развиваться. Благодаря поддержке семьи эта идея превратилась в современную стоматологическую клинику, которой сегодня доверяют тысячи пациентов.</p>
            <p>Мы начинали с небольшой команды и трёх стоматологических кресел. Шаг за шагом развивались, внедряли современные технологии, расширяли команду специалистов и создавали комфортные условия для пациентов. Сегодня Family Dent — это клиника, где можно получить комплексное стоматологическое лечение для всей семьи в одном месте.</p>
          </div>
        </section>

        <section className="grid gap-6 border-b border-rule pb-10 lg:grid-cols-[5fr_7fr] lg:items-end" aria-labelledby="about-video-title">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-accent">Family Dent</p>
            <h2 id="about-video-title" className="mt-3 font-display text-3xl font-semibold leading-tight text-ink">Познакомьтесь с нашей клиникой</h2>
            <p className="mt-4 max-w-xl text-pretty leading-relaxed text-muted">Посмотрите, как устроено пространство Family Dent и какая атмосфера ждёт вас на приёме.</p>
          </div>
          <video className="w-full rounded-2xl border border-rule bg-ink shadow-card" controls playsInline preload="metadata">
            <source src="/videos/about-family-dent.mp4" type="video/mp4" />
            Ваш браузер не поддерживает воспроизведение видео.
          </video>
        </section>
      </div>

      {spaces.length > 0 && <ClinicTour spaces={spaces} />}

      <div className="page-container page-container--content mb-8 flex flex-col gap-10">
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
