import { Star } from 'lucide-react';
import { getReviewSourceLabel } from '../utils/reviewSource';

function getAuthorName(review: any) {
  return review.authorName || review.patientName || review.displayName || 'Пациент FamilyDent';
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return (parts[0]?.[0] || 'F') + (parts[1]?.[0] || 'D');
}

function getReviewDate(review: any) {
  const raw = review.date || review.createdAt || review.importedAt;
  if (!raw) return 'Дата не указана';

  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return 'Дата не указана';

  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function getBranch(review: any) {
  return (
    review.branch ||
    review.clinicBranch ||
    review.location ||
    review.address ||
    review.doctorName ||
    'FamilyDent'
  );
}

export function ReviewCard({ review, compact = false }: { review: any; compact?: boolean }) {
  const authorName = getAuthorName(review);
  const rating = Math.max(0, Math.min(5, Number(review.rating || 0)));
  const text = review.text || review.comment || 'Нет текста отзыва';
  const avatar = review.photoURL || review.avatar || review.authorPhoto || review.profilePhoto;

  return (
    <article className="flex h-full flex-col rounded-lg border border-border bg-card p-6">
      <div className="mb-4 flex items-center gap-1 text-primary" aria-label={`Оценка ${rating} из 5`}>
        {Array.from({ length: 5 }).map((_, index) => (
          <Star key={index} className={`h-4 w-4 ${index < rating ? 'fill-current' : 'text-border'}`} />
        ))}
      </div>

      <p className={`flex-1 text-sm leading-relaxed text-foreground ${compact ? 'line-clamp-6' : ''}`}>
        {text}
      </p>

      <div className="mt-6 flex items-center gap-3 border-t border-border pt-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-secondary text-xs font-semibold uppercase text-muted-foreground">
          {avatar ? (
            <img src={avatar} alt={authorName} className="h-full w-full object-cover" loading="lazy" decoding="async" />
          ) : (
            getInitials(authorName)
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-semibold text-foreground">{authorName}</h3>
          <p className="truncate text-xs text-muted-foreground">
            {getReviewDate(review)} · {getBranch(review)}
          </p>
        </div>
        <span className="shrink-0 text-xs text-muted-foreground">
          {getReviewSourceLabel(review.source)}
        </span>
      </div>
    </article>
  );
}
