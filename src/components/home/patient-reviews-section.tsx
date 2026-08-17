import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ArrowRight, Star } from "lucide-react";
import { getPatientReviews } from "../../lib/data/patient-reviews";
import type { PatientReview } from "../../lib/data/types";
import { ScrollAnimate } from "../shared/scroll-animate";

const sourceLabels: Record<PatientReview["source"], string> = {
  google: "Google",
  instagram: "Instagram",
  whatsapp: "WhatsApp",
  video: "Видеоотзыв",
};

function ReviewCard({ review }: { review: PatientReview }) {
  return (
    <article className="group flex min-h-56 flex-col justify-between gap-8 rounded-[var(--radius-xl)] border border-[var(--color-rule)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-whisper)] transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-[var(--color-accent-2)] hover:shadow-[var(--shadow-card)] sm:p-7">
      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-1" aria-label={`${review.rating ?? 5} из 5`}>
          {Array.from({ length: review.rating ?? 5 }).map((_, index) => (
            <Star
              key={index}
              aria-hidden="true"
              className="size-4 fill-[var(--color-accent)] text-[var(--color-accent)]"
            />
          ))}
        </div>
        <p className="text-pretty text-sm leading-6 text-[var(--color-ink-2)] sm:text-base sm:leading-7">
          {review.text}
        </p>
      </div>

      <footer className="flex items-end justify-between gap-4 border-t border-[var(--color-rule)] pt-5">
        <div className="flex flex-col gap-1">
          <h3 className="font-sans text-sm font-bold text-[var(--color-ink)] sm:text-base">
            {review.authorName}
          </h3>
          <p className="text-xs text-[var(--color-muted)]">{review.publishedAt}</p>
        </div>
        <span className="rounded-[var(--radius-pill)] bg-[var(--color-accent-soft)] px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-[var(--color-accent)]">
          {sourceLabels[review.source]}
        </span>
      </footer>
    </article>
  );
}

export function PatientReviewsSection() {
  const [reviews, setReviews] = useState<PatientReview[]>([]);
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const firstColumnY = useTransform(scrollYProgress, [0, 1], [-112, 96]);
  const secondColumnY = useTransform(scrollYProgress, [0, 1], [88, -128]);

  useEffect(() => {
    getPatientReviews().then(setReviews);
  }, []);

  const averageRating = useMemo(() => {
    const rated = reviews.filter((review) => review.rating);
    if (!rated.length) return null;
    return rated.reduce((sum, review) => sum + (review.rating ?? 0), 0) / rated.length;
  }, [reviews]);

  const firstColumn = reviews.filter((_, index) => index % 2 === 0);
  const secondColumn = reviews.filter((_, index) => index % 2 !== 0);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="patient-reviews-title"
      className="w-full overflow-hidden border-b border-[var(--color-rule)] bg-[var(--color-paper-2)] px-5 py-16 text-[var(--color-ink)] sm:px-8 sm:py-24 min-[900px]:min-h-[62rem] min-[900px]:py-28"
    >
      <div className="mx-auto grid max-w-7xl gap-12 min-[900px]:grid-cols-[minmax(17rem,0.78fr)_minmax(0,1.45fr)] min-[900px]:items-start min-[900px]:gap-16">
        <ScrollAnimate className="flex flex-col items-start min-[900px]:sticky min-[900px]:top-24 min-[900px]:h-fit">
          <span className="mb-5 font-mono text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-accent)]">
            Доверие пациентов
          </span>
          <h2
            id="patient-reviews-title"
            className="max-w-lg text-balance font-sans text-4xl font-bold leading-[1.02] tracking-[-0.04em] text-[var(--color-ink)] sm:text-5xl min-[900px]:text-6xl"
          >
            <span className="block">Что говорят</span>
            <span className="block">наши пациенты?</span>
          </h2>

          {averageRating !== null && (
            <div className="mt-9 flex w-full max-w-md items-end justify-between gap-5 border-y border-[var(--color-rule-2)] py-5">
              <div className="flex flex-col gap-2">
                <div className="flex items-baseline gap-2">
                  <strong className="font-sans text-4xl leading-none tracking-tight text-[var(--color-ink)]">
                    {averageRating.toFixed(1)} / 5
                  </strong>
                </div>
                <div className="flex items-center gap-1" aria-hidden="true">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star
                      key={index}
                      className="size-4 fill-[var(--color-accent)] text-[var(--color-accent)]"
                    />
                  ))}
                </div>
              </div>
              <p className="max-w-32 text-right text-xs leading-5 text-[var(--color-muted)]">
                Средняя оценка отзывов
              </p>
            </div>
          )}

          <p className="mt-6 max-w-md text-pretty text-sm leading-6 text-[var(--color-muted)] sm:text-base sm:leading-7">
            Истории пациентов Family Dent о лечении, внимании врачей и атмосфере клиники.
          </p>

          <Link
            to="/reviews"
            className="group mt-8 inline-flex min-h-11 items-center gap-3 border-b border-[var(--color-ink)] pb-1 text-sm font-bold text-[var(--color-ink)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] focus-visible:ring-offset-4"
          >
            <span>Изучить все отзывы</span>
            <ArrowRight className="size-5 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </ScrollAnimate>

        <div className="-mx-5 sm:-mx-8 min-[900px]:mx-0">
          <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:px-8 min-[900px]:hidden">
            {reviews.map((review) => (
              <div key={review.id} className="w-[84vw] max-w-sm shrink-0 snap-center">
                <ReviewCard review={review} />
              </div>
            ))}
          </div>

          <div className="hidden grid-cols-2 gap-5 min-[900px]:grid">
            <motion.div
              style={reduceMotion ? undefined : { y: firstColumnY }}
              className="flex flex-col gap-5 will-change-transform"
            >
              {firstColumn.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </motion.div>
            <motion.div
              style={reduceMotion ? undefined : { y: secondColumnY }}
              className="flex flex-col gap-5 pt-16 will-change-transform"
            >
              {secondColumn.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
