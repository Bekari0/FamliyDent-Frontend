import { motion, AnimatePresence } from 'motion/react';
import React, { useState, useEffect } from 'react';
import { X, Calendar, Phone as PhoneIcon, User, MessageSquare, Send, Clock, UserCheck, AlertCircle, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormErrors {
  name?: string;
  phone?: string;
  date?: string;
}

const DOCTORS = [
  { id: '1', name: 'Др. Ахмедов Саид' },
  { id: '2', name: 'Др. Каримова Мадина' },
  { id: '3', name: 'Др. Назаров Рустам' },
  { id: 'any', name: 'Любой свободный врач' }
];

export function BookingModal({ isOpen, onClose }: BookingModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    service: 'Консультация',
    doctor: 'any',
    date: '',
    time: '09:00',
    comment: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setFormData({
        name: '',
        phone: '',
        service: 'Консультация',
        doctor: 'any',
        date: '',
        time: '09:00',
        comment: ''
      });
      setErrors({});
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

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
      
      const maxDate = new Date();
      maxDate.setFullYear(maxDate.getFullYear() + 1);

      if (isNaN(selectedDate.getTime())) {
        newErrors.date = 'Введите корректную дату';
      } else if (selectedDate < today) {
        newErrors.date = 'Дата не может быть в прошлом';
      } else if (selectedDate > maxDate) {
        newErrors.date = 'Слишком поздняя дата';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    // Simple masking logic for +992
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
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success('Заявка принята!', {
      description: `Мы свяжемся с вами для подтверждения записи к ${DOCTORS.find(d => d.id === formData.doctor)?.name}.`,
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
            <div className="hidden md:flex w-[30%] lg:w-[32%] bg-primary p-5 lg:p-8 flex-col justify-between relative overflow-hidden shrink-0">
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

            <div className="flex-1 p-4 sm:p-6 md:p-7 lg:p-8 overflow-y-auto bg-white no-scrollbar">
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
                  {/* Name field */}
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
                      >
                        {DOCTORS.map(doc => (
                          <option key={doc.id} value={doc.id}>{doc.name}</option>
                        ))}
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
                        {['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'].map(t => (
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
                    placeholder="Дополнительная информация (необязательно)" 
                    className="min-h-[80px] md:min-h-[100px] rounded-lg md:rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-primary/20 text-sm p-3 resize-none transition-all"
                  />
                </div>

                <div className="pt-1">
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full h-12 md:h-14 rounded-lg md:rounded-xl text-sm md:text-base font-bold shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all group overflow-hidden relative"
                  >
                    <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    {isSubmitting ? (
                      <div className="flex items-center gap-3 relative z-10">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Обработка...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 relative z-10">
                        <span>Записаться в клинику</span>
                        <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </div>
                    )}
                  </Button>
                </div>

                <div className="flex flex-col items-center gap-3 pt-4">
                  <div className="flex items-center gap-6 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
                    <img src="https://www.vectorlogo.zone/logos/visa/visa-ar21.svg" className="h-4" alt="Visa" />
                    <img src="https://www.vectorlogo.zone/logos/mastercard/mastercard-ar21.svg" className="h-6" alt="Mastercard" />
                  </div>
                  <p className="text-[10px] text-slate-400 leading-relaxed uppercase tracking-widest font-bold text-center">
                    Ваши данные защищены <br className="sm:hidden" /> сквозным шифрованием
                  </p>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

