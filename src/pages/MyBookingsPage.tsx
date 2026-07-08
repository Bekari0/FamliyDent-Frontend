
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import axios from 'axios';
import { Calendar, Clock, MapPin, ChevronRight, ChevronLeft, FileText, Loader2, X, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { getDisplayDoctorName } from '../utils/doctorName';

const clinicTimeZone = 'Europe/Moscow';
const clinicTimeZoneOffset = '+03:00';

const createTimeSlots = () => {
 const slots = [];
 for (let minutes = 7 * 60 + 30; minutes <= 19 * 60; minutes += 30) {
 const hours = Math.floor(minutes / 60);
 const mins = minutes % 60;
 slots.push(`${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`);
 }
 return slots;
};

const timeSlots = createTimeSlots();

const getClinicToday = (now = new Date()) => {
 const parts = new Intl.DateTimeFormat('en-US', {
 timeZone: clinicTimeZone,
 year: 'numeric',
 month: '2-digit',
 day: '2-digit',
 }).formatToParts(now);
 const get = (type: string) => Number(parts.find((part) => part.type === type)?.value);
 return new Date(Date.UTC(get('year'), get('month') - 1, get('day')));
};

const toDateValue = (date: Date) => {
 const year = date.getUTCFullYear();
 const month = String(date.getUTCMonth() + 1).padStart(2, '0');
 const day = String(date.getUTCDate()).padStart(2, '0');
 return `${year}-${month}-${day}`;
};

const isPastSlot = (date: string, time: string, now: Date) => {
 if (!date || !time) return false;
 return new Date(`${date}T${time}:00${clinicTimeZoneOffset}`).getTime() <= now.getTime();
};

export function MyBookingsPage() {
 const [bookings, setBookings] = useState<any[]>([]);
 const [loading, setLoading] = useState(true);
 const [isRescheduling, setIsRescheduling] = useState<any>(null);
 const [rescheduleData, setRescheduleData] = useState({ date: '', time: '' });
 const [busySlots, setBusySlots] = useState<string[]>([]);
 const [isSubmitting, setIsSubmitting] = useState(false);
 const [now, setNow] = useState(() => new Date());

 const fetchMyBookings = async () => {
 try {
 const response = await axios.get('/api/bookings');
 setBookings(Array.isArray(response.data) ? response.data : []);
 } catch (error) {
 setBookings([]);
 toast.error('Ошибка загрузки ваших записей');
 } finally {
 setLoading(false);
 }
 };

 useEffect(() => {
 fetchMyBookings();
 }, []);

 useEffect(() => {
 const timer = window.setInterval(() => setNow(new Date()), 30000);
 return () => window.clearInterval(timer);
 }, []);

 useEffect(() => {
 if (rescheduleData.date && rescheduleData.time && isPastSlot(rescheduleData.date, rescheduleData.time, now)) {
 setRescheduleData((prev) => ({ ...prev, time: '' }));
 }
 }, [rescheduleData.date, rescheduleData.time, now]);

 const handleCancel = async (id: string) => {
 if (!window.confirm('Вы точно хотите отменить запись?')) return;
 try {
 await axios.patch(`/api/bookings/${id}/cancel`);
 toast.success('Запись успешно отменена');
 fetchMyBookings();
 } catch (error: any) {
 toast.error(error.response?.data?.error || 'Ошибка при отмене');
 }
 };

 const startReschedule = (booking: any) => {
 setIsRescheduling(booking);
 setRescheduleData({ date: '', time: '' });
 };

 useEffect(() => {
 if (isRescheduling && rescheduleData.date) {
 const fetchBusy = async () => {
 try {
 const res = await axios.get(`/api/bookings/busy-slots?doctorId=${isRescheduling.doctorId}&date=${rescheduleData.date}`);
 setBusySlots(res.data);
 } catch (error) {
 console.error(error);
 }
 };
 fetchBusy();
 }
 }, [isRescheduling, rescheduleData.date]);

 const availableDates = useMemo(() => {
 const dates = [];
 const today = getClinicToday(now);
 for (let i = 0; dates.length < 14 && i < 28; i++) {
 const d = new Date(today);
 d.setUTCDate(today.getUTCDate() + i);
 if (d.getUTCDay() !== 0) {
 const value = toDateValue(d);
 if (!timeSlots.some((time) => !isPastSlot(value, time, now))) continue;
 dates.push({
 value,
 label: d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', timeZone: 'UTC' })
 });
 }
 }
 return dates;
 }, [now]);

 const handleRescheduleSubmit = async (e: React.FormEvent) => {
 e.preventDefault();
 if (!rescheduleData.date || !rescheduleData.time) return;
 if (isPastSlot(rescheduleData.date, rescheduleData.time, new Date())) {
 toast.error('Нельзя перенести запись на прошедшее время');
 setRescheduleData((prev) => ({ ...prev, time: '' }));
 return;
 }
 setIsSubmitting(true);
 try {
 await axios.patch(`/api/bookings/${isRescheduling._id || isRescheduling.id}/user-action`, {
 action: 'reschedule',
 date: rescheduleData.date,
 time: rescheduleData.time
 });
 toast.success('Запись перенесена');
 setIsRescheduling(null);
 fetchMyBookings();
 } catch (error: any) {
 toast.error(error.response?.data?.error || 'Ошибка при переносе');
 } finally {
 setIsSubmitting(false);
 }
 };

 const activeBookings = (Array.isArray(bookings) ? bookings : []).filter(b => b.status !== 'completed' && b.status !== 'cancelled');
 const pastBookings = (Array.isArray(bookings) ? bookings : []).filter(b => b.status === 'completed' || b.status === 'cancelled');

 const getDoctorName = (booking: any) => getDisplayDoctorName(booking);

 return (
 <div className="pt-24 pb-20 bg-background min-h-screen text-foreground font-sans">
 <div className="container mx-auto px-4 max-w-5xl">
 <div className="mb-8">
 <Button variant="ghost" asChild className="hover:bg-secondary rounded-md">
 <Link to="/profile" className="flex items-center gap-2 text-muted-foreground font-semibold text-[10px] uppercase tracking-[0.18em] hover:text-primary transition-colors">
 <ChevronLeft className="w-4 h-4" />
 Вернуться в профиль
 </Link>
 </Button>
 </div>

 <div className="flex items-center gap-6 mb-12">
 <h1 className="text-4xl font-display font-semibold text-foreground italic">Мои записи</h1>
 <div className="px-4 py-1.5 bg-card border border-border rounded-lg text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.18em] shadow-sm">
 {bookings.length} всего
 </div>
 </div>

 {loading ? (
 <div className="flex flex-col items-center justify-center py-40">
 <Loader2 className="w-12 h-12 animate-spin text-primary mb-6" />
 <p className="text-muted-foreground font-semibold uppercase tracking-[0.18em] text-xs">Загрузка записей...</p>
 </div>
 ) : (
 <div className="space-y-16">
 <section>
 <div className="flex items-center gap-3 mb-8 ml-2">
 <div className="w-10 h-10 rounded-md bg-secondary flex items-center justify-center text-primary">
 <Calendar className="w-5 h-5" /> 
 </div>
 <h2 className="text-2xl font-display font-semibold text-foreground italic">
 Предстоящие визиты
 </h2>
 </div>

 {activeBookings.length === 0 && (
 <div className="bg-card p-20 rounded-[50px] text-center border border-border shadow-2xl shadow-primary/5 text-muted-foreground font-semibold italic text-lg">
 У вас нет активных записей
 </div>
 )}
 <div className="space-y-8">
 {activeBookings.map((b, i) => (
 <motion.div 
 key={b._id || b.id}
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: i * 0.1 }}
 className="bg-card p-10 rounded-[50px] border border-border shadow-2xl shadow-primary/5 flex flex-col md:flex-row items-center gap-10 justify-between hover:shadow-primary/10 transition-all group"
 >
 <div className="flex flex-col md:flex-row items-center gap-8 text-center md:text-left w-full">
 <div className="w-24 h-24 bg-secondary rounded-[32px] flex flex-col items-center justify-center text-primary border border-border group-hover:bg-primary group-hover:text-white transition-all shadow-inner shrink-0">
 {(() => {
 const d = b.date ? new Date(b.date) : new Date();
 return (
 <>
 <span className="text-3xl font-display font-semibold leading-none mb-1">{d.getDate()}</span>
 <span className="text-[10px] font-semibold uppercase tracking-[0.2em] opacity-60">
 {d.toLocaleDateString('ru-RU', { month: 'short' }).replace('.', '')}
 </span>
 </>
 )
 })()}
 </div>
 <div className="flex-1">
 <h3 className="text-2xl font-display font-semibold text-foreground mb-1 italic leading-none">{getDoctorName(b)}</h3>
 <p className="text-[10px] text-muted-foreground font-semibold mb-4 uppercase tracking-[0.2em]">{b.serviceId || 'Консультация'}</p>
 <div className="flex flex-wrap gap-5 text-sm text-muted-foreground font-semibold">
 <span className="flex items-center gap-2 bg-secondary px-4 py-2 rounded-md border border-border/5"><Clock className="w-4 h-4 text-primary" /> {b.time}</span>
 <span className="flex items-center gap-2 bg-secondary px-4 py-2 rounded-md border border-border/5"><MapPin className="w-4 h-4 text-primary" /> Филиал "Айни"</span>
 <span className={`px-4 py-2 rounded-md text-[10px] font-semibold uppercase tracking-[0.18em] shadow-sm border ${
 b.status === 'confirmed' ? 'bg-success text-white border-success' : 
 b.status === 'pending' ? 'bg-warning/10 text-warning border-warning/20' : 'bg-muted text-muted-foreground border-transparent'
 }`}>
 {b.status === 'confirmed' ? 'Подтвержден' : b.status === 'pending' ? 'Ожидает' : b.status}
 </span>
 </div>
 </div>
 </div>
 <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto shrink-0">
 <Button onClick={() => handleCancel(b._id || b.id)} variant="outline" className="h-14 px-8 rounded-lg text-[10px] font-semibold uppercase tracking-[0.2em] border-error/10 text-error hover:bg-error hover:text-white transition-all shadow-sm">Отменить</Button>
 <Button onClick={() => startReschedule(b)} className="h-14 px-8 rounded-lg text-[10px] font-semibold uppercase tracking-[0.2em] bg-primary text-primary-foreground shadow-xl shadow-primary/20 hover:bg-primary-hover transition-all">Перенести</Button>
 </div>
 </motion.div>
 ))}
 </div>
 </section>

 <section>
 <div className="flex items-center gap-3 mb-8 ml-2">
 <div className="w-10 h-10 rounded-md bg-secondary flex items-center justify-center text-primary">
 <FileText className="w-5 h-5" /> 
 </div>
 <h2 className="text-2xl font-display font-semibold text-foreground italic">История посещений</h2>
 </div>
 <div className="bg-card rounded-[50px] border border-border overflow-hidden shadow-2xl shadow-primary/5">
 {pastBookings.length === 0 && <div className="text-center py-20 text-muted-foreground font-semibold italic text-lg">История пуста</div>}
 <div className="divide-y divide-border/5">
 {pastBookings.map((b) => (
 <div key={b._id || b.id} className="p-8 flex items-center justify-between hover:bg-secondary transition-all group">
 <div className="flex items-center gap-8">
 <div className="w-14 h-14 rounded-lg bg-secondary flex items-center justify-center text-primary/40 group-hover:bg-primary group-hover:text-white transition-all shadow-inner">
 <FileText className="w-6 h-6" />
 </div>
 <div>
 <div className="font-semibold text-foreground group-hover:italic transition-all text-xl">{b.serviceId || 'Прием специалиста'}</div>
 <div className="text-[10px] text-muted-foreground font-semibold uppercase tracking-[0.18em] mt-2">
 <span className="text-muted-foreground">
 {b.date ? new Date(b.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' }) : b.date} • {b.time}
 </span>
 <span className="mx-3 opacity-20">•</span>
 <span className="text-muted-foreground">{getDoctorName(b)}</span>
 <span className="mx-3 opacity-20">•</span>
 <span className={b.status === 'completed' ? 'text-success' : 'text-error'}>{b.status === 'completed' ? 'Завершено' : 'Отменено'}</span>
 </div>
 </div>
 </div>
 <div className="w-10 h-10 rounded-md border border-border/5 flex items-center justify-center text-muted-foreground/20 group-hover:text-primary group-hover:border-primary/20 transition-all">
 <ChevronRight className="w-6 h-6" />
 </div>
 </div>
 ))}
 </div>
 </div>
 </section>
 </div>
 )}

 {/* Перенос записи */}
 <AnimatePresence>
 {isRescheduling && (
 <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
 <motion.div 
 initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
 onClick={() => setIsRescheduling(null)}
 className="absolute inset-0 bg-primary/20 backdrop-blur-xl"
 />
 <motion.div 
 initial={{ opacity: 0, scale: 0.95, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 30 }}
 className="relative w-full max-w-xl bg-card rounded-md shadow-2xl p-10 md:p-14 overflow-hidden border border-white/50"
 >
 <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full -mr-24 -mt-24 blur-3xl" />
 
 <div className="flex items-center justify-between mb-10 relative z-10">
 <div>
 <h3 className="text-3xl font-display font-semibold text-primary italic leading-none mb-2">Перенос записи</h3>
 <p className="text-[10px] text-primary/40 font-semibold uppercase tracking-[0.18em]">Выберите новое время приема</p>
 </div>
 <button onClick={() => setIsRescheduling(null)} className="w-12 h-12 flex items-center justify-center hover:bg-primary/10 rounded-lg transition-all text-primary/30 hover:text-primary">
 <X className="w-6 h-6" />
 </button>
 </div>

 <form onSubmit={handleRescheduleSubmit} className="space-y-10 relative z-10">
 <div>
 <label className="text-[10px] font-semibold text-primary/40 uppercase tracking-[0.2em] mb-4 block ml-2">1. Выберите дату</label>
 <div className="grid grid-cols-3 gap-3">
 {availableDates.map(d => (
 <button 
 key={d.value} type="button" onClick={() => setRescheduleData({...rescheduleData, date: d.value, time: ''})}
 className={`h-14 rounded-lg text-sm font-semibold transition-all border-2 shadow-sm ${rescheduleData.date === d.value ? 'border-primary bg-primary text-primary-foreground shadow-primary/20' : 'border-primary/5 bg-primary/5 text-primary/60 hover:border-primary/20'}`}
 >
 {d.label}
 </button>
 ))}
 </div>
 </div>

 {rescheduleData.date && (
 <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
 <label className="text-[10px] font-semibold text-primary/40 uppercase tracking-[0.2em] mb-4 block ml-2">2. Свободное время</label>
 <div className="grid grid-cols-4 gap-3">
 {timeSlots.map(t => {
 const isBusy = busySlots.includes(t);
 const isPast = isPastSlot(rescheduleData.date, t, now);
 const isDisabled = isBusy || isPast;
 return (
 <button 
 key={t} type="button" 
 disabled={isDisabled}
 onClick={() => setRescheduleData({...rescheduleData, time: t})}
 className={`h-12 rounded-md text-xs font-semibold transition-all border-2 shadow-sm ${
 rescheduleData.time === t ? 'border-primary bg-primary text-primary-foreground shadow-primary/20' : 
 isDisabled ? 'opacity-20 grayscale cursor-not-allowed border-primary/5 bg-primary/5 translate-y-0.5' : 'border-primary/5 bg-primary/5 text-primary/60 hover:border-primary/20 hover:-translate-y-0.5'
 }`}
 >
 {t}
 </button>
 );
 })}
 </div>
 </motion.div>
 )}

 <div className="pt-6 flex gap-4">
 <Button variant="ghost" type="button" onClick={() => setIsRescheduling(null)} className="flex-1 h-16 rounded-[24px] text-primary/40 font-semibold hover:bg-primary/5 hover:text-primary">Отмена</Button>
 <Button disabled={!rescheduleData.time || isSubmitting} type="submit" className="flex-1 h-16 rounded-[24px] bg-primary text-primary-foreground flex items-center justify-center gap-3 font-semibold shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
 {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : <><CheckCircle2 className="w-5 h-5" /> Подтвердить</>}
 </Button>
 </div>
 </form>
 </motion.div>
 </div>
 )}
 </AnimatePresence>
 </div>
 </div>
 );
}

