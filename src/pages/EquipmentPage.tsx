import { EquipmentExplorer } from "@/components/equipment/equipment-explorer";
import { EditorialPageHero } from "@/components/shared/editorial-page-hero";
import { equipmentItems } from "@/lib/reference-content/equipment";

export function EquipmentPage() {
  return <main className="min-h-screen bg-paper"><EditorialPageHero badge="Технологии" title="Оборудование экспертного уровня" description="Цифровая диагностика и точные протоколы помогают сделать лечение предсказуемым и бережным." /><EquipmentExplorer items={equipmentItems} /></main>;
}
