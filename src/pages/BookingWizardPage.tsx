import React, { useEffect, useMemo, useRef, useState } from 'react';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { Check, Calendar as CalendarIcon, Clock, User, ChevronRight, Loader2, Stethoscope } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate, useSearchParams } from 'react-router-dom';

const timeSlots = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];

export function BookingWizardPage() {
 const navigate = useNavigate();
 const [searchParams] = useSearchParams();
 const prefilledDoctorId = searchParams.get('doctorId');
 const serviceRef = useRef<HTMLDivElement>(null);
 const doctorRef = useRef<HTMLDivElement>(null);
 const dateRef = useRef<HTMLDivElement>(null);
 const confirmRef = useRef<HTMLDivElement>(null);

 const [services, setServices] = useState<any[]>([]);
 const [doctors, setDoctors] = useState<any[]>([]);
 const [loading, setLoading] = useState(true);
 const [isSubmitting, setIsSubmitting] = useState(false);
 const [busySlots, setBusySlots] = useState<string[]>([]);

 const [data, setData] = useState({
 serviceId: '',
 serviceName: '',
 doctorId: '',
 doctorName: '',
 date: '',
 time: '',
 });

 const availableDates = useMemo(() => {
 const dates = [];
 const today = new Date();
 for (let i = 0; i < 10; i++) {
 const date = new Date(today);
 date.setDate(today.getDate() + i);
 if (date.getDay() !== 0) {
 dates.push({
 value: date.toISOString().split('T')[0],
 label: date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' }),
 weekday: date.toLocaleDateString('ru-RU', { weekday: 'short' })
 });
 }
 }
 return dates;
 }, []);

 useEffect(() => {
 const fetchData = async () => {
 try {
 const [servicesResponse, doctorsResponse] = await Promise.all([
 axios.get('/api/services'),
 axios.get('/api/doctors')
 ]);
 const servicesData = Array.isArray(servicesResponse.data) ? servicesResponse.data : [];
 const doctorsData = Array.isArray(doctorsResponse.data) ? doctorsResponse.data : [];

 setServices(servicesData);
 setDoctors(doctorsData);

 if (prefilledDoctorId) {
 const doctor = doctorsData.find((item: any) => item._id === prefilledDoctorId || item.id === prefilledDoctorId);
 if (doctor) {
 setData((prev) => ({
 ...prev,
 doctorId: doctor._id || doctor.id,
 doctorName: doctor.name
 }));
 setTimeout(() => serviceRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
 }
 }
 } catch (error) {
 toast.error('Ошибка загрузки данных для записи');
 } finally {
 setLoading(false);
 }
 };
 fetchData();
 }, [prefilledDoctorId]);

 useEffect(() => {
 if (!data.doctorId || !data.date) return;
 const fetchBusySlots = async () => {
 try {
 const response = await axios.get(`/api/bookings/busy-slots?doctorId=${data.doctorId}&date=${data.date}`);
 setBusySlots(Array.isArray(response.data) ? response.data : []);
 } catch {
 setBusySlots([]);
 }
 };
 fetchBusySlots();
 }, [data.doctorId, data.date]);

 const selectService = (serviceName: string) => {
 setData((prev) => ({ ...prev, serviceId: serviceName, serviceName }));
 setTimeout(() => doctorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
 };

 const selectDoctor = (doctor: any) => {
 setData((prev) => ({ ...prev, doctorId: doctor._id || doctor.id, doctorName: doctor.name }));
 setTimeout(() => dateRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
 };

 const selectDate = (date: string) => {
 setData((prev) => ({ ...prev, date, time: '' }));
 setTimeout(() => dateRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 80);
 };

 const selectTime = (time: string) => {
 setData((prev) => ({ ...prev, time }));
 setTimeout(() => confirmRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 80);
 };

 const handleFinish = async () => {
 if (!data.doctorId || !data.serviceId || !data.date || !data.time) {
 toast.error('Заполните все шаги записи');
 return;
 }

 setIsSubmitting(true);
 try {
 await axios.post('/api/bookings', {
 doctorId: data.doctorId,
 serviceId: data.serviceId,
 date: data.date,
 time: data.time
 });
 toast.success('Запись успешно создана');
 navigate('/profile/bookings');
 } catch (error: any) {
 toast.error(error.response?.data?.error || 'Ошибка при создании записи');
 } finally {
 setIsSubmitting(false);
 }
 };

 const progress = [data.serviceId, data.doctorId, data.date && data.time].filter(Boolean).length;

 if (loading) {
 return (
 <div className="min-h-[70vh] flex items-center justify-center bg-background">
 <div className="text-center">
 <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto mb-4" />
 <p className="text-text-secondary font-medium">Подготовка системы записи...</p>
 </div>
 </div>
 );
 }

 return (
 <div className="pt-24 pb-14 bg-background min-h-screen text-foreground">
 <div className="container mx-auto px-4 max-w-6xl">
 <div className="grid lg:grid-cols-[1fr_320px] gap-6 items-start">
 <main className="space-y-5">
 <header className="bg-white rounded-xl border border-border shadow-sm p-5">
 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
 <div>
 <h1 className="text-3xl font-display font-bold text-foreground">Онлайн запись</h1>
 <p className="text-text-secondary mt-1">Выберите услугу, врача и удобное время приема.</p>
 </div>
 <div className="flex gap-2">
 {[1, 2, 3].map((step) => (
 <div key={step} className={`h-2 w-14 rounded-full ${step <= progress ? 'bg-primary' : 'bg-secondary'}`} />
 ))}
 </div>
 </div>
 </header>

 <StepCard ref={serviceRef} icon={Stethoscope} title="1. Услуга" done={!!data.serviceId}>
 {data.serviceId ? (
 <SelectedRow label="Выбрано" value={data.serviceName} onReset={() => setData({ ...data, serviceId: '', serviceName: '' })} />
 ) : (
 <div className="space-y-5">
 {services.map((category) => (
 <section key={category._id || category.category}>
 <h3 className="text-xs font-black text-text-secondary uppercase tracking-widest mb-3">{category.category || 'Услуги'}</h3>
 <div className="grid sm:grid-cols-2 gap-3">
 {(category.services || []).map((serviceName: string) => (
 <button key={serviceName} onClick={() => selectService(serviceName)} className="p-4 rounded-xl border border-border bg-white text-left hover:border-primary hover:bg-primary/5 transition-all">
 <div className="font-bold text-foreground">{serviceName}</div>
 <div className="text-xs text-text-secondary mt-1">Консультация и подбор плана лечения</div>
 </button>
 ))}
 </div>
 </section>
 ))}
 </div>
 )}
 </StepCard>

 <StepCard ref={doctorRef} icon={User} title="2. Врач" done={!!data.doctorId} muted={!data.serviceId}>
 {!data.serviceId ? (
 <p className="text-text-secondary">Сначала выберите услугу.</p>
 ) : data.doctorId ? (
 <SelectedRow label="Выбран врач" value={data.doctorName} onReset={() => setData({ ...data, doctorId: '', doctorName: '', date: '', time: '' })} />
 ) : (
 <div className="grid sm:grid-cols-2 gap-3">
 {doctors.map((doctor) => (
 <button key={doctor._id || doctor.id} onClick={() => selectDoctor(doctor)} className="flex items-center gap-4 p-4 rounded-xl border border-border bg-white text-left hover:border-primary hover:bg-primary/5 transition-all">
 <img src={doctor.image} alt={doctor.name} className="w-14 h-14 rounded-xl object-cover bg-secondary" />
 <div>
 <div className="font-bold text-foreground">{doctor.name}</div>
 <div className="text-xs text-primary font-bold uppercase tracking-wider">{doctor.specialty}</div>
 </div>
 </button>
 ))}
 </div>
 )}
 </StepCard>

 <StepCard ref={dateRef} icon={CalendarIcon} title="3. Дата и время" done={!!data.date && !!data.time} muted={!data.doctorId}>
 {!data.doctorId ? (
 <p className="text-text-secondary">Выберите врача, чтобы увидеть свободные слоты.</p>
 ) : (
 <div className="grid md:grid-cols-2 gap-5">
 <div>
 <h3 className="text-xs font-black text-text-secondary uppercase tracking-widest mb-3">Доступные даты</h3>
 <div className="grid grid-cols-3 gap-2">
 {availableDates.map((date) => (
 <button key={date.value} onClick={() => selectDate(date.value)} className={`h-14 rounded-xl border font-bold text-sm transition-all ${data.date === date.value ? 'bg-primary text-white border-primary' : 'bg-white border-border text-foreground hover:border-primary'}`}>
 <span className="block leading-none">{date.label}</span>
 <span className="block text-[10px] opacity-70 mt-1">{date.weekday}</span>
 </button>
 ))}
 </div>
 </div>
 <div>
 <h3 className="text-xs font-black text-text-secondary uppercase tracking-widest mb-3">Свободное время</h3>
 <div className="grid grid-cols-3 gap-2">
 {timeSlots.map((time) => {
 const isBusy = busySlots.includes(time);
 return (
 <button key={time} disabled={isBusy} onClick={() => data.date ? selectTime(time) : toast.error('Сначала выберите дату')} className={`h-14 rounded-xl border font-bold text-sm transition-all ${data.time === time ? 'bg-primary text-white border-primary' : isBusy ? 'bg-secondary text-text-secondary/40 border-border cursor-not-allowed' : 'bg-white border-border text-foreground hover:border-primary'}`}>
 <Clock className="w-4 h-4 mx-auto mb-1" />
 {time}
 </button>
 );
 })}
 </div>
 </div>
 </div>
 )}
 </StepCard>
 </main>

 <aside ref={confirmRef} className="lg:sticky lg:top-24 bg-white rounded-xl border border-border shadow-md p-5">
 <h2 className="text-xl font-bold text-foreground mb-4">Подтверждение</h2>
 <div className="space-y-3 text-sm">
 <SummaryRow label="Услуга" value={data.serviceName || 'Не выбрана'} />
 <SummaryRow label="Врач" value={data.doctorName || 'Не выбран'} />
 <SummaryRow label="Дата" value={data.date || 'Не выбрана'} />
 <SummaryRow label="Время" value={data.time || 'Не выбрано'} />
 </div>
 <Button disabled={isSubmitting || !data.doctorId || !data.serviceId || !data.date || !data.time} onClick={handleFinish} className="mt-5 w-full h-12 rounded-xl bg-primary text-white font-bold hover:bg-primary-hover">
 {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : (
 <>
 <Check className="w-5 h-5 mr-2" />
 Подтвердить запись
 </>
 )}
 </Button>
 </aside>
 </div>
 </div>
 </div>
 );
}

const StepCard = React.forwardRef<HTMLDivElement, any>(({ icon: Icon, title, done, muted, children }, ref) => (
 <section ref={ref} className={`bg-white rounded-xl border shadow-sm p-5 scroll-mt-24 ${muted ? 'border-border opacity-75' : done ? 'border-primary/30' : 'border-border'}`}>
 <div className="flex items-center gap-3 mb-4">
 <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${done ? 'bg-primary text-white' : 'bg-secondary text-primary'}`}>
 <Icon className="w-5 h-5" />
 </div>
 <h2 className="text-xl font-bold text-foreground">{title}</h2>
 </div>
 {children}
 </section>
));

function SelectedRow({ label, value, onReset }: { label: string; value: string; onReset: () => void }) {
 return (
 <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 flex items-center justify-between gap-4">
 <div>
 <div className="text-xs text-primary font-bold uppercase tracking-widest mb-1">{label}</div>
 <div className="text-lg font-bold text-foreground">{value}</div>
 </div>
 <Button variant="outline" onClick={onReset} className="rounded-xl border-border">
 Сменить
 <ChevronRight className="w-4 h-4 ml-1" />
 </Button>
 </div>
 );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
 return (
 <div className="flex justify-between gap-4 py-2 border-b border-border last:border-0">
 <span className="text-text-secondary">{label}</span>
 <span className="font-bold text-foreground text-right">{value}</span>
 </div>
 );
}

