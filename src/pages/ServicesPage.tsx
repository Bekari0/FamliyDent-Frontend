import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { EditorialPageHero } from "../components/shared/editorial-page-hero";
import { Clock, Tag, ArrowRight, Calendar } from "lucide-react";
import { getServices } from "../lib/data/services";
import type { Service } from "../lib/data/types";
import { StaggerContainer, StaggerItem } from "../components/shared/scroll-animate";

interface ServicesPageProps {
  onOpenBooking: () => void;
}

export function ServicesPage({ onOpenBooking }: ServicesPageProps) {
  const [services, setServices] = useState<Service[]>([]);
  const location = useLocation();

  useEffect(() => {
    document.title = "Стоматологические услуги — Family Dent Душанбе";
    async function loadServices() {
      const data = await getServices();
      setServices(data);
    }
    loadServices();
  }, []);

  // Hash link auto-scroll
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      const elem = document.getElementById(id);
      if (elem) {
        elem.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location.hash, services]);

  return (
    <div className="w-full flex flex-col min-h-screen bg-paper text-ink">
      <EditorialPageHero
        badge="Наши направления"
        title="Услуги и направления лечения"
        description="Комплексная семейная стоматология в Душанбе с использованием передовых швейцарских и японских стандартов."
      />

      <StaggerContainer className="max-w-7xl mx-auto px-5 my-8 w-full flex flex-col gap-8">
        {services.map((service) => (
          <StaggerItem
            key={service.id}
            id={service.slug}
            className="scroll-mt-24 bg-surface border border-rule rounded-3xl p-6 sm:p-8 shadow-card flex flex-col md:flex-row justify-between gap-6 hover:border-accent/40 transition-colors"
          >
            <div className="max-w-2xl">
              <span className="text-[11px] uppercase font-semibold text-accent tracking-wider block mb-1 font-mono">
                {service.category}
              </span>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-ink mb-3">
                {service.title}
              </h2>
              <p className="text-xs sm:text-sm text-muted font-normal leading-relaxed mb-4">
                {service.description}
              </p>

              {service.details && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {service.details.map((detail, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-3 py-1 rounded-lg bg-accent/15 border border-accent/25 text-accent"
                    >
                      {detail}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col justify-between items-start md:items-end gap-4 border-t md:border-t-0 md:border-l border-rule pt-4 md:pt-0 md:pl-8 flex-shrink-0">
              {service.duration && (
                <div className="flex items-center gap-1 text-xs text-muted">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Длительность: {service.duration}</span>
                </div>
              )}

              <button
                onClick={onOpenBooking}
                className="w-full sm:w-auto min-h-11 bg-ink hover:bg-accent hover:text-accent-ink text-paper font-semibold text-xs px-5 py-2.5 rounded-pill transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5 text-accent-2" />
                <span>Записаться</span>
              </button>
            </div>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </div>
  );
}
