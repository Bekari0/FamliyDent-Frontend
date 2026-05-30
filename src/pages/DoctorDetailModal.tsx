import { motion, AnimatePresence } from 'motion/react';
import { X, History, Star, GraduationCap, Award, CheckCircle2, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import * as styles from './DoctorDetailModal.styles';


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
 <div className={styles.overlay}>
 <motion.div
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 onClick={onClose}
 className={styles.backdrop}
 />
 <motion.div
 initial={{ opacity: 0, scale: 0.95, y: 20 }}
 animate={{ opacity: 1, scale: 1, y: 0 }}
 exit={{ opacity: 0, scale: 0.95, y: 20 }}
 className={styles.modal}
 onClick={(e) => e.stopPropagation()}
 >
 <button 
 onClick={onClose}
 className={styles.closeBtn}
 >
 <X className="w-5 h-5 sm:w-6 sm:h-6" />
 </button>

 <div className={styles.imageWrapper}>
 <img 
 src={doctor.image} 
 alt={doctor.name} 
 className={styles.image}
 />
 <div className={styles.imageGradient} />
 </div>

 <div className={styles.content}>
 <div className={styles.specialtyBadge}>
 {doctor.specialty}
 </div>
 <h2 className={styles.title}>{doctor.name}</h2>
 
 <div className={styles.statsBlock}>
 <div className={styles.statItem}>
 <History className={styles.statIcon} />
 <div>
 <div className={styles.statValue}>{doctor.experience}</div>
 <div className={styles.statLabel}>Опыт работы</div>
 </div>
 </div>
 <div className="w-px h-8 bg-slate-100" />
 <div className={styles.statItem}>
 <Star className="w-5 h-5 text-amber-400 fill-current" />
 <div>
 <div className={styles.statValue}>5.0 Рейтинг</div>
 <div className={styles.statLabel}>Отзывы пациентов</div>
 </div>
 </div>
 </div>

 <div className={styles.section}>
 <h4 className={styles.sectionLabel}>
 <GraduationCap className="w-4 h-4 text-primary" />
 О специалисте
 </h4>
 <p className={styles.sectionDesc}>
 {doctor.description}
 </p>
 {doctor.education && (
 <div className={styles.eduBox}>
 <strong className="text-primary font-bold mr-2 uppercase text-[10px] tracking-widest">Образование:</strong> 
 {doctor.education}
 </div>
 )}
 </div>

 {doctor.achievements && doctor.achievements.length > 0 && (
 <div className={styles.section}>
 <h4 className={styles.sectionLabel}>
 <Award className="w-4 h-4 text-accent" />
 Достижения
 </h4>
 <ul className={styles.achList}>
 {doctor.achievements.map((ach, i) => (
 <li key={i} className={styles.achItem}>
 <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
 <span>{ach}</span>
 </li>
 ))}
 </ul>
 </div>
 )}

 <div className={styles.footer}>
 <Button 
 onClick={() => onBooking(doctor._id)}
 className={styles.bookBtn}
 >
 <Calendar className="w-5 h-5" />
 Записаться на прием
 </Button>
 </div>
 </div>
 </motion.div>
 </div>
 )}
 </AnimatePresence>
 );
}


