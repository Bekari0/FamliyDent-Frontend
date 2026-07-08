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
 <h1 className="text-4xl lg:text-5xl font-display font-semibold text-foreground mb-4 flex items-center gap-4 tracking-tight">
 <div className="p-4 bg-primary text-primary-foreground rounded-md shadow-md shadow-primary/20">
 <Users className="w-9 h-9" />
 </div>
 База пациентов
 </h1>
 <p className="text-muted-foreground text-lg font-medium max-w-2xl leading-relaxed">
 Управление профилями, контактами и медицинской историей пациентов Family Dent.
 </p>
 </div>
 <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
 <div className="relative w-full sm:w-96 group">
 <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/60 group-hover:text-primary transition-all" />
 <Input
 placeholder="Поиск по базе данных..."
 className="h-14 pl-14 pr-6 bg-card border-border rounded-md text-base focus:ring-4 focus:ring-primary/10 text-foreground placeholder:text-muted-foreground shadow-sm transition-all font-medium"
 value={searchTerm}
 onChange={(event) => setSearchTerm(event.target.value)}
 />
 </div>
 <div className="h-14 px-6 rounded-md bg-secondary border border-border text-foreground font-semibold text-xs uppercase tracking-[0.18em] flex items-center justify-center gap-3 shadow-sm">
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
 <div key={index} className="h-80 bg-secondary animate-pulse rounded-md border border-border" />
 ))
 ) : (
 filteredPatients.map((patient) => (
 <motion.div
 key={getPatientId(patient)}
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 className="group"
 >
 <Card className="rounded-lg border-border shadow-sm hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 overflow-hidden bg-card border group-hover:border-primary/30">
 <CardContent className="p-5 sm:p-6">
 <div className="flex items-start justify-between gap-4 mb-6">
 <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg bg-secondary border border-border flex items-center justify-center text-primary shrink-0">
 <User className="w-8 h-8" />
 </div>
 <div className="flex gap-2 shrink-0">
 <Button
 variant="ghost"
 size="icon"
 className="h-11 w-11 rounded-md !text-primary bg-primary/10 hover:!bg-primary hover:!text-primary-foreground shadow-sm border border-primary/10"
 onClick={() => fetchPatientDetails(patient)}
 title="Открыть карточку пациента"
 >
 <Eye className="w-5 h-5" />
 </Button>
 <Button
 variant="ghost"
 size="icon"
 className="h-11 w-11 rounded-md !text-error bg-error/10 hover:!bg-error hover:!text-primary-foreground shadow-sm border border-error/10"
 onClick={() => handleDelete(patient)}
 title="Удалить пациента"
 >
 <Trash2 className="w-5 h-5" />
 </Button>
 </div>
 </div>

 <div className="mb-6 min-w-0">
 <h3 className="text-xl sm:text-2xl font-display font-semibold text-foreground mb-3 line-clamp-1 leading-tight">
 {patient.displayName || 'Пациент без имени'}
 </h3>
 <div className="flex items-start gap-2 text-sm text-muted-foreground font-semibold break-all leading-relaxed">
 <Mail className="w-4 h-4 text-primary shrink-0" />
 {patient.email || 'Email не указан'}
 </div>
 </div>

 <div className="space-y-3 mb-6">
 <div className="flex items-center gap-3 text-sm sm:text-base text-muted-foreground font-semibold">
 <span className="p-2.5 rounded-md bg-secondary text-primary border border-border shrink-0">
 <Phone className="w-5 h-5" />
 </span>
 <span className="min-w-0 break-words">{patient.phoneNumber || 'Без номера'}</span>
 </div>
 <div className="flex items-center gap-3 text-sm sm:text-base text-muted-foreground font-semibold">
 <span className="p-2.5 rounded-md bg-secondary text-primary border border-border shrink-0">
 <Calendar className="w-5 h-5" />
 </span>
 <span className="min-w-0">С нами с{' '}
 {patient.createdAt ? new Date(patient.createdAt).toLocaleDateString('ru-RU') : 'неизвестной даты'}
 </span>
 </div>
 </div>

 {getPatientId(patient) && (
 <Link
 to={`/profile/records/${getPatientId(patient)}`}
 className="w-full min-h-12 rounded-md bg-primary/10 text-primary font-semibold text-xs uppercase tracking-[0.16em] flex items-center justify-center gap-3 hover:bg-primary hover:text-primary-foreground transition-all active:scale-95 px-4 text-center"
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
 <div className="mt-10 text-center py-16 text-muted-foreground font-semibold border-2 border-dashed border-border rounded-md">
 Пациенты не найдены
 </div>
 )}

 <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
 <DialogContent className="max-w-6xl w-[calc(100vw-2rem)] rounded-lg p-0 overflow-hidden border border-border shadow-2xl bg-card">
 {selectedPatient && (
 <div className="max-h-[88vh] overflow-y-auto no-scrollbar">
 <div className="bg-primary p-8 lg:p-10 text-primary-foreground relative overflow-hidden">
 <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
 <div className="w-24 h-24 rounded-md bg-card/20 backdrop-blur-xl flex items-center justify-center shadow-lg border border-primary-foreground/20">
 <User className="w-12 h-12" />
 </div>
 <div className="text-center md:text-left min-w-0">
 <h2 className="text-3xl lg:text-4xl font-display font-semibold mb-4 tracking-tight">
 {selectedPatient.patient?.displayName || 'Пациент без имени'}
 </h2>
 <div className="flex flex-wrap justify-center md:justify-start items-center gap-5 text-primary-foreground/85 font-semibold text-xs uppercase tracking-[0.12em]">
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
 <div className="p-6 rounded-md bg-secondary border border-border">
 <div className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.16em] mb-3">
 Визитов в клинику
 </div>
 <div className="text-4xl font-display font-semibold text-foreground">
 {selectedPatient.bookings?.length || 0}
 </div>
 </div>
 <div className="p-6 rounded-md bg-secondary border border-border">
 <div className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.16em] mb-3">
 Медицинских карт
 </div>
 <div className="text-4xl font-display font-semibold text-foreground">
 {selectedPatient.records?.length || 0}
 </div>
 </div>
 <div className="p-6 rounded-md bg-secondary border border-border">
 <div className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.16em] mb-3">
 Последний прием
 </div>
 <div className="text-xl font-display font-semibold text-foreground">
 {selectedPatient.bookings?.[0]?.date || 'Нет данных'}
 </div>
 </div>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
 <div className="p-5 rounded-md bg-secondary border border-border">
 <div className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.16em] mb-2">
 Дата создания
 </div>
 <div className="font-semibold text-foreground">
 {selectedPatient.patient?.createdAt ? new Date(selectedPatient.patient.createdAt).toLocaleString('ru-RU') : 'Нет данных'}
 </div>
 </div>
 <div className="p-5 rounded-md bg-secondary border border-border">
 <div className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.16em] mb-2">
 Последнее обновление
 </div>
 <div className="font-semibold text-foreground">
 {selectedPatient.patient?.updatedAt ? new Date(selectedPatient.patient.updatedAt).toLocaleString('ru-RU') : 'Нет данных'}
 </div>
 </div>
 </div>

 <div>
 <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.18em] mb-6 flex items-center gap-3">
 <Clock className="w-5 h-5 text-primary" />
 История посещений
 </h4>
 <div className="space-y-4">
 {(selectedPatient.bookings || []).length === 0 ? (
 <div className="text-center py-10 text-muted-foreground font-semibold border-2 border-dashed border-border rounded-md">
 История посещений пуста
 </div>
 ) : (
 selectedPatient.bookings.map((booking: any) => (
 <div key={booking._id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-md bg-card border border-border shadow-sm">
 <div className="flex items-center gap-5">
 <div className="w-12 h-12 rounded-md bg-secondary flex items-center justify-center text-primary">
 <Calendar className="w-6 h-6" />
 </div>
 <div>
 <div className="text-lg font-display font-semibold text-foreground">
 {booking.date} в {booking.time}
 </div>
 <div className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.1em] mt-1">
 Доктор: {booking.doctorName || 'Не указан'}
 </div>
 </div>
 </div>
 <Badge
 className={cn(
 'rounded-full px-5 py-2 border-none shadow-sm font-semibold text-[10px] uppercase tracking-[0.18em]',
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
 <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.18em] mb-6 flex items-center gap-3">
 <FileText className="w-5 h-5 text-primary" />
 Лечебная документация
 </h4>
 <div className="space-y-5">
 {(selectedPatient.records || []).length === 0 ? (
 <div className="text-center py-10 text-muted-foreground font-semibold border-2 border-dashed border-border rounded-md">
 Медицинская документация не найдена
 </div>
 ) : (
 selectedPatient.records.map((record: any) => (
 <div key={record._id} className="p-6 rounded-md bg-secondary border border-border">
 <div className="mb-5">
 <span className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.14em] block mb-2">
 Заключение специалиста
 </span>
 <div className="text-2xl font-display font-semibold text-foreground">
 {record.diagnosis || 'Диагноз не указан'}
 </div>
 </div>
 <div>
 <span className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.14em] block mb-2">
 Назначенное лечение
 </span>
 <p className="text-muted-foreground leading-relaxed font-semibold">
 {record.treatment || 'Лечение не указано'}
 </p>
 </div>
 <div className="mt-6 pt-5 border-t border-border text-xs font-semibold text-muted-foreground uppercase tracking-[0.16em]">
 Лечащий врач: {record.doctorName || 'Не указан'}
 </div>
 </div>
 ))
 )}
 </div>
 </div>

 <div>
 <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.18em] mb-6 flex items-center gap-3">
 <ImageIcon className="w-5 h-5 text-primary" />
 Прикрепленные снимки и файлы
 </h4>
 {(selectedPatient.scans || []).length === 0 ? (
 <div className="text-center py-10 text-muted-foreground font-semibold border-2 border-dashed border-border rounded-md">
 Файлы не прикреплены
 </div>
 ) : (
 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 {selectedPatient.scans.map((scan: any) => (
 <a key={scan._id || scan.id} href={scan.imageUrl} target="_blank" rel="noreferrer" className="p-4 rounded-md bg-secondary border border-border hover:border-primary transition-all flex items-center justify-between gap-4">
 <div>
 <div className="font-semibold text-foreground">{scan.description || scan.originalName || 'Файл медкарты'}</div>
 <div className="text-xs text-muted-foreground mt-1">
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
 className="h-14 px-10 rounded-md border-border text-foreground font-semibold uppercase tracking-[0.14em] text-xs hover:bg-primary hover:text-primary-foreground transition-all"
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

