import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, CheckCircle2 } from "lucide-react";
import type { EquipmentItem } from "@/lib/data/types";
import { ScrollAnimate, StaggerContainer, StaggerItem } from "../shared/scroll-animate";

interface EquipmentExplorerProps {
  items: EquipmentItem[];
}

export function EquipmentExplorer({ items }: EquipmentExplorerProps) {
  const [activeItem, setActiveItem] = useState<EquipmentItem>(
    items[0] || {
      id: "eq-1",
      slug: "microscope",
      name: "Дентальный микроскоп",
      description: "Оптическая система для сверхточного лечения.",
      patientBenefit: "Максимальное сохранение здоровых тканей зуба.",
      image: "https://images.pexels.com/photos/3845766/pexels-photo-3845766.jpeg?auto=compress&cs=tinysrgb&w=1000",
    }
  );

  return (
    <div className="w-full max-w-7xl mx-auto px-5 py-8">
      {/* Desktop Layout */}
      <ScrollAnimate className="hidden md:grid md:grid-cols-12 gap-8 items-start">
        {/* Left List */}
        <div className="md:col-span-5 bg-surface border border-rule p-4 rounded-2xl flex flex-col gap-2 shadow-card">
          <h3 className="text-xs uppercase font-semibold text-accent tracking-wider mb-2 px-2 font-mono">
            Инновационное оснащение
          </h3>
          {items.map((item) => {
            const isActive = item.id === activeItem.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveItem(item)}
                className={`w-full text-left p-3.5 rounded-xl transition-all duration-200 cursor-pointer flex items-center justify-between border ${
                  isActive
                    ? "bg-accent/15 border-accent/40 text-ink font-semibold shadow-sm"
                    : "bg-paper border-rule text-muted hover:text-ink hover:bg-paper-2"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${isActive ? "bg-accent shadow-[0_0_8px_var(--color-accent)]" : "bg-rule"}`} />
                  <span className="text-sm font-medium">{item.name}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Active Display */}
        <div className="md:col-span-7 bg-surface border border-rule rounded-2xl overflow-hidden shadow-card p-6 flex flex-col gap-5">
          <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-paper">
            <AnimatePresence mode="wait">
              <motion.img
                key={activeItem.id}
                src={activeItem.image}
                alt={activeItem.name}
                loading="lazy"
                decoding="async"
                initial={{ opacity: 0, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full object-cover"
              />
            </AnimatePresence>
          </div>

          <div>
            <h3 className="font-display text-2xl font-bold text-ink mb-2">{activeItem.name}</h3>
            <p className="text-sm text-muted font-normal leading-relaxed mb-4">
              {activeItem.description}
            </p>

            <div className="p-4 rounded-xl bg-accent/15 border border-accent/25 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-semibold text-accent uppercase tracking-wide block mb-0.5 font-mono">
                  Что получает пациент:
                </span>
                <p className="text-xs text-ink font-normal leading-relaxed">
                  {activeItem.patientBenefit}
                </p>
              </div>
            </div>
          </div>
        </div>
      </ScrollAnimate>

      {/* Mobile Sequential Layout */}
      <StaggerContainer className="md:hidden flex flex-col gap-6">
        {items.map((item) => (
          <StaggerItem
            key={item.id}
            className="bg-surface border border-rule rounded-2xl p-5 shadow-card flex flex-col gap-4"
          >
            <div className="aspect-[16/10] w-full rounded-xl overflow-hidden bg-paper">
              <img
                src={item.image}
                alt={item.name}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-ink mb-1.5">{item.name}</h3>
              <p className="text-xs text-muted font-normal leading-relaxed mb-3">
                {item.description}
              </p>
              <div className="p-3 rounded-xl bg-accent/15 border border-accent/25 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-[11px] font-semibold text-accent uppercase block mb-0.5 font-mono">
                    Польза для вас:
                  </span>
                  <p className="text-xs text-ink font-normal leading-relaxed">
                    {item.patientBenefit}
                  </p>
                </div>
              </div>
            </div>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </div>
  );
}
