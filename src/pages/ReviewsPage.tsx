import { useEffect, useState, type FormEvent } from 'react';
import { motion } from 'motion/react';
import axios from 'axios';
import { Star, MessageSquare, ChevronRight, Loader2, Send } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import { getDisplayDoctorName } from '../utils/doctorName';
import { getReviewSourceClassName, getReviewSourceLabel } from '../utils/reviewSource';

export function ReviewsPage() {
 const { user } = useAuth();
 const [reviews, setReviews] = useState<any[]>([]);
 const [available, setAvailable] = useState<any[]>([]);
 const [loading, setLoading] = useState(true);
 const [submitting, setSubmitting] = useState(false);
 const [form, setForm] = useState({ appointmentId: '', text: '', rating: 5 });

 const fetchReviews = async () => {
 setLoading(true);
 try {
 const res = await axios.get('/api/reviews/public');
 setReviews(Array.isArray(res.data) ? res.data : []);
 } catch {
 toast.error('Не удалось загрузить отзывы');
 } finally {
 setLoading(false);
 }
 };

 const fetchAvailable = async () => {
 if (!user) return;
 try {
 const res = await axios.get('/api/reviews/my-available-appointments');
 const items = Array.isArray(res.data) ? res.data : [];
 setAvailable(items);
 if (items[0]) setForm((prev) => ({ ...prev, appointmentId: prev.appointmentId || items[0]._id || items[0].id }));
 } catch {
 setAvailable([]);
 }
 };

 useEffect(() => {
 fetchReviews();
 }, []);

 useEffect(() => {
 fetchAvailable();
 }, [user]);

 const handleSubmit = async (event: FormEvent) => {
 event.preventDefault();
 if (!form.appointmentId) return toast.error('Выберите завершенный прием');
 if (form.text.trim().length < 10) return toast.error('Напишите отзыв не короче 10 символов');

 setSubmitting(true);
 try {
 await axios.post('/api/reviews', form);
 toast.success('Спасибо! Ваш отзыв отправлен на модерацию.');
 setForm({ appointmentId: '', text: '', rating: 5 });
 await Promise.all([fetchAvailable(), fetchReviews()]);
 } catch (error: any) {
 toast.error(error.response?.data?.error || 'Не удалось отправить отзыв');
 } finally {
 setSubmitting(false);
 }
 };

 return (
 <div className="pb-20 bg-background min-h-screen">
 <div className="container mx-auto px-4">
 <div className="mb-10 flex justify-between items-center">
 <Button variant="ghost" asChild>
 <Link to="/">
 <ChevronRight className="w-4 h-4 mr-2 rotate-180" />
 Назад на главную
 </Link>
 </Button>
 </div>

 <div className="text-center max-w-3xl mx-auto mb-12">
 <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-[clamp(2.2rem,4vw,4rem)] font-display font-bold text-foreground mb-5">
 Отзывы пациентов
 </motion.h1>
 <div className="flex items-center justify-center gap-1 text-amber-400 mb-4">
 {[1, 2, 3, 4, 5].map((s) => <Star key={s} className="w-6 h-6 fill-current" />)}
 </div>
 <p className="text-lg font-semibold text-text-secondary">На сайте отображаются только одобренные отзывы.</p>
 </div>

 {user && (
 <form onSubmit={handleSubmit} className="max-w-2xl mx-auto mb-12 bg-card p-6 rounded-xl border border-border shadow-sm space-y-5">
 <div>
 <h2 className="text-xl font-bold text-foreground">Оставить отзыв</h2>
 <p className="text-sm text-text-secondary mt-1">Отзыв можно отправить после завершенного приема. Перед публикацией его проверит администратор.</p>
 </div>

 {available.length === 0 ? (
 <div className="rounded-xl bg-secondary/70 border border-border p-4 text-sm text-text-secondary">
 Нет завершенных приемов, доступных для отзыва.
 </div>
 ) : (
 <>
 <label className="block">
 <span className="text-sm font-semibold text-foreground">Прием</span>
 <select value={form.appointmentId} onChange={(e) => setForm({ ...form, appointmentId: e.target.value })} className="mt-2 w-full h-11 rounded-xl border border-border bg-white px-3 text-foreground">
 {available.map((booking) => (
 <option key={booking._id || booking.id} value={booking._id || booking.id}>
 {booking.date || 'Дата не указана'} {booking.time || ''} · {getDisplayDoctorName(booking)}
 </option>
 ))}
 </select>
 </label>

 <div>
 <span className="text-sm font-semibold text-foreground">Оценка</span>
 <div className="flex gap-2 text-amber-400 mt-2">
 {[1, 2, 3, 4, 5].map((s) => (
 <button key={s} type="button" onClick={() => setForm({ ...form, rating: s })} className="p-1">
 <Star className={`w-7 h-7 ${form.rating >= s ? 'fill-current' : 'text-slate-200'}`} />
 </button>
 ))}
 </div>
 </div>

 <label className="block">
 <span className="text-sm font-semibold text-foreground">Текст отзыва</span>
 <textarea required value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} className="mt-2 w-full h-32 p-4 rounded-xl bg-white border border-border focus:ring-2 focus:ring-primary/20 resize-none" placeholder="Расскажите о вашем впечатлении..." />
 </label>

 <Button disabled={submitting} type="submit" className="w-full h-12 rounded-xl bg-primary text-white font-bold">
 {submitting ? <Loader2 className="animate-spin" /> : <><Send className="w-4 h-4 mr-2" /> Отправить на модерацию</>}
 </Button>
 </>
 )}
 </form>
 )}

 {loading ? (
 <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>
 ) : reviews.length === 0 ? (
 <div className="max-w-xl mx-auto rounded-xl border border-border bg-card p-8 text-center text-text-secondary">Пока нет опубликованных отзывов.</div>
 ) : (
 <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
 {reviews.map((review, idx) => (
 <motion.div key={review._id || review.id} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: (idx % 9) * 0.04 }} className="bg-card p-6 rounded-xl border border-border shadow-sm relative flex flex-col min-h-[250px]">
 <MessageSquare className="absolute top-6 right-6 w-10 h-10 text-primary/10" />
 <div className="flex items-center justify-between gap-3 mb-4">
 <div className="flex items-center gap-1 text-amber-400">
 {Array.from({ length: 5 }).map((_, i) => <Star key={i} className={`w-4 h-4 ${i < Number(review.rating || 0) ? 'fill-current' : 'text-slate-200'}`} />)}
 </div>
 <span className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest ${getReviewSourceClassName(review.source)}`}>
 {getReviewSourceLabel(review.source)}
 </span>
 </div>
 <p className="text-text-secondary mb-6 leading-relaxed flex-1 line-clamp-7">{review.text || review.comment || 'Нет текста отзыва'}</p>
 <div className="border-t border-border pt-4">
 <span className="font-bold text-foreground">{review.patientName || 'Пациент'}</span>
 <div className="text-xs text-text-secondary mt-1">{getDisplayDoctorName(review, 'FamilyDent')}</div>
 </div>
 </motion.div>
 ))}
 </div>
 )}
 </div>
 </div>
 );
}

