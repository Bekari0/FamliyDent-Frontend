import React, { useEffect, useState } from "react";
import { EditorialPageHero } from "../components/shared/editorial-page-hero";
import { EquipmentExplorer } from "../components/equipment/equipment-explorer";
import { getEquipmentItems } from "../lib/data/equipment";
import type { EquipmentItem } from "../lib/data/types";

export function EquipmentPage() {
  const [equipmentItems, setEquipmentItems] = useState<EquipmentItem[]>([]);

  useEffect(() => {
    document.title = "Современное оборудование — Family Dent Душанбе";
    async function loadEquipment() {
      const data = await getEquipmentItems();
      setEquipmentItems(data);
    }
    loadEquipment();
  }, []);

  return (
    <div className="w-full flex flex-col min-h-screen bg-paper text-ink">
      <EditorialPageHero
        badge="Инновации и технологии"
        title="Современное оборудование"
        description="Передовые цифровые технологии, дентальные микроскопы и 3D-томографы, обеспечивающие максимальную точность и безопасность лечения."
      />

      <section className="page-container grid gap-6 py-8 lg:grid-cols-[5fr_7fr] lg:items-end" aria-labelledby="tomography-video-title">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-accent">3D-диагностика</p>
          <h2 id="tomography-video-title" className="mt-3 font-display text-3xl font-semibold leading-tight text-ink">Томография в Family Dent</h2>
          <p className="mt-4 max-w-xl text-pretty leading-relaxed text-muted">Видео показывает технологию, которую мы используем для точной цифровой диагностики и планирования лечения.</p>
        </div>
        <video className="w-full rounded-2xl border border-rule bg-ink shadow-card" controls playsInline preload="metadata">
          <source src="/videos/3d-tomography.mp4" type="video/mp4" />
          Ваш браузер не поддерживает воспроизведение видео.
        </video>
      </section>

      <EquipmentExplorer items={equipmentItems} />
    </div>
  );
}
