import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ArrowDown, ArrowRight, Calendar, Check, Clock, ShieldCheck } from "lucide-react";
import { EditorialPageHero } from "../components/shared/editorial-page-hero";
import { getServices } from "../lib/data/services";
import type { Service } from "../lib/data/types";
import "./services-page.css";

interface ServicesPageProps {
  onOpenBooking: () => void;
}

const treatmentSteps = [
  "Диагностика",
  "Индивидуальный план",
  "Качественные материалы",
  "Профессиональное лечение",
  "Контроль результата",
];

export function ServicesPage({ onOpenBooking }: ServicesPageProps) {
  const [services, setServices] = useState<Service[]>([]);
  const location = useLocation();

  useEffect(() => {
    document.title = "Стоматологические услуги — Family Dent Душанбе";
    getServices().then(setServices);
  }, []);

  useEffect(() => {
    if (!location.hash || services.length === 0) return;
    const element = document.getElementById(location.hash.slice(1));
    element?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [location.hash, services]);

  return (
    <main className="services-page">
      <EditorialPageHero
        badge="Услуги Family Dent"
        title="Все основные направления в одной клинике"
        description="От профилактики и лечения зубов до имплантации, ортодонтии и эстетической стоматологии."
      />

      <section className="services-page__trust" aria-labelledby="services-trust-title">
        <div className="services-page__container services-trust">
          <div>
            <p className="services-page__eyebrow">Качество, которому можно доверять</p>
            <h2 id="services-trust-title">Лечение начинается с точной диагностики</h2>
          </div>
          <div className="services-trust__copy">
            <ShieldCheck aria-hidden="true" />
            <p>
              Мы используем современные подходы к лечению, цифровую диагностику и качественные материалы от проверенных производителей из Японии, Южной Кореи, Италии, России, Германии и других стран.
            </p>
          </div>
        </div>
      </section>

      <section className="services-catalog" aria-labelledby="services-catalog-title">
        <div className="services-page__container services-catalog__layout">
          <aside className="services-catalog__aside">
            <p className="services-page__eyebrow">Каталог направлений</p>
            <h2 id="services-catalog-title">Выберите нужную услугу</h2>
            <nav aria-label="Навигация по услугам">
              {services.map((service, index) => (
                <a key={service.id} href={`#${service.slug}`}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  {service.title}
                </a>
              ))}
            </nav>
          </aside>

          <div className="services-catalog__list">
            {services.map((service, index) => (
              <article key={service.id} id={service.slug} className="service-entry">
                <header className="service-entry__header">
                  <span className="service-entry__number">{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <p className="services-page__eyebrow">{service.category}</p>
                    <h3>{service.title}</h3>
                  </div>
                </header>

                <div className="service-entry__body">
                  <p className="service-entry__description">{service.description}</p>
                  <ul>
                    {service.details?.map((detail) => (
                      <li key={detail}>
                        <Check aria-hidden="true" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <footer className="service-entry__footer">
                  <div className="service-entry__duration">
                    <Clock aria-hidden="true" />
                    <span>
                      <small>Длительность</small>
                      {service.duration}
                    </span>
                  </div>
                  <button type="button" onClick={onOpenBooking}>
                    Записаться
                    <ArrowRight aria-hidden="true" />
                  </button>
                </footer>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="services-process" aria-labelledby="services-process-title">
        <div className="services-page__container">
          <div className="services-process__heading">
            <div>
              <p className="services-page__eyebrow">План действий</p>
              <h2 id="services-process-title">Понятный путь к результату</h2>
            </div>
            <ArrowDown aria-hidden="true" />
          </div>
          <ol>
            {treatmentSteps.map((step, index) => (
              <li key={step}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{step}</strong>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="services-cta">
        <div className="services-page__container services-cta__inner">
          <div>
            <p className="services-page__eyebrow">Первый шаг</p>
            <h2>Начните с консультации и диагностики</h2>
            <p>Врач оценит состояние полости рта, ответит на вопросы и предложит последовательный план лечения.</p>
          </div>
          <button type="button" onClick={onOpenBooking}>
            <Calendar aria-hidden="true" />
            Записаться на приём
          </button>
        </div>
      </section>
    </main>
  );
}
