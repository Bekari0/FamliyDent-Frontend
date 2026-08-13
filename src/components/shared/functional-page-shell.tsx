import React from "react";

interface FunctionalPageShellProps {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  width?: "normal" | "wide";
}

export function FunctionalPageShell({
  eyebrow,
  title,
  description,
  actions,
  children,
  width = "normal",
}: FunctionalPageShellProps) {
  const containerWidth = width === "wide" ? "max-w-7xl" : "max-w-5xl";

  return (
    <main className="min-h-screen bg-paper px-5 pb-12 pt-28 text-ink sm:px-8 sm:pb-16 sm:pt-36">
      <div className={`mx-auto w-full ${containerWidth}`}>
        <header className="mb-8 border-b border-rule pb-6 sm:mb-10 sm:pb-8">
          {eyebrow && <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-wider text-trust">{eyebrow}</p>}
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-3xl">
              <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">{title}</h1>
              {description && <p className="mt-3 text-base leading-relaxed text-editorial-muted">{description}</p>}
            </div>
            {actions && <div className="flex shrink-0 flex-wrap items-center gap-3">{actions}</div>}
          </div>
        </header>
        {children}
      </div>
    </main>
  );
}
