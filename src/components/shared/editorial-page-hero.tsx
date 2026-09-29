import React from "react";
import { ScrollAnimate } from "./scroll-animate";

interface EditorialPageHeroProps {
  badge?: string;
  title: string;
  description: string;
  dark?: boolean;
  backgroundImage?: string;
}

export function EditorialPageHero({ badge, title, description, dark = false, backgroundImage }: EditorialPageHeroProps) {
  const hasBackgroundImage = Boolean(backgroundImage);
  const isDark = dark || hasBackgroundImage;

  return (
    <section className={`relative w-full overflow-hidden pt-28 pb-12 text-center sm:pt-36 sm:pb-16 ${hasBackgroundImage ? "min-h-[25rem] sm:min-h-[30rem]" : ""}`}>
      {backgroundImage && (
        <>
          <img src={backgroundImage} alt="" className="absolute inset-0 size-full object-cover" aria-hidden="true" />
          <div className="absolute inset-0 bg-ink/60" aria-hidden="true" />
        </>
      )}
      <ScrollAnimate className="page-container relative z-10 flex flex-col items-center">
        <div className="flex w-full max-w-4xl flex-col items-center">
        {badge && (
          <span
            className={`px-3.5 py-1 rounded-pill text-xs font-semibold mb-4 uppercase tracking-wider font-mono whitespace-nowrap max-w-full overflow-hidden text-ellipsis ${
              isDark
                ? "bg-white/10 border border-white/20 text-accent-soft"
                : "bg-accent/15 border border-accent/25 text-accent"
            }`}
          >
            {badge}
          </span>
        )}
        <h1
          className={`max-w-[22ch] text-balance font-display text-3xl sm:text-4xl md:text-5xl font-semibold tracking-[-0.035em] leading-[1.05] mb-4 ${
            isDark ? "text-white" : "text-ink"
          }`}
        >
          {title}
        </h1>
        <p
          className={`text-pretty text-base sm:text-lg font-normal leading-relaxed max-w-2xl ${
            isDark ? "text-white/80" : "text-muted"
          }`}
        >
          {description}
        </p>
        </div>
      </ScrollAnimate>
    </section>
  );
}
