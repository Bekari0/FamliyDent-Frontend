import React, { useEffect, useState } from "react";
import { EditorialPageHero } from "../components/shared/editorial-page-hero";
import { Calendar, Tag } from "lucide-react";
import { getPricingItems } from "../lib/data/pricing";
import type { PricingItem } from "../lib/data/types";

interface PricingPageProps {
  onOpenBooking: () => void;
}

export function PricingPage({ onOpenBooking }: PricingPageProps) {
  const [pricing, setPricing] = useState<PricingItem[]>([]);

  useEffect(() => {
    document.title = "Цены на услуги — Family Dent Душанбе";
    async function loadPricing() {
      const data = await getPricingItems();
      setPricing(data);
    }
    loadPricing();
  }, []);

  const categories = Array.from(new Set(pricing.map((p) => p.category)));

  return (
    <div className="w-full flex flex-col min-h-screen bg-paper text-ink">
      <EditorialPageHero
        badge="Прозрачная стоимость"
        title="Цены на лечение"
        description="Фиксированные расценки без скрытых доплат. Точную стоимость план лечения указывает доктор после бесплатного первичного осмотра."
      />

      <div className="page-container page-container--content my-8 flex flex-col gap-8">
        {categories.map((cat) => {
          const items = pricing.filter((p) => p.category === cat);
          return (
            <div key={cat} className="bg-surface border border-rule rounded-3xl p-6 sm:p-8 shadow-card">
              <h2 className="font-display text-lg sm:text-xl font-bold text-ink mb-4 border-b border-rule pb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-accent" />
                <span>{cat}</span>
              </h2>

              <div className="divide-y divide-rule">
                {items.map((item) => (
                  <div key={item.id} className="py-3.5 flex items-center justify-between gap-4">
                    <span className="text-xs sm:text-sm text-ink font-medium">{item.name}</span>
                    <span className="text-xs sm:text-sm text-accent font-bold whitespace-nowrap bg-accent/15 px-3 py-1 rounded-lg border border-accent/25 font-mono">
                      {item.price}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
