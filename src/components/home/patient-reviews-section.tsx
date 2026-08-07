import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Star, Quote, Play, Pause, ChevronLeft, ChevronRight } from "lucide-react";
import { getPatientReviews } from "../../lib/data/patient-reviews";
import type { PatientReview } from "../../lib/data/types";
import { ScrollAnimate, StaggerContainer, StaggerItem } from "../shared/scroll-animate";

export function PatientReviewsSection() {
  const [reviews, setReviews] = useState<PatientReview[]>([]);
  const [activeIdx, setActiveIdx] = useState<number>(0);
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});

  useEffect(() => {
    async function load() {
      const data = await getPatientReviews();
      setReviews(data);
    }
    load();
  }, []);

  const currentReview = reviews[activeIdx];

  const handleNext = () => {
    if (reviews.length === 0) return;
    setActiveIdx((prev) => (prev + 1) % reviews.length);
  };

  const handlePrev = () => {
    if (reviews.length === 0) return;
    setActiveIdx((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  const toggleVideo = (id: string) => {
    const video = videoRefs.current[id];
    if (!video) return;

    if (playingVideoId === id) {
      video.pause();
      setPlayingVideoId(null);
    } else {
      // pause all other videos
      Object.entries(videoRefs.current).forEach(([vId, vEl]) => {
        const videoElement = vEl as HTMLVideoElement | null;
        if (vId !== id && videoElement) videoElement.pause();
      });
      video.play();
      setPlayingVideoId(id);
    }
  };

  return (
    <section className="w-full bg-[var(--color-surface)] text-[var(--color-ink)] py-16 sm:py-20 px-5 sm:px-8 border-b border-[var(--color-rule)]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <ScrollAnimate className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs uppercase font-bold text-[var(--color-accent)] tracking-wider mb-2 block font-mono">
              Доверие пациентов
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[var(--color-ink)] tracking-tight">
              Отзывы о Family Dent
            </h2>
            <p className="text-xs sm:text-sm text-[var(--color-muted)] font-normal mt-1">
              Честные истории вылеченных пациентов из Душанбе и других городов.
            </p>
          </div>
          <Link
            to="/reviews"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--color-paper-2)] text-[var(--color-ink)] border border-[var(--color-rule)] text-xs font-bold hover:bg-[var(--color-paper-3)] transition-all self-start md:self-auto group"
          >
            <span>Все отзывы</span>
            <ArrowRight className="w-4 h-4 text-[var(--color-accent)] group-hover:translate-x-1 transition-transform" />
          </Link>
        </ScrollAnimate>

        {/* Featured Review Hero Card with Switcher */}
        {currentReview && (
          <ScrollAnimate delay={0.1} className="bg-[var(--color-paper)] border border-[var(--color-rule)] rounded-3xl p-6 sm:p-10 shadow-[var(--shadow-whisper)] mb-10 relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Review Text / Quotes */}
              <div className="lg:col-span-7 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <Quote className="w-8 h-8 text-[var(--color-accent)] flex-shrink-0 opacity-80" />
                    <div className="flex items-center gap-1">
                      {[...Array(currentReview.rating || 5)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 fill-amber-400 text-amber-400"
                        />
                      ))}
                    </div>
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentReview.id}
                      initial={{ opacity: 0, x: 15 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -15 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p className="text-base sm:text-lg lg:text-xl font-medium text-[var(--color-ink)] leading-relaxed italic mb-6">
                        «{currentReview.text}»
                      </p>

                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[var(--color-accent)] text-[var(--color-accent-ink)] font-extrabold flex items-center justify-center text-sm">
                          {currentReview.authorName.charAt(0)}
                        </div>
                        <div>
                          <h4 className="text-sm font-extrabold text-[var(--color-ink)]">
                            {currentReview.authorName}
                          </h4>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] font-bold uppercase tracking-wider bg-[var(--color-accent-soft)] text-[var(--color-accent)] px-2 py-0.5 rounded border border-[var(--color-rule)]">
                              {currentReview.source}
                            </span>
                            {currentReview.publishedAt && (
                              <span className="text-xs text-[var(--color-muted)]">
                                • {currentReview.publishedAt}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Carousel Controls */}
                <div className="flex items-center gap-3 mt-8 pt-6 border-t border-[var(--color-rule)]">
                  <button
                    onClick={handlePrev}
                    aria-label="Предыдущий отзыв"
                    className="w-10 h-10 rounded-xl bg-[var(--color-surface)] border border-[var(--color-rule)] hover:bg-[var(--color-paper-2)] text-[var(--color-ink)] flex items-center justify-center transition-all cursor-pointer shadow-2xs active:scale-95"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <span className="text-xs font-bold text-[var(--color-muted)] font-mono">
                    {activeIdx + 1} / {reviews.length}
                  </span>
                  <button
                    onClick={handleNext}
                    aria-label="Следующий отзыв"
                    className="w-10 h-10 rounded-xl bg-[var(--color-surface)] border border-[var(--color-rule)] hover:bg-[var(--color-paper-2)] text-[var(--color-ink)] flex items-center justify-center transition-all cursor-pointer shadow-2xs active:scale-95"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Media / Video Column */}
              <div className="lg:col-span-5">
                {currentReview.source === "video" && currentReview.videoUrl ? (
                  <div className="relative aspect-[16/10] sm:aspect-[16/9] rounded-2xl overflow-hidden bg-[var(--color-ink)] border border-[var(--color-rule)] shadow-md group">
                    <video
                      ref={(el) => (videoRefs.current[currentReview.id] = el)}
                      src={currentReview.videoUrl}
                      poster={currentReview.videoPoster}
                      controls={playingVideoId === currentReview.id}
                      preload="none"
                      className="w-full h-full object-cover"
                    />
                    {playingVideoId !== currentReview.id && (
                      <button
                        onClick={() => toggleVideo(currentReview.id)}
                        className="absolute inset-0 flex items-center justify-center bg-[var(--color-ink)]/40 hover:bg-[var(--color-ink)]/30 transition-colors cursor-pointer"
                        aria-label="Воспроизвести видео"
                      >
                        <div className="w-14 h-14 rounded-full bg-[var(--color-accent)] text-[var(--color-accent-ink)] flex items-center justify-center shadow-2xl hover:scale-105 transition-transform">
                          <Play className="w-6 h-6 fill-current ml-1" />
                        </div>
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="bg-[var(--color-surface)] rounded-2xl p-6 border border-[var(--color-rule)] shadow-2xs flex flex-col justify-center items-center text-center min-h-[220px]">
                    <Quote className="w-10 h-10 text-[var(--color-accent-soft)] mb-3" />
                    <p className="text-xs text-[var(--color-muted)] font-normal max-w-xs">
                      Все отзывы подтверждены и собраны из открытых геосервисов и мессенджеров.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </ScrollAnimate>
        )}

        {/* Small Preview Grid of other reviews */}
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {reviews.slice(0, 3).map((rev, idx) => (
            <StaggerItem
              key={rev.id}
              as="div"
            >
              <button
                onClick={() => setActiveIdx(idx)}
                className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  idx === activeIdx
                    ? "bg-[var(--color-ink)] text-[var(--color-paper)] border-[var(--color-ink)] shadow-md"
                    : "bg-[var(--color-paper)] hover:bg-[var(--color-paper-2)] text-[var(--color-ink)] border-[var(--color-rule)]"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-extrabold">{rev.authorName}</span>
                    <span
                      className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded ${
                        idx === activeIdx
                          ? "bg-[var(--color-accent)] text-[var(--color-accent-ink)]"
                          : "bg-[var(--color-accent-soft)] text-[var(--color-accent)]"
                      }`}
                    >
                      {rev.source}
                    </span>
                  </div>
                  <p className="text-xs line-clamp-2 opacity-80 leading-relaxed font-normal">
                    "{rev.text}"
                  </p>
                </div>
              </button>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
