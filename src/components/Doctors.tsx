import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Award, ArrowRight, Plus, Star } from 'lucide-react';
import axios from 'axios';
import { cn } from '@/lib/utils';
import { useBooking } from '@/context/BookingContext';
import { DoctorDetailModal } from './DoctorDetailModal';
import { Link } from 'react-router-dom';

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

const API_URL = '/api';
import { FALLBACK_DOCTORS } from '@/fallbackData';
import * as styles from './Doctors.styles';


export function Doctors() {
 const [doctors, setDoctors] = useState<Doctor[]>([]);
 const [loading, setLoading] = useState(true);
 const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
 const { openBooking } = useBooking();

 useEffect(() => {
 const fetchDoctors = async () => {
 try {
 const response = await axios.get(`${API_URL}/doctors`);
 const doctorsData = Array.isArray(response.data) ? response.data : FALLBACK_DOCTORS;
 setDoctors(doctorsData.slice(0, 3) as any);
 } catch (err) {
 console.error('Ошибка загрузки врачей, используем резервные данные:', err);
 setDoctors(FALLBACK_DOCTORS.slice(0, 3) as any);
 } finally {
 setLoading(false);
 }
 };
 fetchDoctors();
 }, []);

 if (loading) {
 return (
 <section id="doctors" className={styles.section}>
 <div className={styles.container}>
 <div className="text-center py-20">
 <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
 <p className="mt-4 text-slate-400 font-bold uppercase tracking-widest text-[10px]">Поиск специалистов...</p>
 </div>
 </div>
 </section>
 );
 }

 if (doctors.length === 0) return null;

 return (
 <>
 <section id="doctors" className={styles.section}>
 <div className={styles.container}>
 <div className={styles.headerRow}>
 <div className={styles.headerContent}>
 <motion.div
 initial={{ opacity: 0, scale: 0.9 }}
 whileInView={{ opacity: 1, scale: 1 }}
 viewport={{ once: true }}
 className={styles.badge}
 >
 <Award className="w-3.5 h-3.5" />
 Наши эксперты
 </motion.div>
 <motion.h2 
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 className={styles.title}
 >
 Познакомьтесь с <span className={styles.titleSpan}>профессионалами</span>
 </motion.h2>
 <motion.p 
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ delay: 0.1 }}
 className={styles.desc}
 >
 Команда FamilyDent — это врачи высшей категории, которые любят свою работу и искренне заботятся о здоровье ваших зубов.
 </motion.p>
 </div>
 
 <motion.div
 initial={{ opacity: 0, x: 20 }}
 whileInView={{ opacity: 1, x: 0 }}
 viewport={{ once: true }}
 className="hidden md:block"
 >
 <Link to="/doctors">
 <Button variant="outline" className={styles.seeAllBtn}>
 Все врачи
 <ArrowRight className="w-4 h-4" />
 </Button>
 </Link>
 </motion.div>
 </div>

 <div className={styles.grid}>
 {doctors.map((doctor, index) => (
 <motion.div
 key={doctor._id}
 initial={{ opacity: 0, y: 30 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ delay: index * 0.1 }}
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
 loading="lazy"
 decoding="async"
 />
 
 <div className={styles.ratingBadge}>
 <Star className="w-3 h-3 text-amber-400 fill-current" />
 <span>5.0</span>
 </div>

 <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
 <div className="translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
 <div className="text-white/80 text-[10px] font-bold uppercase tracking-widest">Профиль врача</div>
 <div className="w-10 h-0.5 bg-primary rounded-full mt-2" />
 </div>
 </div>

 <div className="absolute top-4 left-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-primary shadow-lg opacity-0 group-hover:opacity-100 transition-all transform scale-90 group-hover:scale-100">
 <Plus className="w-5 h-5" />
 </div>
 </div>

 <CardContent className={styles.cardContent}>
 <div className={styles.specialtyBadge}>
 {doctor.specialty}
 </div>
 <h3 className={styles.cardTitle}>
 {doctor.name}
 </h3>
 <p className={styles.experienceStyle}>
 Стаж работы: {doctor.experience}
 </p>
 
 <div className={styles.actions}>
 <button 
 onClick={() => setSelectedDoctor(doctor)}
 className={styles.buttonOutline}
 >
 Подробнее
 </button>
 </div>
 </CardContent>
 </Card>
 </motion.div>
 ))}
 </div>

 <motion.div 
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 className="mt-12 md:hidden"
 >
 <Link to="/doctors">
 <Button variant="outline" className="w-full h-14 rounded-2xl border-slate-100 font-bold text-slate-500 hover:bg-slate-50">
 Посмотреть всех врачей
 </Button>
 </Link>
 </motion.div>
 </div>
 </section>

 <DoctorDetailModal 
 doctor={selectedDoctor}
 isOpen={!!selectedDoctor}
 onClose={() => setSelectedDoctor(null)}
 onBooking={(doctorId) => {
 setSelectedDoctor(null);
 openBooking(doctorId);
 }}
 />
 </>
 );
}


