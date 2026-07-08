import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import {
 Users,
 Calendar,
 TrendingUp,
 Activity,
 ChevronRight,
 Stethoscope,
 RefreshCcw,
 Newspaper,
 MessageSquare,
 Download,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import axios from 'axios';
import { toast } from 'sonner';
import { exportToPDF } from '../lib/pdfExport';

interface AdminStats {
 users: number;
 bookings: number;
 doctors: number;
 recentBookings: any[];
}

export function AdminDashboard() {
 const { user } = useAuth();
 const [stats, setStats] = useState<AdminStats | null>(null);
 const [loading, setLoading] = useState(true);

 const fetchStats = async () => {
 setLoading(true);
 try {
 const response = await axios.get('/api/admin/stats');
 setStats(response.data);
 } catch (error) {
 toast.error('Ошибка загрузки статистики');
 } finally {
 setLoading(false);
 }
 };

 useEffect(() => {
 fetchStats();
 }, []);

 const statCards = [
 { label: 'Пациентов', value: stats?.users ?? 0, icon: Users },
 { label: 'Всего записей', value: stats?.bookings ?? 0, icon: Calendar },
 { label: 'Врачей', value: stats?.doctors ?? 0, icon: Stethoscope },
 { label: 'Эффективность', value: '94%', icon: TrendingUp },
 ];

 const exportReport = async () => {
 if (!stats?.recentBookings) return;

 try {
 const headers = ['№', 'Пациент', 'Дата', 'Время', 'Статус'];
 const data = stats.recentBookings.map((booking, index) => [
 index + 1,
 booking.patientName || 'Пациент',
 booking.date || '',
 booking.time || '',
 booking.status || '',
 ]);

 await exportToPDF(
 'Отчет по последним записям клиники Family Dent',
 headers,
 data,
 `report_dashboard_${new Date().toISOString().split('T')[0]}`,
 );

 toast.success('Отчет экспортирован в PDF');
 } catch (error) {
 toast.error('Ошибка при экспорте отчета');
 }
 };

 return (
 <div className="pt-24 pb-20 bg-background min-h-screen text-foreground">
 <div className="container mx-auto px-4">
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-12">
 {[
 { to: '/admin/bookings', icon: Calendar, caption: 'Управление', label: 'Записи' },
 { to: '/admin/patients', icon: Users, caption: 'База данных', label: 'Пациенты' },
 { to: '/admin/doctors', icon: Stethoscope, caption: 'Штат', label: 'Врачи' },
 { to: '/admin/blog', icon: Newspaper, caption: 'Модерация', label: 'Статьи' },
 { to: '/admin/reviews', icon: MessageSquare, caption: 'Модерация', label: 'Отзывы' },
 ].map((item) => (
 <Button
 key={item.to}
 asChild
 variant="outline"
 className="justify-start h-20 rounded-md shadow-sm bg-card border border-border hover:border-primary transition-all group px-6"
 >
 <Link to={item.to} className="flex items-center gap-4 w-full">
 <div className="p-3 bg-secondary text-primary rounded-md group-hover:bg-primary group-hover:text-primary-foreground transition-all">
 <item.icon size={24} />
 </div>
 <div className="text-left">
 <p className="text-[10px] font-semibold uppercase text-muted-foreground leading-none mb-1 tracking-[0.18em]">
 {item.caption}
 </p>
 <p className="font-semibold text-foreground text-base">{item.label}</p>
 </div>
 <ChevronRight className="ml-auto text-muted-foreground/50 group-hover:text-primary transition-colors" />
 </Link>
 </Button>
 ))}
 </div>

 <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-8">
 <div>
 <h1 className="text-4xl lg:text-5xl font-display font-semibold text-foreground mb-3">
 Монитор клиники
 </h1>
 <p className="text-muted-foreground">
 Центральная панель управления{user?.displayName ? ` • ${user.displayName}` : ''}
 </p>
 </div>
 <div className="flex flex-col sm:flex-row gap-4">
 <button
 onClick={fetchStats}
 className="h-12 px-6 rounded-md bg-card border border-border text-foreground font-semibold text-sm hover:bg-secondary transition-all flex items-center justify-center gap-3 shadow-sm"
 >
 <RefreshCcw size={18} className={loading ? 'animate-spin' : ''} />
 Обновить
 </button>
 <button
 onClick={exportReport}
 className="h-12 px-6 rounded-md bg-primary text-primary-foreground font-semibold text-sm shadow-md hover:bg-primary-hover active:scale-95 transition-all flex items-center justify-center gap-3"
 >
 <Download size={18} />
 Экспорт в PDF
 </button>
 </div>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
 {statCards.map((stat, index) => (
 <motion.div
 key={stat.label}
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: index * 0.1 }}
 className="bg-card p-6 rounded-md border border-border shadow-md hover:shadow-lg transition-all"
 >
 <div className="w-12 h-12 rounded-md bg-primary/10 text-primary flex items-center justify-center mb-4">
 <stat.icon className="w-6 h-6" />
 </div>
 <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
 {stat.label}
 </div>
 <div className="text-2xl font-semibold text-foreground">{loading ? '...' : stat.value}</div>
 </motion.div>
 ))}
 </div>

 <div className="grid lg:grid-cols-3 gap-8">
 <div className="lg:col-span-2 bg-card rounded-md border border-border p-6 lg:p-8 shadow-md">
 <div className="flex items-center justify-between mb-8">
 <h3 className="text-xl font-semibold flex items-center gap-3 text-foreground">
 <Activity className="text-primary" />
 Последние записи
 </h3>
 <Link to="/admin/bookings" className="text-primary font-semibold text-sm underline hover:text-primary-hover transition-colors">
 Все записи
 </Link>
 </div>
 <div className="space-y-4">
 {(!stats?.recentBookings || !Array.isArray(stats.recentBookings) || stats.recentBookings.length === 0) && (
 <p className="text-muted-foreground text-center py-10 font-medium">Нет новых записей</p>
 )}
 {Array.isArray(stats?.recentBookings) &&
 stats.recentBookings.map((booking, index) => (
 <div key={booking._id || index} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-md bg-secondary border border-border">
 <div className="flex items-center gap-4">
 <div className="w-12 h-12 rounded-md bg-card flex items-center justify-center font-semibold text-primary shadow-sm">
 #{index + 1}
 </div>
 <div>
 <div className="font-semibold text-foreground">Пациент: {booking.patientName || 'Не указан'}</div>
 <div className="text-xs text-muted-foreground">
 {booking.date || 'Дата не указана'} в {booking.time || 'время не указано'}
 </div>
 </div>
 </div>
 <Badge
 className={`rounded-lg border-none ${
 booking.status === 'confirmed'
 ? 'bg-success/10 text-success'
 : booking.status === 'cancelled'
 ? 'bg-error/10 text-error'
 : booking.status === 'pending'
 ? 'bg-warning/10 text-warning'
 : 'bg-muted text-muted-foreground'
 }`}
 >
 {booking.status || 'unknown'}
 </Badge>
 </div>
 ))}
 </div>
 </div>

 <div className="bg-card rounded-md border border-border p-6 lg:p-8 shadow-md">
 <h3 className="text-xl font-semibold mb-8 text-foreground">Управление</h3>
 <div className="space-y-4">
 {[
 { to: '/admin/patients', icon: Users, label: 'Пациенты' },
 { to: '/admin/doctors', icon: Stethoscope, label: 'Врачи' },
 { to: '/admin/bookings', icon: Calendar, label: 'Записи' },
 { to: '/admin/blog', icon: Newspaper, label: 'Статьи' },
 { to: '/admin/reviews', icon: MessageSquare, label: 'Отзывы' },
 ].map((item) => (
 <Link key={item.to} to={item.to} className="flex items-center justify-between p-4 rounded-md bg-secondary hover:bg-muted transition-colors border border-border">
 <div className="flex items-center gap-3">
 <item.icon className="text-primary w-5 h-5" />
 <span className="font-semibold text-foreground">{item.label}</span>
 </div>
 <ChevronRight size={16} className="text-muted-foreground" />
 </Link>
 ))}
 </div>
 </div>
 </div>
 </div>
 </div>
 );
}

