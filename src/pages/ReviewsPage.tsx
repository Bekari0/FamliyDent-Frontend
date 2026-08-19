import { useEffect, useMemo, useState } from "react";
import { ExternalLink, MapPin, Star } from "lucide-react";
import { EditorialPageHero } from "../components/shared/editorial-page-hero";
import { VideoReviewCard } from "../components/reviews/video-review-card";
import {
  getPatientReviews,
  googleReviewSources,
  reviewSourceLinks,
} from "../lib/data/patient-reviews";
import type { PatientReview } from "../lib/data/types";

type ReviewFilter = "all" | "video" | "yandex" | "google";

const filters: Array<{ id: ReviewFilter; label: string }> = [
  { id: "all", label: "Все" },
  { id: "video", label: "Видеоотзывы" },
  { id: "yandex", label: "Яндекс Карты" },
  { id: "google", label: "Google Maps" },
];

function TextReviewCard({ review }: { review: PatientReview }) {
  return (
    <a
      href={review.sourceUrl}
      target="_blank"
      rel="noreferrer"
      className="group flex min-h-64 flex-col justify-between gap-8 rounded-[var(--radius-lg)] border border-[var(--color-rule)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-whisper)] transition-all hover:-translate-y-1 hover:border-[var(--color-accent-2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] sm:p-7"
      aria-label={`Отзыв ${review.authorName} на Яндекс Картах`}
    >
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-1" aria-label={`${review.rating ?? 5} из 5`}>
            {Array.from({ length: review.rating ?? 5 }).map((_, index) => (
              <Star key={index} aria-hidden="true" className="size-4 fill-[var(--color-warn)] text-[var(--color-warn)]" />
            ))}
          </div>
          <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[var(--color-accent)]">Яндекс</span>
        </div>
        <p className="text-pretty text-sm leading-6 text-[var(--color-ink-2)]">{`«${review.text}»`}</p>
      </div>
      <footer className="flex items-end justify-between gap-4 border-t border-[var(--color-rule)] pt-5">
        <div className="flex flex-col gap-1">
          <h3 className="font-sans text-base font-bold text-[var(--color-ink)]">{review.authorName}</h3>
          <p className="text-xs text-[var(--color-muted)]">{review.publishedAt}</p>
        </div>
        <ExternalLink aria-hidden="true" className="size-4 text-[var(--color-muted)] transition-colors group-hover:text-[var(--color-accent)]" />
      </footer>
    </a>
  );
}

function GoogleSourceCard({ source }: { source: (typeof googleReviewSources)[number] }) {
  return (
    <a
      href={source.href}
      target="_blank"
      rel="noreferrer"
      className="group flex min-h-64 flex-col justify-between gap-8 rounded-[var(--radius-lg)] bg-[var(--color-ink)] p-6 text-[var(--color-paper)] transition-transform hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] sm:p-7"
    >
      <div className="flex items-start justify-between gap-4">
        <span className="flex size-11 items-center justify-center rounded-full bg-[var(--color-accent)] text-[var(--color-accent-ink)]">
          <MapPin aria-hidden="true" className="size-5" />
        </span>
        <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[var(--color-accent-2)]">Google Maps</span>
      </div>
      <div className="flex flex-col gap-3">
        <h3 className="font-sans text-xl font-bold">{source.name}</h3>
        <p className="text-sm leading-6 text-[var(--color-paper-3)]">{source.branch}. Откройте карточку филиала, чтобы увидеть актуальные отзывы без сокращений.</p>
        <span className="mt-2 inline-flex items-center gap-2 text-sm font-bold">
          Смотреть отзывы
          <ExternalLink aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </a>
  );
}

export function ReviewsPage() {
  const [reviews, setReviews] = useState<PatientReview[]>([]);
  const [activeFilter, setActiveFilter] = useState<ReviewFilter>("all");

  useEffect(() => {
    document.title = "Отзывы пациентов — Family Dent Душанбе";
    getPatientReviews().then(setReviews);
  }, []);

  const filteredReviews = useMemo(() => {
    if (activeFilter === "video") return reviews.filter((review) => review.source === "instagram" || review.source === "video");
    if (activeFilter === "yandex") return reviews.filter((review) => review.source === "yandex");
    if (activeFilter === "google") return [];
    return reviews;
  }, [activeFilter, reviews]);

  const showGoogle = activeFilter === "all" || activeFilter === "google";

  return (
    <main className="flex min-h-screen w-full flex-col bg-[var(--color-paper)] text-[var(--color-ink)]">
      <EditorialPageHero
        badge="Мнения пациентов"
        title="Отзывы о Family Dent"
        description="Видеоистории и отзывы с карт — с прямыми ссылками на оригинальные публикации."
      />

      <section aria-labelledby="reviews-list-title" className="py-12 sm:py-16">
        <div className="page-container flex flex-col gap-10">
          <div className="flex flex-col gap-5 border-b border-[var(--color-rule)] pb-7 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex max-w-xl flex-col gap-2">
              <h2 id="reviews-list-title" className="font-sans text-2xl font-bold tracking-tight sm:text-3xl">Истории наших пациентов</h2>
              <p className="text-sm leading-6 text-[var(--color-muted)]">Выберите формат или площадку. Каждый текстовый отзыв ведёт к оригиналу.</p>
            </div>
            <div role="group" aria-label="Фильтр отзывов" className="flex flex-wrap gap-2">
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() => setActiveFilter(filter.id)}
                  aria-pressed={activeFilter === filter.id}
                  className={`min-h-11 rounded-full border px-4 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] ${activeFilter === filter.id ? "border-[var(--color-ink)] bg-[var(--color-ink)] text-[var(--color-paper)]" : "border-[var(--color-rule-2)] bg-[var(--color-surface)] text-[var(--color-ink)] hover:border-[var(--color-accent)]"}`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          <div aria-live="polite" className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredReviews.map((review) =>
              review.source === "instagram" || review.source === "video" ? (
                <VideoReviewCard key={review.id} review={review} />
              ) : (
                <TextReviewCard key={review.id} review={review} />
              ),
            )}
            {showGoogle && googleReviewSources.map((source) => <GoogleSourceCard key={source.id} source={source} />)}
          </div>

          {activeFilter === "yandex" && (
            <a href={reviewSourceLinks.yandex} target="_blank" rel="noreferrer" className="inline-flex min-h-11 w-fit items-center gap-2 font-bold text-[var(--color-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]">
              Все отзывы на Яндекс Картах <ExternalLink aria-hidden="true" className="size-4" />
            </a>
          )}
        </div>
      </section>
    </main>
  );
}
