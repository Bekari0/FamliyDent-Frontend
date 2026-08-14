import { useEffect, useState } from 'react';
import axios from 'axios';
import { Award, Calendar, CheckCircle2, GraduationCap, History, Loader2, Phone, Star } from 'lucide-react';
import { DoctorDetailModal } from '@/components/DoctorDetailModal';
import { EditorialPageHero } from '@/components/shared/editorial-page-hero';
import { ScrollAnimate } from '@/components/shared/scroll-animate';
import { useBooking } from '@/context/BookingContext';
import { FALLBACK_DOCTORS } from '@/fallbackData';
import * as styles from './DoctorsPage.styles';

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
        setError(null);
        const response = await axios.get<Doctor[]>('/api/doctors');
        const data = Array.isArray(response.data) ? response.data : [];
        setDoctors(data.length > 0 ? data : FALLBACK_DOCTORS as unknown as Doctor[]);
      } catch (error) {
        console.error('Ошибка загрузки врачей, используем резервные данные:', error);
        const fallback = FALLBACK_DOCTORS as unknown as Doctor[];
        setDoctors(fallback);
        if (fallback.length === 0) setError('Не удалось загрузить список врачей.');
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  return (
    <main className={styles.page} data-ui="editorial-page">
      <EditorialPageHero
        dark
        badge="Врачи клиники"
        title="Наши врачи-стоматологи"
        description="Команда специалистов FamilyDent сочетает клинический опыт, бережный подход и постоянное профессиональное развитие."
      />

      <div className={styles.container}>
        {loading ? (
          <div className={styles.state} role="status"><Loader2 className={styles.loader} aria-hidden="true" /><span>Загрузка врачей...</span></div>
        ) : error ? (
          <div className={styles.state} role="alert"><span>{error}</span><button type="button" onClick={() => window.location.reload()} className={styles.retryButton}>Попробовать снова</button></div>
        ) : doctors.length === 0 ? (
          <div className={styles.state}>Информация о врачах пока не опубликована.</div>
        ) : (
          <section className={styles.grid} aria-label="Команда врачей FamilyDent">
            {doctors.map((doctor, index) => (
              <ScrollAnimate key={doctor._id} className={styles.card}>
                <button type="button" onClick={() => setSelectedDoctor(doctor)} className={styles.imageButton} aria-label={`Подробнее о враче ${doctor.name}`}>
                  <img src={doctor.image} alt={doctor.name} className={styles.imageStyle} loading={index < 3 ? 'eager' : 'lazy'} decoding="async" />
                  <span className={styles.ratingBadge}><Star className="h-3.5 w-3.5 fill-current" aria-hidden="true" />5.0</span>
                </button>
                <div className={styles.cardContent}>
                  <span className={styles.specialtyBadge}>{doctor.specialty}</span>
                  <h2 className={styles.cardTitle}>{doctor.name}</h2>
                  <p className={styles.experienceStyle}><History className="h-4 w-4" aria-hidden="true" />Стаж работы: {doctor.experience}</p>
                  <p className={styles.descriptionStyle}>{doctor.description}</p>
                  <div className={styles.infoBlock}>
                    <h3 className={styles.infoHeader}><GraduationCap className={styles.infoIcon} aria-hidden="true" />Образование</h3>
                    <p className={styles.infoText}>{doctor.education || 'Информация не указана'}</p>
                  </div>
                  {doctor.achievements?.length > 0 && (
                    <div className={styles.infoBlock}>
                      <h3 className={styles.infoHeader}><Award className={styles.infoIcon} aria-hidden="true" />Достижения</h3>
                      <ul className={styles.achievementsList}>
                        {doctor.achievements.slice(0, 2).map((item, itemIndex) => (
                          <li key={itemIndex} className={styles.achievementItem}><CheckCircle2 className={styles.achievementIcon} aria-hidden="true" /><span>{item}</span></li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </ScrollAnimate>
            ))}
          </section>
        )}

        <section className={styles.ctaSection} aria-labelledby="doctor-cta-title">
          <div>
            <span className={styles.ctaBadge}>Забота о вашей улыбке</span>
            <h2 id="doctor-cta-title" className={styles.ctaTitle}>Доверьте здоровье команде профессионалов</h2>
            <p className={styles.ctaDesc}>Запишитесь на первичный осмотр — врач ответит на вопросы и составит понятный план лечения.</p>
          </div>
          <div className={styles.ctaButtons}>
            <button type="button" onClick={() => openBooking()} className={styles.buttonWhite}><Calendar className="h-4 w-4" aria-hidden="true" />Записаться</button>
            <a href="tel:+992446606600" className={styles.ctaPhone}><Phone className="h-4 w-4" aria-hidden="true" />+992 446 60 66 00</a>
          </div>
        </section>
      </div>

      <DoctorDetailModal
        doctor={selectedDoctor}
        isOpen={Boolean(selectedDoctor)}
        onClose={() => setSelectedDoctor(null)}
        onBooking={(doctorId) => { setSelectedDoctor(null); openBooking(doctorId); }}
      />
    </main>
  );
}
