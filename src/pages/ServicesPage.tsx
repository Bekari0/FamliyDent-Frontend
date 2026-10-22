import {
  Button,
  Heading,
  Reveal,
  RevealGroup,
  RevealHeading,
  Text,
} from "@/ui-kit";
import { ArrowRight, Calendar } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getServices } from "../lib/data/services";
import type { Service } from "../lib/data/types";
import "./services-page.css";

interface ServicesPageProps {
  onOpenBooking: () => void;
}

export function ServiceTile({
  service,
  index,
  compact = false,
}: {
  service: Service;
  index: number;
  compact?: boolean;
}) {
  const number = String(index + 1).padStart(2, "0");
  return (
    <Reveal
      id={compact ? undefined : service.slug}
      className={`service-tile-wrap${compact ? " service-tile-wrap--compact" : ""}`}
    >
      <Link
        className="service-tile"
        to={`/services/${service.slug}`}
        aria-label={`${number}. ${service.title}`}
      >
        <img
          src={service.image}
          alt={`${service.title} в клинике Family Dent`}
          loading="lazy"
          decoding="async"
          width="640"
          height="480"
          style={{
            objectPosition:
              service.mobileImagePosition || service.imagePosition,
          }}
        />
        <span className="service-tile__shade" aria-hidden="true" />
        <span className="service-tile__number">{number}</span>
        <strong>{service.shortTitle}</strong>
        <ArrowRight className="service-tile__arrow" aria-hidden="true" />
      </Link>
    </Reveal>
  );
}

const treatmentSteps = [
  "Диагностика",
  "Индивидуальный план",
  "Качественные материалы",
  "Профессиональное лечение",
  "Контроль результата",
];

export function ServicesPage({ onOpenBooking }: ServicesPageProps) {
  const reduceMotion = useReducedMotion();
  const [services, setServices] = useState<Service[]>([]);
  useEffect(() => {
    document.title = "Стоматологические услуги — Family Dent Душанбе";
    void getServices().then(setServices);
  }, []);

  return (
    <div className="services-page">
      <section
        className="services-hero services-hero--compact"
        data-ui-scheme="inverse"
        aria-labelledby="services-hero-title"
      >
        <motion.img
          className="services-hero__image"
          src="/images/services/DSC08274.webp"
          alt="Цифровая диагностика в клинике Family Dent"
          loading="eager"
          fetchPriority="high"
          width="1440"
          height="960"
          initial={reduceMotion ? false : { scale: 1.035 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        />
        <div className="services-hero__shade" aria-hidden="true" />
        <motion.div
          className="services-page__container services-hero__content"
          initial={reduceMotion ? false : { opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <Text variant="overline" className="services-page__eyebrow">
            Услуги Family Dent
          </Text>
          <Heading level={1} id="services-hero-title">
            Все направления стоматологии
            <br />в одной клинике
          </Heading>
          <Text variant="body" className="services-hero__lead">
            От профилактики и лечения зубов до имплантации, ортодонтии и
            эстетической стоматологии — все основные направления в одной
            клинике.
          </Text>
          <Button size="lg" onClick={onOpenBooking}>
            Записаться на консультацию <ArrowRight aria-hidden="true" />
          </Button>
        </motion.div>
      </section>

      <section
        className="services-catalog"
        aria-labelledby="services-catalog-title"
      >
        <div className="services-page__container">
          <header className="services-catalog__header">
            <div>
              <Text variant="overline" className="services-page__eyebrow">
                12 направлений
              </Text>
              <RevealHeading level={2} id="services-catalog-title">
                Выберите направление
              </RevealHeading>
            </div>
            <Text variant="body">
              Откройте страницу услуги, чтобы узнать подробнее о лечении и
              записаться на консультацию.
            </Text>
          </header>
          <RevealGroup className="services-grid">
            {services.map((service, index) => (
              <ServiceTile key={service.id} service={service} index={index} />
            ))}
          </RevealGroup>
        </div>
      </section>

      <section
        className="services-process services-process--compact"
        data-ui-scheme="inverse"
        aria-labelledby="services-process-title"
      >
        <div className="services-page__container">
          <div className="services-process__heading">
            <div>
              <Text variant="overline" className="services-page__eyebrow">
                Подход к лечению
              </Text>
              <RevealHeading level={2} id="services-process-title">
                От диагностики до контроля результата
              </RevealHeading>
            </div>
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

      <section
        className="services-final"
        aria-labelledby="services-final-title"
      >
        <div className="services-page__container services-final__inner">
          <div>
            <Text variant="overline" className="services-page__eyebrow">
              Первый шаг
            </Text>
            <RevealHeading level={2} id="services-final-title">
              Не знаете, какое направление вам подходит?
            </RevealHeading>
            <Text variant="body">
              Начните с консультации и диагностики — врач оценит состояние зубов
              и составит индивидуальный план лечения.
            </Text>
          </div>
          <Button size="lg" onClick={onOpenBooking}>
            <Calendar aria-hidden="true" />
            Записаться на консультацию
          </Button>
        </div>
      </section>
    </div>
  );
}
