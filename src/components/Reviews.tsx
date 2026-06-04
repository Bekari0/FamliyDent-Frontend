import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import axios from 'axios';
import { ArrowRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
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
 <section id="reviews" className="relative overflow-hidden bg-white py-16 lg:py-20">
 <div className="container mx-auto px-4 sm:px-6 lg:px-8">
 <div className="mx-auto mb-10 flex max-w-5xl flex-col gap-6 md:flex-row md:items-end md:justify-between">
 <div className="max-w-3xl">
 <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-primary">
 <Star className="h-4 w-4 fill-current" />
 {hasReviews ? `${reviews.length} отзывов пациентов` : 'Отзывы пациентов'}
 </div>

 <h2 className="mb-4 text-[clamp(2rem,3vw,3.25rem)] font-bold leading-tight text-slate-900">
 Что говорят о нас <span className="text-primary">пациенты</span>
 </h2>

 <p className="text-base leading-relaxed text-slate-600 lg:text-lg">
 {hasReviews
 ? 'Публикуем только проверенные отзывы сайта, Google Maps и Яндекс Карт.'
 : 'Здесь появятся отзывы сайта, Google Maps и Яндекс Карт после модерации или импорта.'}
 </p>
 </div>

 <motion.div
 initial={{ opacity: 0, x: 20 }}
 whileInView={{ opacity: 1, x: 0 }}
 viewport={{ once: true }}
 className="hidden md:block"
 >
 <Link to="/reviews">
 <Button variant="outline" className="h-12 rounded-xl border-slate-200 bg-white px-5 font-bold text-slate-700 hover:border-primary/40">
 Все отзывы
 <ArrowRight className="h-4 w-4" />
 </Button>
 </Link>
 </motion.div>
 </div>

 {reviews.length === 0 ? (
 <div className="mx-auto max-w-xl rounded-xl border border-border bg-secondary/50 p-8 text-center text-slate-600">
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
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ delay: index * 0.05 }}
 >
 <ReviewCard review={review} compact />
 </motion.div>
 ))}
 </div>
 </div>
 )}

 <motion.div
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 className="mt-8 md:hidden"
 >
 <Link to="/reviews">
 <Button variant="outline" className="h-14 w-full rounded-2xl border-slate-100 font-bold text-slate-500 hover:bg-slate-50">
 Посмотреть все отзывы
 </Button>
 </Link>
 </motion.div>
 </div>
 </section>
 );
}
