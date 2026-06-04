import { useEffect, useState, type FormEvent } from 'react';
import { motion } from 'motion/react';
import axios from 'axios';
import { ChevronRight, Loader2, Send, Star } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import { getDisplayDoctorName } from '../utils/doctorName';
import { ReviewCard } from '../components/ReviewCard';

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
 <div className="min-h-screen bg-background pb-20">
 <div className="container mx-auto px-4">
 <div className="mb-10 flex items-center justify-between">
 <Button variant="ghost" asChild>
 <Link to="/">
 <ChevronRight className="mr-2 h-4 w-4 rotate-180" />
 Назад на главную
 </Link>
 </Button>
 </div>

 <div className="mx-auto mb-12 max-w-3xl text-center">
 <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-5 font-display text-[clamp(2.2rem,4vw,4rem)] font-bold text-foreground">
 Отзывы пациентов
 </motion.h1>
 <div className="mb-4 flex items-center justify-center gap-1 text-amber-400">
 {[1, 2, 3, 4, 5].map((s) => <Star key={s} className="h-6 w-6 fill-current" />)}
 </div>
 <p className="text-lg font-semibold text-text-secondary">
 {reviews.length > 0 ? `${reviews.length} опубликованных отзывов` : 'На сайте отображаются только одобренные отзывы.'}
 </p>
 </div>

 {user && (
 <form onSubmit={handleSubmit} className="mx-auto mb-12 max-w-2xl space-y-5 rounded-xl border border-border bg-card p-6 shadow-sm">
 <div>
 <h2 className="text-xl font-bold text-foreground">Оставить отзыв</h2>
 <p className="mt-1 text-sm text-text-secondary">Отзыв можно отправить после завершенного приема. Перед публикацией его проверит администратор.</p>
 </div>

 {available.length === 0 ? (
 <div className="rounded-xl border border-border bg-secondary/70 p-4 text-sm text-text-secondary">
 Нет завершенных приемов, доступных для отзыва.
 </div>
 ) : (
 <>
 <label className="block">
 <span className="text-sm font-semibold text-foreground">Прием</span>
 <select value={form.appointmentId} onChange={(e) => setForm({ ...form, appointmentId: e.target.value })} className="mt-2 h-11 w-full rounded-xl border border-border bg-white px-3 text-foreground">
 {available.map((booking) => (
 <option key={booking._id || booking.id} value={booking._id || booking.id}>
 {booking.date || 'Дата не указана'} {booking.time || ''} · {getDisplayDoctorName(booking)}
 </option>
 ))}
 </select>
 </label>

 <div>
 <span className="text-sm font-semibold text-foreground">Оценка</span>
 <div className="mt-2 flex gap-2 text-amber-400">
 {[1, 2, 3, 4, 5].map((s) => (
 <button key={s} type="button" onClick={() => setForm({ ...form, rating: s })} className="p-1">
 <Star className={`h-7 w-7 ${form.rating >= s ? 'fill-current' : 'text-slate-200'}`} />
 </button>
 ))}
 </div>
 </div>

 <label className="block">
 <span className="text-sm font-semibold text-foreground">Текст отзыва</span>
 <textarea required value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} className="mt-2 h-32 w-full resize-none rounded-xl border border-border bg-white p-4 focus:ring-2 focus:ring-primary/20" placeholder="Расскажите о вашем впечатлении..." />
 </label>

 <Button disabled={submitting} type="submit" className="h-12 w-full rounded-xl bg-primary font-bold text-white">
 {submitting ? <Loader2 className="animate-spin" /> : <><Send className="mr-2 h-4 w-4" /> Отправить на модерацию</>}
 </Button>
 </>
 )}
 </form>
 )}

 {loading ? (
 <div className="flex justify-center py-20"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>
 ) : reviews.length === 0 ? (
 <div className="mx-auto max-w-xl rounded-xl border border-border bg-card p-8 text-center text-text-secondary">Пока нет опубликованных отзывов.</div>
 ) : (
 <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
 {reviews.map((review, idx) => (
 <motion.div key={review._id || review.id} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: (idx % 9) * 0.04 }}>
 <ReviewCard review={review} />
 </motion.div>
 ))}
 </div>
 )}
 </div>
 </div>
 );
}
