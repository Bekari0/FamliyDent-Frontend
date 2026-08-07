import React from "react";
import type { TeamCategory } from "@/lib/data/types";

interface TeamCategoryNavProps {
  activeCategory: TeamCategory | "all";
  onSelectCategory: (cat: TeamCategory | "all") => void;
  dark?: boolean;
}

const CATEGORIES: { id: TeamCategory | "all"; label: string }[] = [
  { id: "all", label: "Все сотрудники" },
  { id: "doctors", label: "Врачи" },
  { id: "nurses", label: "Медсёстры" },
  { id: "administrators", label: "Администраторы" },
  { id: "management", label: "Руководство" },
  { id: "technical", label: "Техническая служба" },
];

export function TeamCategoryNav({
  activeCategory,
  onSelectCategory,
  dark = false,
}: TeamCategoryNavProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 my-6">
      {CATEGORIES.map((cat) => {
        const isActive = activeCategory === cat.id;
        return (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={`px-4 py-2 rounded-pill text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer border ${
              isActive
                ? dark
                  ? "bg-accent/20 border-accent/60 text-accent-soft font-semibold shadow-sm"
                  : "bg-accent/15 border-accent/40 text-ink font-semibold shadow-sm"
                : dark
                  ? "bg-white/5 border-white/10 text-white/70 hover:text-white hover:bg-white/10"
                  : "bg-paper border-rule text-muted hover:text-ink hover:bg-paper-2"
            }`}
          >
            {cat.label}
          </button>
        );
      })}
    </div>
  );
}
