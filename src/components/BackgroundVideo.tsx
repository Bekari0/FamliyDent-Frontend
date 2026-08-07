import React from "react";

export function BackgroundVideo() {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden select-none pointer-events-none z-0">
      {/* Abstract Pure CSS Ambient Glow & Radial Gradient Base */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          background: `
            radial-gradient(circle at 50% 50%, color-mix(in oklch, var(--color-accent) 25%, transparent) 0%, color-mix(in oklch, var(--color-accent) 10%, transparent) 35%, transparent 70%),
            var(--gradient-dark)
          `,
        }}
      />

      {/* Decorative CSS Orbit / Subtle Grid Line Accents */}
      <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(var(--color-accent)_1px,transparent_1px)] [background-size:32px_32px] pointer-events-none" />

      {/* Ambient soft light spots */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] sm:w-[900px] h-[700px] sm:h-[900px] rounded-full blur-[120px] pointer-events-none animate-green-pulse" style={{ background: "color-mix(in oklch, var(--color-accent) 15%, transparent)" }} />
    </div>
  );
}
