import { ExternalLink } from "lucide-react";
import type { PatientReview } from "../../lib/data/types";

interface VideoReviewCardProps {
  review: PatientReview;
}

export function VideoReviewCard({ review }: VideoReviewCardProps) {
  const isInstagram = review.source === "instagram";

  return (
    <article className="flex flex-col overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-rule)] bg-[var(--color-surface)] shadow-[var(--shadow-whisper)]">
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-[var(--color-paper-2)]">
        {isInstagram && review.videoUrl ? (
          <iframe
            src={review.videoUrl}
            title={review.authorName}
            loading="lazy"
            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
            className="h-full w-full border-0"
          />
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

      <div className="flex flex-col gap-3 border-t border-[var(--color-rule)] p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[var(--color-accent)]">
              Видеоотзыв · Instagram
            </span>
            <h3 className="font-sans text-base font-bold text-[var(--color-ink)]">
              {review.authorName}
            </h3>
          </div>
          {review.sourceUrl && (
            <a
              href={review.sourceUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="Открыть оригинал видеоотзыва в Instagram"
              className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[var(--color-ink)] text-[var(--color-paper)] transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
            >
              <ExternalLink aria-hidden="true" className="size-4" />
            </a>
          )}
        </div>
        {review.text && <p className="text-sm leading-6 text-[var(--color-muted)]">{review.text}</p>}
      </div>
    </article>
  );
}
