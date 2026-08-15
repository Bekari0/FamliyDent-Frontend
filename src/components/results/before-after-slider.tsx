import { useCallback, useEffect, useRef, useState } from "react";

type SliderKey = "ArrowLeft" | "ArrowRight" | "Home" | "End" | string;

export function normalizeSliderPosition(value: number): number {
  return Math.min(100, Math.max(0, value));
}

export function moveSliderPosition(position: number, key: SliderKey): number {
  if (key === "ArrowLeft") return normalizeSliderPosition(position - 5);
  if (key === "ArrowRight") return normalizeSliderPosition(position + 5);
  if (key === "Home") return 0;
  if (key === "End") return 100;
  return normalizeSliderPosition(position);
}

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  title?: string;
  disclaimer?: string;
}

export function BeforeAfterSlider({
  beforeImage,
  afterImage,
  title = "Сравнение результата до и после",
  disclaimer = "Результат лечения индивидуален и зависит от клинической ситуации.",
}: BeforeAfterSliderProps) {
  const [position, setPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateWidth = () => setContainerWidth(containerRef.current?.clientWidth ?? 0);
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const updateFromPointer = useCallback((clientX: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) return;
    setPosition(normalizeSliderPosition(((clientX - rect.left) / rect.width) * 100));
  }, []);

  const releasePointer = (event: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  };

  return (
    <div className="flex w-full flex-col gap-2">
      <p id={`slider-help-${title}`} className="sr-only">Используйте стрелки влево и вправо, чтобы сравнить изображения.</p>
      <div
        ref={containerRef}
        role="slider"
        tabIndex={0}
        aria-label={title}
        aria-describedby={`slider-help-${title}`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(position)}
        aria-valuetext={`${Math.round(position)}% изображения до лечения`}
        aria-orientation="horizontal"
        onPointerDown={(event) => { setIsDragging(true); event.currentTarget.setPointerCapture(event.pointerId); updateFromPointer(event.clientX); }}
        onPointerMove={(event) => { if (isDragging) updateFromPointer(event.clientX); }}
        onPointerUp={releasePointer}
        onPointerCancel={releasePointer}
        onKeyDown={(event) => {
          if (["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) {
            event.preventDefault();
            setPosition((current) => moveSliderPosition(current, event.key));
          }
        }}
        className="relative aspect-[4/3] w-full touch-pan-y select-none overflow-hidden rounded-2xl border border-rule bg-ink shadow-md focus:outline-none focus:ring-2 focus:ring-accent"
      >
        <img src={afterImage} alt="Результат после лечения" loading="lazy" decoding="async" draggable={false} className="pointer-events-none absolute inset-0 h-full w-full object-cover" />
        <div className="pointer-events-none absolute inset-y-0 left-0 overflow-hidden" style={{ width: `${position}%` }}>
          <img src={beforeImage} alt="До лечения" loading="lazy" decoding="async" draggable={false} className="absolute inset-y-0 left-0 h-full max-w-none object-cover" style={{ width: containerWidth > 0 ? `${containerWidth}px` : "100%" }} />
        </div>
        <div aria-hidden="true" className="pointer-events-none absolute bottom-0 top-0 w-1 bg-accent" style={{ left: `${position}%` }}><span className="absolute top-1/2 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-accent bg-white text-xs font-bold text-ink shadow-lg">↔</span></div>
        <span aria-hidden="true" className="pointer-events-none absolute left-3 top-3 rounded-lg border border-white/20 bg-ink/75 px-2.5 py-1 font-mono text-[11px] font-bold uppercase tracking-wider text-paper">До</span>
        <span aria-hidden="true" className="pointer-events-none absolute right-3 top-3 rounded-lg border border-accent/30 bg-ink/75 px-2.5 py-1 font-mono text-[11px] font-bold uppercase tracking-wider text-accent">После</span>
      </div>
      <p className="px-1 text-[11px] italic leading-normal text-editorial-muted">{disclaimer}</p>
    </div>
  );
}
