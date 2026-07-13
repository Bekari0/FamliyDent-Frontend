'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import axios from 'axios';
import { useBooking } from '@/context/BookingContext';
import { DoctorDetailModal } from './DoctorDetailModal';
import { FALLBACK_DOCTORS } from '@/fallbackData';
import * as styles from './Doctors.styles';

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
  '/images/specialist-nuros-dylshod.jpg',
  '/images/specialist-mahmudov-hakim.jpg',
  '/images/specialist-usupova-esuman.jpg',
  '/images/specialist-sobirov-ulugbek.jpg',
];

const SPECIALIST_COPY = [
  'Координирует маршрут лечения и командную работу клиники.',
  'Помогает с диагностикой, лечением и первичной консультацией.',
  'Ведёт терапевтический приём и объясняет пациенту следующие шаги.',
  'Работает с планом лечения и контрольными визитами пациента.',
];

export function Doctors() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reduceMotion = useReducedMotion();
  const { openBooking } = useBooking();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get(`${API_URL}/doctors`);
        const data = Array.isArray(response.data) && response.data.length ? response.data : FALLBACK_DOCTORS;
        setDoctors(data.slice(0, 4) as unknown as Doctor[]);
      } catch {
        setDoctors(FALLBACK_DOCTORS.slice(0, 4) as unknown as Doctor[]);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  useEffect(() => {
    if (reduceMotion || isPaused || doctors.length < 2) return;
    const interval = window.setInterval(() => {
      setDirection(1);
      setActiveIndex((current) => (current + 1) % doctors.length);
    }, 4200);
    return () => window.clearInterval(interval);
  }, [doctors.length, isPaused, reduceMotion]);

  useEffect(() => () => {
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
  }, []);

  const pauseTemporarily = () => {
    setIsPaused(true);
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    resumeTimer.current = setTimeout(() => setIsPaused(false), 6500);
  };

  const move = (step: number, manual = true) => {
    if (doctors.length < 2) return;
    if (manual) pauseTemporarily();
    setDirection(step);
    setActiveIndex((current) => (current + step + doctors.length) % doctors.length);
  };

  const getOffset = (index: number) => {
    let offset = index - activeIndex;
    const half = doctors.length / 2;
    if (offset > half) offset -= doctors.length;
    if (offset < -half) offset += doctors.length;
    return offset;
  };

  if (loading) {
    return <section id="doctors" className={styles.section}><Loader2 className="h-9 w-9 animate-spin text-[#12A99B]" /></section>;
  }
  if (!doctors.length) return null;

  return (
    <>
      <section id="doctors" className={styles.section} aria-labelledby="doctors-title">
        <div className={styles.intro}>
          <p className={styles.eyebrow}>Команда Family Dent</p>
          <h2 id="doctors-title" className={styles.title}>Наши специалисты</h2>
          <p className={styles.description}>
            Врачи Family Dent ведут пациента командой: от первичной диагностики до контрольного визита.
          </p>
          <button type="button" className={styles.matchButton} onClick={() => openBooking()}>
            Подобрать специалиста
          </button>
          <div className={styles.controls} aria-label="Управление каруселью">
            <button type="button" className={styles.controlButton} onClick={() => move(-1)} aria-label="Предыдущий специалист">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <span className={styles.counter}>{String(activeIndex + 1).padStart(2, '0')} / {String(doctors.length).padStart(2, '0')}</span>
            <button type="button" className={styles.controlButton} onClick={() => move(1)} aria-label="Следующий специалист">
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div
          className={styles.carouselViewport}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onFocusCapture={() => setIsPaused(true)}
          onBlurCapture={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) setIsPaused(false);
          }}
        >
          <motion.div
            className={styles.carouselStage}
            drag={doctors.length > 1 ? 'x' : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.16}
            onDragEnd={(_, info) => {
              if (info.offset.x < -65 || info.velocity.x < -450) move(1);
              else if (info.offset.x > 65 || info.velocity.x > 450) move(-1);
            }}
          >
            <AnimatePresence initial={false} custom={direction}>
              {doctors.map((doctor, index) => {
                const offset = getOffset(index);
                const distance = Math.abs(offset);
                const isActive = offset === 0;
                return (
                  <motion.article
                    key={doctor._id}
                    className={styles.card}
                    initial={false}
                    animate={{
                      x: offset * 285,
                      y: offset < 0 ? 54 : distance * 34,
                      scale: Math.max(0.92, 1 - distance * 0.025),
                      rotate: offset < 0 ? -1.5 : offset * 0.45,
                      opacity: distance > 2 ? 0 : 1,
                    }}
                    transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 190, damping: 26, mass: 0.9 }}
                    style={{ zIndex: offset === 0 ? 20 : offset < 0 ? 8 : 16 - distance }}
                    aria-hidden={!isActive && distance > 1}
                  >
                    <button type="button" className={styles.photoButton} onClick={() => setSelectedDoctor(doctor)} aria-label={`Подробнее о враче ${doctor.name}`}>
                      <img
                        src={SPECIALIST_IMAGES[index] || doctor.image || '/placeholder.svg'}
                        alt={doctor.name}
                        className={styles.photo}
                        draggable={false}
                      />
                    </button>
                    <div className={styles.cardBody}>
                      <p className={styles.specialty}>{index === 0 ? 'Заведующий' : doctor.specialty}</p>
                      <h3 className={styles.cardTitle}>{doctor.name}</h3>
                      <p className={styles.cardDescription}>{doctor.description || SPECIALIST_COPY[index]}</p>
                      <button type="button" className={styles.bookButton} onClick={() => openBooking(doctor._id)}>
                        Записаться
                      </button>
                    </div>
                  </motion.article>
                );
              })}
            </AnimatePresence>
          </motion.div>
          <p className={styles.swipeHint}>Свайпните карточки или используйте стрелки</p>
        </div>
      </section>

      <DoctorDetailModal
        doctor={selectedDoctor}
        isOpen={Boolean(selectedDoctor)}
        onClose={() => setSelectedDoctor(null)}
        onBooking={(doctorId) => {
          setSelectedDoctor(null);
          openBooking(doctorId);
        }}
      />
    </>
  );
}
