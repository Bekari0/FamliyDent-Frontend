import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Plus, Minus, HelpCircle } from "lucide-react";
import { getFaqItems } from "../../lib/data/faq";
import type { FaqItem } from "../../lib/data/types";
import { ScrollAnimate, StaggerContainer, StaggerItem } from "../shared/scroll-animate";

export function HomeFaqSection() {
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [openId, setOpenId] = useState<string | null>("faq-1");

  useEffect(() => {
    async function load() {
      const data = await getFaqItems();
      setFaqs(data);
    }
    load();
  }, []);

  const toggleAccordion = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section className="w-full bg-[var(--color-paper-2)] text-[var(--color-ink)] py-16 sm:py-20 px-5 sm:px-8 border-b border-[var(--color-rule)]">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <ScrollAnimate className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs uppercase font-bold text-[var(--color-accent)] tracking-wider mb-2 block font-mono">
              Вопросы и ответы
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[var(--color-ink)] tracking-tight">
              Часто задаваемые вопросы
            </h2>
          </div>
          <Link
            to="/faq"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--color-surface)] text-[var(--color-ink)] border border-[var(--color-rule)] text-xs font-bold hover:bg-[var(--color-paper)] transition-all self-start sm:self-auto group shadow-2xs"
          >
            <span>Все вопросы</span>
            <ArrowRight className="w-4 h-4 text-[var(--color-accent)] group-hover:translate-x-1 transition-transform" />
          </Link>
        </ScrollAnimate>

        {/* Linear Accordion List */}
        <StaggerContainer className="flex flex-col divide-y divide-[var(--color-rule)] border-t border-b border-[var(--color-rule)] bg-[var(--color-surface)] rounded-2xl shadow-[var(--shadow-whisper)] px-6 sm:px-8 py-2">
          {faqs.map((faq) => {
            const isOpen = openId === faq.id;
            const contentId = `faq-content-${faq.id}`;
            const buttonId = `faq-trigger-${faq.id}`;

            return (
              <StaggerItem key={faq.id} className="py-5">
                <button
                  id={buttonId}
                  aria-expanded={isOpen}
                  aria-controls={contentId}
                  onClick={() => toggleAccordion(faq.id)}
                  className="w-full text-left flex items-center justify-between gap-4 group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] rounded-lg p-1"
                >
                  <span className="text-base sm:text-lg font-bold text-[var(--color-ink)] group-hover:text-[var(--color-accent)] transition-colors">
                    {faq.question}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                      isOpen
                        ? "bg-[var(--color-accent)] text-[var(--color-accent-ink)]"
                        : "bg-[var(--color-paper-2)] text-[var(--color-ink-2)] group-hover:bg-[var(--color-paper-3)]"
                    }`}
                  >
                    {isOpen ? (
                      <Minus className="w-4 h-4" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={contentId}
                      role="region"
                      aria-labelledby={buttonId}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <p className="pt-3 pb-1 text-xs sm:text-sm text-[var(--color-muted)] font-normal leading-relaxed max-w-3xl pr-8">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}
