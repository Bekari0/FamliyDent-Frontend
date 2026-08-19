import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, CheckCircle2, Clock, ChevronRight, Sparkles } from "lucide-react";
import { getServices } from "../../lib/data/services";
import type { Service } from "../../lib/data/types";
import { ScrollAnimate, StaggerContainer, StaggerItem } from "../shared/scroll-animate";

interface FeaturedServicesSectionProps {
  onOpenBooking: () => void;
}

export function FeaturedServicesSection({ onOpenBooking }: FeaturedServicesSectionProps) {
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

    const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
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
          const top = target.getBoundingClientRect().top + window.scrollY - desiredOffset;

          window.scrollTo({
            top,
            behavior: "smooth",
          });
        }
        setPendingScrollId(null);
      });
    });
  }, [activeServiceId, pendingScrollId]);

  const activeService = services.find((s) => s.id === activeServiceId) || services[0];

  return (
    <section className="w-full bg-paper-2 text-ink py-16 sm:py-20 px-5 sm:px-8 border-b border-rule">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <ScrollAnimate className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs uppercase font-bold text-accent tracking-wider mb-2 block font-mono">
              Направления лечения
            </span>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-ink tracking-tight">
              Основные услуги клиники
            </h2>
            <p className="text-xs sm:text-sm text-muted font-normal mt-1">
              Персональный подход, цифровая точность и гарантия качества для всей семьи.
            </p>
          </div>
          <Link
            to="/services"
            className="inline-flex min-h-11 items-center gap-2 px-5 py-2.5 rounded-pill bg-paper text-ink border border-rule text-xs font-bold hover:bg-accent-soft transition-all self-start md:self-auto group shadow-whisper"
          >
            <span>Все услуги</span>
            <ArrowRight className="w-4 h-4 text-accent group-hover:translate-x-1 transition-transform" />
          </Link>
        </ScrollAnimate>

        {/* DESKTOP VIEW: Split interactive layout */}
        <ScrollAnimate delay={0.1} className="hidden lg:grid lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Vertical List */}
          <div className="lg:col-span-5 flex flex-col gap-2.5">
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
                >
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`w-2.5 h-2.5 rounded-full transition-colors ${
                        isActive ? "bg-accent" : "bg-rule"
                      }`}
                    />
                    <div>
                      <h3 className="font-display text-sm font-bold leading-tight">
                        {service.title}
                      </h3>
                    </div>
                  </div>
                  <ChevronRight
                    className={`w-4 h-4 transition-transform ${
                      isActive
                        ? "text-accent translate-x-1"
                        : "text-muted"
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* Right Active Preview Card with Image Crossfade */}
          {activeService && (
            <div className="lg:col-span-7 bg-paper rounded-3xl p-6 sm:p-8 border border-rule shadow-card flex flex-col justify-between min-h-[480px]">
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
                    <div className="aspect-[16/9] w-full rounded-2xl overflow-hidden mb-6 bg-[var(--color-paper-2)] shadow-md relative">
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
                      <div className="absolute top-3 right-3 bg-[var(--color-ink)]/90 backdrop-blur-md text-[var(--color-accent-2)] px-3 py-1.5 rounded-xl text-xs font-bold border border-white/10 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{activeService.duration || "45–60 мин"}</span>
                      </div>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-extrabold text-[var(--color-ink)] mb-3">
                      {activeService.title}
                    </h3>

                    <p className="text-sm text-[var(--color-muted)] leading-relaxed mb-6 font-normal">
                      {activeService.description}
                    </p>

                    {/* Features Checklist */}
                    {activeService.details && activeService.details.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-6">
                        {activeService.details.map((detail, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-2 text-xs font-semibold text-[var(--color-ink)] bg-[var(--color-surface)] p-2.5 rounded-xl border border-[var(--color-rule)] shadow-2xs"
                          >
                            <CheckCircle2 className="w-4 h-4 text-[var(--color-accent)] flex-shrink-0" />
                            <span>{detail}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-3 pt-4 border-t border-[var(--color-rule)]">
                    <button
                      onClick={onOpenBooking}
                      className="green-shimmer-bg hover:brightness-105 font-bold text-xs sm:text-sm px-6 py-3 rounded-xl transition-all shadow-md cursor-pointer flex items-center gap-2 active:scale-95"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Записаться на этот приём</span>
                    </button>
                    <Link
                      to="/services"
                      className="bg-[var(--color-surface)] hover:bg-[var(--color-paper-2)] text-[var(--color-ink)] border border-[var(--color-rule)] font-bold text-xs sm:text-sm px-5 py-3 rounded-xl transition-all flex items-center gap-1"
                    >
                      <span>Подробнее</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          )}
        </ScrollAnimate>

        {/* MOBILE VIEW: Accordion List */}
        <StaggerContainer className="lg:hidden flex flex-col gap-3">
          {services.map((service) => {
            const isOpen = service.id === activeServiceId;
            return (
              <StaggerItem
                key={service.id}
                className="bg-[var(--color-paper)] border border-[var(--color-rule)] rounded-2xl overflow-hidden transition-all"
              >
                <button
                  ref={(el) => {
                    serviceRefs.current[service.id] = el;
                  }}
                  onClick={() => {
                    if (isOpen) {
                      setActiveServiceId("");
                      setPendingScrollId(null);
                    } else {
                      setActiveServiceId(service.id);
                      setPendingScrollId(service.id);
                    }
                  }}
                  className="w-full text-left p-4 flex items-center justify-between font-bold text-[var(--color-ink)] cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-2.5 h-2.5 rounded-full ${
                        isOpen ? "bg-[var(--color-accent)]" : "bg-[var(--color-rule-2)]"
                      }`}
                    />
                    <div>
                      <span className="text-sm block">{service.title}</span>
                    </div>
                  </div>
                  <ChevronRight
                    className={`w-4 h-4 text-[var(--color-muted)] transition-transform ${
                      isOpen ? "rotate-90 text-[var(--color-accent)]" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="p-4 pt-0 border-t border-[var(--color-rule)] bg-[var(--color-surface)]">
                    <div className="aspect-[16/9] w-full rounded-xl overflow-hidden my-3 bg-[var(--color-paper-2)]">
                      <img
                        src={service.image}
                        alt={`${service.title} в клинике Family Dent`}
                        loading="lazy"
                        decoding="async"
                        width="900"
                        height="506"
                        style={{ objectPosition: service.mobileImagePosition || service.imagePosition }}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-xs text-[var(--color-muted)] leading-relaxed mb-4">
                      {service.description}
                    </p>
                    {service.details && (
                      <ul className="flex flex-col gap-1.5 mb-4">
                        {service.details.map((d, i) => (
                          <li
                            key={i}
                            className="text-xs text-[var(--color-ink)] flex items-center gap-2"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-[var(--color-accent)] flex-shrink-0" />
                            <span>{d}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    <button
                      onClick={onOpenBooking}
                      className="w-full green-shimmer-bg font-bold text-xs py-3 rounded-xl transition-all shadow-sm"
                    >
                      Записаться на консультацию
                    </button>
                  </div>
                )}
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}
