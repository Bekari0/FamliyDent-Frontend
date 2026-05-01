import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useBooking } from '@/context/BookingContext';
import { Badge } from '@/components/ui/badge';
import { 
  Stethoscope, Sparkles, Calendar, Phone, Home, ChevronRight,
  GraduationCap, Award, CheckCircle2, Star, Instagram, Facebook, Linkedin
} from 'lucide-react';

import * as styles from './doctors-page.styles';

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  experience: string;
  image: string;
  description: string;
  education: string;
  achievements: string[];
  rating?: number;
}

const TEST_DOCTORS: Doctor[] = [
  {
    id: '1',
    name: 'Др. Ахмедов Саид',
    specialty: 'Главный врач, Хирург-имплантолог',
    experience: '15 лет',
    image: 'https://picsum.photos/seed/doctor1/500/600',
    description: 'Специалист экспертного уровня в области дентальной имплантации и костной пластики. Провел более 5000 успешных операций.',
    education: 'МГМСУ им. Евдокимова, стажировки в Германии и Швейцарии.',
    achievements: ['Врач года 2023', 'Член ITI', 'Автор 15 научных статей'],
    rating: 5.0
  },
  {
    id: '2',
    name: 'Др. Каримова Мадина',
    specialty: 'Врач-ортодонт',
    experience: '8 лет',
    image: 'https://picsum.photos/seed/doctor2/500/600',
    description: 'Создает идеальные улыбки с помощью современных брекет-систем и элайнеров.',
    education: 'ТГМУ им. Абуали ибни Сино, специализация по ортодонтии.',
    achievements: ['Сертифицированный специалист Invisalign', 'Лучший ортодонт 2022', 'Более 1000 пациентов'],
    rating: 5.0
  },
  {
    id: '3',
    name: 'Др. Назаров Рустам',
    specialty: 'Стоматолог-терапевт',
    experience: '10 лет',
    image: 'https://picsum.photos/seed/doctor3/500/600',
    description: 'Мастер художественной реставрации и эндодонтического лечения под микроскопом.',
    education: 'МГМСУ, курсы по эстетической реставрации в Италии.',
    achievements: ['Эксперт по работе с микроскопом', 'Победитель конкурса реставраций 2021', 'Член ассоциации стоматологов'],
    rating: 5.0
  }
];

export function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>(TEST_DOCTORS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { openBooking } = useBooking();



  // useEffect(() => {
  //   const fetchDoctors = async () => {
  //     try {
  //       const response = await axios.get(`${API_URL}/api/doctors`);
  //       setDoctors(response.data);
  //       setLoading(false);
  //     } catch (err) {
  //       console.error('Ошибка загрузки врачей:', err);
  //       setError('Не удалось загрузить список врачей');
  //       setLoading(false);
  //     }
  //   };
  //   fetchDoctors();
  // }, []);

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.loaderWrapper}>
            <div className={styles.loader} />
            <p className={styles.loaderText}>Загрузка врачей...</p>
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
            <p className={styles.errorText}>{error}</p>
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
        <div className={styles.breadcrumbWrapper}>
          <nav className={styles.breadcrumb}>
            <Link to="/" className={styles.breadcrumbLink}>
              <Home className="w-4 h-4" />
              <span>Главная</span>
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className={styles.breadcrumbActive}>Наши врачи</span>
          </nav>
        </div>
      </div>

      <div className={styles.container}>
        <div className={styles.headerSection}>
          <div className={styles.headerInner}>
            <Badge className={styles.headerBadge}>
              <Award className="w-3 h-3 mr-1" />
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
                key={doctor.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="h-full"
              >
                <Card className={styles.card}>
                  <div className={styles.imageWrapper}>
                    <img 
                      src={doctor.image} 
                      alt={doctor.name}
                      className={styles.image}
                    />
                    {doctor.rating && (
                      <div className={styles.ratingBadge}>
                        <Star className="w-3 h-3 fill-accent text-accent" />
                        <span>{doctor.rating}</span>
                      </div>
                    )}
                    
                    {/* Социальные сети поверх фото */}
                    <div className={styles.socialOverlay}>
                      <div className={styles.socialIcons}>
                        <Button size="icon" variant="secondary" className={styles.socialIconButton}>
                          <Instagram className="w-4 h-4" />
                        </Button>
                        <Button size="icon" variant="secondary" className={styles.socialIconButton}>
                          <Facebook className="w-4 h-4" />
                        </Button>
                        <Button size="icon" variant="secondary" className={styles.socialIconButton}>
                          <Linkedin className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <CardContent className={styles.cardContent}>
                    <div className={styles.specialtyBadge}>
                      Стаж: {doctor.experience}
                    </div>
                    
                    <h3 className={styles.cardTitle}>{doctor.name}</h3>
                    
                    <p className={styles.specialty}>
                      {doctor.specialty}
                    </p>

                    <p className={styles.description}>
                      {doctor.description}
                    </p>

                    <div className={styles.statsWrapper}>
                      <div className={styles.statItem}>
                        <span className={styles.statValue}>1.5k+</span>
                        <span className={styles.statLabel}>Пациентов</span>
                      </div>
                      <div className={styles.statDivider} />
                      <div className={styles.statItem}>
                        <span className={styles.statValue}>12+</span>
                        <span className={styles.statLabel}>Наград</span>
                      </div>
                    </div>

                    <div className={styles.infoBlock}>
                      <div className={styles.infoHeader}>
                        <GraduationCap className={styles.infoIcon} />
                        <span className={styles.infoTitle}>Образование</span>
                      </div>
                      <p className={styles.infoText}>{doctor.education}</p>
                    </div>

                    <div className={styles.infoBlock}>
                      <div className={styles.infoHeader}>
                        <Award className={styles.infoIcon} />
                        <span className={styles.infoTitle}>Достижения</span>
                      </div>
                      <ul className={styles.achievementsList}>
                        {doctor.achievements.slice(0, 2).map((item, idx) => (
                          <li key={idx} className={styles.achievementItem}>
                            <CheckCircle2 className={styles.achievementIcon} />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Button onClick={openBooking} className={styles.buttonFull}>
                      <Calendar className="w-4 h-4 mr-2" />
                      Записаться
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

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
                  <Button onClick={openBooking} className={styles.buttonWhite}>
                    <Calendar className="w-4 h-4 mr-2" />
                    Записаться сейчас
                  </Button>

                  <a href="tel:+992000000000" className={styles.ctaPhone}>
                    <div className={styles.ctaPhoneIcon}>
                      <Phone className={styles.ctaPhoneIconInner} />
                    </div>
                    <div className={styles.ctaPhoneText}>
                      <div className={styles.ctaPhoneLabel}>Позвоните нам</div>
                      <div className={styles.ctaPhoneNumber}>+992 000 000 000</div>
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