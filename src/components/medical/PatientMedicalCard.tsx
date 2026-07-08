import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Shield, Save, Loader2, AlertCircle, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { MedicalCard } from '@/types';
import { toast } from 'sonner';

interface PatientMedicalCardProps {
 patientId: string;
 isEditable?: boolean;
}

export function PatientMedicalCard({ patientId, isEditable = false }: PatientMedicalCardProps) {
 const [card, setCard] = useState<MedicalCard | null>(null);
 const [loading, setLoading] = useState(true);
 const [saving, setSaving] = useState(false);
 const [newAllergy, setNewAllergy] = useState('');
 const [newCondition, setNewCondition] = useState('');

 useEffect(() => {
 const fetchCard = async () => {
 setLoading(true);
 try {
 const response = await axios.get(`/api/medical/card/${patientId}`);
 setCard(response.data);
 } catch (error) {
 console.error('Error fetching card:', error);
 toast.error('Не удалось загрузить мед. карту');
 } finally {
 setLoading(false);
 }
 };

 if (patientId) fetchCard();
 }, [patientId]);

 const handleSave = async () => {
 if (!card) return;
 setSaving(true);
 try {
 const response = await axios.put(`/api/medical/card/${patientId}`, card);
 toast.success('Мед. карта обновлена');
 setCard(response.data);
 } catch (error) {
 console.error('Error saving card:', error);
 toast.error('Ошибка при сохранении');
 } finally {
 setSaving(false);
 }
 };

 if (loading) {
 return (
 <div className="flex flex-col items-center justify-center py-20">
 <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
 <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Загрузка данных...</p>
 </div>
 );
 }

 if (!card) return null;

 return (
 <div className="space-y-8">
 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 <div className="space-y-5">
 <h3 className="text-xl font-display font-bold text-foreground">Основные данные</h3>
 <div className="bg-secondary rounded-2xl p-5 sm:p-6 border border-border">
 <label className="block text-[10px] font-semibold uppercase tracking-widest text-primary mb-3 ml-1">Группа крови</label>
 <input 
 type="text" 
 value={card.bloodType || ''} 
 onChange={(e) => setCard({...card, bloodType: e.target.value})}
 disabled={!isEditable}
 placeholder="Введите группу крови (напр. O+)"
 className="w-full bg-card border border-border rounded-xl p-4 font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all disabled:bg-background disabled:text-muted-foreground"
 />
 </div>
 <div className="bg-secondary rounded-2xl p-5 sm:p-6 border border-border">
 <label className="block text-[10px] font-semibold uppercase tracking-widest text-primary mb-3 ml-1">Дополнительные заметки</label>
 <textarea 
 value={card.notes || ''} 
 onChange={(e) => setCard({...card, notes: e.target.value})}
 disabled={!isEditable}
 rows={4}
 placeholder="Важные примечания для врачей..."
 className="w-full bg-card border border-border rounded-xl p-4 font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all disabled:bg-background disabled:text-muted-foreground resize-none"
 />
 </div>
 </div>

 <div className="space-y-5">
 <h3 className="text-xl font-display font-bold text-foreground">Ограничения и заболевания</h3>
 
 <div className="bg-error/5 rounded-2xl p-5 sm:p-6 border border-error/10">
 <div className="flex items-center justify-between mb-4">
 <label className="block text-[10px] font-semibold uppercase tracking-widest text-error ml-1">Аллергии</label>
 {card.allergies.length > 0 && <AlertCircle className="w-4 h-4 text-error" />}
 </div>
 
 <div className="flex flex-wrap gap-2 mb-4">
 {card.allergies.map((allergy, i) => (
 <span key={i} className="px-4 py-2 bg-card text-error rounded-xl text-xs font-bold border border-error/10 flex items-center gap-2">
 {allergy}
 {isEditable && (
 <button 
 onClick={() => setCard({...card, allergies: card.allergies.filter((_, idx) => idx !== i)})}
 className="hover:text-error/70"
 >
 <X size={14} />
 </button>
 )}
 </span>
 ))}
 {card.allergies.length === 0 && (
 <p className="text-muted-foreground font-medium italic text-sm py-2 px-2">Аллергий не выявлено</p>
 )}
 </div>

 {isEditable && (
 <div className="flex gap-2">
 <input 
 type="text" 
 value={newAllergy}
 onChange={(e) => setNewAllergy(e.target.value)}
 placeholder="Добавить..."
 className="flex-1 bg-card border border-error/10 rounded-xl p-3 text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-error/20"
 />
 <button 
 onClick={() => {
 if (newAllergy) {
 setCard({...card, allergies: [...card.allergies, newAllergy]});
 setNewAllergy('');
 }
 }}
 className="w-10 h-10 bg-error text-white rounded-xl flex items-center justify-center hover:bg-error/90 transition-colors"
 >
 <Plus size={18} />
 </button>
 </div>
 )}
 </div>

 <div className="bg-secondary rounded-2xl p-5 sm:p-6 border border-border">
 <label className="block text-[10px] font-semibold uppercase tracking-widest text-primary mb-4 ml-1">Хронические заболевания</label>
 <div className="flex flex-wrap gap-2 mb-4">
 {card.chronicConditions.map((condition, i) => (
 <span key={i} className="px-4 py-2 bg-card text-foreground rounded-xl text-xs font-bold border border-border flex items-center gap-2">
 {condition}
 {isEditable && (
 <button 
 onClick={() => setCard({...card, chronicConditions: card.chronicConditions.filter((_, idx) => idx !== i)})}
 className="hover:text-primary/70"
 >
 <X size={14} />
 </button>
 )}
 </span>
 ))}
 {card.chronicConditions.length === 0 && (
 <p className="text-muted-foreground font-medium text-sm py-2 px-2">Данные отсутствуют</p>
 )}
 </div>

 {isEditable && (
 <div className="flex gap-2">
 <input 
 type="text" 
 value={newCondition}
 onChange={(e) => setNewCondition(e.target.value)}
 placeholder="Добавить..."
 className="flex-1 bg-card border border-border rounded-xl p-3 text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
 />
 <button 
 onClick={() => {
 if (newCondition) {
 setCard({...card, chronicConditions: [...card.chronicConditions, newCondition]});
 setNewCondition('');
 }
 }}
 className="w-10 h-10 bg-primary text-primary-foreground rounded-xl flex items-center justify-center hover:bg-primary/90 transition-colors"
 >
 <Plus size={18} />
 </button>
 </div>
 )}
 </div>
 </div>
 </div>

 {isEditable && (
 <div className="flex justify-end pt-6 border-t border-border">
 <Button 
 onClick={handleSave} 
 disabled={saving}
 className="rounded-xl bg-primary text-primary-foreground h-14 px-8 sm:px-10 font-bold shadow-xl shadow-primary/20 hover:bg-primary-hover transition-colors"
 >
 {saving ? (
 <>
 <Loader2 className="w-4 h-4 mr-2 animate-spin" />
 Сохранение...
 </>
 ) : (
 <>
 <Save className="w-4 h-4 mr-2" />
 Сохранить изменения
 </>
 )}
 </Button>
 </div>
 )}

 <div className="flex items-center gap-4 p-5 bg-secondary rounded-2xl border border-border text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
 <Shield className="w-5 h-5 text-primary" />
 Последнее обновление: {new Date(card.updatedAt).toLocaleString('ru-RU')}
 </div>
 </div>
 );
}

