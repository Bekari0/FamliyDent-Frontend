import { useEffect, useState, type FormEvent } from 'react';
import axios from 'axios';
import { Loader2, Send, Star } from 'lucide-react';
import { toast } from 'sonner';
import { EditorialPageHero } from '@/components/shared/editorial-page-hero';
import { ReviewCard } from '@/components/ReviewCard';
import { useAuth } from '@/context/AuthContext';
import { getDisplayDoctorName } from '@/utils/doctorName';

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
      const response = await axios.get('/api/reviews/public');
      setReviews(Array.isArray(response.data) ? response.data : []);
    } catch {
      toast.error('Не удалось загрузить отзывы');
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailable = async () => {
    if (!user) return;
    try {
      const response = await axios.get('/api/reviews/my-available-appointments');
      const items = Array.isArray(response.data) ? response.data : [];
      setAvailable(items);
      if (items[0]) setForm((previous) => ({ ...previous, appointmentId: previous.appointmentId || items[0]._id || items[0].id }));
    } catch {
      setAvailable([]);
    }
  };

  useEffect(() => { fetchReviews(); }, []);
  useEffect(() => { fetchAvailable(); }, [user]);

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
    <main className="min-h-screen bg-paper pb-20 text-ink" data-ui="editorial-page">
      <EditorialPageHero
        badge="Мнения пациентов"
        title="Отзывы о FamilyDent"
        description="На сайте публикуются только одобренные отзывы пациентов после завершенного приема."
      />

      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
        <div className="mb-8 flex flex-col gap-4 border-y border-rule py-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-1 text-amber-400" aria-label="Рейтинг 5 из 5">{[1, 2, 3, 4, 5].map((value) => <Star key={value} className="h-5 w-5 fill-current" aria-hidden="true" />)}</div>
          <p className="text-sm text-editorial-muted">{reviews.length > 0 ? `${reviews.length} опубликованных отзывов` : 'Публикуются только отзывы, прошедшие модерацию.'}</p>
        </div>

        {user && (
          <form onSubmit={handleSubmit} className="mx-auto mb-10 max-w-3xl rounded-3xl border border-rule bg-surface p-6 shadow-whisper sm:p-8">
            <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-accent">Ваше мнение</span>
            <h2 className="mt-2 font-display text-2xl font-bold">Оставить отзыв</h2>
            <p className="mt-2 text-sm leading-relaxed text-editorial-muted">Отзыв можно отправить после завершенного приема. Перед публикацией его проверит администратор.</p>

            {available.length === 0 ? (
              <div className="mt-6 rounded-2xl border border-rule bg-paper-2 p-5 text-sm text-editorial-muted">Нет завершенных приемов, доступных для отзыва.</div>
            ) : (
              <div className="mt-6 grid gap-5">
                <label className="grid gap-2 text-sm font-semibold">
                  Прием
                  <select value={form.appointmentId} onChange={(event) => setForm({ ...form, appointmentId: event.target.value })} className="min-h-11 w-full rounded-xl border border-rule bg-paper px-4 text-sm text-ink focus:border-accent focus:outline-none">
                    {available.map((booking) => <option key={booking._id || booking.id} value={booking._id || booking.id}>{booking.date || 'Дата не указана'} {booking.time || ''} · {getDisplayDoctorName(booking)}</option>)}
                  </select>
                </label>

                <fieldset>
                  <legend className="text-sm font-semibold">Оценка</legend>
                  <div className="mt-2 flex gap-1 text-amber-400">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button key={rating} type="button" onClick={() => setForm({ ...form, rating })} className="rounded-lg p-1 focus-visible:outline-2 focus-visible:outline-accent" aria-label={`Поставить оценку ${rating}`} aria-pressed={form.rating === rating}>
                        <Star className={`h-7 w-7 ${form.rating >= rating ? 'fill-current' : 'text-rule-2'}`} aria-hidden="true" />
                      </button>
                    ))}
                  </div>
                </fieldset>

                <label className="grid gap-2 text-sm font-semibold">
                  Текст отзыва
                  <textarea required minLength={10} value={form.text} onChange={(event) => setForm({ ...form, text: event.target.value })} className="min-h-32 w-full resize-y rounded-xl border border-rule bg-paper p-4 text-sm font-normal focus:border-accent focus:outline-none" placeholder="Расскажите о вашем впечатлении..." />
                </label>

                <button disabled={submitting} type="submit" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-pill bg-ink px-6 text-xs font-bold text-paper transition-colors hover:bg-accent hover:text-accent-ink disabled:cursor-wait disabled:opacity-60">
                  {submitting ? <><Loader2 className="h-4 w-4 animate-spin" />Отправляем...</> : <><Send className="h-4 w-4" />Отправить на модерацию</>}
                </button>
              </div>
            )}
          </form>
        )}

        {loading ? (
          <div className="flex min-h-64 items-center justify-center gap-3 rounded-3xl border border-rule bg-surface text-sm text-editorial-muted" role="status"><Loader2 className="h-8 w-8 animate-spin text-accent" />Загрузка отзывов...</div>
        ) : reviews.length === 0 ? (
          <div className="rounded-3xl border border-rule bg-surface p-10 text-center text-sm text-editorial-muted">Пока нет опубликованных отзывов.</div>
        ) : (
          <section className="grid gap-5 md:grid-cols-2 lg:grid-cols-3" aria-label="Отзывы пациентов">
            {reviews.map((review) => <ReviewCard key={review._id || review.id} review={review} />)}
          </section>
        )}
      </div>
    </main>
  );
}
