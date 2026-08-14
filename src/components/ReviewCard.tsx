import { Star } from 'lucide-react';
import { getReviewSourceClassName, getReviewSourceLabel } from '../utils/reviewSource';

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
  return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
}

function getBranch(review: any) {
  return review.branch || review.clinicBranch || review.location || review.address || review.doctorName || 'FamilyDent';
}

export function ReviewCard({ review, compact = false }: { review: any; compact?: boolean }) {
  const authorName = getAuthorName(review);
  const rating = Math.max(0, Math.min(5, Number(review.rating || 0)));
  const text = review.text || review.comment || 'Нет текста отзыва';
  const avatar = review.photoURL || review.avatar || review.authorPhoto || review.profilePhoto;

  return (
    <article className="flex h-full flex-col rounded-2xl border border-rule bg-paper p-5 shadow-whisper transition-shadow hover:shadow-card">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-accent-soft text-sm font-black uppercase text-accent ring-1 ring-accent/10">
            {avatar ? <img src={avatar} alt={authorName} className="h-full w-full object-cover" loading="lazy" decoding="async" /> : getInitials(authorName)}
          </div>
          <div className="min-w-0">
            <h3 className="truncate font-display text-base font-bold text-ink">{authorName}</h3>
            <div className="mt-1 flex items-center gap-1 text-amber-400" aria-label={`Оценка ${rating} из 5`}>
              {Array.from({ length: 5 }).map((_, index) => <Star key={index} className={`h-4 w-4 ${index < rating ? 'fill-current' : 'text-rule'}`} />)}
            </div>
          </div>
        </div>
        <span className={`shrink-0 rounded-pill border px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest ${getReviewSourceClassName(review.source)}`}>{getReviewSourceLabel(review.source)}</span>
      </div>
      <p className={`my-5 flex-1 text-sm leading-relaxed text-ink-2 ${compact ? 'line-clamp-6' : ''}`}>{text}</p>
      <div className="mt-auto border-t border-rule pt-4 text-xs text-muted">
        <div>{getReviewDate(review)}</div>
        <div className="mt-1 font-semibold text-ink-2">{getBranch(review)}</div>
      </div>
    </article>
  );
}
