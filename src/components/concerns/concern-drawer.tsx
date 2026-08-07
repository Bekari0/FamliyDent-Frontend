import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ArrowRight, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import type { ConcernItem } from "@/lib/data/types";

interface ConcernDrawerProps {
  concerns: ConcernItem[];
}

export function ConcernDrawer({ concerns }: ConcernDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section id="concerns" className="w-full max-w-7xl mx-auto px-5 my-6 sm:my-10 z-10 relative">
      <div className="bg-surface border border-rule rounded-2xl shadow-card backdrop-blur-xl overflow-hidden transition-all duration-300 text-ink">
        {/* Accordion Trigger Header */}
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          aria-expanded={isOpen}
          aria-controls="concern-drawer-content"
          className="w-full px-6 py-4 sm:px-8 sm:py-5 flex items-center justify-between text-left cursor-pointer group focus:outline-none focus:ring-2 focus:ring-accent/50 rounded-2xl"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-accent-soft border border-rule flex items-center justify-center text-accent transition-transform duration-300 group-hover:scale-105">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display text-lg sm:text-xl font-bold text-ink tracking-tight flex items-center gap-2">
                <span>Что вас беспокоит?</span>
              </h2>
              <p className="text-xs sm:text-sm text-muted font-normal mt-0.5">
                Выберите вашу проблему для быстрой симптоматической консультации
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-accent hidden sm:inline">
              {isOpen ? "Свернуть" : "Развернуть список"}
            </span>
            <div className={`w-8 h-8 rounded-full bg-paper border border-rule flex items-center justify-center transition-transform duration-300 ${isOpen ? "rotate-180 bg-accent-soft text-accent" : "text-muted"}`}>
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>
        </button>

        {/* Expandable Content Drawer */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              id="concern-drawer-content"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden border-t border-rule bg-paper-2"
            >
              <div className="p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {concerns.map((item) => (
                  <Link
                    key={item.id}
                    to={item.serviceHref}
                    className="p-4 rounded-xl bg-paper hover:bg-surface border border-rule hover:border-accent/40 transition-all duration-200 group flex flex-col justify-between shadow-whisper"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm font-semibold text-ink group-hover:text-accent transition-colors">
                          {item.title}
                        </span>
                        <ArrowRight className="w-4 h-4 text-muted group-hover:text-accent group-hover:translate-x-1 transition-all" />
                      </div>
                      {item.shortDescription && (
                        <p className="text-xs text-muted font-normal leading-relaxed">
                          {item.shortDescription}
                        </p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
