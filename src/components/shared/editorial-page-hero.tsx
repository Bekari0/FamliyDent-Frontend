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
    <section className="relative mx-auto w-full max-w-7xl overflow-hidden px-5 pb-12 pt-28 text-center sm:pb-16 sm:pt-36">
      <ScrollAnimate className="mx-auto flex max-w-3xl flex-col items-center">
        {badge && (
          <span className={`mb-4 max-w-full overflow-hidden text-ellipsis whitespace-nowrap rounded-pill border px-3.5 py-1 font-mono text-xs font-semibold uppercase tracking-wider ${dark ? "border-white/20 bg-white/10 text-accent-soft" : "border-accent/25 bg-accent/15 text-accent"}`}>
            {badge}
          </span>
        )}
        <h1 className={`mb-4 font-display text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl md:text-5xl ${dark ? "text-white" : "text-ink"}`}>
          {title}
        </h1>
        <p className={`max-w-2xl text-base font-normal leading-relaxed sm:text-lg ${dark ? "text-white/80" : "text-muted"}`}>
          {description}
        </p>
      </ScrollAnimate>
    </section>
  );
}
