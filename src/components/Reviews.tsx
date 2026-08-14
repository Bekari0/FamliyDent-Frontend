import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import axios from 'axios';
import { ArrowRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ReviewCard } from './ReviewCard';
import {
  createInitialReviewsState,
  createReviewsErrorState,
  createReviewsSuccessState,
  getHomeMotionProps,
  getHorizontalWheelDecision,
  getReviewsFallback,
  type ReviewsRequestState,
} from './home/home-behavior';

function scrollHorizontally(container: HTMLDivElement, event: WheelEvent) {
  const maxScrollLeft = container.scrollWidth - container.clientWidth;
  if (maxScrollLeft <= 0) return;
  const decision = getHorizontalWheelDecision({
    scrollLeft: container.scrollLeft,
    maxScrollLeft,
    deltaX: event.deltaX,
    deltaY: event.deltaY,
  });
  if (!decision.consumed) return;
  event.preventDefault();
  event.stopPropagation();
  container.scrollLeft = decision.nextScrollLeft;
}

export function Reviews() {
  const [requestState, setRequestState] = useState<ReviewsRequestState<any>>(() => createInitialReviewsState<any>());
  const reviewsTrackRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = Boolean(useReducedMotion());

  useEffect(() => {
    axios.get('/api/reviews/public')
      .then((res) => setRequestState(createReviewsSuccessState(res.data)))
      .catch(() => setRequestState(createReviewsErrorState()));
  }, []);

  const reviews = requestState.reviews;
  const previewReviews = reviews.slice(0, 12);
  const fallback = getReviewsFallback(requestState);

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

        {fallback ? (
          <div role={fallback.role} className={`mx-auto max-w-xl rounded-2xl border p-8 text-center shadow-whisper ${fallback.tone === 'error' ? 'border-error/25 bg-error-soft text-error' : 'border-rule bg-paper-2 text-muted'}`}>
            {fallback.message}
          </div>
        ) : (
          <div ref={reviewsTrackRef} aria-label="Отзывы пациентов" className="no-scrollbar -mx-5 cursor-grab touch-pan-x overflow-x-auto overflow-y-hidden px-5 pb-1 active:cursor-grabbing sm:-mx-8 sm:px-8">
            <div className="flex items-stretch gap-5">
              {previewReviews.map((review, index) => (
                <motion.div key={review.id || review._id} className="w-[310px] shrink-0 sm:w-[360px] lg:w-[390px]" {...getHomeMotionProps(shouldReduceMotion, { opacity: 0, y: 20 }, { delay: index * 0.05 })} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
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
