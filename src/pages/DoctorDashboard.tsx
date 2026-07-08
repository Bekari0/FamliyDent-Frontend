
import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import axios from 'axios';
import { 
 Calendar, Clock, Users, CheckCircle, XCircle, 
 Settings, TrendingUp, ChevronRight, Loader2, 
 CalendarCheck, AlertCircle, LogOut, Edit3, Save, Camera,
 FileText
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import * as styles from './DoctorDashboard.styles';


const formatDateParts = (value?: string) => {
 if (!value) return { day: '—', month: 'Дата' };
 const date = new Date(value);
 if (Number.isNaN(date.getTime())) return { day: '—', month: 'Дата' };
 return {
 day: String(date.getDate()),
 month: date.toLocaleDateString('ru-RU', { month: 'short' })
 };
};

const safeNumber = (value: any) => {
 const number = Number(value);
 return Number.isFinite(number) ? number : 0;
};

const textOrFallback = (value: any, fallback = 'Не указано') => {
 if (value === undefined || value === null || value === '') return fallback;
 return String(value);
};

export function DoctorDashboard() {
 const { user, logout } = useAuth();
 const [bookings, setBookings] = useState<any[]>([]);
 const [stats, setStats] = useState<any>(null);
 const [loading, setLoading] = useState(true);
 const [showEditProfile, setShowEditProfile] = useState(false);
 const [profileData, setProfileData] = useState<any>(null);
 const [savingProfile, setSavingProfile] = useState(false);

 const fetchData = async () => {
 try {
 const [bookingsRes, statsRes] = await Promise.all([
 axios.get('/api/doctor/bookings'),
 axios.get('/api/doctor/stats')
 ]);
 setBookings(bookingsRes.data);
 setStats(statsRes.data);
 
 // Загружаем профиль текущего врача
 const docId = user?.doctorId;
 if (docId) {
 try {
 const docRes = await axios.get(`/api/doctors/${docId}`);
 setProfileData(docRes.data);
 } catch (docErr) {
 console.warn('Doctor profile not found (404 expected if unseeded):', docErr);
 // Не показываем ошибку, используем данные пользователя
 setProfileData({
 name: user?.displayName,
 specialty: 'Врач',
 description: ''
 });
 }
 } else {
 // Резервный вариант для врача без привязанного профиля
 setProfileData({
 name: user?.displayName,
 specialty: 'Врач-специалист',
 description: 'Клиника Family Dent'
 });
 }
 } catch (error) {
 console.error('Dashboard fetch error:', error);
 toast.error('Ошибка загрузки данных кабинета');
 } finally {
 setLoading(false);
 }
 };

 useEffect(() => {
 fetchData();
 }, [user]);

 const handleUpdateProfile = async (e: React.FormEvent) => {
 e.preventDefault();
 setSavingProfile(true);
 try {
 await axios.patch(`/api/doctors/${user.doctorId}`, profileData);
 toast.success('Профиль обновлен');
 setShowEditProfile(false);
 fetchData();
 } catch (error) {
 toast.error('Ошибка обновления профиля');
 } finally {
 setSavingProfile(false);
 }
 };

 const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
 if (!e.target.files?.length) return;
 const file = e.target.files[0];
 const formData = new FormData();
 formData.append('file', file);
 try {
 const res = await axios.post('/api/upload', formData);
 setProfileData({ ...profileData, image: res.data.url });
 toast.success('Фото обновлено');
 } catch (error) {
 toast.error('Ошибка загрузки фото');
 }
 };

 const handleStatusChange = async (bookingId: string, status: string) => {
 try {
 await axios.patch(`/api/bookings/${bookingId}`, { status });
 toast.success('Статус обновлен');
 fetchData();
 } catch (error) {
 toast.error('Ошибка обновления статуса');
 }
 };

 if (loading) {
 return (
 <div className="min-h-screen flex items-center justify-center bg-card">
 <Loader2 className="w-10 h-10 animate-spin text-primary" />
 </div>
 );
 }

 return (
 <div className={styles.dashboard}>
 <div className={styles.container}>
 <div className={styles.header}>
 <div>
 <h1 className={styles.title}>Кабинет врача</h1>
 <p className={styles.subtitle}>
 Здравствуйте, <span className={styles.userName}>{user?.displayName}</span>
 </p>
 </div>
 <div className={styles.actions}>
 <Button variant="outline" onClick={() => logout()} className={styles.logoutBtn}>
 <LogOut className="w-4 h-4 mr-2" /> Выйти
 </Button>
 </div>
 </div>

 {/* Статистика */}
 <div className={styles.statsGrid}>
 {[
 { label: 'Всего записей', value: safeNumber(stats?.total), icon: CalendarCheck, color: 'text-primary', bg: 'bg-primary/5' },
 { label: 'Ожидают', value: safeNumber(stats?.pending), icon: Clock, color: 'text-primary', bg: 'bg-warning/10' },
 { label: 'Подтверждено', value: safeNumber(stats?.confirmed), icon: CheckCircle, color: 'text-success', bg: 'bg-success/10' },
 ].map((s, i) => (
 <motion.div 
 key={i} 
 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
 className={styles.statCard}
 >
 <div className={cn(styles.statIconBox, s.bg)}>
 <s.icon className={cn("w-8 h-8", s.color)} />
 </div>
 <div>
 <div className={styles.statValue}>{s.value}</div>
 <div className={styles.statLabel}>{s.label}</div>
 </div>
 </motion.div>
 ))}
 </div>

 {/* Основное содержимое */}
 <div className={styles.mainGrid}>
 <div className={styles.mainCol}>
 <h2 className={styles.sectionTitle}>
 <Users className="w-6 h-6 text-primary" />
 Ближайшие приемы
 </h2>
 
 <div className={styles.bookingList}>
 {bookings.length > 0 ? bookings.map((b, i) => (
 <motion.div 
 key={b._id}
 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
 className={cn(styles.bookingCard, "group")}
 >
 <div className={styles.bookingInfo}>
 <div className={styles.dateBadge}>
 {(() => {
 const { day, month } = formatDateParts(b.date);
 return (
 <>
 <span className={styles.month}>{month}</span>
 <span className={styles.day}>{day}</span>
 </>
 )
 })()}
 </div>
 <div>
 <h3 className={styles.patientName}>{textOrFallback(b.patientName, 'Пациент не указан')}</h3>
 <div className={styles.metaInfo}>
 <span className={styles.metaItem}><Clock className="w-3.5 h-3.5" /> {textOrFallback(b.time, 'Время не указано')}</span>
 <span className={styles.metaItem}><AlertCircle className="w-3.5 h-3.5" /> {textOrFallback(b.serviceId, 'Услуга не указана')}</span>
 </div>
 </div>
 </div>

 <div className={styles.bookingActions}>
 <Link to={`/profile/records/${b.patientId}`} className="p-3 bg-primary/5 text-primary rounded-md hover:bg-primary hover:text-white transition-all">
 <FileText className="w-5 h-5" />
 </Link>
 {b.status === 'pending' ? (
 <>
 <Button 
 onClick={() => handleStatusChange(b._id, 'confirmed')}
 className={styles.confirmBtn}
 >
 Подтвердить
 </Button>
 <Button 
 onClick={() => handleStatusChange(b._id, 'cancelled')}
 variant="outline"
 className={styles.cancelBtn}
 >
 <XCircle className="w-4 h-4" />
 </Button>
 </>
 ) : (
 <span className={cn(styles.statusBadge, 
 b.status === 'confirmed' ? styles.statusConfirmed : 
 b.status === 'cancelled' ? styles.statusCancelled : styles.statusDefault
 )}>
 {b.status === 'confirmed' ? 'Подтверждено' : b.status === 'cancelled' ? 'Отменено' : b.status}
 </span>
 )}
 </div>
 </motion.div>
 )) : (
 <div className={styles.emptyState}>
 На сегодня записей нет
 </div>
 )}
 </div>
 </div>

 <div className={styles.sideCol}>
 <h2 className={styles.sectionTitle}>
 <Settings className="w-6 h-6 text-primary" />
 Мой профиль
 </h2>
 <div className={styles.profileCard}>
 <div className={styles.profileHeader}>
 <div className={cn(styles.avatarWrapper, "group")}>
 <img src={profileData?.image || user?.photoURL || 'https://via.placeholder.com/150'} alt="" className={styles.avatar} />
 <div className={styles.avatarOverlay}>
 <Camera className="w-6 h-6 text-white" />
 <input type="file" onChange={handlePhotoUpload} className={styles.avatarInput} accept="image/*" />
 </div>
 </div>
 <h3 className={styles.profileName}>{profileData?.name || user?.displayName}</h3>
 <p className={styles.profileSpecialty}>{profileData?.specialty || 'Врач'}</p>
 <p className={styles.profileEmail}>{user?.email}</p>
 </div>
 <div className={styles.profileActions}>
 <Button onClick={() => setShowEditProfile(true)} variant="outline" className={styles.profileBtn}>
 <Edit3 className="w-4 h-4 mr-2" /> Редактировать профиль
 </Button>
 <Button variant="ghost" className={styles.ghostBtn}>
 Настройки уведомлений
 </Button>
 </div>
 </div>
 
 <div className={styles.dailyStatsCard}>
 <h4 className={styles.dailyStatsTitle}>
 <Calendar className="w-4 h-4 text-primary" /> По дням
 </h4>
 <div className={styles.dailyStatsList}>
 {(Array.isArray(stats?.daily) ? stats.daily : []).map((d: any, i: number) => (
 <div key={i} className={styles.dailyStatsItem}>
 <span className={styles.dailyStatsLabel}>{textOrFallback(d.label, 'Дата не указана')}</span>
 <div className={styles.dailyStatsValueBox}>
 <span className={styles.dailyStatsValue}>{safeNumber(d.value)}</span>
 <span className={styles.dailyStatsUnit}>записей</span>
 </div>
 </div>
 ))}
 </div>
 </div>
 </div>
 </div>
 </div>

 {/* Редактирование профиля */}
 {showEditProfile && (
 <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-espresso/60 backdrop-blur-sm" onClick={() => setShowEditProfile(false)} />
 <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-card w-full max-w-2xl rounded-lg shadow-2xl relative overflow-hidden z-10 p-8 sm:p-12">
 <form onSubmit={handleUpdateProfile} className="space-y-6 max-h-[85vh] overflow-y-auto pr-2 custom-scrollbar">
 <div className="flex justify-between items-center mb-8">
 <h2 className="text-3xl font-semibold text-foreground">Профиль специалиста</h2>
 <button type="button" onClick={() => setShowEditProfile(false)} className="w-12 h-12 rounded-lg bg-secondary hover:bg-secondary flex items-center justify-center text-muted-foreground transition-all active:scale-95"><XCircle className="w-6 h-6" /></button>
 </div>

 <div className="grid md:grid-cols-2 gap-6">
 <div className="space-y-2">
 <label className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground ml-1">ФИО</label>
 <input required value={profileData?.name} onChange={e => setProfileData({...profileData, name: e.target.value})} className="w-full h-14 px-5 rounded-md bg-secondary border border-border focus:ring-2 focus:ring-primary/20 outline-none font-semibold text-foreground" />
 </div>
 <div className="space-y-2">
 <label className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground ml-1">Специализация</label>
 <input required value={profileData?.specialty} onChange={e => setProfileData({...profileData, specialty: e.target.value})} className="w-full h-14 px-5 rounded-md bg-secondary border border-border focus:ring-2 focus:ring-primary/20 outline-none font-semibold text-foreground" />
 </div>
 </div>

 <div className="space-y-2">
 <label className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground ml-1">О себе</label>
 <textarea value={profileData?.description} onChange={e => setProfileData({...profileData, description: e.target.value})} className="w-full h-32 px-5 py-4 rounded-md bg-secondary border border-border focus:ring-2 focus:ring-primary/20 outline-none resize-none text-muted-foreground leading-relaxed" />
 </div>

 <div className="grid md:grid-cols-2 gap-6">
 <div className="space-y-2">
 <label className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground ml-1">Образование</label>
 <textarea value={profileData?.education?.join('\n')} onChange={e => setProfileData({...profileData, education: e.target.value.split('\n')})} className="w-full h-32 px-5 py-4 rounded-md bg-secondary border border-border focus:ring-2 focus:ring-primary/20 outline-none resize-none text-sm leading-relaxed" placeholder="По одной строке..." />
 </div>
 <div className="space-y-2">
 <label className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground ml-1">Достижения</label>
 <textarea value={profileData?.achievements?.join('\n')} onChange={e => setProfileData({...profileData, achievements: e.target.value.split('\n')})} className="w-full h-32 px-5 py-4 rounded-md bg-secondary border border-border focus:ring-2 focus:ring-primary/20 outline-none resize-none text-sm leading-relaxed" placeholder="По одной строке..." />
 </div>
 </div>

 <Button disabled={savingProfile} type="submit" className="w-full h-16 rounded-lg bg-primary text-primary-foreground font-semibold text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all">
 {savingProfile ? <Loader2 className="animate-spin" /> : <><Save className="w-5 h-5 mr-3" /> Сохранить профиль</>}
 </Button>
 </form>
 </motion.div>
 </div>
 )}
 </div>
 );
}


