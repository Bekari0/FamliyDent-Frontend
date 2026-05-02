import { motion, AnimatePresence } from 'motion/react';
import React, { useState, useEffect, useMemo } from 'react';
import { X, Calendar, Phone as PhoneIcon, User, MessageSquare, Send, Clock, UserCheck, AlertCircle, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import axios from 'axios';

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

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const DEFAULT_DOCTOR = { _id: 'any', name: 'Любой свободный врач' };

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
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    service: 'Консультация',
    doctor: defaultDoctorId,
    date: '',
    time: '09:00',
    comment: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (isOpen && !initialDoctors && backendDoctors.length === 0) {
      const fetchDoctors = async () => {
        try {
          setIsFetching(true);
          const response = await axios.get(`${API_URL}/api/doctors`);
          setBackendDoctors(response.data);
          setIsFetching(false);
        } catch (err) {
          console.error('Ошибка загрузки врачей в модалке:', err);
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

  useEffect(() => {
    if (isOpen) {
      setFormData(prev => ({
        ...prev,
        doctor: defaultDoctorId || 'any',
        name: '',
        phone: '',
        date: '',
        time: '09:00',
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
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (isNaN(selectedDate.getTime())) {
        newErrors.date = 'Введите корректную дату';
      } else if (selectedDate < today) {
        newErrors.date = 'Дата не может быть в прошлом';
      }
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
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const doctorName = allDoctors.find(d => d._id === formData.doctor)?.name || 'врачу';
    toast.success('Заявка принята!', {
      description: `Мы свяжемся с вами для подтверждения записи к ${doctorName}.`,
    });
    
    setIsSubmitting(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-[95%] sm:max-w-lg md:max-w-2xl lg:max-w-3xl bg-white rounded-[24px] md:rounded-[32px] shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[85vh]"
          >
            {/* Left Side */}
            <div className="hidden md:flex w-[30%] lg:w-[32%] bg-primary p-6 lg:p-8 flex-col justify-between relative overflow-hidden shrink-0">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-24 -mt-24 blur-2xl" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-accent/20 rounded-full -ml-16 -mb-16 blur-xl" />
              
              <div className="relative z-10">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl mb-6">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-xl lg:text-2xl font-display font-bold text-white mb-3 leading-tight">Ваш путь к <br/>идеальной <br/><span className="text-accent underline decoration-2 underline-offset-4">улыбке</span></h2>
                <p className="text-white/80 leading-relaxed text-xs">
                  Профессиональная диагностика и забота о вашем здоровье в комфортной атмосфере.
                </p>
              </div>

              <div className="relative z-10 space-y-4">
                {[
                  { icon: Clock, label: 'Ответ специалиста', val: '~15 минут' },
                  { icon: UserCheck, label: 'Врачи клиники', val: 'Эксперты' }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-white/90">
                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                      <item.icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[9px] font-bold uppercase tracking-wider text-white/40">{item.label}</div>
                      <div className="font-bold text-xs lg:text-sm">{item.val}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Form Side */}
            <div className="flex-1 p-5 sm:p-7 md:p-8 lg:p-10 overflow-y-auto bg-white no-scrollbar">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-lg lg:text-xl font-display font-bold text-slate-900">Запись на прием</h2>
                  <div className="h-1 w-8 bg-primary rounded-full mt-1" />
                </div>
                <button 
                  onClick={onClose}
                  className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all shrink-0"
                >
                  <X className="w-4 h-4 md:w-5 md:h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2 px-1">
                      <User className="w-3 h-3 text-primary" />
                      Ваше имя
                    </label>
                    <Input 
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Алишер Ахмедов" 
                      className={cn(
                        "h-10 md:h-12 rounded-lg md:rounded-xl bg-slate-50 border-transparent focus:bg-white transition-all text-sm",
                        errors.name ? "ring-2 ring-red-500/50" : "focus:ring-2 focus:ring-primary/20"
                      )}
                    />
                    {errors.name && (
                      <span className="text-[9px] text-red-500 font-bold px-1 flex items-center gap-1">
                        <AlertCircle className="w-2.5 h-2.5" /> {errors.name}
                      </span>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2 px-1">
                      <PhoneIcon className="w-3 h-3 text-primary" />
                      Телефон
                    </label>
                    <Input 
                      type="tel" 
                      value={formData.phone}
                      onChange={handlePhoneChange}
                      placeholder="+992 00 000 0000" 
                      className={cn(
                        "h-10 md:h-12 rounded-lg md:rounded-xl bg-slate-50 border-transparent focus:bg-white transition-all text-sm",
                        errors.phone ? "ring-2 ring-red-500/50" : "focus:ring-2 focus:ring-primary/20"
                      )}
                    />
                    {errors.phone && (
                      <span className="text-[9px] text-red-500 font-bold px-1 flex items-center gap-1">
                        <AlertCircle className="w-2.5 h-2.5" /> {errors.phone}
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2 px-1">
                      <Activity className="w-3 h-3 text-primary" />
                      Услуга
                    </label>
                    <div className="relative">
                      <select 
                        value={formData.service}
                        onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                        className="w-full h-10 md:h-12 rounded-lg md:rounded-xl bg-slate-50 px-3 text-slate-900 border-none focus:ring-2 focus:ring-primary/20 outline-none appearance-none cursor-pointer text-sm"
                      >
                        <option>Консультация</option>
                        <option>Лечение кариеса</option>
                        <option>Профессиональная гигиена</option>
                        <option>Имплантация</option>
                        <option>Ортодонтия</option>
                        <option>Протезирование</option>
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        <X className="w-3 h-3 rotate-45" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2 px-1">
                      <UserCheck className="w-3 h-3 text-primary" />
                      Специалист
                    </label>
                    <div className="relative">
                      <select 
                        value={formData.doctor}
                        onChange={(e) => setFormData({ ...formData, doctor: e.target.value })}
                        className="w-full h-10 md:h-12 rounded-lg md:rounded-xl bg-slate-50 px-3 text-slate-900 border-none focus:ring-2 focus:ring-primary/20 outline-none appearance-none cursor-pointer text-sm"
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
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        <X className="w-3 h-3 rotate-45" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2 px-1">
                      <Calendar className="w-3 h-3 text-primary" />
                      Желаемая дата
                    </label>
                    <Input 
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className={cn(
                        "h-10 md:h-12 rounded-lg md:rounded-xl bg-slate-50 border-transparent focus:bg-white transition-all text-sm",
                        errors.date ? "ring-2 ring-red-500/50" : "focus:ring-2 focus:ring-primary/20"
                      )}
                    />
                    {errors.date && (
                      <span className="text-[9px] text-red-500 font-bold px-1 flex items-center gap-1">
                        <AlertCircle className="w-2.5 h-2.5" /> {errors.date}
                      </span>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2 px-1">
                      <Clock className="w-3 h-3 text-primary" />
                      Время
                    </label>
                    <div className="relative">
                      <select 
                        value={formData.time}
                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                        className="w-full h-10 md:h-12 rounded-lg md:rounded-xl bg-slate-50 px-3 text-slate-900 border-none focus:ring-2 focus:ring-primary/20 outline-none appearance-none cursor-pointer text-sm"
                      >
                        {['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'].map(t => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        <X className="w-3 h-3 rotate-45" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2 px-1">
                    <MessageSquare className="w-3 h-3 text-primary" />
                    Комментарий
                  </label>
                  <Textarea 
                    value={formData.comment}
                    onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                    placeholder="Дополнительные пожелания" 
                    className="min-h-[80px] rounded-lg md:rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-primary/20 text-sm p-3 resize-none transition-all"
                  />
                </div>

                <div className="pt-2">
                  <Button 
                    type="submit" 
                    disabled={isSubmitting || isLoading}
                    className="w-full h-12 md:h-14 rounded-lg md:rounded-xl text-sm md:text-base font-bold shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all group overflow-hidden relative"
                  >
                    <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    {isSubmitting ? (
                      <div className="flex items-center gap-3 relative z-10">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Отправка...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 relative z-10">
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
