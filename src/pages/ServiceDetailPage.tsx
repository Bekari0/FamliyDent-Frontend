import { useParams, Link } from 'react-router-dom';
import { Banknote, Calendar, CheckCircle2, ChevronLeft, Clock, ShieldCheck } from 'lucide-react';
import { EditorialPageHero } from '@/components/shared/editorial-page-hero';
import { MOCK_SERVICES } from '@/data/mockData';
import { findServiceById, getDetailRenderState } from './public-pages-behavior';

export function ServiceDetailPage() {
  const { id } = useParams();
  const service = findServiceById(MOCK_SERVICES, id);
  const renderState = getDetailRenderState({ loading: false, item: service });

  if (renderState === 'not-found' || !service) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-paper px-5 text-center text-ink">
        <h1 className="font-display text-2xl font-bold">Услуга не найдена</h1>
        <Link to="/services" className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-pill border border-rule bg-surface px-5 text-sm font-bold hover:bg-paper-2"><ChevronLeft className="h-4 w-4" />Ко всем услугам</Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-paper pb-20 text-ink" data-ui="editorial-page">
      <EditorialPageHero badge={service.category} title={service.title} description={service.description} />
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-5 sm:px-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <article>
          <Link to="/services" className="mb-6 inline-flex items-center gap-2 text-xs font-semibold text-accent transition-colors hover:text-ink"><ChevronLeft className="h-4 w-4" />Ко всем услугам</Link>
          <dl className="grid gap-4 rounded-3xl border border-rule bg-surface p-6 shadow-whisper sm:grid-cols-3">
            <div className="flex gap-3"><Clock className="h-5 w-5 shrink-0 text-accent" /><div><dt className="font-mono text-[10px] uppercase tracking-wider text-editorial-muted">Длительность</dt><dd className="mt-1 text-sm font-bold">{service.duration} мин</dd></div></div>
            <div className="flex gap-3"><Banknote className="h-5 w-5 shrink-0 text-accent" /><div><dt className="font-mono text-[10px] uppercase tracking-wider text-editorial-muted">Стоимость</dt><dd className="mt-1 text-sm font-bold">от {service.price} сомони</dd></div></div>
            <div className="flex gap-3"><ShieldCheck className="h-5 w-5 shrink-0 text-accent" /><div><dt className="font-mono text-[10px] uppercase tracking-wider text-editorial-muted">Гарантия</dt><dd className="mt-1 text-sm font-bold">до 5 лет</dd></div></div>
          </dl>

          <section className="mt-6 rounded-3xl border border-rule bg-surface p-7 shadow-whisper sm:p-9" aria-labelledby="procedure-title">
            <h2 id="procedure-title" className="font-display text-2xl font-bold">О процедуре</h2>
            <p className="mt-4 text-sm leading-relaxed text-editorial-muted">Здесь представлено подробное описание процедуры {service.title}. Мы используем современное оборудование и сертифицированные материалы.</p>
            <ul className="mt-7 grid gap-3 sm:grid-cols-2">
              {['Безболезненность', 'Высокая точность', 'Минимальный срок заживления', 'Лучшие материалы'].map((item) => (
                <li key={item} className="flex items-center gap-3 rounded-xl border border-rule bg-paper-2 p-4 text-sm font-medium"><CheckCircle2 className="h-4 w-4 shrink-0 text-accent" />{item}</li>
              ))}
            </ul>
          </section>
        </article>

        <aside className="h-fit rounded-3xl bg-ink p-7 text-paper shadow-card lg:sticky lg:top-28">
          <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-accent">Онлайн-запись</span>
          <h2 className="mt-3 font-display text-2xl font-bold text-white">Записаться на прием</h2>
          <p className="mt-3 text-sm leading-relaxed text-white/65">Оставьте заявку, и администратор поможет подобрать удобное время.</p>
          <Link to="/book" className="mt-6 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-pill bg-accent px-5 text-xs font-bold text-accent-ink transition-colors hover:bg-accent-2"><Calendar className="h-4 w-4" />Записаться</Link>
        </aside>
      </div>
    </main>
  );
}
