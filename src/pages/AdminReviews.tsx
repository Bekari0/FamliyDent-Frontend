import { useEffect, useState } from 'react';
import axios from 'axios';
import { Check, Loader2, Star, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { getDisplayDoctorName } from '../utils/doctorName';
import { getReviewSourceClassName, getReviewSourceLabel } from '../utils/reviewSource';

const filters = [
 { value: 'pending', label: 'Ожидают проверки' },
 { value: 'approved', label: 'Одобренные' },
 { value: 'rejected', label: 'Отклоненные' },
 { value: '', label: 'Все' }
];

export function AdminReviews() {
 const [reviews, setReviews] = useState<any[]>([]);
 const [status, setStatus] = useState('pending');
 const [loading, setLoading] = useState(true);

 const fetchReviews = async () => {
 setLoading(true);
 try {
 const res = await axios.get('/api/admin/reviews', { params: status ? { status } : {} });
 setReviews(Array.isArray(res.data) ? res.data : []);
 } catch (error: any) {
 toast.error(error.response?.data?.error || 'Не удалось загрузить отзывы');
 } finally {
 setLoading(false);
 }
 };

 useEffect(() => {
 fetchReviews();
 }, [status]);

 const action = async (id: string, type: 'approve' | 'reject' | 'delete') => {
 try {
 if (type === 'delete') await axios.delete(`/api/admin/reviews/${id}`);
 else {
 const nextStatus = type === 'approve' ? 'approved' : 'rejected';
 await axios.patch(`/api/admin/reviews/${id}/moderation`, {
 status: nextStatus,
 reason: type === 'approve' ? 'Одобрено администратором' : 'Отклонено администратором',
 });
 }
 toast.success(type === 'approve' ? 'Отзыв одобрен' : type === 'reject' ? 'Отзыв отклонен' : 'Отзыв удален');
 fetchReviews();
 } catch (error: any) {
 toast.error(error.response?.data?.error || 'Действие не выполнено');
 }
 };

 return (
 <div className="min-h-screen bg-[#f8fafc] py-8">
 <div className="container mx-auto px-4">
 <div className="mb-6">
 <h1 className="text-3xl font-semibold text-foreground">Модерация отзывов</h1>
 <p className="text-muted-foreground mt-2">Одобренные отзывы появляются на сайте.</p>
 </div>

 <div className="flex flex-wrap gap-2 mb-6">
 {filters.map((item) => (
 <button key={item.label} onClick={() => setStatus(item.value)} className={`h-10 px-4 rounded-md text-sm font-semibold border transition ${status === item.value ? 'bg-primary text-primary-foreground border-primary' : 'bg-card text-foreground border-border hover:border-primary/40'}`}>
 {item.label}
 </button>
 ))}
 </div>

 {loading ? (
 <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
 ) : reviews.length === 0 ? (
 <div className="rounded-md bg-card border border-border p-8 text-center text-muted-foreground">Отзывов в этом разделе нет.</div>
 ) : (
 <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
 {reviews.map((review) => (
 <article key={review._id || review.id} className="rounded-md bg-card border border-border shadow-sm p-5 flex flex-col">
 <div className="flex items-center justify-between gap-3 mb-4">
 <div className="flex gap-1 text-primary">
 {Array.from({ length: 5 }).map((_, i) => <Star key={i} className={`w-4 h-4 ${i < Number(review.rating || 0) ? 'fill-current' : 'text-espresso-muted'}`} />)}
 </div>
 <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{review.moderationStatus || review.status}</span>
 </div>
 <div className="mb-4">
 <span className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${getReviewSourceClassName(review.source)}`}>
 {getReviewSourceLabel(review.source)}
 </span>
 </div>
 <p className="text-foreground leading-relaxed flex-1">{review.text || review.comment || 'Нет текста'}</p>
 {(review.moderationReason || review.moderationScore !== undefined) && (
 <div className="mt-4 rounded-md border border-border bg-secondary p-3 text-xs text-muted-foreground">
 <div className="font-semibold text-foreground">Модерация</div>
 {review.moderationReason && <div className="mt-1">{review.moderationReason}</div>}
 {review.moderationScore !== undefined && <div className="mt-1">Score: {review.moderationScore}</div>}
 </div>
 )}
 <div className="mt-5 pt-4 border-t border-border text-sm text-muted-foreground">
 <div><span className="font-semibold text-foreground">Пациент:</span> {review.patientName || review.authorName || 'Пациент'}</div>
 <div className="mt-1"><span className="font-semibold text-foreground">Врач:</span> {getDisplayDoctorName(review)}</div>
 </div>
 <div className="flex gap-2 mt-5">
 <Button onClick={() => action(review._id || review.id, 'approve')} className="h-10 flex-1 rounded-md bg-success hover:bg-success/90 text-white">
 <Check className="w-4 h-4 mr-1" /> Одобрить
 </Button>
 <Button onClick={() => action(review._id || review.id, 'reject')} variant="outline" className="h-10 rounded-md">
 <X className="w-4 h-4" />
 </Button>
 <Button onClick={() => action(review._id || review.id, 'delete')} variant="outline" className="h-10 rounded-md text-destructive hover:text-destructive">
 <Trash2 className="w-4 h-4" />
 </Button>
 </div>
 </article>
 ))}
 </div>
 )}
 </div>
 </div>
 );
}

