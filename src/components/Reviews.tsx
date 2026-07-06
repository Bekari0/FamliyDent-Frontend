import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import axios from 'axios';
import { ArrowRight } from 'lucide-react';
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

  const hasReviews = reviews.length > 0;
  const previewReviews = reviews.slice(0, 12);

  useEffect(() => {
    const container = reviewsTrackRef.current;
    if (!container || previewReviews.length === 0) return;

    const handleWheel = (event: WheelEvent) => scrollHorizontally(container, event);
    container.addEventListener('wheel', handleWheel, { passive: false });

    return () => container.removeEventListener('wheel', handleWheel);
  }, [previewReviews.length]);

  return (
    <section id="reviews" className="bg-card py-16 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between lg:mb-14">
          <div className="max-w-2xl">
            <p className="mb-5 flex items-center gap-3 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
              <span className="inline-block h-px w-10 bg-primary" aria-hidden="true" />
              {hasReviews ? `${reviews.length} отзывов пациентов` : 'Отзывы пациентов'}
            </p>

            <h2 className="font-display text-3xl font-medium leading-snug tracking-tight text-foreground text-balance lg:text-4xl">
              Что говорят о нас пациенты
            </h2>

            <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground text-pretty">
              {hasReviews
                ? 'Публикуем только проверенные отзывы сайта, Google Maps и Яндекс Карт.'
                : 'Здесь появятся отзывы сайта, Google Maps и Яндекс Карт после модерации или импорта.'}
            </p>
          </div>

          <Link
            to="/reviews"
            className="hidden h-11 items-center gap-2 rounded-md border border-border px-5 text-sm font-medium text-foreground transition-colors hover:border-primary/40 md:inline-flex"
          >
            Все отзывы
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {reviews.length === 0 ? (
          <div className="mx-auto max-w-xl rounded-lg border border-border bg-secondary/50 p-8 text-center text-muted-foreground">
            Пока нет опубликованных отзывов.
          </div>
        ) : (
          <div
            ref={reviewsTrackRef}
            className="no-scrollbar -mx-4 cursor-grab touch-pan-x overflow-x-auto overflow-y-hidden px-4 pb-1 active:cursor-grabbing"
          >
            <div className="flex items-stretch gap-5">
              {previewReviews.map((review, index) => (
                <motion.div
                  key={review.id || review._id}
                  className="w-[320px] shrink-0 sm:w-[360px] lg:w-[390px]"
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.04, duration: 0.4 }}
                >
                  <ReviewCard review={review} compact />
                </motion.div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 md:hidden">
          <Link
            to="/reviews"
            className="flex h-12 w-full items-center justify-center gap-2 rounded-md border border-border text-sm font-medium text-foreground"
          >
            Посмотреть все отзывы
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
