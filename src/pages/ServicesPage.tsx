import { useEffect, useState } from "react";
import { ArrowDown, ArrowRight, Calendar, Check, Clock } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { servicesData } from "../lib/data/services";
import type { Service } from "../lib/data/types";
import "./services-page.css";

interface ServicesPageProps { onOpenBooking: () => void; }

const treatmentSteps = ["Диагностика", "Индивидуальный план", "Качественные материалы", "Профессиональное лечение", "Контроль результата"];
const patterns = ["split", "bleed", "offset", "dark"] as const;

function ServiceScene({ service, index, onOpenBooking }: { service: Service; index: number; onOpenBooking: () => void }) {
  const reduceMotion = useReducedMotion();
  const number = String(index + 1).padStart(2, "0");
  return (
    <motion.article
      id={service.slug}
      className={`service-scene service-scene--${patterns[index % patterns.length]}`}
      initial={reduceMotion ? false : { opacity: 0, y: 48 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="services-page__container service-scene__grid">
        <div className="service-scene__media">
          <img src={service.image} alt={`${service.title} в клинике Family Dent`} loading="lazy" decoding="async" width="900" height="600" style={{ objectPosition: service.imagePosition, ["--mobile-position" as string]: service.mobileImagePosition || service.imagePosition }} />
          <span className="service-scene__watermark" aria-hidden="true">{number}</span>
        </div>
        <div className="service-scene__content">
          <div className="service-scene__meta"><span>{number} / 12</span><span>{service.category}</span></div>
          <h2>{service.title}</h2>
          <p className="service-scene__description">{service.description}</p>
          <ul>{service.details?.map((detail) => <li key={detail}><Check aria-hidden="true" /><span>{detail}</span></li>)}</ul>
          <div className="service-scene__actions">
            <div className="service-scene__duration"><Clock aria-hidden="true" /><span><small>Длительность</small>{service.duration}</span></div>
            <button type="button" onClick={onOpenBooking}>Записаться <ArrowRight aria-hidden="true" /></button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export function ServicesPage({ onOpenBooking }: ServicesPageProps) {
  const [activeSlug, setActiveSlug] = useState(servicesData[0].slug);
  const reduceMotion = useReducedMotion();

  useEffect(() => { document.title = "Стоматологические услуги — Family Dent Душанбе"; }, []);
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActiveSlug(visible.target.id);
    }, { rootMargin: "-25% 0px -55%", threshold: [0.05, 0.3, 0.6] });
    servicesData.forEach(({ slug }) => { const node = document.getElementById(slug); if (node) observer.observe(node); });
    return () => observer.disconnect();
  }, []);

  return <main className="services-page">
    <section className="services-hero" aria-labelledby="services-hero-title">
      <motion.img className="services-hero__image" src="/images/services/DSC08274.webp" alt="Цифровая диагностика в клинике Family Dent" loading="eager" fetchPriority="high" width="1440" height="960" initial={reduceMotion ? false : { scale: 1.06 }} animate={{ scale: 1 }} transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }} />
      <div className="services-hero__shade" aria-hidden="true" />
      <motion.div className="services-page__container services-hero__content" initial={reduceMotion ? false : "hidden"} animate="visible" variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.11 } } }}>
        <motion.p variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="services-page__eyebrow">Услуги Family Dent</motion.p>
        <div className="services-hero__title-mask"><motion.h1 id="services-hero-title" variants={{ hidden: { y: "110%" }, visible: { y: 0, transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] } } }}>Все направления стоматологии в одной клинике</motion.h1></div>
        <motion.p className="services-hero__lead" variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } }}>От профилактики и лечения зубов до имплантации, ортодонтии и эстетической стоматологии — все основные направления в одной клинике.</motion.p>
        <motion.button type="button" onClick={onOpenBooking} variants={{ hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0 } }}>Записаться на консультацию <ArrowRight aria-hidden="true" /></motion.button>
        <motion.a className="services-hero__scroll" href="#approach" aria-label="Перейти к описанию подхода" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}><ArrowDown aria-hidden="true" /></motion.a>
      </motion.div>
    </section>

    <section id="approach" className="services-intro" aria-labelledby="services-intro-title"><div className="services-page__container services-intro__grid"><p className="services-intro__index">01 / ПОДХОД</p><div><p className="services-page__eyebrow">Family Dent</p><h2 id="services-intro-title">Качество, которому можно доверять</h2></div><p className="services-intro__copy">Мы используем современные подходы к лечению, цифровую диагностику и качественные материалы от проверенных производителей из Японии, Южной Кореи, Италии, России, Германии и других стран.</p></div></section>

    <nav className="services-rail" aria-label="Навигация по услугам"><div className="services-page__container services-rail__scroll">{servicesData.map((service, index) => <a key={service.id} href={`#${service.slug}`} aria-current={activeSlug === service.slug ? "location" : undefined}><span>{String(index + 1).padStart(2, "0")}</span>{service.title}</a>)}</div></nav>

    <section className="services-scenes" aria-label="Направления лечения">{servicesData.map((service, index) => <ServiceScene key={service.id} service={service} index={index} onOpenBooking={onOpenBooking} />)}</section>

    <section className="services-process" aria-labelledby="services-process-title"><div className="services-page__container"><div className="services-process__heading"><div><p className="services-page__eyebrow">План действий</p><h2 id="services-process-title">Понятный путь к результату</h2></div><ArrowDown aria-hidden="true" /></div><ol>{treatmentSteps.map((step, index) => <motion.li key={step} initial={reduceMotion ? false : { opacity: 0, y: 24 }} whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.09 }}><span>{String(index + 1).padStart(2, "0")}</span><strong>{step}</strong></motion.li>)}</ol></div></section>

    <section className="services-cta"><img src="/images/services/DSC08324.webp" alt="" loading="lazy" decoding="async" width="1440" height="960" /><div className="services-cta__shade" aria-hidden="true" /><div className="services-page__container services-cta__inner"><p className="services-page__eyebrow">Первый шаг</p><h2>Не знаете, с чего начать?</h2><p>Начните с консультации и диагностики — врач оценит состояние зубов и составит индивидуальный план лечения.</p><button type="button" onClick={onOpenBooking}><Calendar aria-hidden="true" />Записаться на консультацию</button></div></section>
  </main>;
}
