import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Camera, Layers, Eye } from "lucide-react";
import type { ClinicSpace } from "@/lib/data/types";
import { ClinicSpaceSelector } from "./clinic-space-selector";

interface ClinicTourProps {
  spaces: ClinicSpace[];
  title?: string;
  subtitle?: string;
}

export function ClinicTour({
  spaces,
  title = "Фотоэкскурсия по клинике Family Dent",
  subtitle = "Современное стоматологическое пространство, спроектированное для максимального комфорта пациентов в Душанбе.",
}: ClinicTourProps) {
  const [activeSpace, setActiveSpace] = useState<ClinicSpace>(spaces[0] || {
    id: "reception",
    slug: "reception",
    title: "Ресепшн",
    description: "Просторная зона приема с уютной атмосферой.",
    image: "https://images.pexels.com/photos/6627618/pexels-photo-6627618.jpeg?auto=compress&cs=tinysrgb&w=1200",
    order: 1
  });

  const [tourMode, setTourMode] = useState<"photo" | "panorama">("photo");

  return (
    <div className="page-container py-8">
      {/* Header section */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-pill bg-accent/15 border border-accent/25 text-accent text-xs font-semibold mb-3 font-mono">
            <Camera className="w-3.5 h-3.5" />
            <span>Виртуальное знакомство</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold text-ink tracking-tight">
            {title}
          </h2>
          <p className="text-sm text-muted max-w-2xl mt-2 font-normal leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Mode Toggle (Prepared for future 360 panorama) */}
        <div className="flex items-center gap-1 bg-paper p-1 rounded-xl border border-rule self-start md:self-auto">
          <button
            onClick={() => setTourMode("photo")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              tourMode === "photo"
                ? "bg-accent/20 text-ink border border-accent/30 shadow-2xs"
                : "text-muted hover:text-ink"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Фотогалерея</span>
          </button>
          <button
            onClick={() => setTourMode("panorama")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              tourMode === "panorama"
                ? "bg-accent/20 text-ink border border-accent/30 shadow-2xs"
                : "text-muted hover:text-ink"
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>360° Панорама</span>
          </button>
        </div>
      </div>

      {/* Tour Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Selector */}
        <div className="lg:col-span-4 bg-surface border border-rule p-4 rounded-2xl shadow-card">
          <h3 className="text-xs uppercase font-semibold text-accent tracking-wider mb-3 px-1 font-mono">
            Зоны клиники
          </h3>
          <ClinicSpaceSelector
            spaces={spaces}
            activeSpaceId={activeSpace.id}
            onSelectSpace={(s) => setActiveSpace(s)}
          />
        </div>

        {/* Right Column: Interactive Space Display */}
        <div className="lg:col-span-8 bg-surface border border-rule rounded-2xl overflow-hidden shadow-card relative flex flex-col">
          <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden bg-paper">
            <AnimatePresence mode="wait">
              <motion.img
                key={activeSpace.id + tourMode}
                src={activeSpace.image}
                alt={activeSpace.title}
                loading="lazy"
                decoding="async"
                initial={{ opacity: 0, scale: 1.03 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="w-full h-full object-cover"
              />
            </AnimatePresence>

            {/* Mode badge overlay */}
            <div className="absolute top-4 left-4 bg-ink/75 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-xs text-paper flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span>{tourMode === "panorama" ? "Интерактивный обзор 360°" : "Высокое разрешение HD"}</span>
            </div>
          </div>

          {/* Description footer */}
          <div className="p-6 bg-paper border-t border-rule">
            <h3 className="font-display text-xl font-bold text-ink mb-2">{activeSpace.title}</h3>
            <p className="text-sm text-muted font-normal leading-relaxed">
              {activeSpace.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
