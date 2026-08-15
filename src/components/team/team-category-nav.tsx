import type { TeamCategory } from "@/lib/reference-content/types";

export const TEAM_CATEGORIES = ["doctors", "nurses", "administrators", "management", "technical"] as const satisfies readonly TeamCategory[];

const CATEGORY_LABELS: Record<TeamCategory | "all", string> = {
  all: "Все сотрудники",
  doctors: "Врачи",
  nurses: "Медсёстры",
  administrators: "Администраторы",
  management: "Руководство",
  technical: "Техническая служба",
};

export function getVisibleTeamCategories(activeCategory: TeamCategory | "all"): readonly TeamCategory[] {
  return activeCategory === "all" ? TEAM_CATEGORIES : [activeCategory];
}

interface TeamCategoryNavProps {
  activeCategory: TeamCategory | "all";
  onSelectCategory: (category: TeamCategory | "all") => void;
  dark?: boolean;
}

export function TeamCategoryNav({ activeCategory, onSelectCategory, dark = false }: TeamCategoryNavProps) {
  return (
    <nav className="my-6 flex flex-wrap items-center justify-center gap-2" aria-label="Категории команды">
      {(["all", ...TEAM_CATEGORIES] as const).map((category) => {
        const isActive = activeCategory === category;
        return (
          <button
            key={category}
            type="button"
            aria-pressed={isActive}
            onClick={() => onSelectCategory(category)}
            className={`min-h-11 rounded-pill border px-4 py-2 text-xs font-medium transition-colors motion-reduce:transition-none sm:text-sm ${
              isActive
                ? dark ? "border-accent/60 bg-accent/20 font-semibold text-accent-soft" : "border-accent/40 bg-accent/15 font-semibold text-ink"
                : dark ? "border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white" : "border-rule bg-paper text-editorial-muted hover:bg-paper-2 hover:text-ink"
            }`}
          >{CATEGORY_LABELS[category]}</button>
        );
      })}
    </nav>
  );
}
