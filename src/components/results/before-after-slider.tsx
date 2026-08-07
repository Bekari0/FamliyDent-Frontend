import React, { useState, useRef, useCallback, useEffect } from "react";

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
  const [position, setPosition] = useState<number>(50); // percentage 0 - 100
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(0);

  useEffect(() => {
    if (!containerRef.current) return;
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const calculatePos = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    let percent = (x / rect.width) * 100;
    if (percent < 0) percent = 0;
    if (percent > 100) percent = 100;
    setPosition(percent);
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    calculatePos(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    calculatePos(e.clientX);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // pointer release fallback
    }
  };

  const handlePointerCancel = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowLeft") {
      setPosition((prev) => Math.max(0, prev - 5));
    } else if (e.key === "ArrowRight") {
      setPosition((prev) => Math.min(100, prev + 5));
    } else if (e.key === "Home") {
      setPosition(0);
    } else if (e.key === "End") {
      setPosition(100);
    }
  };

  return (
    <div className="w-full flex flex-col gap-2">
      <div
        ref={containerRef}
        role="slider"
        tabIndex={0}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(position)}
        aria-label={title}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        onKeyDown={handleKeyDown}
        className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden select-none cursor-ew-resize touch-pan-y border border-slate-200 bg-slate-900 shadow-md focus:outline-none focus:ring-2 focus:ring-accent"
      >
        {/* Underneath image: AFTER */}
        <img
          src={afterImage}
          alt="Результат после лечения"
          loading="lazy"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        />

        {/* Top image: BEFORE (clipped) */}
        <div
          className="absolute inset-y-0 left-0 overflow-hidden pointer-events-none"
          style={{ width: `${position}%` }}
        >
          <img
            src={beforeImage}
            alt="До лечения"
            loading="lazy"
            decoding="async"
            className="absolute inset-y-0 left-0 max-w-none h-full object-cover"
            style={{ width: containerWidth > 0 ? `${containerWidth}px` : "100%" }}
          />
        </div>

        {/* Divider line and handle */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-accent pointer-events-none shadow-[0_0_12px_rgba(216,200,163,0.8)]"
          style={{ left: `${position}%` }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white border-2 border-accent flex items-center justify-center shadow-lg text-ink text-xs font-bold">
            ↔
          </div>
        </div>

        {/* Text Badges */}
        <div className="absolute top-3 left-3 bg-ink/75 backdrop-blur-md px-2.5 py-1 rounded-lg text-[11px] font-bold text-paper uppercase tracking-wider border border-white/20 pointer-events-none shadow-sm font-mono">
          До
        </div>
        <div className="absolute top-3 right-3 bg-ink/75 backdrop-blur-md px-2.5 py-1 rounded-lg text-[11px] font-bold text-accent uppercase tracking-wider border border-accent/30 pointer-events-none shadow-sm font-mono">
          После
        </div>
      </div>

      {/* Mandatory Disclaimer */}
      <p className="text-[11px] text-slate-500 font-normal italic leading-normal px-1">
        {disclaimer}
      </p>
    </div>
  );
}
