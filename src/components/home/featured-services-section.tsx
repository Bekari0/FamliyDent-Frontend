import {
  Container,
  Heading,
  Reveal,
  RevealGroup,
  RevealItem,
  Text,
  readCssToken,
} from "@/ui-kit";
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Clock,
  Sparkles,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { getServices } from "../../lib/data/services";
import type { Service } from "../../lib/data/types";

interface FeaturedServicesSectionProps {
  onOpenBooking: () => void;
}

export function FeaturedServicesSection({
  onOpenBooking,
}: FeaturedServicesSectionProps) {
  const [services, setServices] = useState<Service[]>([]);
  const [activeServiceId, setActiveServiceId] = useState<string>("");
  const [pendingScrollId, setPendingScrollId] = useState<string | null>(null);
  const serviceRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  useEffect(() => {
    async function load() {
      const data = await getServices();
      setServices(data);
      if (data.length > 0) {
        setActiveServiceId(data[0].id);
      }
    }
    load();
  }, []);

  useEffect(() => {
    if (!pendingScrollId) return;
    if (activeServiceId !== pendingScrollId) return;
    if (typeof window === "undefined") return;

    const isDesktop = window.matchMedia(
      `(min-width: ${readCssToken("--breakpoint-desktop")})`,
    ).matches;
    if (isDesktop) {
      setPendingScrollId(null);
      return;
    }

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const target = serviceRefs.current[pendingScrollId];
        if (target) {
          const header = document.querySelector("header");
          const headerHeight = header?.getBoundingClientRect().height ?? 0;
          const desiredOffset = Math.max(90, Math.min(110, headerHeight + 30));
          const top =
            target.getBoundingClientRect().top + window.scrollY - desiredOffset;

          window.scrollTo({
            top,
            behavior: "auto",
          });
        }
        setPendingScrollId(null);
      });
    });
  }, [activeServiceId, pendingScrollId]);

  const activeService =
    services.find((s) => s.id === activeServiceId) || services[0];

  return (
    <section className="w-full border-b border-rule bg-paper-2 section-space text-ink">
      <Container>
        {/* Header */}
        <Reveal className="flex flex-col tablet:flex-row tablet:items-end justify-between section-heading-gap gap-4">
          <div>
            <span className="type-overline uppercase text-brand-text mb-2 block">
              Направления лечения
            </span>
            <Heading level={2} className="text-ink">
              Основные услуги клиники
            </Heading>
            <Text variant="body-sm" className="text-muted mt-1">
              Персональный подход, цифровая точность и гарантия качества для
              всей семьи.
            </Text>
          </div>
          <Link
            to="/services"
            className="type-caption inline-flex min-h-11 items-center gap-2 px-5 py-2.5 rounded-pill bg-paper text-ink border border-rule hover:bg-accent-soft transition-all self-start tablet:self-auto group shadow-whisper"
            data-ui-scheme="default"
          >
            <span>Все услуги</span>
            <ArrowRight className="w-4 h-4 text-brand-text group-hover:translate-x-1 transition-transform" />
          </Link>
        </Reveal>

        {/* DESKTOP VIEW: Split interactive layout */}
        <Reveal
          delay={0.1}
          className="hidden desktop:grid desktop:grid-cols-12 gap-8 items-stretch"
        >
          {/* Left Vertical List */}
          <div className="desktop:col-span-5 flex flex-col gap-2.5">
            {services.map((service) => {
              const isActive = service.id === activeServiceId;
              return (
                <button
                  key={service.id}
                  onClick={() => setActiveServiceId(service.id)}
                  onMouseEnter={() => setActiveServiceId(service.id)}
                  className={`w-full text-left p-4.5 rounded-2xl transition-all cursor-pointer flex items-center justify-between border ${
                    isActive
                      ? "bg-ink text-paper border-ink shadow-lg translate-x-1"
                      : "bg-paper hover:bg-paper-3 text-ink border-rule shadow-whisper"
                  }`}
                  data-ui-scheme={isActive ? "inverse" : "default"}
                >
                  <div className="flex min-w-0 items-center gap-3.5">
                    <div
                      className={`w-2.5 h-2.5 rounded-full transition-colors ${
                        isActive ? "bg-accent" : "bg-rule"
                      }`}
                    />
                    <div>
                      <span className="type-heading-6">{service.title}</span>
                    </div>
                  </div>
                  <ChevronRight
                    className={`w-4 h-4 transition-transform ${
                      isActive ? "text-brand-text translate-x-1" : "text-muted"
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* Right Active Preview Card with Image Crossfade */}
          {activeService && (
            <div
              className="desktop:col-span-7 bg-paper rounded-3xl p-6 sm:p-8 border border-rule shadow-card flex flex-col justify-between min-h-[480px]"
              data-ui-scheme="default"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeService.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                  className="flex flex-col h-full justify-between gap-6"
                >
                  <div>
                    {/* Image Preview */}
                    <div className="aspect-[16/9] w-full rounded-2xl overflow-hidden mb-6 bg-paper-2 shadow-md relative">
                      <img
                        src={activeService.image}
                        alt={`${activeService.title} в клинике Family Dent`}
                        loading="lazy"
                        decoding="async"
                        width="900"
                        height="506"
                        style={{ objectPosition: activeService.imagePosition }}
                        className="w-full h-full object-cover"
                      />
                      <div
                        className="type-caption absolute top-3 right-3 bg-ink/90 backdrop-blur-md text-accent-2 px-3 py-1.5 rounded-xl border border-on-dark/10 flex items-center gap-1.5"
                        data-ui-scheme="inverse"
                      >
                        <Clock className="w-3.5 h-3.5" />
                        <span>{activeService.duration || "45–60 мин"}</span>
                      </div>
                    </div>

                    <Heading
                      level={3}
                      variant="heading-4"
                      className="text-ink mb-3"
                    >
                      {activeService.title}
                    </Heading>

                    <Text variant="body-sm" className="text-muted mb-6">
                      {activeService.description}
                    </Text>

                    {/* Features Checklist */}
                    {activeService.details &&
                      activeService.details.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-6">
                          {activeService.details.map((detail, idx) => (
                            <div
                              key={idx}
                              className="type-caption flex items-center gap-2 text-ink bg-surface p-2.5 rounded-xl border border-rule shadow-2xs"
                              data-ui-scheme="default"
                            >
                              <CheckCircle2 className="w-4 h-4 text-brand-text flex-shrink-0" />
                              <span>{detail}</span>
                            </div>
                          ))}
                        </div>
                      )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-rule">
                    <button
                      onClick={onOpenBooking}
                      className="type-button green-shimmer-bg hover:brightness-105 px-6 py-3 rounded-xl transition-all shadow-md cursor-pointer flex items-center gap-2 active:scale-95"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Записаться на этот приём</span>
                    </button>
                    <Link
                      to="/services"
                      className="type-caption bg-surface hover:bg-paper-2 text-ink border border-rule px-5 py-3 rounded-xl transition-all flex items-center gap-1"
                      data-ui-scheme="default"
                    >
                      <span>Подробнее</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          )}
        </Reveal>

        {/* MOBILE VIEW: Accordion List */}
        <RevealGroup className="desktop:hidden flex flex-col gap-3">
          {services.map((service) => {
            const isOpen = service.id === activeServiceId;
            return (
              <RevealItem
                key={service.id}
                className="bg-paper border border-rule rounded-2xl overflow-hidden transition-all"
                data-ui-scheme="default"
              >
                <button
                  ref={(el) => {
                    serviceRefs.current[service.id] = el;
                  }}
                  aria-expanded={isOpen}
                  aria-controls={`service-panel-${service.id}`}
                  onClick={() => {
                    if (isOpen) {
                      setActiveServiceId("");
                      setPendingScrollId(null);
                    } else {
                      setActiveServiceId(service.id);
                      setPendingScrollId(service.id);
                    }
                  }}
                  className="w-full text-left p-4 flex items-center justify-between font-bold text-ink cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-2.5 h-2.5 rounded-full ${
                        isOpen ? "bg-accent" : "bg-rule-2"
                      }`}
                    />
                    <div>
                      <span className="type-body-sm block">
                        {service.title}
                      </span>
                    </div>
                  </div>
                  <ChevronRight
                    className={`w-4 h-4 text-muted transition-transform ${
                      isOpen ? "rotate-90 text-brand-text" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div
                    id={`service-panel-${service.id}`}
                    className="p-4 pt-0 border-t border-rule bg-surface"
                    data-ui-scheme="default"
                  >
                    <div className="aspect-[16/9] w-full rounded-xl overflow-hidden my-3 bg-paper-2">
                      <img
                        src={service.image}
                        alt={`${service.title} в клинике Family Dent`}
                        loading="lazy"
                        decoding="async"
                        width="900"
                        height="506"
                        style={{
                          objectPosition:
                            service.mobileImagePosition ||
                            service.imagePosition,
                        }}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <Text variant="body-sm" className="text-muted mb-4">
                      {service.description}
                    </Text>
                    {service.details && (
                      <ul className="flex flex-col gap-1.5 mb-4">
                        {service.details.map((d, i) => (
                          <li
                            key={i}
                            className="type-caption text-ink flex items-center gap-2"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-brand-text flex-shrink-0" />
                            <span>{d}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    <button
                      onClick={onOpenBooking}
                      className="type-button w-full green-shimmer-bg py-3 rounded-xl transition-all shadow-sm"
                    >
                      Записаться на консультацию
                    </button>
                  </div>
                )}
              </RevealItem>
            );
          })}
        </RevealGroup>
      </Container>
    </section>
  );
}
