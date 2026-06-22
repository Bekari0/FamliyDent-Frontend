import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import axios from 'axios';
import { Search, Plus, Star, Edit2, Trash2, Loader2, X, Image as ImageIcon, Briefcase, GraduationCap, Award, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../components/ui/button';

export function AdminDoctors() {
 const [doctors, setDoctors] = useState<any[]>([]);
 const [loading, setLoading] = useState(true);
 const [isModalOpen, setIsModalOpen] = useState(false);
 const [currentDoctor, setCurrentDoctor] = useState<any>(null);
 const [formData, setFormData] = useState({
 name: '',
 email: '',
 specialty: '',
 experience: '',
 image: '',
 description: '',
 education: '',
 achievements: '',
 password: ''
 });
 const [uploading, setUploading] = useState(false);

 const fetchDoctors = async () => {
 try {
 const response = await axios.get('/api/doctors');
 setDoctors(Array.isArray(response.data) ? response.data : []);
 } catch (error) {
 setDoctors([]);
 toast.error('Ошибка загрузки врачей');
 } finally {
 setLoading(false);
 }
 };

 useEffect(() => {
 fetchDoctors();
 }, []);

 const handleOpenModal = (doctor: any = null) => {
 if (doctor) {
 setCurrentDoctor(doctor);
 setFormData({
 name: doctor.name || '',
 email: doctor.email || '',
 specialty: doctor.specialty || '',
 experience: doctor.experience || '',
 image: doctor.image || '',
 description: doctor.description || '',
 education: Array.isArray(doctor.education) ? doctor.education.join('\n') : doctor.education || '',
 achievements: Array.isArray(doctor.achievements) ? doctor.achievements.join('\n') : doctor.achievements || '',
 password: ''
 });
 } else {
 setCurrentDoctor(null);
 setFormData({
 name: '',
 email: '',
 specialty: '',
 experience: '',
 image: '',
 description: '',
 education: '',
 achievements: '',
 password: ''
 });
 }
 setIsModalOpen(true);
 };

 const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
 if (!e.target.files?.length) return;
 const file = e.target.files[0];
 const uploadFormData = new FormData();
 uploadFormData.append('file', file);

 setUploading(true);
 try {
 const res = await axios.post('/api/upload', uploadFormData);
 setFormData({ ...formData, image: res.data.url });
 toast.success('Фото загружено');
 } catch (error) {
 toast.error('Ошибка загрузки файла');
 } finally {
 setUploading(false);
 }
 };

 const handleSubmit = async (e: React.FormEvent) => {
 e.preventDefault();
 const data: any = {
 ...formData,
 education: formData.education.split('\n').filter(s => s.trim()),
 achievements: formData.achievements.split('\n').filter(s => s.trim())
 };

 if (currentDoctor) {
 delete data.password;
 }

 try {
 if (currentDoctor) {
 await axios.patch(`/api/doctors/${currentDoctor._id || currentDoctor.id}`, data);
 toast.success('Данные врача обновлены');
 } else {
 await axios.post('/api/doctors', data);
 toast.success('Новый врач и аккаунт созданы');
 }
 setIsModalOpen(false);
 fetchDoctors();
 } catch (error: any) {
 toast.error(error.response?.data?.error || 'Ошибка при сохранении');
 }
 };

 const deleteDoctor = async (id: string) => {
 if (!window.confirm('Вы уверены, что хотите удалить этого врача?')) return;
 try {
 await axios.delete(`/api/doctors/${id}`);
 toast.success('Врач удален');
 fetchDoctors();
 } catch (error: any) {
 toast.error(error.response?.data?.error || 'Ошибка при удалении');
 }
 };

 return (
 <div className="pt-24 pb-20 bg-slate-50 min-h-screen">
 <div className="container mx-auto px-4">
 <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
 <div>
 <h1 className="text-3xl font-bold text-slate-900">Управление персоналом</h1>
 <p className="text-slate-500">Редактирование профилей врачей и сотрудников</p>
 </div>
 <button 
 onClick={() => handleOpenModal()}
 className="px-6 py-3 rounded-lg bg-primary text-white font-bold flex items-center gap-2 hover:brightness-110 transition-all shadow-md"
 >
 <Plus className="w-5 h-5" />
 Добавить врача
 </button>
 </div>

 {loading ? (
 <div className="flex flex-col items-center justify-center py-20">
 <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
 <p className="text-slate-400">Загрузка...</p>
 </div>
 ) : (
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
 {doctors.map((doctor, i) => (
 <motion.div 
 key={doctor._id || doctor.id}
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: i * 0.05 }}
 className="bg-white p-6 rounded-xl border border-slate-200 shadow-md flex flex-col"
 >
 <div className="flex items-center gap-4 mb-4">
 <img src={doctor.image || 'https://images.unsplash.com/photo-1559839734-2b71f1536780?q=80&w=2070'} alt={doctor.name} className="w-16 h-16 rounded-full object-cover" />
 <div>
 <h3 className="text-lg font-bold text-slate-900">{doctor.name}</h3>
 <p className="text-primary text-sm font-medium">{doctor.specialty}</p>
 </div>
 </div>

 <p className="text-slate-600 text-sm mb-6 line-clamp-3 flex-1">{doctor.description}</p>

 <div className="flex gap-2">
 <button 
 onClick={() => handleOpenModal(doctor)}
 className="flex-1 py-2 rounded-lg bg-slate-100 text-slate-600 font-bold text-sm hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
 >
 <Edit2 className="w-4 h-4" /> Править
 </button>
 <button 
 onClick={() => deleteDoctor(doctor._id || doctor.id!)}
 className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all border border-red-100"
 >
 <Trash2 className="w-5 h-5" />
 </button>
 </div>
 </motion.div>
 ))}
 </div>
 )}

 {/* Модальное окно */}
 <AnimatePresence>
 {isModalOpen && (
 <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
 <motion.div 
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 onClick={() => setIsModalOpen(false)}
 className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
 />
 <motion.div 
 initial={{ opacity: 0, scale: 0.95, y: 20 }}
 animate={{ opacity: 1, scale: 1, y: 0 }}
 exit={{ opacity: 0, scale: 0.95, y: 20 }}
 className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden"
 >
 <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
 <h2 className="text-xl font-bold">{currentDoctor ? 'Редактировать врача' : 'Добавить врача'}</h2>
 <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors">
 <X size={20} />
 </button>
 </div>
 <form onSubmit={handleSubmit} className="p-6 max-h-[70vh] overflow-y-auto space-y-4">
 <div className="grid md:grid-cols-2 gap-4">
 <div className="space-y-1">
 <label className="text-sm font-medium text-slate-700">ФИО</label>
 <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/20 outline-none" />
 </div>
 <div className="space-y-1">
 <label className="text-sm font-medium text-slate-700">Email</label>
 <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/20 outline-none" />
 </div>
 </div>

 {!currentDoctor && (
 <div className="space-y-1">
 <label className="text-sm font-medium text-slate-700">Пароль</label>
 <input required type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/20 outline-none" />
 </div>
 )}

 <div className="grid md:grid-cols-2 gap-4">
 <div className="space-y-1">
 <label className="text-sm font-medium text-slate-700">Специализация</label>
 <input required type="text" value={formData.specialty} onChange={e => setFormData({...formData, specialty: e.target.value})} className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/20 outline-none" />
 </div>
 <div className="space-y-1">
 <label className="text-sm font-medium text-slate-700">Опыт</label>
 <input required type="text" value={formData.experience} onChange={e => setFormData({...formData, experience: e.target.value})} className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/20 outline-none" />
 </div>
 </div>

 <div className="space-y-1">
 <label className="text-sm font-medium text-slate-700">Фото (URL)</label>
 <div className="flex gap-2">
 <input type="text" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} className="flex-1 px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/20 outline-none" />
 <input type="file" onChange={handleFileUpload} className="hidden" id="doctor-photo" accept="image/*" />
 <label htmlFor="doctor-photo" className="px-4 py-2 rounded-lg bg-slate-100 flex items-center justify-center cursor-pointer hover:bg-slate-200 transition-colors">
 {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ImageIcon className="w-5 h-5" />}
 </label>
 </div>
 </div>

 <div className="space-y-1">
 <label className="text-sm font-medium text-slate-700">Описание</label>
 <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full h-24 px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/20 outline-none resize-none" />
 </div>

 <div className="grid md:grid-cols-2 gap-4">
 <div className="space-y-1">
 <label className="text-sm font-medium text-slate-700">Образование</label>
 <textarea value={formData.education} onChange={e => setFormData({...formData, education: e.target.value})} className="w-full h-24 px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/20 outline-none resize-none" placeholder="По одной строке..." />
 </div>
 <div className="space-y-1">
 <label className="text-sm font-medium text-slate-700">Достижения</label>
 <textarea value={formData.achievements} onChange={e => setFormData({...formData, achievements: e.target.value})} className="w-full h-24 px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/20 outline-none resize-none" placeholder="По одной строке..." />
 </div>
 </div>

 <div className="pt-4 flex gap-3">
 <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 rounded-lg">Отмена</Button>
 <Button type="submit" className="flex-1 py-3 rounded-lg bg-primary text-white">Сохранить</Button>
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

