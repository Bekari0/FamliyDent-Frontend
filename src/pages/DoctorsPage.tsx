import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import axios from 'axios';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useBooking } from '@/context/BookingContext';
import { Badge } from '@/components/ui/badge';
import { Stethoscope, Sparkles, Calendar, Phone, Home, ChevronRight,
 GraduationCap, Award, CheckCircle2, Star, Instagram, Facebook,
 X, History, Plus
} from 'lucide-react';
import { DoctorDetailModal } from '@/components/DoctorDetailModal';

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

import { FALLBACK_DOCTORS } from '@/fallbackData';
import { DbService } from '@/services/dbService';
import * as styles from './DoctorsPage.styles';


export function DoctorsPage() {
 const [doctors, setDoctors] = useState<Doctor[]>([]);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState<string | null>(null);
 const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
 const { openBooking } = useBooking();

 useEffect(() => {
 const fetchDoctors = async () => {
 try {
 setLoading(true);
 const data = await DbService.getAll<Doctor>('doctors');
 if (data.length > 0) {
 setDoctors(data);
 } else {
 setDoctors(FALLBACK_DOCTORS as unknown as Doctor[]);
 }
 } catch (err) {
 console.error('Ошибка загрузки врачей, используем резервные данные:', err);
 setDoctors(FALLBACK_DOCTORS as unknown as Doctor[]);
 } finally {
 setLoading(false);
 }
 };
 fetchDoctors();
 }, []);

 if (loading) {
 return (
 <div className={styles.page}>
 <div className={styles.container}>
 <div className={styles.loaderWrapper}>
 <div className={styles.loader} />
 <p className="mt-4 text-slate-600 text-sm sm:text-base">Загрузка врачей...</p>
 </div>
 </div>
 </div>
 );
 }

 if (error) {
 return (
 <div className={styles.page}>
 <div className={styles.container}>
 <div className={styles.loaderWrapper}>
 <p className="text-red-500 text-sm sm:text-base">{error}</p>
 <Button onClick={() => window.location.reload()} className="mt-4">
 Попробовать снова
 </Button>
 </div>
 </div>
 </div>
 );
 }

 return (
 <div className={styles.page}>
 <div className={styles.container}>
 <div className={styles.headerSection}>
 <div className={styles.headerInner}>
 <Badge className={styles.headerBadge}>
 Наши эксперты
 </Badge>
 <h1 className={styles.headerTitle}>
 Познакомьтесь с <span className={styles.headerTitleSpan}>профессионалами</span>
 </h1>
 <p className={styles.headerDesc}>
 Команда FamilyDent — это врачи высшей категории, которые любят свою работу и постоянно совершенствуют свои навыки.
 </p>
 </div>
 </div>
 </div>

 <div className={styles.container}>
 <div className={styles.gridSection}>
 <div className={styles.grid}>
 {doctors.map((doctor, index) => (
 <motion.div
 key={doctor._id}
 initial={{ opacity: 0, y: 30 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ delay: index * 0.1 }}
 className="h-full"
 >
 <Card className={styles.card}>
 <div 
 className={styles.imageWrapper}
 onClick={() => setSelectedDoctor(doctor)}
 >
 <img 
 src={doctor.image} 
 alt={doctor.name}
 className={styles.imageStyle}
 />
 <div className={styles.ratingBadge}>
 <Star className="w-3 h-3 text-yellow-400 fill-current" />
 <span>5.0</span>
 </div>
 <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-4 sm:p-6">
 <div className="translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
 <div className="text-white/80 text-[10px] font-bold uppercase tracking-widest">Нажмите для подробностей</div>
 <div className="w-10 h-0.5 bg-primary rounded-full mt-2" />
 </div>
 </div>
 </div>

 <CardContent className={styles.cardContent}>
 <div className={styles.specialtyBadge}>
 {doctor.specialty}
 </div>
 
 <h3 className={styles.cardTitle}>{doctor.name}</h3>
 
 <div className={styles.experienceStyle}>
 Стаж работы: {doctor.experience}
 </div>

 <p className={styles.descriptionStyle}>
 {doctor.description}
 </p>

 <div className={styles.infoBlock}>
 <div className={styles.infoHeader}>
 <GraduationCap className={styles.infoIcon} />
 <span>Образование</span>
 </div>
 <p className={styles.infoText}>{doctor.education || 'Информация не указана'}</p>
 </div>

 {doctor.achievements && doctor.achievements.length > 0 && (
 <div className={styles.infoBlock}>
 <div className={styles.infoHeader}>
 <Award className={styles.infoIcon} />
 <span>Достижения</span>
 </div>
 <ul className={styles.achievementsList}>
 {doctor.achievements.slice(0, 2).map((item, idx) => (
 <li key={idx} className={styles.achievementItem}>
 <CheckCircle2 className={styles.achievementIcon} />
 <span className="line-clamp-1">{item}</span>
 </li>
 ))}
 </ul>
 </div>
 )}

 <div className={styles.buttonWrapper}>
 <Button 
 onClick={() => openBooking(doctor._id)} 
 className={styles.buttonFull}
 >
 Записаться на прием
 </Button>
 </div>
 </CardContent>
 </Card>
 </motion.div>
 ))}
 </div>
 </div>
 </div>

 {/* Doctor Info Modal */}
 <DoctorDetailModal 
 doctor={selectedDoctor}
 isOpen={!!selectedDoctor}
 onClose={() => setSelectedDoctor(null)}
 onBooking={(doctorId) => {
 setSelectedDoctor(null);
 openBooking(doctorId);
 }}
 />

 <div className={styles.container}>
 <div className={styles.ctaSection}>
 <div className={styles.ctaInner}>
 <div className={styles.ctaBlur1} />
 <div className={styles.ctaBlur2} />
 <div className={styles.ctaContent}>
 <motion.div
 initial={{ opacity: 0, scale: 0.9 }}
 whileInView={{ opacity: 1, scale: 1 }}
 viewport={{ once: true }}
 >
 <div className={styles.ctaBadge}>
 <Sparkles className={styles.ctaBadgeIcon} />
 <span className={styles.ctaBadgeText}>Забота о вашей улыбке</span>
 </div>

 <h2 className={styles.ctaTitle}>
 Доверьте свою улыбку <br />
 <span className={styles.ctaTitleSpan}>команде профессионалов</span>
 </h2>

 <p className={styles.ctaDesc}>
 Запишитесь на первичный осмотр уже сегодня
 </p>

 <div className={styles.ctaButtons}>
 <Button onClick={() => openBooking()} className={styles.buttonWhite}>
 <Calendar className="w-4 h-4 mr-2" />
 Записаться сейчас
 </Button>

 <a href="tel:+992446606600" className={styles.ctaPhone}>
 <div className={styles.ctaPhoneIcon}>
 <Phone className={styles.ctaPhoneIconInner} />
 </div>
 <div className={styles.ctaPhoneText}>
 <div className={styles.ctaPhoneLabel}>Позвоните нам</div>
 <div className={styles.ctaPhoneNumber}>+992 446 60 66 00</div>
 </div>
 </a>
 </div>
 </motion.div>
 </div>
 </div>
 </div>
 </div>
 </div>
 );
}


