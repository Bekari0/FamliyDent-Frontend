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

      <EquipmentExplorer items={equipmentItems} />
    </div>
  );
}
