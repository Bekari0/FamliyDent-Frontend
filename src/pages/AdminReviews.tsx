import { useEffect, useState } from 'react';
import axios from 'axios';
import { Check, Loader2, Star, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { getDisplayDoctorName } from '../utils/doctorName';

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
 else await axios.patch(`/api/admin/reviews/${id}/${type}`);
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
 <h1 className="text-3xl font-bold text-slate-900">Модерация отзывов</h1>
 <p className="text-slate-600 mt-2">Одобренные отзывы появляются на сайте.</p>
 </div>

 <div className="flex flex-wrap gap-2 mb-6">
 {filters.map((item) => (
 <button key={item.label} onClick={() => setStatus(item.value)} className={`h-10 px-4 rounded-xl text-sm font-bold border transition ${status === item.value ? 'bg-primary text-white border-primary' : 'bg-white text-slate-700 border-slate-200 hover:border-primary/40'}`}>
 {item.label}
 </button>
 ))}
 </div>

 {loading ? (
 <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
 ) : reviews.length === 0 ? (
 <div className="rounded-xl bg-white border border-slate-200 p-8 text-center text-slate-600">Отзывов в этом разделе нет.</div>
 ) : (
 <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
 {reviews.map((review) => (
 <article key={review._id || review.id} className="rounded-xl bg-white border border-slate-200 shadow-sm p-5 flex flex-col">
 <div className="flex items-center justify-between gap-3 mb-4">
 <div className="flex gap-1 text-amber-400">
 {Array.from({ length: 5 }).map((_, i) => <Star key={i} className={`w-4 h-4 ${i < Number(review.rating || 0) ? 'fill-current' : 'text-slate-200'}`} />)}
 </div>
 <span className="text-xs font-bold uppercase tracking-widest text-slate-500">{review.status}</span>
 </div>
 <p className="text-slate-700 leading-relaxed flex-1">{review.text || review.comment || 'Нет текста'}</p>
 <div className="mt-5 pt-4 border-t border-slate-100 text-sm text-slate-600">
 <div className="font-bold text-slate-900">{review.patientName || 'Пациент'}</div>
 <div>{getDisplayDoctorName(review)}</div>
 </div>
 <div className="flex gap-2 mt-5">
 <Button onClick={() => action(review._id || review.id, 'approve')} className="h-10 flex-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white">
 <Check className="w-4 h-4 mr-1" /> Одобрить
 </Button>
 <Button onClick={() => action(review._id || review.id, 'reject')} variant="outline" className="h-10 rounded-xl">
 <X className="w-4 h-4" />
 </Button>
 <Button onClick={() => action(review._id || review.id, 'delete')} variant="outline" className="h-10 rounded-xl text-red-600 hover:text-red-700">
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

