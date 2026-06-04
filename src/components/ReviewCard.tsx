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
 <article className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
 <div className="flex items-start justify-between gap-4">
 <div className="flex min-w-0 items-center gap-3">
 <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/10 text-sm font-black uppercase text-primary ring-1 ring-primary/10">
 {avatar ? (
 <img src={avatar} alt={authorName} className="h-full w-full object-cover" loading="lazy" decoding="async" />
 ) : (
 getInitials(authorName)
 )}
 </div>

 <div className="min-w-0">
 <h3 className="truncate text-base font-bold text-slate-900">{authorName}</h3>
 <div className="mt-1 flex items-center gap-1 text-amber-400" aria-label={`Оценка ${rating} из 5`}>
 {Array.from({ length: 5 }).map((_, index) => (
 <Star key={index} className={`h-4 w-4 ${index < rating ? 'fill-current' : 'text-slate-200'}`} />
 ))}
 </div>
 </div>
 </div>

 <span className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest ${getReviewSourceClassName(review.source)}`}>
 {getReviewSourceLabel(review.source)}
 </span>
 </div>

 <p className={`my-5 flex-1 text-center text-sm leading-relaxed text-slate-700 ${compact ? 'line-clamp-6' : ''}`}>
 {text}
 </p>

 <div className="mt-auto border-t border-slate-100 pt-4 text-center text-xs text-slate-500">
 <div>{getReviewDate(review)}</div>
 <div className="mt-1 font-semibold text-slate-600">{getBranch(review)}</div>
 </div>
 </article>
 );
}
