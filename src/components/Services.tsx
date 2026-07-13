import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import * as styles from './Services.styles';

const SERVICES = [
  { title: 'Имплантация', text: 'Восстановление зубов с точным цифровым планированием.', icon: '/icons/icon-implantation.svg' },
  { title: 'Протезирование', text: 'Коронки, виниры и конструкции с естественной эстетикой.', icon: '/icons/icon-prosthetics.svg' },
  { title: 'Детская стоматология', text: 'Бережное знакомство с лечением без лишнего стресса.', icon: '/icons/icon-pediatric.svg' },
  { title: 'Ортодонтия', text: 'Брекеты и элайнеры для ровной, здоровой улыбки.', icon: '/icons/icon-orthodontics.svg' },
  { title: 'Хирургия', text: 'Безопасные операции и сложные удаления по показаниям.', icon: '/icons/icon-surgery.svg' },
  { title: 'Эстетика улыбки', text: 'Реставрации, отбеливание и персональный дизайн улыбки.', icon: '/icons/icon-aesthetic.svg' },
];

export function Services() {
  return (
    <section id="services" className={styles.section} aria-labelledby="services-title">
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <p className={styles.kicker}>Направления лечения</p>
            <h2 id="services-title" className={styles.title}>Стоматология для всей семьи</h2>
          </div>
          <p className={styles.lead}>
            От первого осмотра до сложной реабилитации — в одной клинике и с понятным планом лечения.
          </p>
        </div>

        <div className={styles.grid}>
          {SERVICES.map((service, index) => (
            <Link key={service.title} to="/services" className={styles.card}>
              <span className={styles.index}>{String(index + 1).padStart(2, '0')}</span>
              <img src={service.icon} alt="" aria-hidden="true" className={styles.icon} />
              <div className={styles.cardCopy}>
                <h3 className={styles.cardTitle}>{service.title}</h3>
                <p className={styles.cardText}>{service.text}</p>
              </div>
              <ArrowUpRight className={styles.arrow} aria-hidden="true" />
            </Link>
          ))}
        </div>

        <div className={styles.feature}>
          <img
            src="/images/doctor-care.jpg"
            alt="Врачи Family Dent проводят лечение пациента"
            className={styles.featureImage}
            loading="lazy"
          />
          <div className={styles.featureCopy}>
            <p className={styles.kicker}>Командная работа</p>
            <h3 className={styles.featureTitle}>Сложные случаи решаем вместе</h3>
            <p className={styles.featureText}>
              Врачи разных направлений обсуждают диагностику и создают единый план, чтобы результат был предсказуемым.
            </p>
            <Link to="/book" className={styles.featureButton}>Записаться на консультацию</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
