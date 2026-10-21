import { Container, Heading } from "@/ui-kit";
import { motion, useInView, useReducedMotion } from "motion/react";
import React, { useEffect, useRef, useState } from "react";
import { getClinicMetrics, type ClinicMetric } from "../../lib/data/metrics";

const VIDEO_SRC = "/videos/familydent.mp4";
const VIDEO_POSTER = "/images/clinic-exterior-poster.png";
const VIDEO_DELAY_MS = 1200;
const SLOW_CONNECTION_TYPES = ["slow-2g", "2g", "3g"];

export function ClinicMetricsSection() {
  const [metrics, setMetrics] = useState<ClinicMetric[]>([]);
  const [isVideoMounted, setIsVideoMounted] = useState(false);
  const [isVideoVisible, setIsVideoVisible] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [saveData, setSaveData] = useState(false);
  const [effectiveType, setEffectiveType] = useState<string | undefined>(
    undefined,
  );
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.25 });
  const shouldReduceMotion = useReducedMotion();
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const updateConnectionState = () => {
      const connection = (navigator as any).connection as
        | { saveData?: boolean; effectiveType?: string }
        | undefined;
      setSaveData(connection?.saveData === true);
      setEffectiveType(connection?.effectiveType);
    };

    async function loadMetrics() {
      const data = await getClinicMetrics();
      setMetrics(data);
    }

    loadMetrics();
    updateConnectionState();

    const connection = (navigator as any).connection as
      | { addEventListener?: Function; removeEventListener?: Function }
      | undefined;
    connection?.addEventListener?.("change", updateConnectionState);

    return () => {
      connection?.removeEventListener?.("change", updateConnectionState);
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const isSlowConnection = effectiveType
    ? SLOW_CONNECTION_TYPES.includes(effectiveType)
    : false;
  const shouldLoadVideo = !saveData && !isSlowConnection;

  useEffect(() => {
    if (!shouldLoadVideo || !isInView || isVideoMounted) return;

    timeoutRef.current = window.setTimeout(() => {
      setIsVideoMounted(true);
    }, VIDEO_DELAY_MS);

    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, [isInView, isVideoMounted, shouldLoadVideo]);

  return (
    <section
      ref={sectionRef}
      className="relative z-10 flex h-auto min-h-screen w-full flex-col justify-between overflow-hidden py-6 text-on-dark sm:py-8 desktop:h-screen desktop:max-h-screen desktop:py-10"
    >
      {/* 1. FULL-SCREEN BACKGROUND VIDEO / POSTER WITH OVERLAY */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute inset-0 bg-[url('/images/clinic-exterior-poster.png')] bg-cover bg-center" />

        {isVideoMounted && !videoError && (
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="none"
            poster={VIDEO_POSTER}
            src={VIDEO_SRC}
            onCanPlay={() => setIsVideoVisible(true)}
            onLoadedData={() => setIsVideoVisible(true)}
            onError={() => setVideoError(true)}
            className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none z-0"
            style={{
              opacity: isVideoVisible ? 1 : 0,
              transition: "opacity 0.6s ease-in-out",
            }}
          />
        )}

        <div className="absolute inset-0 bg-overlay/30 pointer-events-none z-[1]" />
      </div>

      {/* 2. TOP HEADER & COMPACT TEXT CONTENT */}
      <Container className="relative z-10">
        {/* Category Badge & Section Title */}
        <div className="flex items-center justify-between gap-4 mb-4 sm:mb-5">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="type-overline inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-surface/10 backdrop-blur-md uppercase text-on-dark/90"
          >
            О КЛИНИКЕ
          </motion.div>

          <motion.span
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 0.65 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="type-overline uppercase text-on-dark/65 hidden sm:inline-block"
          >
            ABOUT US
          </motion.span>
        </div>

        {/* Headline + Paragraph */}
        <div className="max-w-2xl">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="type-heading-3 text-on-dark drop-shadow-sm max-w-[660px]"
          >
            Раскройте совершенство. <br />
            Откройте для себя стандарт{" "}
            <span className="text-accent-soft font-bold">Family Dent</span>.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="type-body-sm mt-3 sm:mt-4 text-on-dark/80 max-w-[540px] drop-shadow-sm"
          >
            В Family Dent мы верим, что ваша улыбка заслуживает экспертной
            заботы и безупречного качества. Наша команда докторов с
            международной сертификацией предлагает премиальный комфорт в
            сочетании с передовой цифровой 3D-диагностикой.
          </motion.p>
        </div>
      </Container>

      {/* 3. HORIZONTAL GLASS STATISTICAL CARDS ROW */}
      <Container className="relative z-10 pt-4 pb-1 sm:pt-6">
        <div className="grid grid-cols-2 desktop:grid-cols-4 gap-3 sm:gap-4 desktop:gap-5 items-stretch">
          {metrics.map((item, index) => (
            <StatGlassCard
              key={item.id}
              metric={item}
              isInView={isInView}
              shouldReduceMotion={!!shouldReduceMotion}
              delay={index * 0.1}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}

interface StatGlassCardProps {
  key?: React.Key;
  metric: ClinicMetric;
  isInView: boolean;
  shouldReduceMotion: boolean;
  delay: number;
}

function StatGlassCard({
  metric,
  isInView,
  shouldReduceMotion,
  delay,
}: StatGlassCardProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (shouldReduceMotion) {
      setDisplayValue(metric.value);
      return;
    }

    if (!isInView) return;

    let startTime: number | null = null;
    const duration = 2800; // Smooth 2.8s count animation
    const target = metric.value;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);

      // Smooth easeOutExpo for natural deceleration towards the target
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const currentVal = Math.floor(easeProgress * target);

      setDisplayValue(currentVal);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayValue(target);
      }
    };

    const animFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animFrame);
  }, [isInView, metric.value, shouldReduceMotion]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{
        duration: 0.6,
        delay: shouldReduceMotion ? 0 : delay,
        ease: "easeOut",
      }}
      className="bg-surface/10 backdrop-blur-md border border-on-dark/15 rounded-2xl p-5 sm:p-6 text-on-dark shadow-xl transition-all duration-300 hover:bg-surface/15 hover:border-on-dark/25 hover:-translate-y-0.5 flex flex-col justify-between"
    >
      <div>
        <div className="flex items-baseline gap-1">
          {metric.prefix && (
            <span className="type-heading-3 text-on-dark">{metric.prefix}</span>
          )}
          <span className="type-heading-2 text-on-dark" aria-live="polite">
            {shouldReduceMotion ? metric.value : displayValue}
          </span>
          {metric.suffix && (
            <span className="type-heading-3 relative top-1 text-accent-soft self-baseline ml-0.5">
              {metric.suffix}
            </span>
          )}
        </div>

        <Heading level={3} variant="heading-6" className="text-on-dark/80 mt-3">
          {metric.label}
        </Heading>
      </div>
    </motion.div>
  );
}
