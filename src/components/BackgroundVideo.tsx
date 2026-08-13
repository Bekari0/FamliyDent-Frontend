import React from "react";

export function BackgroundVideo() {
  return (
    <div className="absolute inset-0 z-0 h-full w-full pointer-events-none select-none overflow-hidden">
      <div
        className="absolute inset-0 h-full w-full"
        style={{
          background: `
            radial-gradient(circle at 50% 50%, color-mix(in oklch, var(--color-accent) 25%, transparent) 0%, color-mix(in oklch, var(--color-accent) 10%, transparent) 35%, transparent 70%),
            var(--gradient-dark)
          `,
        }}
      />
      <div className="absolute inset-0 pointer-events-none opacity-[0.04] bg-[radial-gradient(var(--color-accent)_1px,transparent_1px)] [background-size:32px_32px]" />
      <div
        className="absolute top-1/2 left-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[120px] pointer-events-none sm:h-[900px] sm:w-[900px] animate-green-pulse motion-reduce:animate-none"
        style={{ background: "color-mix(in oklch, var(--color-accent) 15%, transparent)" }}
      />
    </div>
  );
}
