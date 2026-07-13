import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, Loader2, Instagram, Facebook, Send } from 'lucide-react';
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
const SPECIALIST_IMAGES = [
  '/images/specialist-sobirov-ulugbek.jpg',
  '/images/specialist-usupova-esuman.jpg',
  '/images/specialist-mahmudov-hakim.jpg',
];
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
              <p className={styles.kicker}>Знакомьтесь — команда вашей улыбки</p>
              <h2 className={styles.title}>
                Опытные стоматологи,
                <br />
                которым можно доверять
              </h2>
            </div>

            <Link to="/doctors" className={`${styles.seeAllBtn} hidden md:inline-flex`} aria-label="Все врачи">
              <span className={styles.seeAllMain}>Все врачи</span>
              <span className={styles.seeAllChip} aria-hidden="true">
                <ArrowUpRight className="h-4 w-4" />
              </span>
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
                <div className={index === doctors.length - 1 ? styles.cardActive : styles.card}>
                  <h3 className={styles.cardTitle}>{doctor.name}</h3>
                  <p className={styles.specialty}>{doctor.specialty}</p>

                  <button
                    type="button"
                    className={styles.imageWrapper}
                    onClick={() => setSelectedDoctor(doctor)}
                    aria-label={`Подробнее о враче ${doctor.name}`}
                  >
                    <img
                      src={SPECIALIST_IMAGES[index] || doctor.image || "/placeholder.svg"}
                      alt={doctor.name}
                      className={styles.imageStyle}
                      loading="lazy"
                      decoding="async"
                      width={142}
                      height={142}
                    />
                  </button>

                  <div className={styles.socialRow}>
                    <a
                      href="https://instagram.com/familydent.tj"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.socialBtn}
                      aria-label={`Instagram — ${doctor.name}`}
                    >
                      <Instagram className="h-4 w-4" />
                    </a>
                    <a
                      href="https://facebook.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.socialBtn}
                      aria-label={`Facebook — ${doctor.name}`}
                    >
                      <Facebook className="h-4 w-4" />
                    </a>
                    <a
                      href="https://t.me/familydent"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.socialBtn}
                      aria-label={`Telegram — ${doctor.name}`}
                    >
                      <Send className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 md:hidden">
            <Link
              to="/doctors"
              className="flex h-12 w-full items-center justify-center gap-2 rounded-[7px] bg-[#334562] text-sm font-semibold text-primary-foreground"
            >
              Посмотреть всех врачей
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Статистика клиники */}
          <div className={styles.statsGrid}>
            <div className="flex flex-col">
              <span className={styles.statNumber}>99%</span>
              <span className={styles.statCaption}>
                пациентов довольны качеством лечения и сервиса
              </span>
            </div>
            <div className="flex flex-col">
              <span className={styles.statNumber}>30К+</span>
              <span className={styles.statCaption}>
                пациентов успешно прошли лечение в клинике
              </span>
            </div>
            <div className="flex flex-col">
              <span className={styles.statNumber}>400+</span>
              <span className={styles.statCaption}>
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
