import { useEffect, useState } from 'react';
import axios from 'axios';
import { Award, Calendar, ChevronLeft, GraduationCap, History, Loader2, Star } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { EditorialPageHero } from '@/components/shared/editorial-page-hero';
import { useBooking } from '@/context/BookingContext';
import { bookDoctorDetail, buildDoctorEndpoint } from './public-pages-behavior';
import * as styles from './DoctorDetailPage.styles';

export function DoctorDetailPage() {
  const { id } = useParams();
  const [doctor, setDoctor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { openBooking } = useBooking();

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const response = await axios.get(buildDoctorEndpoint(id || ''));
        setDoctor(response.data);
      } catch (error) {
        console.error('Error fetching doctor:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctor();
  }, [id]);

  if (loading) return <main className={styles.loading} role="status"><Loader2 className={styles.loader} aria-hidden="true" /><span className="sr-only">Загрузка данных врача...</span></main>;
  if (!doctor) return <main className={styles.notFound}><h1 className="font-display text-2xl font-bold">Врач не найден</h1><Link to="/doctors" className={styles.backButton}><ChevronLeft className="h-4 w-4" />Ко всем врачам</Link></main>;

  const education = Array.isArray(doctor.education) ? doctor.education : [doctor.education].filter(Boolean);
  const achievements = Array.isArray(doctor.achievements) ? doctor.achievements : [];

  return (
    <main className={styles.page} data-ui="editorial-page">
      <EditorialPageHero dark badge={doctor.specialty} title={doctor.name} description={`Опыт работы: ${doctor.experience || 'информация уточняется'}`} />
      <div className={styles.container}>
        <Link to="/doctors" className={styles.backLink}><ChevronLeft className="h-4 w-4" />Ко всем врачам</Link>
        <div className={styles.layout}>
          <div className={styles.mediaColumn}>
            <div className={styles.imageFrame}>
              <img src={doctor.image} alt={doctor.name} className={styles.image} loading="eager" decoding="async" />
              <div className={styles.rating}><Star className="h-4 w-4 fill-current" aria-hidden="true" /><span>5.0</span><span className="text-white/55">по отзывам пациентов</span></div>
            </div>
            <button type="button" onClick={() => bookDoctorDetail(doctor._id || doctor.id, openBooking)} className={styles.bookButton}><Calendar className="h-4 w-4" aria-hidden="true" />Записаться на прием</button>
            <Link to="/contact" className={styles.questionButton}>Задать вопрос</Link>
          </div>

          <article className={styles.content}>
            <div className={styles.metaRow}><span>{doctor.specialty}</span><span><History className="h-4 w-4" />Стаж: {doctor.experience}</span></div>
            <blockquote className={styles.description}>«{doctor.description}»</blockquote>
            <section className={styles.infoCard} aria-labelledby="education-title">
              <h2 id="education-title" className={styles.infoTitle}><GraduationCap className="h-5 w-5 text-accent" />Образование</h2>
              {education.length > 0 ? <ul className={styles.infoList}>{education.map((item: string, index: number) => <li key={index}>{item}</li>)}</ul> : <p className={styles.infoEmpty}>Информация не указана</p>}
            </section>
            <section className={styles.infoCard} aria-labelledby="achievements-title">
              <h2 id="achievements-title" className={styles.infoTitle}><Award className="h-5 w-5 text-accent" />Достижения</h2>
              {achievements.length > 0 ? <ul className={styles.infoList}>{achievements.map((item: string, index: number) => <li key={index}>{item}</li>)}</ul> : <p className={styles.infoEmpty}>Информация не указана</p>}
            </section>
          </article>
        </div>
      </div>
    </main>
  );
}
