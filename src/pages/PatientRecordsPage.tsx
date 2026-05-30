import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
 Shield, FileText, Lock, ChevronLeft, Loader2, 
 PlusCircle, X, Calendar as CalendarIcon, 
 Activity, Image as ImageIcon, Stethoscope, ClipboardCheck, 
 AlertCircle, Upload, Trash2, ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import axios from 'axios';
import { MedicalRecord, Scan, Recommendation } from '@/types';
import { PatientMedicalCard } from '@/components/medical/PatientMedicalCard';

type TabType = 'history' | 'card' | 'scans' | 'recommendations';

export function PatientRecordsPage() {
 const { patientId: routePatientId } = useParams<{ patientId: string }>();
 const { user, isDoctor, isAdmin } = useAuth();
 const [activeTab, setActiveTab] = useState<TabType>('history');
 const [loading, setLoading] = useState(true);
 const [patientData, setPatientData] = useState<any>(null);
 
 const effectivePatientId = routePatientId || user?.uid || user?.id;

 const [records, setRecords] = useState<MedicalRecord[]>([]);
 const [scans, setScans] = useState<Scan[]>([]);
 const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
 
 const [showAddModal, setShowAddModal] = useState(false);
 const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);

 // Form states for adding data
 const [newRecord, setNewRecord] = useState({ procedureTitle: '', details: '', toothNumber: '', price: '' });
 const [newScan, setNewScan] = useState({ description: '', type: 'x-ray' as any, imageUrl: '', originalName: '', mimeType: '', size: 0 });
 const [newRec, setNewRec] = useState({ content: '', nextVisitDate: '' });
 const [uploadingScan, setUploadingScan] = useState(false);

 // Fetching data
 useEffect(() => {
 const fetchData = async () => {
 if (!effectivePatientId) return;
 
 setLoading(true);
 try {
 // Also fetch profile if it's a doctor/admin viewing a patient
 if (effectivePatientId !== user?.uid) {
 try {
 const profileRes = await axios.get(`/api/admin/patients/${effectivePatientId}`);
 setPatientData(profileRes.data.patient);
 } catch (profileErr) {
 console.warn('Patient profile fetch failed (non-critical):', profileErr);
 setPatientData({ displayName: 'Пациент' });
 }
 }

 const [recordsRes, scansRes, recsRes] = await Promise.all([
 axios.get(`/api/medical/history/${effectivePatientId}`),
 axios.get(`/api/medical/scans/${effectivePatientId}`),
 axios.get(`/api/medical/recommendations/${effectivePatientId}`)
 ]);
 setRecords(recordsRes.data);
 setScans(scansRes.data);
 setRecommendations(recsRes.data);
 } catch (error) {
 console.error('Error fetching medical data:', error);
 toast.error('Ошибка при загрузке данных');
 } finally {
 setLoading(false);
 }
 };

 fetchData();
 }, [effectivePatientId, user]);

 const handleAddData = async () => {
 if (!effectivePatientId) return;
 try {
 if (activeTab === 'history') {
 if (!newRecord.procedureTitle || !newRecord.details) return toast.error('Заполните обязательные поля');
 const res = await axios.post('/api/medical/history', {
 ...newRecord,
 patientId: effectivePatientId,
 price: Number(newRecord.price) || 0
 });
 setRecords([res.data, ...records]);
 } else if (activeTab === 'scans') {
 if (!newScan.imageUrl) return toast.error('Загрузите файл снимка');
 const res = await axios.post('/api/medical/scans', {
 ...newScan,
 patientId: effectivePatientId
 });
 setScans([res.data, ...scans]);
 } else if (activeTab === 'recommendations') {
 if (!newRec.content) return toast.error('Введите содержание рекомендации');
 const res = await axios.post('/api/medical/recommendations', {
 ...newRec,
 patientId: effectivePatientId,
 isCompleted: false
 });
 setRecommendations([res.data, ...recommendations]);
 }
 setShowAddModal(false);
 toast.success('Запись добавлена');
 // Reset forms
 setNewRecord({ procedureTitle: '', details: '', toothNumber: '', price: '' });
 setNewScan({ description: '', type: 'x-ray', imageUrl: '', originalName: '', mimeType: '', size: 0 });
 setNewRec({ content: '', nextVisitDate: '' });
 } catch (error) {
 console.error('Error adding medical data:', error);
 toast.error('Доступ запрещен или произошла ошибка');
 }
 };

 const handleScanUpload = async (file: File) => {
 const formData = new FormData();
 formData.append('file', file);
 setUploadingScan(true);
 try {
 const response = await axios.post('/api/upload', formData, {
 headers: { 'Content-Type': 'multipart/form-data' }
 });
 setNewScan({
 ...newScan,
 imageUrl: response.data.url,
 originalName: response.data.originalName,
 mimeType: response.data.mimeType,
 size: response.data.size,
 type: response.data.mimeType === 'application/pdf' ? 'pdf' : newScan.type
 });
 toast.success('Файл загружен');
 } catch (error: any) {
 toast.error(error.response?.data?.error || 'Ошибка загрузки файла');
 } finally {
 setUploadingScan(false);
 }
 };

 const handleDeleteScan = async (scanId: string) => {
 if (!window.confirm('Удалить этот файл?')) return;
 try {
 await axios.delete(`/api/medical/scans/${scanId}`);
 setScans((prev) => prev.filter((scan: any) => (scan._id || scan.id) !== scanId));
 toast.success('Файл удален');
 } catch (error: any) {
 toast.error(error.response?.data?.error || 'Ошибка удаления файла');
 }
 };

 const tabs = [
 { id: 'history', label: 'История', icon: FileText },
 { id: 'card', label: 'Мед. карта', icon: Shield },
 { id: 'scans', label: 'Снимки', icon: ImageIcon },
 { id: 'recommendations', label: 'Советы', icon: ClipboardCheck },
 ] as const;

 return (
 <div className="pt-24 pb-20 bg-background min-h-screen">
 <div className="container mx-auto px-4 max-w-5xl">
 <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
 <Button variant="ghost" asChild className="hover:bg-primary/5 rounded-xl text-primary/40 hover:text-primary transition-colors">
 <Link to={isDoctor ? "/doctor/dashboard" : (isAdmin ? "/admin/patients" : "/profile")} className="flex items-center gap-2 font-black text-[10px] uppercase tracking-widest">
 <ChevronLeft className="w-4 h-4" />
 Вернуться назад
 </Link>
 </Button>

 <div className="flex bg-white p-1 rounded-3xl border border-primary/10 shadow-sm overflow-x-auto max-w-full no-scrollbar">
 {tabs.map((tab) => (
 <button
 key={tab.id}
 onClick={() => setActiveTab(tab.id as TabType)}
 className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${
 activeTab === tab.id 
 ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-105' 
 : 'text-primary/40 hover:text-primary/60'
 }`}
 >
 <tab.icon className="w-4 h-4" />
 {tab.label}
 </button>
 ))}
 </div>

 {(isDoctor || isAdmin) && activeTab !== 'card' && (
 <Button 
 onClick={() => setShowAddModal(true)}
 className="rounded-2xl shadow-xl shadow-primary/20 bg-primary text-white font-bold h-12 px-6"
 >
 <PlusCircle className="w-4 h-4 mr-2" />
 Добавить
 </Button>
 )}
 </div>

 <motion.div 
 key={activeTab}
 initial={{ opacity: 0, scale: 0.98 }}
 animate={{ opacity: 1, scale: 1 }}
 className="bg-white rounded-[50px] p-8 md:p-12 border border-primary/5 shadow-2xl shadow-primary/5 relative overflow-hidden"
 >
 <div className="flex flex-col md:flex-row items-center justify-between gap-10 mb-16">
 <div className="flex items-center gap-8">
 <div className="w-24 h-24 bg-primary/5 rounded-[40px] flex items-center justify-center text-primary shadow-inner">
 {activeTab === 'history' && <Stethoscope className="w-10 h-10" />}
 {activeTab === 'card' && <Shield className="w-10 h-10" />}
 {activeTab === 'scans' && <ImageIcon className="w-10 h-10" />}
 {activeTab === 'recommendations' && <ClipboardCheck className="w-10 h-10" />}
 </div>
 <div>
 <h1 className="text-4xl font-display font-bold text-foreground mb-2">
 {tabs.find(t => t.id === activeTab)?.label}
 </h1>
 <p className="text-text-secondary font-medium">
 {activeTab === 'history' && (patientData ? `История лечения: ${patientData.displayName}` : "История ваших посещений и проведенных процедур")}
 {activeTab === 'card' && (patientData ? `Мед. карта: ${patientData.displayName}` : "Общая медицинская информация, аллергии и противопоказания")}
 {activeTab === 'scans' && (patientData ? `Снимки: ${patientData.displayName}` : "Ваши рентгенограммы и другие диагностические снимки")}
 {activeTab === 'recommendations' && (patientData ? `Советы: ${patientData.displayName}` : "Советы врача и график профилактических визитов")}
 </p>
 </div>
 </div>
 <div className="px-6 py-3 bg-white text-foreground rounded-2xl flex items-center gap-3 text-[10px] font-black uppercase tracking-widest border border-border shadow-sm">
 <Lock className="w-4 h-4 text-primary/60" />
 Данные защищены
 </div>
 </div>

 {loading ? (
 <div className="flex flex-col items-center justify-center py-20">
 <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
 <p className="text-text-secondary font-bold uppercase tracking-widest text-[10px]">Загрузка данных...</p>
 </div>
 ) : (
 <div className="min-h-[400px]">
 {activeTab === 'history' && (
 records.length === 0 ? (
 <EmptyState icon={FileText} message="История лечений пуста" />
 ) : (
 <div className="space-y-6">
 {records.map((record, i) => (
 <HistoryItem key={record.id || i} record={record} onClick={() => setSelectedRecord(record)} index={i} />
 ))}
 </div>
 )
 )}

 {activeTab === 'card' && effectivePatientId && (
 <PatientMedicalCard patientId={effectivePatientId} isEditable={isDoctor || isAdmin} />
 )}

 {activeTab === 'scans' && (
 scans.length === 0 ? (
 <EmptyState icon={ImageIcon} message="Снимков пока нет" />
 ) : (
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
 {scans.map((scan, i) => (
 <ScanItem key={scan.id || i} scan={scan} index={i} canDelete={isDoctor || isAdmin} onDelete={handleDeleteScan} />
 ))}
 </div>
 )
 )}

 {activeTab === 'recommendations' && (
 recommendations.length === 0 ? (
 <EmptyState icon={ClipboardCheck} message="Нет активных рекомендаций" />
 ) : (
 <div className="space-y-4">
 {recommendations.map((rec, i) => (
 <RecommendationItem key={rec.id || i} rec={rec} index={i} />
 ))}
 </div>
 )
 )}
 </div>
 )}
 </motion.div>
 </div>

 <AnimatePresence>
 {selectedRecord && (
 <RecordDetailModal record={selectedRecord} onClose={() => setSelectedRecord(null)} />
 )}
 {showAddModal && (
 <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAddModal(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
 <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-md bg-white rounded-[40px] p-10 shadow-2xl overflow-hidden">
 <div className="flex justify-between items-center mb-8">
 <h3 className="text-3xl font-display font-bold text-foreground">Добавить данные</h3>
 <button onClick={() => setShowAddModal(false)} className="p-2 text-primary/20 hover:text-primary transition-colors"><X/></button>
 </div>
 
 {activeTab === 'history' && (
 <div className="space-y-4">
 <InputField label="Процедура" value={newRecord.procedureTitle} onChange={(v: string) => setNewRecord({...newRecord, procedureTitle: v})} placeholder="Напр. Гигиеническая чистка" />
 <InputField label="Детали" value={newRecord.details} onChange={(v: string) => setNewRecord({...newRecord, details: v})} textarea placeholder="Описание процедуры..." />
 <div className="grid grid-cols-2 gap-4">
 <InputField label="Зуб" value={newRecord.toothNumber} onChange={(v: string) => setNewRecord({...newRecord, toothNumber: v})} placeholder="№ зуба" />
 <InputField label="Цена" value={newRecord.price} onChange={(v: string) => setNewRecord({...newRecord, price: v})} placeholder="Цена" />
 </div>
 </div>
 )}

 {activeTab === 'scans' && (
 <div className="space-y-4">
 <div>
 <label className="block text-[10px] font-black uppercase tracking-widest text-foreground/60 mb-2 ml-2">Файл снимка</label>
 <label className="w-full min-h-24 bg-secondary border border-border rounded-2xl p-4 font-bold text-foreground flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-primary transition-all">
 {uploadingScan ? <Loader2 className="w-6 h-6 animate-spin text-primary" /> : <Upload className="w-6 h-6 text-primary" />}
 <span className="text-sm text-center">{newScan.originalName || 'Загрузить jpg, png, webp или pdf'}</span>
 <input type="file" accept="image/jpeg,image/png,image/webp,application/pdf" className="hidden" onChange={(e) => e.target.files?.[0] && handleScanUpload(e.target.files[0])} />
 </label>
 </div>
 <InputField label="Описание" value={newScan.description} onChange={(v: string) => setNewScan({...newScan, description: v})} placeholder="Напр. Верхняя челюсть" />
 <div>
 <label className="block text-[10px] font-black uppercase tracking-widest text-text-secondary mb-2 ml-2">Тип снимка</label>
 <select 
 value={newScan.type} 
 onChange={e => setNewScan({...newScan, type: e.target.value as any})}
 className="w-full bg-secondary border border-border rounded-2xl p-4 font-bold text-foreground focus:outline-none"
 >
 <option value="x-ray">Рентген</option>
 <option value="photo">Фото</option>
 <option value="panorama">Панорама</option>
 <option value="pdf">PDF</option>
 </select>
 </div>
 </div>
 )}

 {activeTab === 'recommendations' && (
 <div className="space-y-4">
 <InputField label="Текст рекомендации" value={newRec.content} onChange={(v: string) => setNewRec({...newRec, content: v})} textarea placeholder="Напр. Использовать зубную нить..." />
 <InputField label="Следующий визит" value={newRec.nextVisitDate} onChange={(v: string) => setNewRec({...newRec, nextVisitDate: v})} type="date" />
 </div>
 )}

 <div className="flex gap-4 mt-10">
 <Button onClick={() => setShowAddModal(false)} variant="ghost" className="flex-1 rounded-2xl font-bold h-14">Отмена</Button>
 <Button onClick={handleAddData} className="flex-1 rounded-2xl bg-primary text-white font-bold h-14 shadow-xl shadow-primary/20">Добавить</Button>
 </div>
 </motion.div>
 </div>
 )}
 </AnimatePresence>
 </div>
 );
}

const EmptyState = ({ icon: Icon, message }: { icon: any, message: string }) => (
 <div className="text-center py-24 bg-secondary rounded-[40px] border border-dashed border-border">
 <Icon className="w-16 h-16 text-primary/20 mx-auto mb-6" />
 <p className="text-text-secondary font-bold text-lg tracking-tight">{message}</p>
 </div>
);

const HistoryItem = ({ record, onClick, index }: any) => (
 <motion.div 
 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}
 onClick={onClick}
 className="group cursor-pointer flex flex-col sm:flex-row items-center justify-between p-8 rounded-[40px] bg-primary/5 border border-transparent hover:border-primary/20 transition-all hover:bg-white hover:shadow-2xl hover:shadow-primary/5"
 >
 <div className="flex items-center gap-8 mb-6 sm:mb-0">
 <div className="w-16 h-16 bg-white rounded-[24px] flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
 <FileText className="w-8 h-8" />
 </div>
 <div>
 <div className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] mb-2 leading-none">
 {new Date(record.createdAt).toLocaleDateString('ru-RU')}
 </div>
 <h3 className="text-2xl font-display font-bold text-foreground mb-1 transition-all leading-none">{record.procedureTitle}</h3>
 <div className="flex items-center gap-4 mt-3">
 {record.toothNumber && <span className="text-[10px] bg-white px-3 py-1 rounded-full border border-primary/10 font-black text-primary/60">ЗУБ №{record.toothNumber}</span>}
 <div className="text-xs text-text-secondary font-bold">Детали зафиксированы</div>
 </div>
 </div>
 </div>
 <div className="text-primary/10 group-hover:text-primary/30 transition-colors">
 <ChevronLeft className="rotate-180 w-8 h-8" />
 </div>
 </motion.div>
);

const ScanItem = ({ scan, index, canDelete, onDelete }: any) => (
 <motion.div 
 initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.05 }}
 className="group bg-primary/5 rounded-[32px] overflow-hidden border border-transparent hover:border-primary/20 transition-all hover:bg-white hover:shadow-xl"
 >
 <div className="aspect-square bg-slate-100 relative overflow-hidden">
 <img src={scan.imageUrl || 'https://images.unsplash.com/photo-1551076805-e1869033e561?q=80&w=400&h=400&fit=crop'} alt={scan.description} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
 <div className="absolute top-4 left-4">
 <span className="px-4 py-2 bg-white/90 backdrop-blur-sm rounded-xl text-[10px] font-black uppercase text-primary shadow-sm">
 {scan.type}
 </span>
 </div>
 </div>
 <div className="p-6">
 <div className="text-[9px] font-black text-text-secondary uppercase tracking-widest mb-1">{new Date(scan.createdAt).toLocaleDateString('ru-RU')}</div>
 <h4 className="font-bold text-foreground tracking-tight leading-tight mb-2">{scan.description || 'Диагностический снимок'}</h4>
 <div className="flex gap-2">
 <a href={scan.imageUrl} target="_blank" rel="noreferrer" className="flex-1 py-3 bg-white border border-primary/10 rounded-xl text-[10px] font-black uppercase text-primary/60 hover:bg-primary hover:text-white hover:border-primary transition-all flex items-center justify-center gap-2">
 <ExternalLink className="w-4 h-4" />
 Открыть
 </a>
 {canDelete && (
 <button onClick={() => onDelete(scan._id || scan.id)} className="w-11 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all flex items-center justify-center" title="Удалить файл">
 <Trash2 className="w-4 h-4" />
 </button>
 )}
 </div>
 </div>
 </motion.div>
);

const RecommendationItem = ({ rec, index }: any) => (
 <motion.div 
 initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }}
 className="flex gap-6 p-8 rounded-[32px] bg-white border border-primary/10 shadow-sm relative overflow-hidden group"
 >
 <div className={`w-14 h-14 shrink-0 rounded-2xl flex items-center justify-center ${rec.isCompleted ? 'bg-green-50 text-green-500' : 'bg-primary/5 text-primary'}`}>
 {rec.isCompleted ? <ClipboardCheck /> : <AlertCircle />}
 </div>
 <div className="flex-1">
 <div className="flex items-center justify-between gap-4 mb-2">
 <div className="text-[10px] font-black text-text-secondary uppercase tracking-widest">
 Рекомендация от {new Date(rec.createdAt).toLocaleDateString()}
 </div>
 {rec.nextVisitDate && (
 <div className="px-4 py-1.5 bg-primary/5 text-primary rounded-full text-[9px] font-black uppercase">
 Визит: {new Date(rec.nextVisitDate).toLocaleDateString()}
 </div>
 )}
 </div>
 <p className="text-foreground font-medium leading-relaxed">{rec.content}</p>
 </div>
 </motion.div>
);

const InputField = ({ label, value, onChange, textarea, placeholder, type = "text" }: any) => (
 <div>
 <label className="block text-[10px] font-black uppercase tracking-widest text-text-secondary mb-2 ml-2">{label}</label>
 {textarea ? (
 <textarea 
 value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
 className="w-full bg-secondary border border-border rounded-2xl p-4 font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none h-32"
 />
 ) : (
 <input 
 type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
 className="w-full bg-secondary border border-border rounded-2xl p-4 font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
 />
 )}
 </div>
);

const RecordDetailModal = ({ record, onClose }: { record: MedicalRecord, onClose: () => void }) => (
 <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
 <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-[600px] bg-white rounded-[40px] shadow-2xl overflow-hidden text-slate-800 p-12">
 <div className="flex items-center justify-between mb-12">
 <div className="flex items-center gap-4">
 <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
 <Activity size={24} />
 </div>
 <div>
 <h2 className="text-2xl font-bold tracking-tight">Детали лечения</h2>
 <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Информация защищена</p>
 </div>
 </div>
 <button onClick={onClose} className="p-2 text-slate-300 hover:text-slate-600 transition-colors">
 <X size={24} />
 </button>
 </div>
 
 <div className="space-y-10">
 <div className="grid grid-cols-2 gap-8">
 <div className="space-y-2">
 <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
 <CalendarIcon size={12} /> Дата приема
 </p>
 <p className="font-bold text-slate-900 text-lg">{new Date(record.createdAt).toLocaleDateString('ru-RU')}</p>
 </div>
 {record.toothNumber && (
 <div className="space-y-2">
 <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Номер зуба</p>
 <p className="font-bold text-slate-900 text-lg">{record.toothNumber}</p>
 </div>
 )}
 </div>

 <div className="space-y-4">
 <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Процедура</p>
 <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10 text-slate-900 font-bold text-xl italic tracking-tight">
 {record.procedureTitle}
 </div>
 </div>

 <div className="space-y-4">
 <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Протокол лечения</p>
 <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 text-slate-700 whitespace-pre-wrap leading-relaxed font-medium shadow-inner">
 {record.details}
 </div>
 </div>

 <div className="pt-6 flex justify-end">
 <Button onClick={onClose} className="rounded-2xl bg-primary text-white px-12 h-14 font-bold shadow-xl shadow-primary/30">
 Закрыть
 </Button>
 </div>
 </div>
 </motion.div>
 </div>
);

