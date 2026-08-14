import { useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'motion/react';
import { ClinicBackgroundMedia } from '@/components/media/clinic-background-media';
import { clinicMetrics } from '@/lib/reference-content/metrics';
import { shouldMountClinicVideo } from './home-behavior';

type NetworkInformation = {
  saveData?: boolean;
  addEventListener?: (type: 'change', listener: () => void) => void;
  removeEventListener?: (type: 'change', listener: () => void) => void;
};

export function ClinicMetricsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });
  const shouldReduceMotion = useReducedMotion();
  const [saveData, setSaveData] = useState(false);
  const [mediaFailed, setMediaFailed] = useState(false);

  useEffect(() => {
    const connection = (navigator as Navigator & { connection?: NetworkInformation }).connection;
    const updateSaveData = () => setSaveData(connection?.saveData === true);
    updateSaveData();
    connection?.addEventListener?.('change', updateSaveData);
    return () => connection?.removeEventListener?.('change', updateSaveData);
  }, []);

  const shouldMountVideo = shouldMountClinicVideo({
    isInView,
    reduceMotion: Boolean(shouldReduceMotion),
    saveData,
    mediaFailed,
  });

  return (
    <section ref={sectionRef} className="relative flex min-h-[720px] w-full flex-col justify-between overflow-hidden bg-ink bg-[url('/images/clinic_about.jpg')] bg-cover bg-center px-5 py-12 text-white sm:px-8 sm:py-14 lg:min-h-[760px] lg:px-12 lg:py-16">
      {shouldMountVideo ? <ClinicBackgroundMedia visible onError={() => setMediaFailed(true)} /> : null}
      <div className="absolute inset-0 bg-black/45" aria-hidden="true" />

      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <div className="mb-5 flex items-center justify-between gap-4">
          <span className="inline-flex items-center gap-2 rounded-pill border border-white/15 bg-white/10 px-3.5 py-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.15em] text-white/90 backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            О клинике
          </span>
          <span className="hidden font-mono text-[11px] uppercase tracking-[0.2em] text-white/60 sm:inline">About us</span>
        </div>
        <div className="max-w-2xl">
          <h2 className="font-display text-3xl font-bold leading-[1.08] tracking-tight text-white sm:text-4xl lg:text-[2.65rem]">
            Раскройте совершенство.<br />Откройте стандарт <span className="text-accent-2">Family Dent</span>.
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/80 sm:text-base">
            Экспертная забота, международный опыт врачей и цифровая 3D-диагностика в атмосфере премиального комфорта.
          </p>
        </div>
      </div>

      <dl className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-2 gap-3 pt-10 sm:gap-4 lg:grid-cols-4">
        {clinicMetrics.map((metric) => (
          <div key={metric.id} className="flex min-h-40 flex-col justify-between rounded-2xl border border-white/15 bg-white/10 p-5 text-white shadow-xl backdrop-blur-md transition-colors hover:bg-white/15 sm:p-6">
            <div>
              <dt className="mt-3 font-display text-sm font-medium leading-snug text-white/85 sm:text-base">{metric.label}</dt>
              <dd className="mt-3">
                <span className="flex items-baseline gap-1 font-mono text-3xl font-bold tracking-tight sm:text-4xl lg:text-[2.85rem]">
                  {metric.prefix}{metric.value}<span className="text-accent-2">{metric.suffix}</span>
                </span>
                {metric.description ? <span className="mt-4 block text-xs leading-relaxed text-white/60">{metric.description}</span> : null}
              </dd>
            </div>
          </div>
        ))}
      </dl>
    </section>
  );
}
