import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import {
 Users,
 Search,
 Calendar,
 Phone,
 Mail,
 ChevronRight,
 Trash2,
 Eye,
 User,
 FileText,
 Clock,
 ShieldCheck,
 Image as ImageIcon,
 ExternalLink,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import {
 Dialog,
 DialogContent,
 DialogFooter,
} from '@/components/ui/dialog';

interface Patient {
 uid?: string;
 id?: string;
 _id?: string;
 displayName?: string;
 email?: string;
 phoneNumber?: string;
 gender?: string;
 birthDate?: string;
 createdAt?: string;
}

const getPatientId = (patient: Patient) => patient.uid || patient.id || patient._id || '';

export function AdminPatients() {
 const [patients, setPatients] = useState<Patient[]>([]);
 const [loading, setLoading] = useState(true);
 const [searchTerm, setSearchTerm] = useState('');
 const [selectedPatient, setSelectedPatient] = useState<any | null>(null);
 const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
 const [detailLoading, setDetailLoading] = useState(false);
 const [detailError, setDetailError] = useState('');

 useEffect(() => {
 fetchPatients();
 }, []);

 const fetchPatients = async () => {
 setLoading(true);
 try {
 const response = await axios.get('/api/admin/patients');
 setPatients(Array.isArray(response.data) ? response.data : []);
 } catch (err) {
 toast.error('Ошибка при загрузке списка пациентов');
 } finally {
 setLoading(false);
 }
 };

 const fetchPatientDetails = async (patient: Patient) => {
 const patientId = getPatientId(patient);
 if (!patientId) {
 toast.error('Не найден идентификатор пациента');
 return;
 }

 try {
 const response = await axios.get(`/api/admin/patients/${patientId}`);
 setSelectedPatient({
 patient: response.data?.patient || patient,
 bookings: Array.isArray(response.data?.bookings) ? response.data.bookings : [],
 records: Array.isArray(response.data?.records) ? response.data.records : [],
 scans: Array.isArray(response.data?.scans) ? response.data.scans : [],
 card: response.data?.card || null,
 });
 setIsDetailModalOpen(true);
 } catch (err: any) {
 toast.error(err.response?.status === 404 ? 'Пациент не найден' : 'Ошибка при загрузке данных пациента');
 }
 };

 const handleDelete = async (patient: Patient) => {
 const patientId = getPatientId(patient);
 if (!patientId) {
 toast.error('Не найден идентификатор пациента');
 return;
 }

 if (!window.confirm('Удалить профиль пациента? Его записи останутся в истории клиники.')) return;

 try {
 await axios.delete(`/api/admin/patients/${patientId}`);
 setPatients((prev) => prev.filter((item) => getPatientId(item) !== patientId));
 toast.success('Пациент удален');
 } catch (err) {
 toast.error('Ошибка при удалении пациента');
 }
 };

 const filteredPatients = patients.filter((patient) => {
 const query = searchTerm.toLowerCase();
 return (
 (patient.displayName || '').toLowerCase().includes(query) ||
 (patient.email || '').toLowerCase().includes(query) ||
 (patient.phoneNumber || '').includes(searchTerm)
 );
 });

 return (
 <div className="pt-24 pb-20 bg-background min-h-screen text-foreground overflow-x-hidden">
 <div className="container mx-auto px-4 max-w-7xl">
 <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-12">
 <div>
 <h1 className="text-4xl lg:text-5xl font-display font-bold text-foreground mb-4 flex items-center gap-4 tracking-tight">
 <div className="p-4 bg-primary text-white rounded-xl shadow-md shadow-primary/20">
 <Users className="w-9 h-9" />
 </div>
 База пациентов
 </h1>
 <p className="text-text-secondary text-lg font-medium max-w-2xl leading-relaxed">
 Управление профилями, контактами и медицинской историей пациентов Family Dent.
 </p>
 </div>
 <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
 <div className="relative w-full sm:w-96 group">
 <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/60 group-hover:text-primary transition-all" />
 <Input
 placeholder="Поиск по базе данных..."
 className="h-14 pl-14 pr-6 bg-white border-border rounded-xl text-base focus:ring-4 focus:ring-primary/10 text-foreground placeholder:text-text-secondary shadow-sm transition-all font-medium"
 value={searchTerm}
 onChange={(event) => setSearchTerm(event.target.value)}
 />
 </div>
 <div className="h-14 px-6 rounded-xl bg-secondary border border-border text-foreground font-bold text-xs uppercase tracking-[0.18em] flex items-center justify-center gap-3 shadow-sm">
 <ShieldCheck className="w-5 h-5 text-primary" />
 Пациентов: {patients.length}
 </div>
 </div>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
 {loading ? (
 Array(6)
 .fill(0)
 .map((_, index) => (
 <div key={index} className="h-80 bg-secondary animate-pulse rounded-xl border border-border" />
 ))
 ) : (
 filteredPatients.map((patient) => (
 <motion.div
 key={getPatientId(patient)}
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 className="group"
 >
 <Card className="rounded-xl border-border shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden bg-card border">
 <CardContent className="p-6">
 <div className="flex items-start justify-between mb-6">
 <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
 <User className="w-8 h-8" />
 </div>
 <div className="flex gap-3">
 <Button
 variant="ghost"
 size="icon"
 className="h-11 w-11 rounded-xl text-primary bg-primary/10 hover:bg-primary hover:text-white shadow-sm"
 onClick={() => fetchPatientDetails(patient)}
 title="Открыть карточку пациента"
 >
 <Eye className="w-5 h-5" />
 </Button>
 <Button
 variant="ghost"
 size="icon"
 className="h-11 w-11 rounded-xl text-error bg-error/10 hover:bg-error hover:text-white shadow-sm"
 onClick={() => handleDelete(patient)}
 title="Удалить пациента"
 >
 <Trash2 className="w-5 h-5" />
 </Button>
 </div>
 </div>

 <div className="mb-6">
 <h3 className="text-2xl font-display font-bold text-foreground mb-2 line-clamp-1 leading-tight">
 {patient.displayName || 'Пациент без имени'}
 </h3>
 <div className="flex items-center gap-2 text-sm text-text-secondary font-semibold break-all">
 <Mail className="w-4 h-4 text-primary shrink-0" />
 {patient.email || 'Email не указан'}
 </div>
 </div>

 <div className="space-y-4 mb-6">
 <div className="flex items-center gap-4 text-base text-text-secondary font-semibold">
 <span className="p-3 rounded-xl bg-secondary text-primary">
 <Phone className="w-5 h-5" />
 </span>
 {patient.phoneNumber || 'Без номера'}
 </div>
 <div className="flex items-center gap-4 text-base text-text-secondary font-semibold">
 <span className="p-3 rounded-xl bg-secondary text-primary">
 <Calendar className="w-5 h-5" />
 </span>
 С нами с{' '}
 {patient.createdAt ? new Date(patient.createdAt).toLocaleDateString('ru-RU') : 'неизвестной даты'}
 </div>
 </div>

 {getPatientId(patient) && (
 <Link
 to={`/profile/records/${getPatientId(patient)}`}
 className="w-full h-14 rounded-xl bg-primary/10 text-primary font-black text-xs uppercase tracking-[0.18em] flex items-center justify-center gap-3 hover:bg-primary hover:text-white transition-all active:scale-95"
 >
 Медицинская карта
 <ChevronRight className="w-5 h-5" />
 </Link>
 )}
 </CardContent>
 </Card>
 </motion.div>
 ))
 )}
 </div>

 {!loading && filteredPatients.length === 0 && (
 <div className="mt-10 text-center py-16 text-text-secondary font-bold border-2 border-dashed border-border rounded-xl">
 Пациенты не найдены
 </div>
 )}

 <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
 <DialogContent className="max-w-4xl rounded-xl p-0 overflow-hidden border border-border shadow-2xl bg-card">
 {selectedPatient && (
 <div className="max-h-[85vh] overflow-y-auto">
 <div className="bg-primary p-8 lg:p-10 text-white relative overflow-hidden">
 <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
 <div className="w-24 h-24 rounded-xl bg-white/20 backdrop-blur-xl flex items-center justify-center shadow-lg border border-white/20">
 <User className="w-12 h-12" />
 </div>
 <div className="text-center md:text-left min-w-0">
 <h2 className="text-3xl lg:text-4xl font-display font-bold mb-4 tracking-tight">
 {selectedPatient.patient?.displayName || 'Пациент без имени'}
 </h2>
 <div className="flex flex-wrap justify-center md:justify-start items-center gap-5 text-white/85 font-bold text-xs uppercase tracking-[0.12em]">
 <span className="flex items-center gap-2 break-all">
 <Mail className="w-4 h-4 shrink-0" /> {selectedPatient.patient?.email || 'Email не указан'}
 </span>
 <span className="flex items-center gap-2">
 <Phone className="w-4 h-4 shrink-0" /> {selectedPatient.patient?.phoneNumber || 'Телефон не указан'}
 </span>
 </div>
 </div>
 </div>
 </div>

 <div className="p-6 lg:p-10 space-y-10">
 <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
 <div className="p-6 rounded-xl bg-secondary border border-border">
 <div className="text-xs font-black text-text-secondary uppercase tracking-[0.16em] mb-3">
 Визитов в клинику
 </div>
 <div className="text-4xl font-display font-bold text-foreground">
 {selectedPatient.bookings?.length || 0}
 </div>
 </div>
 <div className="p-6 rounded-xl bg-secondary border border-border">
 <div className="text-xs font-black text-text-secondary uppercase tracking-[0.16em] mb-3">
 Медицинских карт
 </div>
 <div className="text-4xl font-display font-bold text-foreground">
 {selectedPatient.records?.length || 0}
 </div>
 </div>
 <div className="p-6 rounded-xl bg-secondary border border-border">
 <div className="text-xs font-black text-text-secondary uppercase tracking-[0.16em] mb-3">
 Последний прием
 </div>
 <div className="text-xl font-display font-bold text-foreground">
 {selectedPatient.bookings?.[0]?.date || 'Нет данных'}
 </div>
 </div>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
 <div className="p-5 rounded-xl bg-secondary border border-border">
 <div className="text-xs font-black text-text-secondary uppercase tracking-[0.16em] mb-2">
 Дата создания
 </div>
 <div className="font-bold text-foreground">
 {selectedPatient.patient?.createdAt ? new Date(selectedPatient.patient.createdAt).toLocaleString('ru-RU') : 'Нет данных'}
 </div>
 </div>
 <div className="p-5 rounded-xl bg-secondary border border-border">
 <div className="text-xs font-black text-text-secondary uppercase tracking-[0.16em] mb-2">
 Последнее обновление
 </div>
 <div className="font-bold text-foreground">
 {selectedPatient.patient?.updatedAt ? new Date(selectedPatient.patient.updatedAt).toLocaleString('ru-RU') : 'Нет данных'}
 </div>
 </div>
 </div>

 <div>
 <h4 className="text-xs font-black text-text-secondary uppercase tracking-[0.18em] mb-6 flex items-center gap-3">
 <Clock className="w-5 h-5 text-primary" />
 История посещений
 </h4>
 <div className="space-y-4">
 {(selectedPatient.bookings || []).length === 0 ? (
 <div className="text-center py-10 text-text-secondary font-bold border-2 border-dashed border-border rounded-xl">
 История посещений пуста
 </div>
 ) : (
 selectedPatient.bookings.map((booking: any) => (
 <div key={booking._id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl bg-card border border-border shadow-sm">
 <div className="flex items-center gap-5">
 <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-primary">
 <Calendar className="w-6 h-6" />
 </div>
 <div>
 <div className="text-lg font-display font-bold text-foreground">
 {booking.date} в {booking.time}
 </div>
 <div className="text-xs font-black text-text-secondary uppercase tracking-[0.1em] mt-1">
 Доктор: {booking.doctorName || 'Не указан'}
 </div>
 </div>
 </div>
 <Badge
 className={cn(
 'rounded-full px-5 py-2 border-none shadow-sm font-black text-[10px] uppercase tracking-widest',
 booking.status === 'confirmed'
 ? 'bg-success/10 text-success'
 : booking.status === 'completed'
 ? 'bg-primary/10 text-primary'
 : booking.status === 'pending'
 ? 'bg-warning/10 text-warning'
 : 'bg-error/10 text-error',
 )}
 >
 {booking.status || 'unknown'}
 </Badge>
 </div>
 ))
 )}
 </div>
 </div>

 <div>
 <h4 className="text-xs font-black text-text-secondary uppercase tracking-[0.18em] mb-6 flex items-center gap-3">
 <FileText className="w-5 h-5 text-primary" />
 Лечебная документация
 </h4>
 <div className="space-y-5">
 {(selectedPatient.records || []).length === 0 ? (
 <div className="text-center py-10 text-text-secondary font-bold border-2 border-dashed border-border rounded-xl">
 Медицинская документация не найдена
 </div>
 ) : (
 selectedPatient.records.map((record: any) => (
 <div key={record._id} className="p-6 rounded-xl bg-secondary border border-border">
 <div className="mb-5">
 <span className="text-xs font-black text-text-secondary uppercase tracking-[0.14em] block mb-2">
 Заключение специалиста
 </span>
 <div className="text-2xl font-display font-bold text-foreground">
 {record.diagnosis || 'Диагноз не указан'}
 </div>
 </div>
 <div>
 <span className="text-xs font-black text-text-secondary uppercase tracking-[0.14em] block mb-2">
 Назначенное лечение
 </span>
 <p className="text-text-secondary leading-relaxed font-semibold">
 {record.treatment || 'Лечение не указано'}
 </p>
 </div>
 <div className="mt-6 pt-5 border-t border-border text-xs font-black text-text-secondary uppercase tracking-[0.16em]">
 Лечащий врач: {record.doctorName || 'Не указан'}
 </div>
 </div>
 ))
 )}
 </div>
 </div>

 <div>
 <h4 className="text-xs font-black text-text-secondary uppercase tracking-[0.18em] mb-6 flex items-center gap-3">
 <ImageIcon className="w-5 h-5 text-primary" />
 Прикрепленные снимки и файлы
 </h4>
 {(selectedPatient.scans || []).length === 0 ? (
 <div className="text-center py-10 text-text-secondary font-bold border-2 border-dashed border-border rounded-xl">
 Файлы не прикреплены
 </div>
 ) : (
 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 {selectedPatient.scans.map((scan: any) => (
 <a key={scan._id || scan.id} href={scan.imageUrl} target="_blank" rel="noreferrer" className="p-4 rounded-xl bg-secondary border border-border hover:border-primary transition-all flex items-center justify-between gap-4">
 <div>
 <div className="font-bold text-foreground">{scan.description || scan.originalName || 'Файл медкарты'}</div>
 <div className="text-xs text-text-secondary mt-1">
 {scan.createdAt ? new Date(scan.createdAt).toLocaleDateString('ru-RU') : 'Нет даты'} • {scan.type || scan.mimeType || 'file'}
 </div>
 </div>
 <ExternalLink className="w-5 h-5 text-primary shrink-0" />
 </a>
 ))}
 </div>
 )}
 </div>
 </div>

 <DialogFooter className="p-6 bg-secondary border-t border-border flex items-center justify-center">
 <Button
 variant="outline"
 onClick={() => setIsDetailModalOpen(false)}
 className="h-14 px-10 rounded-xl border-border text-foreground font-black uppercase tracking-[0.14em] text-xs hover:bg-primary hover:text-white transition-all"
 >
 Закрыть медицинскую карту
 </Button>
 </DialogFooter>
 </div>
 )}
 </DialogContent>
 </Dialog>
 </div>
 </div>
 );
}

