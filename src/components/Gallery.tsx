'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';

const STATS = [
  { value: 12, suffix: '+', label: 'лет заботы о пациентах' },
  { value: 8500, suffix: '+', label: 'пациентов доверили нам улыбку', grouped: true },
  { value: 96, suffix: '%', label: 'пациентов рекомендуют клинику' },
  { value: 14, suffix: '', label: 'врачей разных направлений' },
];

function AnimatedNumber({
  value,
  suffix,
  grouped = false,
  active,
}: {
  value: number;
  suffix: string;
  grouped?: boolean;
  active: boolean;
}) {
  const [current, setCurrent] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!active) return;
    if (reduceMotion) {
      setCurrent(value);
      return;
    }

    let frame = 0;
    const duration = 1600;
    const startedAt = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - startedAt) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(Math.round(value * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, reduceMotion, value]);

  const formatted = grouped
    ? new Intl.NumberFormat('ru-RU').format(current)
    : String(current);

  return (
    <span aria-label={`${value}${suffix}`}>
      <span aria-hidden="true">{formatted}{suffix}</span>
    </span>
  );
}

export function Gallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.25 });
  const reduceMotion = useReducedMotion();

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative isolate min-h-[900px] overflow-hidden bg-[#F4F6F3] text-[#071A1F] lg:min-h-[1000px]"
      aria-labelledby="clinic-story-title"
    >
      <motion.img
        src="/images/clinic-room-reference.jpg"
        alt="Врач Family Dent показывает пациенту результаты диагностики на мониторе"
        className="absolute inset-0 -z-30 h-full w-full object-cover object-[68%_center]"
        initial={{ scale: 1 }}
        whileInView={{ scale: reduceMotion ? 1 : 1.12 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 8, ease: [0.2, 0.7, 0.2, 1] }}
      />
      <div className="absolute inset-0 -z-20 bg-[linear-gradient(90deg,rgba(247,249,246,0.98)_0%,rgba(247,249,246,0.9)_24%,rgba(247,249,246,0.45)_53%,rgba(7,26,31,0.08)_100%)]" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(0deg,rgba(247,249,246,0.9)_0%,transparent_32%)]" />

      <div className="mx-auto flex min-h-[900px] max-w-[1536px] flex-col px-5 pb-7 pt-24 sm:px-8 lg:min-h-[1000px] lg:px-14 lg:pb-10 lg:pt-28">
        <motion.div
          className="max-w-[650px]"
          initial={{ opacity: 0, y: 34 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.45 }}
          transition={{ duration: 0.75, ease: 'easeOut' }}
        >
          <p className="mb-8 font-mono text-xs font-bold uppercase tracking-[0.18em] text-[#0E9D91]">
            О клинике
          </p>
          <h2
            id="clinic-story-title"
            className="max-w-[620px] font-display text-[clamp(3.4rem,6.1vw,7.2rem)] font-bold leading-[0.92] tracking-[-0.065em] text-balance"
          >
            Забота, которую чувствует вся семья
          </h2>
          <p className="mt-9 max-w-[610px] text-base font-medium leading-7 text-[#273A3E] sm:text-lg sm:leading-8">
            Family Dent — семейная клиника в Душанбе. Мы объединяем диагностику и
            специалистов разных направлений в одном понятном маршруте: врач показывает
            план лечения, объясняет каждый этап и остаётся на связи после приёма.
          </p>
        </motion.div>

        <div className="mt-auto grid gap-3 pt-20 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((stat, index) => (
            <motion.article
              key={stat.label}
              className="min-h-36 rounded-2xl border border-white/70 bg-white/80 p-5 shadow-[0_18px_50px_rgba(7,26,31,0.08)] backdrop-blur-md sm:p-6"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.55, delay: index * 0.08 }}
            >
              <p className="font-mono text-base font-bold tracking-[-0.03em] text-[#0E9D91] sm:text-lg">
                <AnimatedNumber
                  value={stat.value}
                  suffix={stat.suffix}
                  grouped={stat.grouped}
                  active={isInView}
                />
              </p>
              <h3 className="mt-6 max-w-[310px] font-display text-xl font-bold leading-tight tracking-[-0.03em] text-[#071A1F] sm:text-2xl">
                {stat.label}
              </h3>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
