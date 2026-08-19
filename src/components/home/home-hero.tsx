import React from "react";
import { motion } from "motion/react";
import { BackgroundVideo } from "../BackgroundVideo";
import { CentralLogo } from "../CentralLogo";

interface HomeHeroProps {
  onOpenBooking: () => void;
  onOpenAuth?: () => void;
}

export function HomeHero({ onOpenBooking, onOpenAuth }: HomeHeroProps) {
  const scrollToBooking = () => {
    const el = document.getElementById("booking");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    } else {
      onOpenBooking();
    }
  };

  return (
    <section className="relative flex min-h-[100svh] w-full flex-col justify-between overflow-hidden bg-[#1A1A1A] pt-24 pb-14 text-white sm:pb-16">
      {/* Background ambient video / lighting */}
      <BackgroundVideo />

      {/* Main Hero Layout matching image.png */}
      <div className="page-container relative z-10 my-auto grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-6 xl:gap-8">
        
        {/* Left Column: Title & Subtitle */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="lg:col-span-4 flex flex-col items-start text-left"
        >
          <h1 className="font-display text-3xl sm:text-4xl lg:text-4xl xl:text-[44px] font-semibold leading-[1.08] text-white tracking-[-0.03em]">
            Современная<br />
            стоматология<br />
            для всей семьи<br />
          </h1>

          <p className="mt-6 text-sm sm:text-base text-white/70 max-w-sm font-light leading-relaxed">
            От первого молочного зуба до сложной имплантации — бережно, точно и без спешки.
          </p>
        </motion.div>

        {/* Center Column: Glowing Tooth Emblem */}
        <div className="lg:col-span-4 flex items-center justify-center py-4 lg:py-0 relative overflow-visible">
          <CentralLogo colorMode="glowing-white" />
        </div>

        {/* Right Column: Title & Action Buttons */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
          className="lg:col-span-4 flex flex-col items-start lg:items-start text-left w-full min-w-0"
        >
          <h2 className="font-display text-[21px] min-[360px]:text-[24px] min-[390px]:text-[27px] sm:text-4xl lg:text-4xl xl:text-[44px] font-semibold leading-[1.08] text-white tracking-[-0.03em] mb-6 w-full max-w-full">
            <span className="block whitespace-nowrap">Без боли.</span>
            <span className="block whitespace-nowrap">Без спешки.</span>
            <span className="block whitespace-nowrap">Без компромиссов.</span>
          </h2>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={scrollToBooking}
              className="px-6 py-3.5 rounded-xl bg-[#D8C8A3] hover:bg-[#E3D5B7] text-[#1A1A1A] font-extrabold text-sm tracking-tight shadow-lg transition-all duration-200 transform hover:scale-[1.03] active:scale-[0.97] cursor-pointer"
            >
              Записаться
            </button>

            {/*
            <button
              onClick={onOpenAuth ? onOpenAuth : onOpenBooking}
              className="px-6 py-3.5 rounded-xl bg-white hover:bg-slate-100 text-[#1A1A1A] font-extrabold text-sm tracking-tight shadow-lg transition-all duration-200 transform hover:scale-[1.03] active:scale-[0.97] cursor-pointer"
            >
              Регистрация
            </button>
            */}
          </div>
        </motion.div>
      </div>

      {/* Large Bottom Background Watermark positioned at bottom border */}
      <div className="absolute bottom-1 sm:bottom-2 left-1/2 -translate-x-1/2 w-full text-center z-10 select-none pointer-events-none overflow-hidden px-4">
        <span className="font-display text-2xl min-[360px]:text-3xl min-[390px]:text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white/10 tracking-tight uppercase whitespace-nowrap block">
          FAMILY DENT<span className="hidden sm:inline"> • ДУШАНБЕ</span>
        </span>
      </div>
    </section>
  );
}
