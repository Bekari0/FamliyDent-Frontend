import { Bus, Car, Clock, Navigation } from 'lucide-react';
import { Contact as ContactComponent } from '@/components/Contact';
import { EditorialPageHero } from '@/components/shared/editorial-page-hero';

export function ContactPage() {
  return (
    <main className="min-h-screen bg-paper text-ink" data-ui="editorial-page">
      <EditorialPageHero
        badge="Связь с нами"
        title="Контакты клиники FamilyDent"
        description="Два филиала в Душанбе, удобная парковка и администраторы, которые помогут подобрать время приема."
      />

      <section className="mx-auto grid w-full max-w-5xl gap-5 px-5 pb-4 sm:px-8 md:grid-cols-3" aria-label="Информация для визита">
        <div className="rounded-2xl border border-rule bg-surface p-5 shadow-whisper"><Clock className="h-5 w-5 text-accent" /><h2 className="mt-4 font-display text-base font-bold">Часы работы</h2><p className="mt-2 text-sm text-editorial-muted">Пн–Сб: 7:30–19:00<br />Вс: выходной</p></div>
        <div className="rounded-2xl border border-rule bg-surface p-5 shadow-whisper"><Bus className="h-5 w-5 text-accent" /><h2 className="mt-4 font-display text-base font-bold">Общественный транспорт</h2><p className="mt-2 text-sm text-editorial-muted">Автобусы №2 и №10, остановка «Центральная клиника».</p></div>
        <div className="rounded-2xl border border-rule bg-surface p-5 shadow-whisper"><Car className="h-5 w-5 text-accent" /><h2 className="mt-4 font-display text-base font-bold">Парковка и маршрут</h2><p className="mt-2 text-sm text-editorial-muted">Бесплатная стоянка перед входом.</p><a href="https://yandex.tj/maps/" target="_blank" rel="noreferrer" className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-pill bg-ink px-5 text-xs font-bold text-paper"><Navigation className="h-4 w-4 text-accent" />Проложить маршрут</a></div>
      </section>

      <ContactComponent />
    </main>
  );
}
