import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Loader2 } from 'lucide-react';
import axios from 'axios';
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
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
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
              <p className={styles.kicker}>
                <span className={styles.kickerLine} aria-hidden="true" />
                Наши врачи
              </p>
              <h2 className={styles.title}>
                Команда, которой доверяют семьи
              </h2>
              <p className={styles.desc}>
                Врачи FamilyDent — специалисты высшей категории. Каждый ведёт свой
                профиль и отвечает за результат лечения.
              </p>
            </div>

            <Link to="/doctors" className={`${styles.seeAllBtn} hidden md:inline-flex`}>
              Все врачи
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className={styles.grid}>
            {doctors.map((doctor, index) => (
              <motion.div
                key={doctor._id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: index * 0.08, duration: 0.4 }}
              >
                <Card className={styles.card}>
                  <div className={styles.imageWrapper} onClick={() => setSelectedDoctor(doctor)}>
                    <img
                      src={doctor.image}
                      alt={doctor.name}
                      className={styles.imageStyle}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>

                  <CardContent className={styles.cardContent}>
                    <p className={styles.specialty}>{doctor.specialty}</p>
                    <h3 className={styles.cardTitle}>{doctor.name}</h3>
                    <p className={styles.experienceStyle}>Стаж работы: {doctor.experience}</p>

                    <div className={styles.actions}>
                      <button onClick={() => setSelectedDoctor(doctor)} className={styles.buttonOutline}>
                        Подробнее
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 md:hidden">
            <Link
              to="/doctors"
              className="flex h-12 w-full items-center justify-center gap-2 rounded-full border border-border text-sm font-semibold text-foreground"
            >
              Посмотреть всех врачей
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Статистика клиники */}
          <div className="mt-16 grid grid-cols-1 gap-10 border-t border-border pt-12 sm:grid-cols-3 lg:mt-20 lg:pt-16">
            <div className="flex flex-col gap-2">
              <span className="text-5xl font-semibold tracking-tight text-foreground lg:text-6xl">99%</span>
              <span className="max-w-52 text-sm leading-snug text-muted-foreground">
                пациентов довольны качеством лечения
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-5xl font-semibold tracking-tight text-foreground lg:text-6xl">10К+</span>
              <span className="max-w-52 text-sm leading-snug text-muted-foreground">
                пациентов успешно прошли лечение в клинике
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-5xl font-semibold tracking-tight text-foreground lg:text-6xl">400+</span>
              <span className="max-w-52 text-sm leading-snug text-muted-foreground">
                установленных имплантов с долговременным результатом
              </span>
            </div>
          </div>
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
