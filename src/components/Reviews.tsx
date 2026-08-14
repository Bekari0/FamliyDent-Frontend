import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import axios from 'axios';
import { ArrowRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ReviewCard } from './ReviewCard';

function scrollHorizontally(container: HTMLDivElement, event: WheelEvent) {
  const maxScrollLeft = container.scrollWidth - container.clientWidth;
  if (maxScrollLeft <= 0) return;
  const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
  event.preventDefault();
  event.stopPropagation();
  container.scrollLeft = Math.max(0, Math.min(maxScrollLeft, container.scrollLeft + delta));
}

export function Reviews() {
  const [reviews, setReviews] = useState<any[]>([]);
  const reviewsTrackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    axios.get('/api/reviews/public')
      .then((res) => setReviews(Array.isArray(res.data) ? res.data : []))
      .catch(() => setReviews([]));
  }, []);

  const previewReviews = reviews.slice(0, 12);

  useEffect(() => {
    const container = reviewsTrackRef.current;
    if (!container || previewReviews.length === 0) return;
    const handleWheel = (event: WheelEvent) => scrollHorizontally(container, event);
    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, [previewReviews.length]);

  return (
    <section id="reviews" className="relative overflow-hidden border-b border-rule bg-surface px-5 py-16 text-ink sm:px-8 sm:py-20">
      <div className="mx-auto max-w-7xl">
        <header className="mb-12 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div className="max-w-3xl">
            <div className="mb-2 inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-accent">
              <Star className="h-4 w-4 fill-current" />
              {reviews.length > 0 ? `${reviews.length} отзывов пациентов` : 'Отзывы пациентов'}
            </div>
            <h2 className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl lg:text-4xl">Что говорят о нас пациенты</h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
              {reviews.length > 0
                ? 'Публикуем только проверенные отзывы с сайта, Google Maps и Яндекс Карт.'
                : 'Здесь появятся отзывы с сайта, Google Maps и Яндекс Карт после модерации или импорта.'}
            </p>
          </div>
          <Link to="/reviews" className="inline-flex min-h-11 items-center gap-2 self-start rounded-pill border border-rule bg-paper-2 px-5 text-xs font-bold text-ink transition-colors hover:bg-paper-3 md:self-auto">
            Все отзывы <ArrowRight className="h-4 w-4 text-accent" />
          </Link>
        </header>

        {reviews.length === 0 ? (
          <div className="mx-auto max-w-xl rounded-2xl border border-rule bg-paper-2 p-8 text-center text-muted shadow-whisper">Пока нет опубликованных отзывов.</div>
        ) : (
          <div ref={reviewsTrackRef} aria-label="Отзывы пациентов" className="no-scrollbar -mx-5 cursor-grab touch-pan-x overflow-x-auto overflow-y-hidden px-5 pb-1 active:cursor-grabbing sm:-mx-8 sm:px-8">
            <div className="flex items-stretch gap-5">
              {previewReviews.map((review, index) => (
                <motion.div key={review.id || review._id} className="w-[310px] shrink-0 sm:w-[360px] lg:w-[390px]" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.05 }}>
                  <ReviewCard review={review} compact />
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
