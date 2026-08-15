import { useState } from 'react';
import { Minus, Plus, Search } from 'lucide-react';
import { EditorialPageHero } from '@/components/shared/editorial-page-hero';

const FAQS = [
  { q: 'Как часто нужно проходить осмотр?', a: 'Мы рекомендуем посещать стоматолога не реже одного раза в полгода для профилактического осмотра и профессиональной гигиены.' },
  { q: 'Болезненно ли лечение зубов?', a: 'В нашей клинике мы используем современные методы анестезии, которые делают процедуру безболезненной даже для самых чувствительных пациентов.' },
  { q: 'С какого возраста можно приводить ребенка?', a: 'Первый визит рекомендуется совершить в возрасте 1 года, чтобы ребенок привык к обстановке и врач мог оценить правильность формирования прикуса.' },
  { q: 'Что такое профессиональная гигиена?', a: 'Это комплекс процедур — AirFlow и ультразвуковая чистка — для удаления налета и зубного камня, которые невозможно убрать дома.' },
  { q: 'Какие гарантии предоставляет клиника?', a: 'Мы даем гарантию на терапевтическое лечение до 2 лет и на имплантацию до 10 лет при условии соблюдения рекомендаций врача.' },
];

export function FAQPage() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <main className="min-h-screen bg-paper pb-20 text-ink" data-ui="editorial-page">
      <EditorialPageHero
        badge="Ответы специалистов"
        title="Часто задаваемые вопросы"
        description="Коротко и понятно отвечаем на популярные вопросы о лечении, профилактике, гарантиях и первом визите."
      />

      <div className="mx-auto grid w-full max-w-6xl gap-8 px-5 sm:px-8 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-12">
        <aside className="h-fit rounded-3xl border border-rule bg-surface p-6 shadow-whisper lg:sticky lg:top-28">
          <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-accent">Найдите ответ</span>
          <p className="mt-3 text-sm leading-relaxed text-editorial-muted">Если нужной информации нет, свяжитесь с клиникой — администратор поможет с вашим вопросом.</p>
          <label className="relative mt-5 block">
            <span className="sr-only">Поиск по вопросам</span>
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-accent" aria-hidden="true" />
            <input type="search" placeholder="Поиск по вопросам..." className="min-h-11 w-full rounded-pill border border-rule bg-paper pl-11 pr-4 text-sm text-ink placeholder:text-editorial-muted focus:border-accent focus:outline-none" />
          </label>
        </aside>

        <section className="space-y-4" aria-label="Ответы на частые вопросы">
          {FAQS.map((faq, index) => {
            const isOpen = openIdx === index;
            const answerId = `faq-answer-${index}`;
            return (
              <article key={faq.q} className="overflow-hidden rounded-2xl border border-rule bg-surface shadow-whisper transition-colors hover:border-accent/40">
                <h2>
                  <button type="button" onClick={() => setOpenIdx(isOpen ? null : index)} className="flex min-h-16 w-full items-center justify-between gap-4 p-5 text-left outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ink/20 sm:p-6" aria-expanded={isOpen} aria-controls={answerId}>
                    <span className="font-display text-base font-bold text-ink sm:text-lg">{faq.q}</span>
                    <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors ${isOpen ? 'bg-accent text-accent-ink' : 'bg-paper-2 text-editorial-muted'}`}>{isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}</span>
                  </button>
                </h2>
                {isOpen && <div id={answerId} className="border-t border-rule px-5 py-5 text-sm leading-relaxed text-editorial-muted sm:px-6">{faq.a}</div>}
              </article>
            );
          })}
        </section>
      </div>
    </main>
  );
}
