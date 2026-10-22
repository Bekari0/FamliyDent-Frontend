import {
  Container,
  Heading,
  readCssMilliseconds,
  Reveal,
  RevealGroup,
  RevealHeading,
} from "@/ui-kit";
import { useInView, useReducedMotion } from "motion/react";
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
  const videoRef = useRef<HTMLVideoElement>(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.25 });
  const shouldReduceMotion = useReducedMotion();
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const connection = (
      navigator as Navigator & {
        connection?: EventTarget & {
          saveData?: boolean;
          effectiveType?: string;
        };
      }
    ).connection;
    const updateConnectionState = () => {
      setSaveData(connection?.saveData === true);
      setEffectiveType(connection?.effectiveType);
    };

    async function loadMetrics() {
      const data = await getClinicMetrics();
      setMetrics(data);
    }

    loadMetrics();
    updateConnectionState();

    connection?.addEventListener("change", updateConnectionState);

    return () => {
      connection?.removeEventListener("change", updateConnectionState);
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const isSlowConnection = effectiveType
    ? SLOW_CONNECTION_TYPES.includes(effectiveType)
    : false;
  const shouldLoadVideo = !saveData && !isSlowConnection && !shouldReduceMotion;

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
  }, [isInView, isVideoMounted, shouldLoadVideo, videoError]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const updatePlayback = () => {
      if (isInView && shouldLoadVideo && !document.hidden)
        void video.play().catch(() => {});
      else video.pause();
    };
    updatePlayback();
    document.addEventListener("visibilitychange", updatePlayback);
    return () => {
      document.removeEventListener("visibilitychange", updatePlayback);
      video.pause();
    };
  }, [isInView, isVideoMounted, shouldLoadVideo, videoError]);

  return (
    <section
      ref={sectionRef}
      className="relative z-10 flex min-h-[var(--hero-min-height)] w-full flex-col justify-between gap-12 overflow-hidden section-space-compact text-on-dark"
    >
      {/* 1. FULL-SCREEN BACKGROUND VIDEO / POSTER WITH OVERLAY */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute inset-0 bg-[url('/images/clinic-exterior-poster.png')] bg-cover bg-center" />

        {shouldLoadVideo && isVideoMounted && !videoError && (
          <video
            ref={videoRef}
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
          <Reveal
            as="div"
            className="type-overline inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-surface/10 backdrop-blur-md uppercase text-on-dark/90"
          >
            О КЛИНИКЕ
          </Reveal>

          <span
            style={{ opacity: 0.65 }}
            className="type-overline uppercase text-on-dark/65 hidden sm:inline-block"
          >
            ABOUT US
          </span>
        </div>

        {/* Headline + Paragraph */}
        <div className="max-w-2xl">
          <RevealHeading
            level={2}
            variant="heading-3"
            className=" text-on-dark drop-shadow-sm max-w-[660px]"
          >
            Раскройте совершенство. <br />
            Откройте для себя стандарт{" "}
            <span className="text-accent-soft font-bold">Family Dent</span>.
          </RevealHeading>

          <Reveal
            as="p"
            className="type-body-sm mt-3 sm:mt-4 text-on-dark/80 max-w-[540px] drop-shadow-sm"
          >
            В Family Dent мы верим, что ваша улыбка заслуживает экспертной
            заботы и безупречного качества. Наша команда докторов с
            международной сертификацией предлагает премиальный комфорт в
            сочетании с передовой цифровой 3D-диагностикой.
          </Reveal>
        </div>
      </Container>

      {/* 3. HORIZONTAL GLASS STATISTICAL CARDS ROW */}
      <Container className="relative z-10 pt-4 pb-1 sm:pt-6">
        <RevealGroup className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,8rem),1fr))] gap-3 sm:gap-4 desktop:gap-5 items-stretch">
          {metrics.map((item) => (
            <StatGlassCard
              key={item.id}
              metric={item}
              shouldReduceMotion={!!shouldReduceMotion}
            />
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}

interface StatGlassCardProps {
  key?: React.Key;
  metric: ClinicMetric;
  shouldReduceMotion: boolean;
}

function StatGlassCard({ metric, shouldReduceMotion }: StatGlassCardProps) {
  const countRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(countRef, { once: true });
  const [displayValue, setDisplayValue] = useState(metric.value);

  useEffect(() => {
    if (shouldReduceMotion) {
      setDisplayValue(metric.value);
      return;
    }

    if (!isInView) return;

    let startTime: number | null = null;
    const duration = readCssMilliseconds("--motion-count-duration");
    if (duration <= 0) {
      setDisplayValue(metric.value);
      return;
    }
    let animFrame: number;
    const target = metric.value;

    const animate = (currentTime: number) => {
      if (startTime === null) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);

      // Smooth easeOutExpo for natural deceleration towards the target
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const currentVal = Math.floor(easeProgress * target);

      setDisplayValue(currentVal);

      if (progress < 1) {
        animFrame = requestAnimationFrame(animate);
      } else {
        setDisplayValue(target);
      }
    };

    animFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animFrame);
  }, [isInView, metric.value, shouldReduceMotion]);

  return (
    <Reveal
      as="div"
      className="bg-surface/10 backdrop-blur-md border border-on-dark/15 rounded-2xl p-4 sm:p-6 text-on-dark shadow-xl transition-all duration-300 hover:bg-surface/15 hover:border-on-dark/25 hover:-translate-y-0.5 flex flex-col justify-between"
    >
      <div ref={countRef}>
        <div className="flex items-baseline gap-1">
          {metric.prefix && (
            <span className="type-heading-3 text-on-dark">{metric.prefix}</span>
          )}
          <span className="type-heading-2 text-on-dark">
            <span aria-hidden="true">
              {shouldReduceMotion ? metric.value : displayValue}
            </span>
            <span className="sr-only">{metric.value}</span>
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
    </Reveal>
  );
}
