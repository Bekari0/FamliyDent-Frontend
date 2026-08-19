import React from "react";
import { ScrollAnimate } from "./scroll-animate";

interface EditorialPageHeroProps {
  badge?: string;
  title: string;
  description: string;
  dark?: boolean;
}

export function EditorialPageHero({ badge, title, description, dark = false }: EditorialPageHeroProps) {
  return (
    <section className="relative w-full pt-28 pb-12 sm:pt-36 sm:pb-16 text-center overflow-hidden">
      <ScrollAnimate className="page-container flex flex-col items-center">
        <div className="flex w-full max-w-4xl flex-col items-center">
        {badge && (
          <span
            className={`px-3.5 py-1 rounded-pill text-xs font-semibold mb-4 uppercase tracking-wider font-mono whitespace-nowrap max-w-full overflow-hidden text-ellipsis ${
              dark
                ? "bg-white/10 border border-white/20 text-accent-soft"
                : "bg-accent/15 border border-accent/25 text-accent"
            }`}
          >
            {badge}
          </span>
        )}
        <h1
          className={`max-w-[22ch] text-balance font-display text-3xl sm:text-4xl md:text-5xl font-semibold tracking-[-0.035em] leading-[1.05] mb-4 ${
            dark ? "text-white" : "text-ink"
          }`}
        >
          {title}
        </h1>
        <p
          className={`text-pretty text-base sm:text-lg font-normal leading-relaxed max-w-2xl ${
            dark ? "text-white/80" : "text-muted"
          }`}
        >
          {description}
        </p>
        </div>
      </ScrollAnimate>
    </section>
  );
}
