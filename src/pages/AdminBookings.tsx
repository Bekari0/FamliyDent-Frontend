import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import axios from 'axios';
import {
 Search,
 Filter,
 Download,
 Calendar,
 Loader2,
 CheckCircle2,
 XCircle,
 Clock,
 User,
 Phone,
 Mail,
 CalendarDays,
 Trash2,
} from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
 Dialog,
 DialogContent,
 DialogDescription,
 DialogHeader,
 DialogTitle,
} from '@/components/ui/dialog';
import { exportToPDF, formatPdfDate, formatPdfStatus } from '../lib/pdfExport';
import { getDisplayDoctorName } from '../utils/doctorName';

const STATUS_MAP: Record<string, { label: string; color: string }> = {
 pending: { label: 'Ожидает', color: 'bg-warning/10 text-warning border-none shadow-sm' },
 confirmed: { label: 'Подтвержден', color: 'bg-success/10 text-success border-none shadow-sm' },
 completed: { label: 'Завершен', color: 'bg-secondary text-muted-foreground border-none shadow-sm' },
 cancelled: { label: 'Отменен', color: 'bg-error/10 text-error border-none shadow-sm' },
};

const getPatientRecordId = (patient: any) => patient?.uid || patient?.id || patient?._id;
const getDoctorName = (booking: any) => getDisplayDoctorName(booking);

