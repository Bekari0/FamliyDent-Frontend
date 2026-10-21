import { Heading, Text } from "@/ui-kit";
import { ExternalLink, Play, ShieldCheck } from "lucide-react";
import type { PatientReview } from "../../lib/data/types";
import { useCookieConsent } from "../shared/cookie-consent";

interface VideoReviewCardProps {
  review: PatientReview;
}

export function VideoReviewCard({ review }: VideoReviewCardProps) {
  const isInstagram = review.source === "instagram";
  const { externalContentAllowed, acceptAll } = useCookieConsent();

  return (
    <article
      className="flex flex-col overflow-hidden rounded-lg border border-rule bg-surface shadow-whisper"
      data-ui-scheme="default"
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-paper-2">
        {isInstagram && review.videoUrl && externalContentAllowed ? (
          <iframe
            src={review.videoUrl}
            title={review.authorName}
            loading="lazy"
            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
            className="h-full w-full border-0"
          />
        ) : isInstagram && review.videoUrl ? (
          <div
            className="flex h-full w-full flex-col items-center justify-center bg-ink px-6 text-center text-paper"
            data-ui-scheme="inverse"
          >
            <span className="flex size-12 items-center justify-center rounded-full border border-accent/30 bg-accent/15 text-accent-2">
              <ShieldCheck aria-hidden="true" className="size-5" />
            </span>
            <Text variant="heading-3" className="mt-4">
              Видео скрыто для вашей приватности
            </Text>
            <Text variant="body-sm" className="mt-2 max-w-xs text-paper/60">
              Instagram загрузится только после вашего согласия на сторонние
              cookie.
            </Text>
            <button
              type="button"
              onClick={acceptAll}
              className="type-button mt-5 inline-flex min-h-10 items-center gap-2 rounded-pill bg-accent px-5 text-accent-ink transition-colors hover:bg-accent-2 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
            >
              <Play aria-hidden="true" className="size-3.5 fill-current" />
              Разрешить видео
            </button>
          </div>
        ) : review.videoUrl ? (
          <video
            src={review.videoUrl}
            poster={review.videoPoster}
            controls
            preload="none"
            className="h-full w-full object-cover"
          />
        ) : null}
      </div>

      <div className="flex flex-col gap-3 border-t border-rule p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <span className="type-overline uppercase text-brand-text">
              Видеоотзыв · Instagram
            </span>
            <Heading level={3} variant="heading-6" className="text-ink">
              {review.authorName}
            </Heading>
          </div>
          {review.sourceUrl && (
            <a
              href={review.sourceUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="Открыть оригинал видеоотзыва в Instagram"
              className="flex size-11 shrink-0 items-center justify-center rounded-full bg-ink text-paper transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
              data-ui-scheme="inverse"
            >
              <ExternalLink aria-hidden="true" className="size-4" />
            </a>
          )}
        </div>
        {review.text && (
          <Text variant="body-sm" className="text-muted">
            {review.text}
          </Text>
        )}
      </div>
    </article>
  );
}
