import React, { useEffect, useState } from "react";
import { EditorialPageHero } from "../components/shared/editorial-page-hero";
import { HelpCircle } from "lucide-react";
import { getFaqItems } from "../lib/data/faq";
import type { FaqItem } from "../lib/data/types";

export function FaqPage() {
  const [faqs, setFaqs] = useState<FaqItem[]>([]);

  useEffect(() => {
    document.title = "Частые вопросы (FAQ) — Family Dent";
    async function loadFaq() {
      const data = await getFaqItems();
      setFaqs(data);
    }
    loadFaq();
  }, []);

  return (
    <div className="w-full flex flex-col min-h-screen bg-paper text-ink">
      <EditorialPageHero
        badge="Ответы на вопросы"
        title="Часто задаваемые вопросы"
        description="Ответы наших специалистов на самые популярные вопросы о лечении, ценах, наркозе и гарантиях."
      />

      <div className="max-w-3xl mx-auto px-5 my-8 w-full flex flex-col gap-4">
        {faqs.map((item) => (
          <div
            key={item.id}
            className="bg-surface border border-rule rounded-2xl p-6 shadow-card"
          >
            <div className="flex items-start gap-3 mb-2">
              <HelpCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
              <h2 className="font-display text-base sm:text-lg font-bold text-ink">{item.question}</h2>
            </div>
            <p className="text-xs sm:text-sm text-muted font-normal leading-relaxed pl-8">
              {item.answer}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