export function AdminBookings() {
 const [bookings, setBookings] = useState<any[]>([]);
 const [loading, setLoading] = useState(true);
 const [searchTerm, setSearchTerm] = useState('');
 const [statusFilter, setStatusFilter] = useState('all');
 const [selectedPatient, setSelectedPatient] = useState<any>(null);

 const fetchBookings = async () => {
 setLoading(true);
 try {
 const response = await axios.get('/api/bookings');
 setBookings(Array.isArray(response.data) ? response.data : []);
 } catch (error) {
 toast.error('Ошибка загрузки записей');
 } finally {
 setLoading(false);
 }
 };

 useEffect(() => {
 fetchBookings();
 }, []);

 const updateStatus = async (id: string, status: string) => {
 try {
 await axios.patch(`/api/bookings/${id}`, { status });
 toast.success('Статус обновлен');
 fetchBookings();
 } catch (error) {
 toast.error('Ошибка обновления статуса');
 }
 };

 const filteredBookings = bookings.filter((booking) => {
 const query = searchTerm.toLowerCase();
 const matchesSearch =
 (booking.patientName || '').toLowerCase().includes(query) ||
 (booking.doctorName || '').toLowerCase().includes(query) ||
 (booking.bookingNumber || '').toString().includes(searchTerm) ||
 (booking.serviceId || '').toLowerCase().includes(query);
 const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
 return matchesSearch && matchesStatus;
 });

 const exportBookings = async () => {
 try {
 const headers = ['№ записи', 'Пациент', 'Врач', 'Услуга', 'Дата', 'Время', 'Статус'];
 const data = filteredBookings.map((booking) => [
 `#${String(booking.bookingNumber || '').padStart(4, '0')}`,
 booking.patientName || 'Пациент',
 getDoctorName(booking),
 booking.serviceId || 'Услуга',
 booking.date || '',
 booking.time || '',
 STATUS_MAP[booking.status]?.label || booking.status || '',
 ]);

 await exportToPDF(
 'Полный реестр записей Family Dent',
 headers,
 data,
 `all_bookings_${new Date().toISOString().split('T')[0]}`,
 );

 toast.success('Записи экспортированы в PDF');
 } catch (error) {
 toast.error('Ошибка при экспорте записей');
 }
 };

 const deleteBooking = async (id: string) => {
 if (!window.confirm('Удалить эту запись навсегда?')) return;

 try {
 await axios.delete(`/api/bookings/${id}`);
 toast.success('Запись удалена');
 fetchBookings();
 } catch (error) {
 toast.error('Ошибка удаления');
 }
 };

 return (
 <div className="pt-24 pb-20 bg-background min-h-screen text-foreground">
 <div className="container mx-auto px-4">
 <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
 <div>
 <h1 className="text-4xl lg:text-5xl font-display font-semibold text-foreground mb-3 tracking-tight">
 Менеджер записей
 </h1>
 <p className="text-muted-foreground font-medium">
 Управление расписанием приемов и статусами медицинских услуг
 </p>
 </div>
 <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
 <button
 onClick={exportBookings}
 className="flex items-center justify-center gap-3 h-14 px-8 rounded-md bg-card border border-border font-semibold text-xs uppercase tracking-[0.18em] hover:bg-secondary transition-all text-foreground shadow-sm"
 >
 <Download className="w-4 h-4 text-primary" /> Экспорт в PDF
 </button>
 <button
 onClick={fetchBookings}
 className="flex items-center justify-center gap-3 h-14 px-8 rounded-md bg-primary text-primary-foreground font-semibold text-xs uppercase tracking-[0.18em] hover:bg-primary-hover active:scale-95 transition-all shadow-md shadow-primary/20"
 >
 <Calendar size={18} /> Обновить список
 </button>
 </div>
 </div>

 <div className="bg-card rounded-md border border-border shadow-md overflow-hidden">
 <div className="p-6 lg:p-8 border-b border-border flex flex-col md:flex-row items-center justify-between gap-6">
 <div className="relative flex-1 max-w-lg w-full group">
 <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-primary/60 w-5 h-5 group-hover:text-primary transition-colors" />
 <input
 type="text"
 placeholder="Поиск по пациенту, врачу или номеру записи..."
 className="w-full h-14 pl-14 pr-6 bg-secondary border border-border rounded-md text-sm focus:ring-4 focus:ring-primary/10 text-foreground placeholder:text-muted-foreground font-medium transition-all"
 value={searchTerm}
 onChange={(event) => setSearchTerm(event.target.value)}
 />
 </div>

 <div className="flex items-center gap-4 w-full md:w-auto">
 <Filter className="text-primary/70 w-5 h-5" />
 <select
 value={statusFilter}
 onChange={(event) => setStatusFilter(event.target.value)}
 className="h-14 px-6 bg-secondary border border-border rounded-md text-sm font-semibold text-foreground outline-none cursor-pointer focus:ring-4 focus:ring-primary/10 transition-all min-w-[220px] w-full"
 >
 <option value="all">Все статусы</option>
 <option value="pending">Ожидают подтверждения</option>
 <option value="confirmed">Подтверждены</option>
 <option value="cancelled">Отменены</option>
 <option value="completed">Завершены успешно</option>
 </select>
 </div>
 </div>

 <div className="overflow-x-auto">
 {loading ? (
 <div className="flex flex-col items-center justify-center py-24">
 <Loader2 className="w-12 h-12 text-primary animate-spin mb-6" />
 <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
 Синхронизация данных...
 </p>
 </div>
 ) : (
 <table className="w-full text-left">
 <thead>
 <tr className="bg-secondary text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.2em]">
 <th className="px-8 py-6">Код</th>
 <th className="px-8 py-6">Клиент</th>
 <th className="px-8 py-6">Специалист / услуга</th>
 <th className="px-8 py-6">Слот времени</th>
 <th className="px-8 py-6">Статус записи</th>
 <th className="px-8 py-6 text-right">Управление</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-border">
 {filteredBookings.map((booking) => (
 <motion.tr
 key={booking._id}
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 className="hover:bg-secondary/60 transition-colors"
 >
 <td className="px-8 py-6 font-semibold text-primary text-sm tracking-tighter">
 #{String(booking.bookingNumber || '').padStart(4, '0')}
 </td>
 <td className="px-8 py-6">
 <button
 onClick={() => setSelectedPatient(booking.patientInfo || {})}
 className="font-semibold text-foreground text-left outline-none border-b-2 border-primary/10 hover:border-primary transition-all leading-relaxed"
 >
 {booking.patientName || 'Пациент'}
 </button>
 </td>
 <td className="px-8 py-6">
 <div className="font-semibold text-foreground leading-none mb-1.5">
 {getDoctorName(booking)}
 </div>
 <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.18em]">
 {booking.serviceId || 'Услуга не указана'}
 </div>
 </td>
 <td className="px-8 py-6">
 <div className="text-sm font-semibold text-foreground mb-1">
 {booking.date
 ? new Date(booking.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })
 : 'Дата не указана'}
 </div>
 <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.18em]">
 {booking.time || 'Время не указано'}
 </div>
 </td>
 <td className="px-8 py-6">
 <Badge
 className={`${STATUS_MAP[booking.status]?.color || 'bg-muted text-muted-foreground'} px-4 py-1.5 rounded-full text-[10px] font-semibold uppercase tracking-[0.18em] shadow-sm`}
 >
 {STATUS_MAP[booking.status]?.label || booking.status || 'Неизвестно'}
 </Badge>
 </td>
 <td className="px-8 py-6 text-right">
 <div className="flex gap-3 justify-end">
 {booking.status === 'pending' && (
 <button
 onClick={() => updateStatus(booking._id, 'confirmed')}
 className="w-12 h-12 text-success bg-success/10 hover:bg-success hover:text-primary-foreground rounded-md flex items-center justify-center transition-all shadow-sm"
 title="Подтвердить прием"
 >
 <CheckCircle2 size={18} />
 </button>
 )}
 {booking.status !== 'cancelled' && booking.status !== 'completed' && (
 <button
 onClick={() => updateStatus(booking._id, 'cancelled')}
 className="w-12 h-12 text-error bg-error/10 hover:bg-error hover:text-primary-foreground rounded-md flex items-center justify-center transition-all shadow-sm"
 title="Отменить запись"
 >
 <XCircle size={18} />
 </button>
 )}
 {booking.status === 'confirmed' && (
 <button
 onClick={() => updateStatus(booking._id, 'completed')}
 className="w-12 h-12 text-primary bg-primary/10 hover:bg-primary hover:text-primary-foreground rounded-md flex items-center justify-center transition-all shadow-sm"
 title="Завершить сеанс"
 >
 <Clock size={18} />
 </button>
 )}
 <button
 onClick={() => deleteBooking(booking._id)}
 className="w-12 h-12 text-error bg-error/10 hover:bg-error hover:text-primary-foreground rounded-md flex items-center justify-center transition-all shadow-sm"
 title="Удалить запись"
 >
 <Trash2 size={18} />
 </button>
 </div>
 </td>
 </motion.tr>
 ))}
 {filteredBookings.length === 0 && (
 <tr>
 <td colSpan={6} className="px-10 py-24 text-center text-muted-foreground font-semibold text-lg tracking-tight">
 Архив записей пуст
 </td>
 </tr>
 )}
 </tbody>
 </table>
 )}
 </div>
 </div>
 </div>

 <Dialog open={!!selectedPatient} onOpenChange={(open) => !open && setSelectedPatient(null)}>
 <DialogContent className="sm:max-w-md rounded-md border border-border shadow-2xl p-0 overflow-hidden bg-card text-foreground">
 {selectedPatient && (
 <div className="p-8">
 <DialogHeader className="mb-6 text-left">
 <DialogTitle className="text-2xl font-semibold font-display text-foreground">
 Информация о пациенте
 </DialogTitle>
 <DialogDescription className="text-muted-foreground">Детальные данные из профиля</DialogDescription>
 </DialogHeader>

 <div className="space-y-4">
 <div className="flex items-center gap-4 p-4 rounded-md bg-secondary border border-border">
 <div className="w-12 h-12 bg-primary/10 rounded-md flex items-center justify-center text-primary">
 <User size={24} />
 </div>
 <div>
 <div className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">ФИО</div>
 <div className="font-semibold text-foreground">{selectedPatient.displayName || 'Не указано'}</div>
 </div>
 </div>

 <div className="flex items-center gap-4 p-4 rounded-md bg-secondary border border-border">
 <div className="w-12 h-12 bg-primary/10 rounded-md flex items-center justify-center text-primary">
 <Phone size={24} />
 </div>
 <div>
 <div className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Телефон</div>
 <div className="font-semibold text-foreground">{selectedPatient.phoneNumber || 'Не указан'}</div>
 </div>
 </div>

 <div className="flex items-center gap-4 p-4 rounded-md bg-secondary border border-border">
 <div className="w-12 h-12 bg-primary/10 rounded-md flex items-center justify-center text-primary">
 <Mail size={24} />
 </div>
 <div>
 <div className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Email</div>
 <div className="font-semibold text-foreground">{selectedPatient.email || 'Не указан'}</div>
 </div>
 </div>

 <div className="grid grid-cols-2 gap-4">
 <div className="flex items-center gap-3 p-4 rounded-md bg-secondary border border-border">
 <CalendarDays className="text-primary w-5 h-5 flex-shrink-0" />
 <div>
 <div className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Рождение</div>
 <div className="font-semibold text-sm text-foreground">{selectedPatient.birthDate || '—'}</div>
 </div>
 </div>
 <div className="flex items-center gap-3 p-4 rounded-md bg-secondary border border-border">
 <User className="text-primary w-5 h-5 flex-shrink-0" />
 <div>
 <div className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Пол</div>
 <div className="font-semibold text-sm text-foreground">
 {selectedPatient.gender === 'male'
 ? 'Мужской'
 : selectedPatient.gender === 'female'
 ? 'Женский'
 : '—'}
 </div>
 </div>
 </div>
 </div>
 </div>

 {getPatientRecordId(selectedPatient) && (
 <div className="pt-6">
 <Button asChild className="w-full h-14 rounded-md bg-primary text-primary-foreground font-semibold hover:bg-primary-hover transition-all">
 <Link to={`/profile/records/${getPatientRecordId(selectedPatient)}`}>
 Перейти в медицинскую карту
 </Link>
 </Button>
 </div>
 )}
 </div>
 )}
 </DialogContent>
 </Dialog>
 </div>
 );
}

