import { Container, Reveal, RevealGroup, RevealHeading, Text } from "@/ui-kit";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { ClinicTour } from "../components/clinic/clinic-tour";
import { EditorialPageHero } from "../components/shared/editorial-page-hero";
import { getClinicSpaces } from "../lib/data/clinic-spaces";
import type { ClinicSpace } from "../lib/data/types";

const clinicValues = [
  [
    "Забота",
    "Мы внимательно относимся к каждому пациенту и стремимся сделать лечение максимально комфортным.",
  ],
  [
    "Честность",
    "Мы предлагаем только необходимое лечение, подробно объясняем план и стоимость до начала работы.",
  ],
  [
    "Качество",
    "Используем современные материалы, проверенные технологии и придерживаемся международных стандартов лечения.",
  ],
  [
    "Развитие",
    "Наши врачи регулярно проходят обучение, чтобы применять самые эффективные современные методики.",
  ],
  [
    "Ответственность",
    "Мы отвечаем за качество своей работы и сопровождаем пациента на всех этапах лечения.",
  ],
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
      setActiveValueIndex(
        (currentIndex) => (currentIndex + 1) % clinicValues.length,
      );
    }, 5000);

    return () => window.clearInterval(intervalId);
  }, []);

  const activeValue = clinicValues[activeValueIndex];

  function showPreviousValue() {
    setActiveValueIndex(
      (currentIndex) =>
        (currentIndex - 1 + clinicValues.length) % clinicValues.length,
    );
  }

  function showNextValue() {
    setActiveValueIndex(
      (currentIndex) => (currentIndex + 1) % clinicValues.length,
    );
  }

  return (
    <div
      className="w-full flex flex-col min-h-screen bg-paper text-ink"
      data-ui-scheme="default"
    >
      <EditorialPageHero
        badge="Семейные ценности"
        title="О клинике Family Dent"
        description="Современный медицинский центр в Душанбе, созданный для комфортного лечения всей семьи в атмосфере заботы и технологического превосходства."
        backgroundImage="/images/about-family-dent-reception.jpg"
      />

      <Container width="content" className="my-8 flex flex-col gap-10">
        <section
          className="border-y border-rule py-10"
          aria-labelledby="about-story-title"
        >
          <RevealHeading
            level={2}
            id="about-story-title"
            className="max-w-4xl text-balance text-ink"
          >
            Family Dent — стоматология, созданная с любовью к своему делу
          </RevealHeading>
          <div className="mt-6 grid gap-5 tablet:grid-cols-[minmax(0,1fr)_minmax(0,18rem)] tablet:items-center">
            <RevealGroup className="type-body-sm flex flex-col gap-5 text-muted">
              <Reveal as={Text} variant="body">
                История Family Dent началась в 2018 году с желания создать
                клинику, где качество лечения всегда будет стоять на первом
                месте. Основатели клиники — врачи, искренне любящие свою
                профессию и стремящиеся постоянно развиваться. Благодаря
                поддержке семьи эта идея превратилась в современную
                стоматологическую клинику, которой сегодня доверяют тысячи
                пациентов.
              </Reveal>
              <Reveal as={Text} variant="body">
                Мы начинали с небольшой команды и трёх стоматологических кресел.
                Шаг за шагом развивались, внедряли современные технологии,
                расширяли команду специалистов и создавали комфортные условия
                для пациентов. Сегодня Family Dent — это клиника, где можно
                получить комплексное стоматологическое лечение для всей семьи в
                одном месте.
              </Reveal>
            </RevealGroup>
            <video
              className="aspect-[9/16] w-full max-w-[min(18rem,36svh)] justify-self-center rounded-xl border border-rule bg-ink object-cover shadow-card tablet:justify-self-end"
              controls
              playsInline
              preload="metadata"
              data-ui-scheme="inverse"
            >
              <source src="/videos/about-family-dent.mp4" type="video/mp4" />
              Ваш браузер не поддерживает воспроизведение видео.
            </video>
          </div>
        </section>
      </Container>

      {spaces.length > 0 && <ClinicTour spaces={spaces} />}

      <Container width="content" className="mb-8 flex flex-col gap-10">
        <section aria-labelledby="values-title">
          <RevealHeading level={2} id="values-title" className="text-ink">
            Наши ценности
          </RevealHeading>
          <div className="mt-6 grid gap-5 tablet:grid-cols-[minmax(0,1fr)_minmax(0,18rem)] tablet:items-center">
            <div className="min-h-[18rem]" aria-live="polite">
              <div className="flex items-start justify-between gap-6">
                <Text variant="overline" className="uppercase text-brand-text">
                  0{activeValueIndex + 1} / 0{clinicValues.length}
                </Text>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={showPreviousValue}
                    className="grid size-11 place-items-center rounded-full border border-rule text-ink transition-colors hover:border-accent hover:text-brand-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                    aria-label="Предыдущая ценность"
                  >
                    <ArrowLeft aria-hidden="true" size={18} strokeWidth={1.7} />
                  </button>
                  <button
                    type="button"
                    onClick={showNextValue}
                    className="grid size-11 place-items-center rounded-full border border-rule text-ink transition-colors hover:border-accent hover:text-brand-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                    aria-label="Следующая ценность"
                  >
                    <ArrowRight
                      aria-hidden="true"
                      size={18}
                      strokeWidth={1.7}
                    />
                  </button>
                </div>
              </div>
              <article key={activeValue[0]} className="mt-10">
                <RevealHeading level={3} className="text-ink">
                  {activeValue[0]}
                </RevealHeading>
                <Text
                  variant="body"
                  className="mt-4 max-w-lg text-pretty text-muted"
                >
                  {activeValue[1]}
                </Text>
              </article>
            </div>
            <video
              className="aspect-[9/16] w-full max-w-[min(18rem,36svh)] justify-self-center rounded-xl border border-rule bg-ink object-cover shadow-card tablet:justify-self-end"
              controls
              playsInline
              preload="metadata"
              data-ui-scheme="inverse"
            >
              <source src="/videos/3d-tomography.mp4" type="video/mp4" />
              Ваш браузер не поддерживает воспроизведение видео.
            </video>
          </div>
        </section>

        <section
          className="border-t border-rule py-10"
          aria-labelledby="belief-title"
        >
          <div className="grid gap-8 desktop:grid-cols-[5fr_7fr]">
            <div>
              <RevealHeading level={2} id="belief-title" className="text-ink">
                Во что мы верим
              </RevealHeading>
              <Text variant="body" className="mt-4 text-pretty text-muted">
                Мы считаем, что хорошая стоматология — это не самое дорогое
                лечение. Это правильное лечение, выполненное качественно,
                безопасно и с заботой о пациенте.
              </Text>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              {[
                [
                  "Не назначаем лишнего",
                  "Предлагаем лечение, которое действительно необходимо.",
                ],
                [
                  "Объясняем понятным языком",
                  "Пациент должен понимать, что происходит с его здоровьем и зачем нужно лечение.",
                ],
                [
                  "Не экономим на качестве",
                  "Используем современные технологии и качественные материалы, сохраняя разумную стоимость лечения.",
                ],
                [
                  "Продолжаем учиться",
                  "Мы убеждены, что в медицине невозможно остановиться в развитии.",
                ],
              ].map(([title, text]) => (
                <article key={title} className="border-t-2 border-accent pt-4">
                  <RevealHeading
                    level={3}
                    variant="heading-6"
                    className="text-ink"
                  >
                    {title}
                  </RevealHeading>
                  <Text variant="body-sm" className="mt-2 text-muted">
                    {text}
                  </Text>
                </article>
              ))}
            </div>
          </div>
        </section>
      </Container>
    </div>
  );
}
