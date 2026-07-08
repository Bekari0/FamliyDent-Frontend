import { motion, AnimatePresence } from 'motion/react';
import React, { useState, useEffect, useMemo } from 'react';
import { X, Calendar, Phone as PhoneIcon, User, MessageSquare, Send, Clock, UserCheck, AlertCircle, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import axios from 'axios';
import styles from './BookingModal.module.css';

interface Doctor {
 _id: string;
 name: string;
}

interface BookingModalProps {
 isOpen: boolean;
 onClose: () => void;
 doctors?: Doctor[];
 isLoadingDoctors?: boolean;
 defaultDoctorId?: string;
}

interface FormErrors {
 name?: string;
 phone?: string;
 date?: string;
}

const API_URL = '/api';

const DEFAULT_DOCTOR = { _id: 'any', name: 'Любой свободный врач' };
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

import { FALLBACK_DOCTORS } from '@/fallbackData';

export function BookingModal({ 
 isOpen, 
 onClose, 
 doctors: initialDoctors,
 isLoadingDoctors: initialLoading = false,
 defaultDoctorId = 'any'
}: BookingModalProps) {
 const [isSubmitting, setIsSubmitting] = useState(false);
 const [backendDoctors, setBackendDoctors] = useState<Doctor[]>([]);
 const [isFetching, setIsFetching] = useState(false);
 const [now, setNow] = useState(() => new Date());
 
 const [formData, setFormData] = useState({
 name: '',
 phone: '',
 service: 'Консультация',
 doctor: defaultDoctorId,
 date: '',
 time: '',
 comment: ''
 });
 const [errors, setErrors] = useState<FormErrors>({});

 useEffect(() => {
 const timer = window.setInterval(() => setNow(new Date()), 30000);
 return () => window.clearInterval(timer);
 }, []);

 // Загружаем врачей, если список не передан извне
 useEffect(() => {
 if (isOpen && !initialDoctors && backendDoctors.length === 0) {
 const fetchDoctors = async () => {
 try {
 setIsFetching(true);
 const response = await axios.get(`${API_URL}/doctors`);
 setBackendDoctors(response.data);
 } catch (err) {
 console.error('Ошибка загрузки врачей в модалке, используем резервные данные:', err);
 setBackendDoctors(FALLBACK_DOCTORS.map(d => ({ _id: d._id, name: d.name })));
 } finally {
 setIsFetching(false);
 }
 };
 fetchDoctors();
 }
 }, [isOpen, initialDoctors, backendDoctors.length]);

 const allDoctors = useMemo(() => {
 const list = initialDoctors || backendDoctors;
 const hasAny = list.some(d => d._id === 'any');
 if (hasAny) return list;
 return [DEFAULT_DOCTOR, ...list];
 }, [initialDoctors, backendDoctors]);

 const isLoading = initialLoading || isFetching;

 // Формируем доступные даты на ближайшие дни без воскресений
 const availableDates = useMemo(() => {
 const dates = [];
 const today = getClinicToday(now);
 
 for (let i = 0; dates.length < 14 && i < 28; i++) {
 const date = new Date(today);
 date.setUTCDate(today.getUTCDate() + i);
 
 // 0 — воскресенье
 if (date.getUTCDay() !== 0) {
 const value = toDateValue(date);
 if (!timeSlots.some((time) => !isPastSlot(value, time, now))) continue;
 dates.push({
 value,
 label: date.toLocaleDateString('ru-RU', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC' }),
 full: date.toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' })
 });
 }
 }
 return dates;
 }, [now]);

 const availableTimeSlots = useMemo(
 () => timeSlots.filter((time) => !isPastSlot(formData.date, time, now)),
 [formData.date, now],
 );

 // Синхронизируем выбранного врача при открытии модального окна
 useEffect(() => {
 if (isOpen) {
 setFormData(prev => ({
 ...prev,
 doctor: defaultDoctorId || 'any',
 name: '',
 phone: '',
 date: availableDates[0]?.value || '',
 time: availableDates[0]?.value
 ? timeSlots.find((time) => !isPastSlot(availableDates[0].value, time, new Date())) || ''
 : '',
 comment: ''
 }));
 setErrors({});
 document.body.style.overflow = 'hidden';
 } else {
 document.body.style.overflow = 'unset';
 }
 return () => {
 document.body.style.overflow = 'unset';
 };
 }, [isOpen, defaultDoctorId]);

 useEffect(() => {
 if (!isOpen || !formData.date) return;
 if (formData.time && availableTimeSlots.includes(formData.time)) return;
 const nextTime = availableTimeSlots[0] || '';
 if (formData.time === nextTime) return;
 setFormData((prev) => ({ ...prev, time: nextTime }));
 }, [isOpen, formData.date, formData.time, availableTimeSlots]);

 const validate = () => {
 const newErrors: FormErrors = {};
 const nameRegex = /^[a-zA-Zа-яА-ЯёЁ\s-]+$/;

 if (formData.name.trim().length < 2) {
 newErrors.name = 'Имя должно содержать минимум 2 символа';
 } else if (!nameRegex.test(formData.name)) {
 newErrors.name = 'Имя должно содержать только буквы';
 }
 
 const phoneRegex = /^\+?[\d\s-]{10,}$/;
 if (!phoneRegex.test(formData.phone)) {
 newErrors.phone = 'Введите корректный номер телефона';
 }

 if (!formData.date) {
 newErrors.date = 'Выберите дату визита';
 }

 if (!formData.time || isPastSlot(formData.date, formData.time, new Date())) {
 newErrors.date = 'Выберите доступное время визита';
 }

 setErrors(newErrors);
 return Object.keys(newErrors).length === 0;
 };

 const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
 let value = e.target.value;
 if (!value.startsWith('+992') && value.length > 0) {
 if (value.startsWith('992')) value = '+' + value;
 else value = '+992 ' + value;
 }
 setFormData({ ...formData, phone: value });
 };

 const handleSubmit = async (e: React.FormEvent) => {
 e.preventDefault();
 if (!validate()) return;

 setIsSubmitting(true);
 try {
 // Проверяем авторизацию пользователя
 const token = document.cookie.split('; ').find(row => row.startsWith('token='));
 if (!token) {
 toast.error('Пожалуйста, войдите в аккаунт, чтобы записаться');
 return;
 }

 await axios.post(`${API_URL}/bookings`, {
 doctorId: formData.doctor === 'any' ? allDoctors[1]?._id : formData.doctor,
 serviceId: 'general',
 date: formData.date,
 time: formData.time,
 comment: formData.comment
 });

 const doctorName = allDoctors.find(d => d._id === formData.doctor)?.name || 'врачу';
 toast.success('Заявка принята!', {
 description: `Мы свяжемся с вами для подтверждения записи к ${doctorName}.`,
 });
 onClose();
 } catch (err: any) {
 toast.error(err.response?.data?.error || 'Ошибка при создании записи');
 } finally {
 setIsSubmitting(false);
 }
 };

 return (
 <AnimatePresence>
 {isOpen && (
 <div className={styles.overlay}>
 <motion.div
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 onClick={onClose}
 className={styles.backdrop}
 />

 <motion.div
 initial={{ opacity: 0, scale: 0.95, y: 20 }}
 animate={{ opacity: 1, scale: 1, y: 0 }}
 exit={{ opacity: 0, scale: 0.95, y: 20 }}
 onClick={(e) => e.stopPropagation()}
 className={styles.modal}
 >
 {/* Левая часть */}
 <div className={styles.leftSide}>
 <div className={styles.blob1} />
 <div className={styles.blob2} />
 
 <div className={styles.leftContent}>
 <div className={styles.iconBox}>
 <Calendar className="w-6 h-6 text-primary-foreground" />
 </div>
 <h2 className={styles.leftTitle}>Ваш путь к <br/>идеальной <br/><span className="text-accent underline decoration-2 underline-offset-4">улыбке</span></h2>
 <p className={styles.leftDesc}>
 Профессиональная диагностика и забота о вашем здоровье в комфортной атмосфере.
 </p>
 </div>

 <div className={styles.statsList}>
 {[
 { icon: Clock, label: 'Ответ специалиста', val: '~15 минут' },
 { icon: UserCheck, label: 'Врачи клиники', val: 'Эксперты' }
 ].map((item, i) => (
 <div key={i} className={styles.statItem}>
 <div className={styles.statIcon}>
 <item.icon className="w-4 h-4" />
 </div>
 <div>
 <div className={styles.statLabel}>{item.label}</div>
 <div className={styles.statValue}>{item.val}</div>
 </div>
 </div>
 ))}
 </div>
 </div>

 {/* Форма */}
 <div className={cn(styles.formSide, "no-scrollbar")}>
 <div className={styles.header}>
 <div>
 <h2 className={styles.headerTitle}>Запись на прием</h2>
 <div className={styles.titleUnderline} />
 </div>
 <button 
 onClick={onClose}
 className={styles.closeBtn}
 >
 <X className="w-4 h-4 md:w-5 md:h-5" />
 </button>
 </div>

 <form onSubmit={handleSubmit} className={styles.form}>
 <div className={styles.grid}>
 <div className={styles.inputGroup}>
 <label className={styles.label}>
 <User className="w-3 h-3 text-primary" />
 Ваше имя
 </label>
 <Input 
 value={formData.name}
 onChange={(e) => setFormData({ ...formData, name: e.target.value })}
 placeholder="Алишер Ахмедов" 
 className={cn(
 styles.input,
 errors.name ? "ring-2 ring-destructive/50" : "focus:ring-2 focus:ring-primary/20"
 )}
 />
 {errors.name && (
 <span className={styles.errorText}>
 <AlertCircle className="w-2.5 h-2.5" /> {errors.name}
 </span>
 )}
 </div>

 <div className={styles.inputGroup}>
 <label className={styles.label}>
 <PhoneIcon className="w-3 h-3 text-primary" />
 Телефон
 </label>
 <Input 
 type="tel" 
 value={formData.phone}
 onChange={handlePhoneChange}
 placeholder="+992 00 000 0000" 
 className={cn(
 styles.input,
 errors.phone ? "ring-2 ring-destructive/50" : "focus:ring-2 focus:ring-primary/20"
 )}
 />
 {errors.phone && (
 <span className={styles.errorText}>
 <AlertCircle className="w-2.5 h-2.5" /> {errors.phone}
 </span>
 )}
 </div>
 </div>

 <div className={styles.grid}>
 <div className={styles.inputGroup}>
 <label className={styles.label}>
 <Activity className="w-3 h-3 text-primary" />
 Услуга
 </label>
 <div className={styles.selectWrapper}>
 <select 
 value={formData.service}
 onChange={(e) => setFormData({ ...formData, service: e.target.value })}
 className={styles.select}
 >
 <option>Консультация</option>
 <option>Лечение кариеса</option>
 <option>Профессиональная гигиена</option>
 <option>Имплантация</option>
 <option>Ортодонтия</option>
 <option>Протезирование</option>
 </select>
 <div className={styles.selectIcon}>
 <X className="w-3 h-3 rotate-45" />
 </div>
 </div>
 </div>

 <div className={styles.inputGroup}>
 <label className={styles.label}>
 <UserCheck className="w-3 h-3 text-primary" />
 Специалист
 </label>
 <div className={styles.selectWrapper}>
 <select 
 value={formData.doctor}
 onChange={(e) => setFormData({ ...formData, doctor: e.target.value })}
 className={styles.select}
 disabled={isLoading}
 >
 {isLoading ? (
 <option>Загрузка врачей...</option>
 ) : (
 allDoctors.map(doc => (
 <option key={doc._id} value={doc._id}>{doc.name}</option>
 ))
 )}
 </select>
 <div className={styles.selectIcon}>
 <X className="w-3 h-3 rotate-45" />
 </div>
 </div>
 </div>
 </div>

 <div className={styles.grid}>
 <div className={styles.inputGroup}>
 <label className={styles.label}>
 <Calendar className="w-3 h-3 text-primary" />
 Желаемая дата
 </label>
 <div className={styles.selectWrapper}>
 <select 
 value={formData.date}
 onChange={(e) => {
 const nextDate = e.target.value;
 const nextTime = timeSlots.find((time) => !isPastSlot(nextDate, time, new Date())) || '';
 setFormData({ ...formData, date: nextDate, time: nextTime });
 }}
 className={styles.select}
 >
 {availableDates.map(date => (
 <option key={date.value} value={date.value}>
 {date.label}
 </option>
 ))}
 </select>
 <div className={styles.selectIcon}>
 <X className="w-3 h-3 rotate-45" />
 </div>
 </div>
 {errors.date && (
 <span className={styles.errorText}>
 <AlertCircle className="w-2.5 h-2.5" /> {errors.date}
 </span>
 )}
 </div>

 <div className={styles.inputGroup}>
 <label className={styles.label}>
 <Clock className="w-3 h-3 text-primary" />
 Время
 </label>
 <div className={styles.selectWrapper}>
 <select 
 value={formData.time}
 onChange={(e) => setFormData({ ...formData, time: e.target.value })}
 className={styles.select}
 >
 {availableTimeSlots.map(t => (
 <option key={t} value={t}>{t}</option>
 ))}
 </select>
 <div className={styles.selectIcon}>
 <X className="w-3 h-3 rotate-45" />
 </div>
 </div>
 </div>
 </div>

 <div className={styles.inputGroup}>
 <label className={styles.label}>
 <MessageSquare className="w-3 h-3 text-primary" />
 Комментарий
 </label>
 <Textarea 
 value={formData.comment}
 onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
 placeholder="Дополнительные пожелания" 
 className={styles.textarea}
 />
 </div>

 <div className="pt-2">
 <Button 
 type="submit" 
 disabled={isSubmitting || isLoading}
 className={styles.submitBtn}
 >
 <div className={styles.submitOverlay} />
 {isSubmitting ? (
 <div className={styles.submitContent}>
 <div className={styles.loadingSpinner} />
 <span>Отправка...</span>
 </div>
 ) : (
 <div className={styles.submitContent}>
 <span>Записаться</span>
 <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
 </div>
 )}
 </Button>
 </div>
 </form>
 </div>
 </motion.div>
 </div>
 )}
 </AnimatePresence>
 );
}

