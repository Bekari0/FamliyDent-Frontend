import { useEffect } from "react";
import { ArrowRight, Calendar } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { Link } from "react-router-dom";
import { servicesData } from "../lib/data/services";
import type { Service } from "../lib/data/types";
import "./services-page.css";

interface ServicesPageProps { onOpenBooking: () => void; }

export function ServiceTile({ service, index, compact = false }: { service: Service; index: number; compact?: boolean }) {
  const reduceMotion = useReducedMotion();
  const number = String(index + 1).padStart(2, "0");
  return (
    <motion.div id={compact ? undefined : service.slug} className={`service-tile-wrap${compact ? " service-tile-wrap--compact" : ""}`} initial={reduceMotion ? false : { opacity: 0, y: 24 }} whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.55, delay: compact ? 0 : (index % 4) * 0.06, ease: [0.16, 1, 0.3, 1] }}>
      <Link className="service-tile" to={`/services/${service.slug}`} aria-label={`${number}. ${service.title}`}>
        <img src={service.image} alt={`${service.title} в клинике Family Dent`} loading="lazy" decoding="async" width="640" height="480" style={{ objectPosition: service.mobileImagePosition || service.imagePosition }} />
        <span className="service-tile__shade" aria-hidden="true" />
        <span className="service-tile__number">{number}</span>
        <strong>{service.shortTitle}</strong>
        <ArrowRight className="service-tile__arrow" aria-hidden="true" />
      </Link>
    </motion.div>
  );
}

const treatmentSteps = ["Диагностика", "Индивидуальный план", "Качественные материалы", "Профессиональное лечение", "Контроль результата"];

export function ServicesPage({ onOpenBooking }: ServicesPageProps) {
  const reduceMotion = useReducedMotion();
  useEffect(() => { document.title = "Стоматологические услуги — Family Dent Душанбе"; }, []);

  return <main className="services-page">
    <section className="services-hero services-hero--compact" aria-labelledby="services-hero-title">
      <motion.img className="services-hero__image" src="/images/services/DSC08274.webp" alt="Цифровая диагностика в клинике Family Dent" loading="eager" fetchPriority="high" width="1440" height="960" initial={reduceMotion ? false : { scale: 1.035 }} animate={{ scale: 1 }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }} />
      <div className="services-hero__shade" aria-hidden="true" />
      <motion.div className="services-page__container services-hero__content" initial={reduceMotion ? false : { opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}>
        <p className="services-page__eyebrow">Услуги Family Dent</p>
        <h1 id="services-hero-title">Все направления стоматологии<br />в одной клинике</h1>
        <p className="services-hero__lead">От профилактики и лечения зубов до имплантации, ортодонтии и эстетической стоматологии — все основные направления в одной клинике.</p>
        <button type="button" onClick={onOpenBooking}>Записаться на консультацию <ArrowRight aria-hidden="true" /></button>
      </motion.div>
    </section>

    <section className="services-catalog" aria-labelledby="services-catalog-title">
      <div className="services-page__container">
        <header className="services-catalog__header"><div><p className="services-page__eyebrow">12 направлений</p><h2 id="services-catalog-title">Выберите направление</h2></div><p>Откройте страницу услуги, чтобы узнать подробнее о лечении и записаться на консультацию.</p></header>
        <div className="services-grid">{servicesData.map((service, index) => <ServiceTile key={service.id} service={service} index={index} />)}</div>
      </div>
    </section>

    <section className="services-process services-process--compact" aria-labelledby="services-process-title"><div className="services-page__container"><div className="services-process__heading"><div><p className="services-page__eyebrow">Подход к лечению</p><h2 id="services-process-title">От диагностики до контроля результата</h2></div></div><ol>{treatmentSteps.map((step, index) => <li key={step}><span>{String(index + 1).padStart(2, "0")}</span><strong>{step}</strong></li>)}</ol></div></section>

    <section className="services-final" aria-labelledby="services-final-title"><div className="services-page__container services-final__inner"><div><p className="services-page__eyebrow">Первый шаг</p><h2 id="services-final-title">Не знаете, какое направление вам подходит?</h2><p>Начните с консультации и диагностики — врач оценит состояние зубов и составит индивидуальный план лечения.</p></div><button type="button" onClick={onOpenBooking}><Calendar aria-hidden="true" />Записаться на консультацию</button></div></section>
  </main>;
}
