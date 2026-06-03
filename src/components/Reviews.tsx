import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import axios from 'axios';
import { Card } from '@/components/ui/card';
import { Star, Quote } from 'lucide-react';
import { getDisplayDoctorName } from '../utils/doctorName';
import { getReviewSourceClassName, getReviewSourceLabel } from '../utils/reviewSource';

export function Reviews() {
 const [reviews, setReviews] = useState<any[]>([]);

 useEffect(() => {
 axios.get('/api/reviews/public')
 .then((res) => setReviews(Array.isArray(res.data) ? res.data.slice(0, 6) : []))
 .catch(() => setReviews([]));
 }, []);

 const hasReviews = reviews.length > 0;

 return (
 <section id="reviews" className="py-16 lg:py-20 bg-white relative overflow-hidden">
 <div className="container mx-auto px-4 sm:px-6 lg:px-8">
 <div className="text-center max-w-3xl mx-auto mb-10">
 <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-5">
 <Star className="w-4 h-4 fill-current" />
 {hasReviews ? `${reviews.length}+ отзывов пациентов` : 'Отзывы пациентов'}
 </div>
 <h2 className="text-[clamp(2rem,3vw,3.25rem)] font-bold text-slate-900 leading-tight mb-4">
 Что говорят о нас <span className="text-primary">пациенты</span>
 </h2>
 <p className="text-slate-600 text-base lg:text-lg leading-relaxed">
 {hasReviews
 ? 'Публикуем только проверенные отзывы после модерации администратора.'
 : 'Здесь появятся отзывы сайта, Google Maps и Яндекс Карт после модерации или импорта.'}
 </p>
 </div>

 {reviews.length === 0 ? (
 <div className="max-w-xl mx-auto rounded-xl border border-border bg-secondary/50 p-8 text-center text-slate-600">
 Пока нет опубликованных отзывов.
 </div>
 ) : (
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
 {reviews.map((review, index) => (
 <motion.div
 key={review.id || review._id}
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ delay: index * 0.06 }}
 >
 <Card className="h-full rounded-xl p-6 border border-border shadow-sm bg-white flex flex-col relative overflow-hidden">
 <Quote className="absolute top-5 right-5 w-10 h-10 text-primary/10" />
 <div className="flex items-center justify-between gap-3 mb-4">
 <div className="flex gap-1 text-amber-400">
 {Array.from({ length: 5 }).map((_, i) => (
 <Star key={i} className={`w-4 h-4 ${i < Number(review.rating || 0) ? 'fill-current' : 'text-slate-200'}`} />
 ))}
 </div>
 <span className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest ${getReviewSourceClassName(review.source)}`}>
 {getReviewSourceLabel(review.source)}
 </span>
 </div>
 <p className="text-slate-700 leading-relaxed text-sm flex-1 line-clamp-6">
 {review.text || review.comment || 'Нет текста отзыва'}
 </p>
 <div className="mt-5 pt-4 border-t border-slate-100">
 <div className="font-bold text-slate-900">{review.patientName || 'Пациент FamilyDent'}</div>
 <div className="text-xs text-slate-500 mt-1">{getDisplayDoctorName(review, 'FamilyDent')}</div>
 </div>
 </Card>
 </motion.div>
 ))}
 </div>
 )}
 </div>
 </section>
 );
}

