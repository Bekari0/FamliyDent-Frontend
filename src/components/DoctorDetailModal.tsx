import { motion, AnimatePresence } from 'motion/react';
import { X, History, Star, GraduationCap, Award, CheckCircle2, Instagram, Facebook, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Doctor {
  _id: string;
  name: string;
  specialty: string;
  experience: string;
  image: string;
  description: string;
  education: string;
  achievements: string[];
}

interface DoctorDetailModalProps {
  doctor: Doctor | null;
  isOpen: boolean;
  onClose: () => void;
  onBooking: (doctorId: string) => void;
}

export function DoctorDetailModal({ doctor, isOpen, onClose, onBooking }: DoctorDetailModalProps) {
  if (!doctor) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/80 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-4xl bg-white rounded-[32px] md:rounded-[40px] shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/20 hover:bg-white/40 md:bg-slate-100 md:hover:bg-slate-200 flex items-center justify-center text-white md:text-slate-500 transition-all"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="w-full md:w-2/5 h-64 md:h-auto relative shrink-0">
              <img 
                src={doctor.image} 
                alt={doctor.name} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 md:hidden" />
            </div>

            <div className="flex-1 p-8 md:p-12 overflow-y-auto no-scrollbar">
              <Badge className="bg-primary/10 text-primary border-none font-bold uppercase tracking-widest text-xs mb-4">
                {doctor.specialty}
              </Badge>
              <h2 className="text-2xl md:text-4xl font-display font-bold text-slate-900 mb-2">{doctor.name}</h2>
              
              <div className="flex flex-wrap items-center gap-4 text-slate-500 mb-8 pb-8 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <History className="w-5 h-5 text-primary" />
                  <span className="font-medium text-sm md:text-base">{doctor.experience}</span>
                </div>
                <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                  <span className="font-bold text-slate-900 text-sm md:text-base">5.0 (Рейтинг)</span>
                </div>
              </div>

              <div className="space-y-8">
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-primary" />
                    О специалисте
                  </h4>
                  <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                    {doctor.description}
                  </p>
                  {doctor.education && (
                    <div className="mt-4 p-4 bg-slate-50 rounded-2xl text-slate-700 text-xs md:text-sm border border-slate-100/50">
                      <strong className="text-primary">Образование:</strong> {doctor.education}
                    </div>
                  )}
                </div>

                {doctor.achievements && doctor.achievements.length > 0 && (
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                      <Award className="w-4 h-4 text-accent" />
                      Достижения
                    </h4>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {doctor.achievements.map((ach, i) => (
                        <li key={i} className="flex items-start gap-3 text-slate-600 text-xs md:text-sm">
                          <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                          {ach}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-slate-100">
                  <Button 
                    onClick={() => onBooking(doctor._id)}
                    size="lg" 
                    className="flex-1 h-14 md:h-16 rounded-2xl font-bold text-sm md:text-base shadow-xl shadow-primary/20"
                  >
                    <Calendar className="w-5 h-5 mr-2" />
                    Записаться на прием
                  </Button>
                  <div className="flex gap-2">
                    {[Instagram, Facebook].map((Icon, i) => (
                      <Button key={i} variant="outline" size="icon" className="h-14 w-14 md:h-16 md:w-16 rounded-2xl border-slate-200 hover:bg-slate-50 transition-colors">
                        <Icon className="w-5 h-5 md:w-6 md:h-6 text-slate-600" />
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
