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
    <article className="flex flex-col overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-rule)] bg-[var(--color-surface)] shadow-[var(--shadow-whisper)]">
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-[var(--color-paper-2)]">
        {isInstagram && review.videoUrl && externalContentAllowed ? (
          <iframe
            src={review.videoUrl}
            title={review.authorName}
            loading="lazy"
            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
            className="h-full w-full border-0"
          />
        ) : isInstagram && review.videoUrl ? (
          <div className="flex h-full w-full flex-col items-center justify-center bg-ink px-6 text-center text-paper">
            <span className="flex size-12 items-center justify-center rounded-full border border-accent/30 bg-accent/15 text-accent-2">
              <ShieldCheck aria-hidden="true" className="size-5" />
            </span>
            <p className="mt-4 font-display text-lg font-semibold">Видео скрыто для вашей приватности</p>
            <p className="mt-2 max-w-xs text-xs leading-relaxed text-paper/60">Instagram загрузится только после вашего согласия на сторонние cookie.</p>
            <button type="button" onClick={acceptAll} className="mt-5 inline-flex min-h-10 items-center gap-2 rounded-pill bg-accent px-5 text-xs font-bold text-accent-ink transition-colors hover:bg-accent-2 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent">
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
