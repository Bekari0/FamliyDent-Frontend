import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { UserPlus, Mail, Lock, User, Phone, ArrowRight, ShieldCheck, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

export function RegisterPage() {
 const [formData, setFormData] = useState({
 name: '',
 email: '',
 phone: '+992',
 password: '',
 confirmPassword: '',
 birthDate: '',
 gender: 'male'
 });
 const [isVerifying, setIsVerifying] = useState(false);
 const [verificationCode, setVerificationCode] = useState('');
 const [resendTimer, setResendTimer] = useState(0);
 const [submitting, setSubmitting] = useState(false);
 const { register, verifyCode, resendCode, user } = useAuth();
 const navigate = useNavigate();

 useEffect(() => {
 if (resendTimer > 0) {
 const timer = setTimeout(() => setResendTimer((value) => value - 1), 1000);
 return () => clearTimeout(timer);
 }
 }, [resendTimer]);

 useEffect(() => {
 if (user) navigate('/');
 }, [user, navigate]);

 const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
 const digitsOnly = event.target.value.replace(/^\+992/, '').replace(/\D/g, '');
 setFormData({ ...formData, phone: '+992' + digitsOnly.slice(0, 9) });
 };

 const handleRegister = async (event: React.FormEvent) => {
 event.preventDefault();
 const email = formData.email.trim().toLowerCase();

 if (formData.name.trim().length < 2) return toast.error('Имя должно быть не короче 2 символов');
 if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return toast.error('Укажите корректный email');
 if (formData.phone.length !== 13) return toast.error('Телефон должен содержать 9 цифр после +992');
 if (formData.password.length < 8) return toast.error('Пароль должен быть не короче 8 символов');
 if (formData.password !== formData.confirmPassword) return toast.error('Пароли не совпадают');

 setSubmitting(true);
 try {
 await register(email, formData.password, formData.name.trim(), formData.phone, formData.birthDate, formData.gender);
 setFormData((prev) => ({ ...prev, email }));
 setIsVerifying(true);
 setResendTimer(60);
 toast.success('Аккаунт создан. Код подтверждения отправлен на email.');
 } catch (err: any) {
 toast.error(err.response?.data?.error || 'Не удалось зарегистрироваться');
 } finally {
 setSubmitting(false);
 }
 };

 const handleVerify = async (event: React.FormEvent) => {
 event.preventDefault();
 if (!/^\d{6}$/.test(verificationCode)) return toast.error('Код должен состоять из 6 цифр');

 setSubmitting(true);
 try {
 await verifyCode(formData.email, verificationCode);
 toast.success('Email подтвержден. Теперь можно войти.');
 navigate('/login');
 } catch (err: any) {
 toast.error(err.response?.data?.error || 'Не удалось подтвердить email');
 } finally {
 setSubmitting(false);
 }
 };

 const handleResend = async () => {
 if (resendTimer > 0) return;
 setSubmitting(true);
 try {
 await resendCode(formData.email);
 setResendTimer(60);
 toast.success('Новый код отправлен');
 } catch (err: any) {
 toast.error(err.response?.data?.error || 'Не удалось отправить код');
 } finally {
 setSubmitting(false);
 }
 };

 return (
 <div className="pt-32 pb-20 min-h-screen bg-background flex flex-col items-center justify-center">
 <div className="mb-8">
 <Button variant="ghost" asChild>
 <Link to="/">
 <ArrowLeft className="w-4 h-4 mr-2" />
 На главную
 </Link>
 </Button>
 </div>

 <div className="container mx-auto px-4 max-w-6xl">
 <div className="bg-card rounded-[32px] overflow-hidden shadow-2xl flex flex-col lg:flex-row border border-border">
 <div className="lg:w-1/2 p-10 lg:p-16 bg-primary text-white">
 <div className="max-w-md">
 <h1 className="text-4xl lg:text-5xl font-display font-bold mb-6 leading-tight">Присоединяйтесь к FamilyDent</h1>
 <p className="text-lg text-white/75 mb-10">Получите доступ к онлайн-записи, своей медицинской карте и истории посещений.</p>

 <div className="space-y-6">
 {[
 { icon: ShieldCheck, title: 'Безопасно', text: 'Ваши данные защищены и доступны только вам и специалистам клиники.' },
 { icon: ArrowRight, title: 'Быстро', text: 'Запись к врачу и управление визитами в личном кабинете.' }
 ].map((item) => (
 <div key={item.title} className="flex gap-4">
 <div className="w-11 h-11 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
 <item.icon className="w-5 h-5" />
 </div>
 <div>
 <div className="font-bold text-lg mb-1">{item.title}</div>
 <div className="text-sm text-white/65 leading-relaxed">{item.text}</div>
 </div>
 </div>
 ))}
 </div>
 </div>
 </div>

 <div className="lg:w-1/2 p-10 lg:p-16">
 <div className="max-w-md mx-auto">
 {!isVerifying ? (
 <>
 <div className="flex items-center gap-3 mb-8 text-primary">
 <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
 <UserPlus className="w-6 h-6" />
 </div>
 <span className="font-bold uppercase tracking-widest text-xs">Регистрация пациента</span>
 </div>

 <form onSubmit={handleRegister} className="space-y-5">
 <div className="grid sm:grid-cols-2 gap-4">
 <Field label="Имя" icon={User} value={formData.name} onChange={(value: string) => setFormData({ ...formData, name: value })} autoComplete="name" />
 <Field label="Телефон" icon={Phone} value={formData.phone} onChange={handlePhoneChange} autoComplete="tel" maxLength={13} />
 </div>

 <div className="grid sm:grid-cols-2 gap-4">
 <label className="space-y-2 block">
 <span className="text-xs font-bold text-text-secondary uppercase tracking-widest ml-1">Дата рождения</span>
 <input type="date" value={formData.birthDate} onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })} className="w-full h-12 px-4 rounded-xl bg-secondary border border-border focus:ring-2 focus:ring-primary/20 text-foreground" />
 </label>
 <label className="space-y-2 block">
 <span className="text-xs font-bold text-text-secondary uppercase tracking-widest ml-1">Пол</span>
 <select value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value })} className="w-full h-12 px-4 rounded-xl bg-secondary border border-border focus:ring-2 focus:ring-primary/20 text-foreground font-bold">
 <option value="male">Мужской</option>
 <option value="female">Женский</option>
 <option value="other">Другой</option>
 </select>
 </label>
 </div>

 <Field label="Email" icon={Mail} type="email" value={formData.email} onChange={(value: string) => setFormData({ ...formData, email: value })} autoComplete="email" />

 <div className="grid sm:grid-cols-2 gap-4">
 <Field label="Пароль" icon={Lock} type="password" value={formData.password} onChange={(value: string) => setFormData({ ...formData, password: value })} autoComplete="new-password" />
 <Field label="Повторите пароль" icon={Lock} type="password" value={formData.confirmPassword} onChange={(value: string) => setFormData({ ...formData, confirmPassword: value })} autoComplete="new-password" />
 </div>

 <Button disabled={submitting} type="submit" className="w-full h-14 rounded-xl bg-primary text-white font-bold text-base shadow-xl shadow-primary/20">
 {submitting ? 'Создаем...' : 'Создать аккаунт'}
 </Button>
 </form>

 <div className="mt-8 text-center">
 <p className="text-text-secondary text-sm">
 Уже есть аккаунт? <Link to="/login" className="text-primary font-bold hover:underline">Войти</Link>
 </p>
 </div>
 </>
 ) : (
 <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-7">
 <div className="flex items-center gap-3 text-primary">
 <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
 <ShieldCheck className="w-6 h-6" />
 </div>
 <span className="font-bold uppercase tracking-widest text-xs">Подтверждение email</span>
 </div>

 <div>
 <h2 className="text-2xl font-bold text-foreground">Введите код</h2>
 <p className="text-text-secondary mt-2">Мы отправили 6-значный код на <b>{formData.email}</b>. Код действует 10 минут.</p>
 </div>

 <form onSubmit={handleVerify} className="space-y-5">
 <input required type="text" inputMode="numeric" maxLength={6} value={verificationCode} onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))} className="w-full h-16 text-center text-3xl font-black tracking-[0.7rem] rounded-xl bg-secondary border border-border focus:ring-2 focus:ring-primary/20 text-foreground" placeholder="000000" />

 <Button disabled={submitting} type="submit" className="w-full h-14 rounded-xl bg-primary text-white font-bold text-base shadow-xl shadow-primary/20">
 {submitting ? 'Проверяем...' : 'Подтвердить'}
 </Button>
 </form>

 <div className="text-center">
 <button onClick={handleResend} disabled={resendTimer > 0 || submitting} className={`font-bold text-sm uppercase tracking-widest ${resendTimer > 0 ? 'text-text-secondary cursor-not-allowed' : 'text-primary hover:underline'}`}>
 Отправить код повторно {resendTimer > 0 && `через ${resendTimer}с`}
 </button>
 </div>

 <div className="text-center">
 <button onClick={() => setIsVerifying(false)} className="text-text-secondary text-xs font-bold uppercase tracking-widest hover:text-foreground">
 <ArrowLeft className="w-3 h-3 inline mr-1" /> Изменить email
 </button>
 </div>
 </motion.div>
 )}
 </div>
 </div>
 </div>
 </div>
 </div>
 );
}

function Field({ label, icon: Icon, value, onChange, type = 'text', autoComplete, maxLength = 100 }: any) {
 const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
 if (typeof onChange === 'function') onChange(event);
 };

 const handleValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
 if (typeof onChange === 'function') onChange(event.target.value);
 };

 const isPhoneHandler = label === 'Телефон';

 return (
 <label className="space-y-2 block">
 <span className="text-xs font-bold text-text-secondary uppercase tracking-widest ml-1">{label}</span>
 <div className="relative">
 <input required type={type} value={value} onChange={isPhoneHandler ? handleChange : handleValueChange} autoComplete={autoComplete} maxLength={maxLength} className="w-full h-12 pl-11 pr-4 rounded-xl bg-secondary border border-border focus:ring-2 focus:ring-primary/20 text-foreground" />
 <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
 </div>
 </label>
 );
}

