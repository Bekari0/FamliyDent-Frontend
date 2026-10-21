import { Button, buttonClass, Heading, Text } from "@/ui-kit";
import { ArrowLeft, ArrowRight, Calendar, Clock } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getServices } from "../lib/data/services";
import type { Service } from "../lib/data/types";
import { ServiceTile } from "./ServicesPage";
import "./service-detail-page.css";

interface ServiceDetailPageProps {
  onOpenBooking: () => void;
}

export function ServiceDetailPage({ onOpenBooking }: ServiceDetailPageProps) {
  const { slug } = useParams();
  const reduceMotion = useReducedMotion();
  const [services, setServices] = useState<Service[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const index = services.findIndex((item) => item.slug === slug);
  const service = index >= 0 ? services[index] : null;

  useEffect(() => {
    void getServices()
      .then(setServices)
      .finally(() => setIsLoaded(true));
  }, []);

  useEffect(() => {
    if (isLoaded)
      document.title = service
        ? `${service.title} — Family Dent`
        : "Услуга не найдена — Family Dent";
  }, [isLoaded, service]);

  if (!isLoaded)
    return (
      <div className="service-not-found">
        <div>
          <Text variant="overline" className="services-page__eyebrow">
            Загрузка…
          </Text>
        </div>
      </div>
    );
  if (!service)
    return (
      <div className="service-not-found">
        <div>
          <Text variant="overline" className="services-page__eyebrow">
            404 / Услуга не найдена
          </Text>
          <Heading level={1}>Такого направления нет</Heading>
          <Text variant="body">
            Вернитесь в каталог и выберите подходящую услугу.
          </Text>
          <Link to="/services" className={buttonClass()}>
            <ArrowLeft aria-hidden="true" />
            Все услуги
          </Link>
        </div>
      </div>
    );

  const related = [1, 2, 3].map(
    (offset) => services[(index + offset) % services.length],
  );
  const number = String(index + 1).padStart(2, "0");

  return (
    <div className="service-detail">
      <section
        className="service-detail-hero"
        data-ui-scheme="inverse"
        aria-labelledby="service-title"
      >
        <motion.img
          src={service.image}
          alt={`${service.title} в клинике Family Dent`}
          loading="eager"
          fetchPriority="high"
          width="1440"
          height="960"
          style={{
            objectPosition:
              service.mobileImagePosition || service.imagePosition,
          }}
          initial={reduceMotion ? false : { scale: 1.04 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        />
        <div className="service-detail-hero__shade" aria-hidden="true" />
        <motion.div
          className="service-detail__container service-detail-hero__content"
          initial={reduceMotion ? false : { opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <Link className="service-detail__back" to="/services">
            <ArrowLeft aria-hidden="true" />
            Все услуги
          </Link>
          <Text variant="overline" className="service-detail__eyebrow">
            {number} / {services.length}
          </Text>
          <Heading level={1} id="service-title">
            {service.title}
          </Heading>
          <Text variant="body" className="service-detail-hero__lead">
            {service.description}
          </Text>
          <div className="service-detail-hero__actions">
            <span>
              <Clock aria-hidden="true" />
              Длительность · {service.duration}
            </span>
            <Button size="lg" onClick={onOpenBooking}>
              Записаться <ArrowRight aria-hidden="true" />
            </Button>
          </div>
        </motion.div>
      </section>

      <section
        className="service-benefits"
        aria-labelledby="service-benefits-title"
      >
        <div className="service-detail__container service-benefits__layout">
          <div>
            <Text variant="overline" className="service-detail__eyebrow">
              Что входит
            </Text>
            <Heading level={2} id="service-benefits-title">
              Внимание к каждой детали лечения
            </Heading>
            <Text variant="body">{service.description}</Text>
          </div>
          <ol>
            {service.details?.map((detail, detailIndex) => (
              <motion.li
                key={detail}
                initial={reduceMotion ? false : { opacity: 0, x: 24 }}
                whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: detailIndex * 0.08 }}
              >
                <span>{String(detailIndex + 1).padStart(2, "0")}</span>
                <strong>{detail}</strong>
              </motion.li>
            ))}
          </ol>
        </div>
      </section>

      <section className="service-booking" data-ui-scheme="inverse">
        <div className="service-detail__container service-booking__inner">
          <div>
            <Text variant="overline" className="service-detail__eyebrow">
              Консультация
            </Text>
            <Heading level={2}>Составим индивидуальный план лечения</Heading>
          </div>
          <Button size="lg" onClick={onOpenBooking}>
            <Calendar aria-hidden="true" />
            Записаться
          </Button>
        </div>
      </section>

      <section
        className="service-related"
        aria-labelledby="service-related-title"
      >
        <div className="service-detail__container">
          <header>
            <Text variant="overline" className="service-detail__eyebrow">
              Продолжить выбор
            </Text>
            <Heading level={2} id="service-related-title">
              Другие направления
            </Heading>
          </header>
          <div className="service-related__grid">
            {related.map((item) => (
              <ServiceTile
                key={item.id}
                service={item}
                index={services.indexOf(item)}
                compact
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
