import {
  Container,
  Heading,
  Reveal,
  RevealGroup,
  RevealHeading,
  Text,
} from "@/ui-kit";
import { ExternalLink, MapPin, Star } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { VideoReviewCard } from "../components/reviews/video-review-card";
import { EditorialPageHero } from "../components/shared/editorial-page-hero";
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
    <Reveal
      as="a"
      href={review.sourceUrl}
      target="_blank"
      rel="noreferrer"
      className="group flex min-h-64 flex-col justify-between gap-8 rounded-lg border border-rule bg-surface p-6 shadow-whisper transition-all hover:-translate-y-1 hover:border-accent-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus sm:p-7"
      aria-label={`Отзыв ${review.authorName} на Яндекс Картах`}
      data-ui-scheme="default"
    >
      <div className="flex flex-col gap-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div
            className="flex items-center gap-1"
            role="img"
            aria-label={`${review.rating ?? 5} из 5`}
          >
            {Array.from({ length: review.rating ?? 5 }).map((_, index) => (
              <Star
                key={index}
                aria-hidden="true"
                className="size-4 fill-warn text-warn"
              />
            ))}
          </div>
          <span className="type-overline uppercase text-brand-text">
            Яндекс
          </span>
        </div>
        <Text
          variant="body-sm"
          className="text-pretty text-ink-2"
        >{`«${review.text}»`}</Text>
      </div>
      <footer className="flex items-end justify-between gap-4 border-t border-rule pt-5">
        <div className="flex flex-col gap-1">
          <Heading level={3} variant="heading-6" className="text-ink">
            {review.authorName}
          </Heading>
          <Text variant="body-sm" className="text-muted">
            {review.publishedAt}
          </Text>
        </div>
        <ExternalLink
          aria-hidden="true"
          className="size-4 text-muted transition-colors group-hover:text-brand-text"
        />
      </footer>
    </Reveal>
  );
}

function GoogleSourceCard({
  source,
}: {
  source: (typeof googleReviewSources)[number];
}) {
  return (
    <Reveal
      as="a"
      href={source.href}
      target="_blank"
      rel="noreferrer"
      className="group flex min-h-64 flex-col justify-between gap-8 rounded-lg bg-ink p-6 text-paper transition-transform hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus sm:p-7"
      data-ui-scheme="inverse"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <span className="flex size-11 items-center justify-center rounded-full bg-accent text-accent-ink">
          <MapPin aria-hidden="true" className="size-5" />
        </span>
        <span className="type-overline uppercase text-accent-2">
          Google Maps
        </span>
      </div>
      <div className="flex flex-col gap-3">
        <Heading level={3} variant="heading-4">
          {source.name}
        </Heading>
        <Text variant="body-sm" className="text-paper-3">
          {source.branch}. Откройте карточку филиала, чтобы увидеть актуальные
          отзывы без сокращений.
        </Text>
        <span className="type-body-sm mt-2 inline-flex items-center gap-2">
          Смотреть отзывы
          <ExternalLink
            aria-hidden="true"
            className="size-4 transition-transform group-hover:translate-x-0.5"
          />
        </span>
      </div>
    </Reveal>
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
    if (activeFilter === "video")
      return reviews.filter(
        (review) => review.source === "instagram" || review.source === "video",
      );
    if (activeFilter === "yandex")
      return reviews.filter((review) => review.source === "yandex");
    if (activeFilter === "google") return [];
    return reviews;
  }, [activeFilter, reviews]);

  const showGoogle = activeFilter === "all" || activeFilter === "google";

  return (
    <div
      className="flex min-h-screen w-full flex-col bg-paper text-ink"
      data-ui-scheme="default"
    >
      <EditorialPageHero
        badge="Мнения пациентов"
        title="Отзывы о Family Dent"
        description="Видеоистории и отзывы с карт — с прямыми ссылками на оригинальные публикации."
      />

      <section aria-labelledby="reviews-list-title" className="section-space">
        <Container className="flex flex-col gap-10">
          <div className="flex flex-col gap-5 border-b border-rule pb-7 desktop:flex-row desktop:items-end desktop:justify-between">
            <div className="flex max-w-xl flex-col gap-2">
              <RevealHeading level={2} id="reviews-list-title">
                Истории наших пациентов
              </RevealHeading>
              <Text variant="body-sm" className="text-muted">
                Выберите формат или площадку. Каждый текстовый отзыв ведёт к
                оригиналу.
              </Text>
            </div>
            <div
              role="group"
              aria-label="Фильтр отзывов"
              className="flex flex-wrap gap-2"
            >
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() => setActiveFilter(filter.id)}
                  aria-pressed={activeFilter === filter.id}
                  className={`type-button min-h-11 rounded-full border px-4 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus ${activeFilter === filter.id ? "border-ink bg-ink text-paper" : "border-rule-2 bg-surface text-ink hover:border-accent"}`}
                  data-ui-scheme={
                    activeFilter === filter.id ? "inverse" : "default"
                  }
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          <RevealGroup
            aria-live="polite"
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 desktop:grid-cols-3"
          >
            {filteredReviews.map((review) =>
              review.source === "instagram" || review.source === "video" ? (
                <VideoReviewCard key={review.id} review={review} />
              ) : (
                <TextReviewCard key={review.id} review={review} />
              ),
            )}
            {showGoogle &&
              googleReviewSources.map((source) => (
                <GoogleSourceCard key={source.id} source={source} />
              ))}
          </RevealGroup>

          {activeFilter === "yandex" && (
            <a
              href={reviewSourceLinks.yandex}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 w-fit items-center gap-2 font-bold text-brand-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
            >
              Все отзывы на Яндекс Картах{" "}
              <ExternalLink aria-hidden="true" className="size-4" />
            </a>
          )}
        </Container>
      </section>
    </div>
  );
}
