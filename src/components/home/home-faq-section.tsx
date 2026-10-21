import { Heading, Text } from "@/ui-kit";
import { Minus, Plus } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { getFaqItems } from "../../lib/data/faq";
import type { FaqItem } from "../../lib/data/types";
import {
  ScrollAnimate,
  StaggerContainer,
  StaggerItem,
} from "../shared/scroll-animate";

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
    <section
      id="faq"
      className="scroll-mt-20 w-full bg-paper-2 text-ink py-16 sm:py-20 px-5 sm:px-8 border-b border-rule"
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <ScrollAnimate className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <span className="type-overline uppercase text-brand-text mb-2 block">
              Вопросы и ответы
            </span>
            <Heading level={2} className="text-ink">
              Часто задаваемые вопросы
            </Heading>
          </div>
        </ScrollAnimate>

        {/* Linear Accordion List */}
        <StaggerContainer
          className="flex flex-col divide-y divide-rule border-t border-b border-rule bg-surface rounded-2xl shadow-whisper px-6 sm:px-8 py-2"
          data-ui-scheme="default"
        >
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
                  className="w-full text-left flex items-center justify-between gap-4 group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-focus rounded-lg p-1"
                >
                  <span className="type-body-sm text-ink group-hover:text-brand-text transition-colors">
                    {faq.question}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                      isOpen
                        ? "bg-accent text-accent-ink"
                        : "bg-paper-2 text-ink-2 group-hover:bg-paper-3"
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
                      <Text
                        variant="body-sm"
                        className="pt-3 pb-1 text-muted max-w-3xl pr-8"
                      >
                        {faq.answer}
                      </Text>
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
