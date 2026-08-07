import React, { useEffect, useState } from "react";
import { EditorialPageHero } from "../components/shared/editorial-page-hero";
import { ClinicTour } from "../components/clinic/clinic-tour";
import { getClinicSpaces } from "../lib/data/clinic-spaces";
import type { ClinicSpace } from "../lib/data/types";

export function ClinicTourPage() {
  const [spaces, setSpaces] = useState<ClinicSpace[]>([]);

  useEffect(() => {
    document.title = "Фотоэкскурсия по клинике — Family Dent Душанбе";
    async function loadSpaces() {
      const data = await getClinicSpaces();
      setSpaces(data);
    }
    loadSpaces();
  }, []);

  return (
    <div className="w-full flex flex-col min-h-screen bg-paper text-ink">
      <EditorialPageHero
        badge="Виртуальный визит"
        title="Познакомьтесь с нашей клиникой"
        description="Взгляните на уютные интерьеры, стерилизационный блок и передовые кабинеты Family Dent еще до первого посещения."
      />

      <ClinicTour spaces={spaces} />
    </div>
  );
}
