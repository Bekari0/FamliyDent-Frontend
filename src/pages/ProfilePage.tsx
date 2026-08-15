import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import {
 User,
 Camera,
 ChevronRight,
 Save,
 Edit2,
 X,
 CalendarDays,
 Shield,
 LogOut,
 Loader2,
 Bell,
 MailCheck,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

const notificationItems = [
 { key: 'email', title: 'Email-уведомления', desc: 'Получать важные сообщения на почту' },
 { key: 'bookingUpdates', title: 'Уведомления о записи', desc: 'Подтверждения и изменения записей' },
 { key: 'appointmentReminders', title: 'Напоминания о приеме', desc: 'Напоминания перед визитом' },
 { key: 'cancellations', title: 'Отмена и перенос', desc: 'Сообщения об отмене или изменении приема' },
 { key: 'news', title: 'Новости и акции', desc: 'Полезные новости клиники' },
] as const;

const defaultNotifications = {
 email: true,
 bookingUpdates: true,
 appointmentReminders: true,
 cancellations: true,
 news: false,
};

export function ProfilePage() {
 const { user, logout, isAdmin, refreshUser } = useAuth();
 const fileInputRef = useRef<HTMLInputElement>(null);
 const [isEditing, setIsEditing] = useState(false);
 const [loading, setLoading] = useState(false);
 const [notifications, setNotifications] = useState(defaultNotifications);
 const [savingNotifications, setSavingNotifications] = useState(false);
 const [emailCode, setEmailCode] = useState('');
 const [emailValue, setEmailValue] = useState(user?.email || '');
 const [sendingCode, setSendingCode] = useState(false);
 const [verifyingCode, setVerifyingCode] = useState(false);
 const [resendLeft, setResendLeft] = useState(0);

 const [formData, setFormData] = useState({
 displayName: user?.displayName || '',
 phoneNumber: user?.phoneNumber || '',
 gender: user?.gender || 'other',
 birthDate: user?.birthDate || '',
 });

 useEffect(() => {
 setEmailValue(user?.email || '');
 setFormData({
 displayName: user?.displayName || '',
 phoneNumber: user?.phoneNumber || '',
 gender: user?.gender || 'other',
 birthDate: user?.birthDate || '',
 });
 }, [user]);

 useEffect(() => {
 const fetchNotifications = async () => {
 try {
 const response = await axios.get('/api/users/notification-settings');
 setNotifications({ ...defaultNotifications, ...response.data });
 } catch {
 setNotifications(defaultNotifications);
 }
 };
 if (user) fetchNotifications();
 }, [user]);

 useEffect(() => {
 if (resendLeft <= 0) return;
 const timer = window.setInterval(() => setResendLeft((value) => Math.max(0, value - 1)), 1000);
 return () => window.clearInterval(timer);
 }, [resendLeft]);

 const handleUpdateProfile = async (event: React.FormEvent) => {
 event.preventDefault();
 setLoading(true);
 try {
 await axios.patch('/api/users/me', formData);
 toast.success('Профиль обновлен');
 setIsEditing(false);
 await refreshUser();
 } catch (error: any) {
 toast.error(error.response?.data?.error || 'Ошибка обновления профиля');
 } finally {
 setLoading(false);
 }
 };

 const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
 const file = event.target.files?.[0];
 if (!file) return;

 const data = new FormData();
 data.append('file', file);
 try {
 const response = await axios.post('/api/upload', data, {
 headers: { 'Content-Type': 'multipart/form-data' },
 });
 await axios.patch('/api/users/me', { photoURL: response.data.url });
 toast.success('Фото обновлено');
 await refreshUser();
 } catch (error: any) {
 toast.error(error.response?.data?.error || 'Ошибка обновления фото');
 }
 };

 const saveNotifications = async () => {
 setSavingNotifications(true);
 try {
 const response = await axios.put('/api/users/notification-settings', notifications);
 setNotifications({ ...defaultNotifications, ...response.data });
 toast.success('Настройки сохранены');
 } catch (error: any) {
 toast.error(error.response?.data?.error || 'Ошибка сохранения настроек');
 } finally {
 setSavingNotifications(false);
 }
 };

 const sendEmailCode = async () => {
 setSendingCode(true);
 try {
 await axios.post('/api/auth/send-email-code', { email: emailValue });
 setResendLeft(60);
 toast.success('Код отправлен на email');
 } catch (error: any) {
 toast.error(error.response?.data?.error || 'Не удалось отправить код');
 } finally {
 setSendingCode(false);
 }
 };

 const verifyEmailCode = async () => {
 if (!emailCode.trim()) {
 toast.error('Введите код');
 return;
 }
 setVerifyingCode(true);
 try {
 await axios.post('/api/auth/verify-email-code', { code: emailCode.trim() });
 toast.success('Email подтвержден');
 setEmailCode('');
 await refreshUser();
 } catch (error: any) {
 toast.error(error.response?.data?.error || 'Ошибка проверки кода');
 } finally {
 setVerifyingCode(false);
 }
 };

 if (!user) {
 return (
 <div className="pt-40 flex items-center justify-center">
 <Loader2 className="w-10 h-10 animate-spin text-primary" />
 </div>
 );
 }

 return (
 <div className="min-h-screen bg-white pb-16 pt-24 sm:pt-28">
 <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-8 xl:px-10">
 <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
 <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-primary transition-colors text-sm font-medium px-4 py-2 rounded-xl hover:bg-slate-50">
 <ChevronRight className="w-4 h-4 rotate-180" />
 Вернуться на главную
 </Link>
 <div className="flex flex-wrap gap-3">
 {isAdmin && (
 <Link to="/admin" className="h-11 px-5 rounded-xl border border-primary/20 text-primary font-bold text-sm hover:bg-primary/5 transition-all flex items-center">
 Админ-панель
 </Link>
 )}
 <button onClick={() => setIsEditing(!isEditing)} className="h-11 px-5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm flex items-center gap-2 transition-all">
 {isEditing ? <><X className="w-4 h-4" /> Отмена</> : <><Edit2 className="w-4 h-4" /> Редактировать</>}
 </button>
 </div>
 </div>

 <div className="grid gap-6 lg:grid-cols-[minmax(360px,0.85fr)_minmax(0,1.75fr)] xl:gap-8">
 <section className="min-w-0 bg-white rounded-xl shadow-md border border-slate-100 p-6 sm:p-8 lg:p-10">
 <div className="relative w-28 h-28 mx-auto mb-6 cursor-pointer group" onClick={() => fileInputRef.current?.click()}>
 {user.photoURL ? (
 <img src={user.photoURL} alt={user.displayName} className="w-full h-full rounded-2xl object-cover border-4 border-white shadow-lg" />
 ) : (
 <div className="w-full h-full rounded-2xl bg-slate-100 flex items-center justify-center text-primary text-4xl font-bold border-4 border-white shadow-lg">
 {user.displayName?.[0]?.toUpperCase() || 'F'}
 </div>
 )}
 <input type="file" hidden ref={fileInputRef} accept="image/jpeg,image/png,image/webp" onChange={handlePhotoUpload} />
 <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-xl bg-white shadow-md border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-primary">
 <Camera className="w-5 h-5" />
 </div>
 </div>

 <div className="text-center mb-8">
 <h1 className="text-3xl font-bold text-slate-900 mb-2">{user.displayName}</h1>
 <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">{user.role === 'admin' ? 'Администратор' : 'Пациент FamilyDent'}</p>
 </div>

 {!isEditing ? (
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
 <Info label="Email" value={user.email} />
 <Info label="Телефон" value={user.phoneNumber || 'Нет данных'} />
 <Info label="Дата рождения" value={user.birthDate || 'Нет данных'} />
 <Info label="Пол" value={user.gender === 'male' ? 'Мужской' : user.gender === 'female' ? 'Женский' : 'Нет данных'} />
 </div>
 ) : (
 <form onSubmit={handleUpdateProfile} className="space-y-4">
 <Field label="Имя и фамилия" value={formData.displayName} onChange={(value) => setFormData({ ...formData, displayName: value })} />
 <Field label="Телефон" value={formData.phoneNumber} onChange={(value) => setFormData({ ...formData, phoneNumber: value })} />
 <div className="grid sm:grid-cols-2 gap-4">
 <Field label="Дата рождения" type="date" value={formData.birthDate} onChange={(value) => setFormData({ ...formData, birthDate: value })} />
 <label className="space-y-2 block">
 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Пол</span>
 <select value={formData.gender} onChange={(event) => setFormData({ ...formData, gender: event.target.value })} className="w-full h-12 px-4 bg-slate-50 border border-slate-100 rounded-xl outline-none font-bold text-slate-900">
 <option value="male">Мужской</option>
 <option value="female">Женский</option>
 <option value="other">Не указано</option>
 </select>
 </label>
 </div>
 <Button disabled={loading} type="submit" className="w-full h-12 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold">
 {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5 mr-2" /> Сохранить изменения</>}
 </Button>
 </form>
 )}

 <button onClick={() => { logout(); window.location.href = '/'; }} className="mt-6 w-full h-12 rounded-xl border border-red-100 text-red-500 font-bold hover:bg-red-50 transition-all flex items-center justify-center gap-2">
 <LogOut className="w-5 h-5" />
 Выйти из системы
 </button>
 </section>

 <div className="min-w-0 space-y-6">
 <div className="grid sm:grid-cols-2 gap-4">
 <QuickLink title="Мои записи" desc="Все приемы" icon={CalendarDays} to="/profile/bookings" />
 <QuickLink title="Мед. карта" desc="История лечения" icon={Shield} to="/profile/records" />
 </div>

 <section className="bg-white rounded-xl shadow-md border border-slate-100 p-6 sm:p-8">
 <div className="flex items-center gap-3 mb-5">
 <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
 <MailCheck className="w-5 h-5" />
 </div>
 <div>
 <h2 className="text-xl font-bold text-foreground">Подтверждение email</h2>
 <p className="text-sm text-text-secondary">{user.isEmailVerified ? 'Email подтвержден' : 'Подтвердите почту кодом'}</p>
 </div>
 </div>
 <div className="grid sm:grid-cols-[1fr_auto] gap-3">
 <input value={emailValue} onChange={(event) => setEmailValue(event.target.value)} disabled={user.isEmailVerified} className="h-11 px-4 rounded-xl border border-border bg-white text-foreground outline-none focus:ring-2 focus:ring-primary/20" />
 <Button disabled={sendingCode || user.isEmailVerified || resendLeft > 0} onClick={sendEmailCode} className="h-11 rounded-xl bg-primary text-white">
 {sendingCode ? <Loader2 className="w-4 h-4 animate-spin" /> : resendLeft > 0 ? `${resendLeft} c` : 'Отправить код'}
 </Button>
 </div>
 {!user.isEmailVerified && (
 <div className="grid sm:grid-cols-[1fr_auto] gap-3 mt-3">
 <input value={emailCode} onChange={(event) => setEmailCode(event.target.value)} placeholder="6-значный код" className="h-11 px-4 rounded-xl border border-border bg-white text-foreground outline-none focus:ring-2 focus:ring-primary/20" />
 <Button disabled={verifyingCode} onClick={verifyEmailCode} variant="outline" className="h-11 rounded-xl">
 {verifyingCode ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Подтвердить'}
 </Button>
 </div>
 )}
 </section>

 <section className="bg-white rounded-xl shadow-md border border-slate-100 p-6 sm:p-8">
 <div className="flex items-center gap-3 mb-5">
 <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
 <Bell className="w-5 h-5" />
 </div>
 <div>
 <h2 className="text-xl font-bold text-foreground">Настройки уведомлений</h2>
 <p className="text-sm text-text-secondary">Выберите, какие сообщения получать</p>
 </div>
 </div>
 <div className="space-y-3">
 {notificationItems.map((item) => (
 <label key={item.key} className="flex items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
 <span>
 <span className="block font-bold text-foreground">{item.title}</span>
 <span className="block text-sm text-text-secondary">{item.desc}</span>
 </span>
 <input type="checkbox" checked={notifications[item.key]} onChange={(event) => setNotifications({ ...notifications, [item.key]: event.target.checked })} className="h-5 w-5 accent-primary" />
 </label>
 ))}
 </div>
 <Button disabled={savingNotifications} onClick={saveNotifications} className="mt-5 w-full h-11 rounded-xl bg-primary text-white font-bold">
 {savingNotifications ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Сохранить настройки'}
 </Button>
 </section>
 </div>
 </div>
 </div>
 </div>
 );
}

function Info({ label, value }: { label: string; value: string }) {
 return (
 <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
 <span className="text-[10px] uppercase font-black tracking-widest text-slate-400 mb-2 block">{label}</span>
 <span className="text-slate-900 font-bold block">{value}</span>
 </div>
 );
}

function Field({ label, value, onChange, type = 'text' }: any) {
 return (
 <label className="space-y-2 block">
 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</span>
 <input type={type} value={value} onChange={(event) => onChange(event.target.value)} className="w-full h-12 px-4 bg-slate-50 border border-slate-100 rounded-xl outline-none font-bold text-slate-900" />
 </label>
 );
}

function QuickLink({ title, desc, icon: Icon, to }: any) {
 return (
 <Link to={to} className="p-5 bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-lg transition-all group">
 <div className="w-12 h-12 rounded-xl bg-slate-50 text-primary flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-all">
 <Icon className="w-6 h-6" />
 </div>
 <h3 className="text-xl font-bold text-slate-900 mb-1">{title}</h3>
 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{desc}</p>
 </Link>
 );
}

