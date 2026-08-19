import { useEffect } from "react";
import { ArrowLeft, ArrowRight, Calendar, Clock } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { Link, useParams } from "react-router-dom";
import { servicesData } from "../lib/data/services";
import { ServiceTile } from "./ServicesPage";
import "./service-detail-page.css";

interface ServiceDetailPageProps { onOpenBooking: () => void; }

export function ServiceDetailPage({ onOpenBooking }: ServiceDetailPageProps) {
  const { slug } = useParams();
  const reduceMotion = useReducedMotion();
  const index = servicesData.findIndex((item) => item.slug === slug);
  const service = index >= 0 ? servicesData[index] : null;

  useEffect(() => { document.title = service ? `${service.title} — Family Dent` : "Услуга не найдена — Family Dent"; }, [service]);

  if (!service) return <main className="service-not-found"><div><p className="services-page__eyebrow">404 / Услуга не найдена</p><h1>Такого направления нет</h1><p>Вернитесь в каталог и выберите подходящую услугу.</p><Link to="/services"><ArrowLeft aria-hidden="true" />Все услуги</Link></div></main>;

  const related = [1, 2, 3].map((offset) => servicesData[(index + offset) % servicesData.length]);
  const number = String(index + 1).padStart(2, "0");

  return <main className="service-detail">
    <section className="service-detail-hero" aria-labelledby="service-title">
      <motion.img src={service.image} alt={`${service.title} в клинике Family Dent`} loading="eager" fetchPriority="high" width="1440" height="960" style={{ objectPosition: service.mobileImagePosition || service.imagePosition }} initial={reduceMotion ? false : { scale: 1.04 }} animate={{ scale: 1 }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }} />
      <div className="service-detail-hero__shade" aria-hidden="true" />
      <motion.div className="service-detail__container service-detail-hero__content" initial={reduceMotion ? false : { opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
        <Link className="service-detail__back" to="/services"><ArrowLeft aria-hidden="true" />Все услуги</Link>
        <p className="service-detail__eyebrow">{number} / {servicesData.length}</p>
        <h1 id="service-title">{service.title}</h1>
        <p className="service-detail-hero__lead">{service.description}</p>
        <div className="service-detail-hero__actions"><span><Clock aria-hidden="true" />Длительность · {service.duration}</span><button type="button" onClick={onOpenBooking}>Записаться <ArrowRight aria-hidden="true" /></button></div>
      </motion.div>
    </section>

    <section className="service-benefits" aria-labelledby="service-benefits-title"><div className="service-detail__container service-benefits__layout"><div><p className="service-detail__eyebrow">Что входит</p><h2 id="service-benefits-title">Внимание к каждой детали лечения</h2><p>{service.description}</p></div><ol>{service.details?.map((detail, detailIndex) => <motion.li key={detail} initial={reduceMotion ? false : { opacity: 0, x: 24 }} whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: detailIndex * 0.08 }}><span>{String(detailIndex + 1).padStart(2, "0")}</span><strong>{detail}</strong></motion.li>)}</ol></div></section>

    <section className="service-booking"><div className="service-detail__container service-booking__inner"><div><p className="service-detail__eyebrow">Консультация</p><h2>Составим индивидуальный план лечения</h2></div><button type="button" onClick={onOpenBooking}><Calendar aria-hidden="true" />Записаться</button></div></section>

    <section className="service-related" aria-labelledby="service-related-title"><div className="service-detail__container"><header><p className="service-detail__eyebrow">Продолжить выбор</p><h2 id="service-related-title">Другие направления</h2></header><div className="service-related__grid">{related.map((item) => <ServiceTile key={item.id} service={item} index={servicesData.indexOf(item)} compact />)}</div></div></section>
  </main>;
}
