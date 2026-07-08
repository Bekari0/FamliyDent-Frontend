import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import * as styles from './Services.styles';

interface ServiceCard {
  title: string;
  sub: string;
  image: string;
  alt: string;
  highlighted?: boolean;
  offset?: string;
}

const LEFT_CARDS: ServiceCard[] = [
  {
    title: 'Профилактика и гигиена',
    sub: 'Осмотры, чистка, диагностика',
    image: '/images/svc-preventive.png',
    alt: 'Профессиональная чистка зубов пациенту',
    highlighted: true,
  },
  {
    title: 'Лечение и реставрация',
    sub: 'Пломбы, коронки, протезы',
    image: '/images/svc-restorative.png',
    alt: 'Зубной техник работает с гипсовой моделью',
    offset: styles.offsetMd,
  },
  {
    title: 'Ортодонтия',
    sub: 'Брекеты и элайнеры',
    image: '/images/svc-ortho.png',
    alt: 'Улыбка с керамическими брекетами',
    offset: styles.offsetLg,
  },
];

const RIGHT_CARDS: ServiceCard[] = [
  {
    title: 'Эстетическая стоматология',
    sub: 'Отбеливание, виниры, дизайн улыбки',
    image: '/images/svc-cosmetic.png',
    alt: 'Осмотр улыбки пациентки стоматологом',
  },
  {
    title: 'Имплантация',
    sub: 'Постоянное восстановление зубов',
    image: '/images/svc-implants.png',
    alt: 'Модель зубного импланта с коронками',
    offset: styles.offsetMd,
  },
  {
    title: 'Сложное лечение',
    sub: 'Каналы, хирургия, лечение дёсен',
    image: '/images/svc-advanced.png',
    alt: 'Врач демонстрирует чистку на модели челюсти',
    offset: styles.offsetLg,
  },
];

function Card({ card }: { card: ServiceCard }) {
  return (
    <Link
      to="/services"
      className={cn(card.highlighted ? styles.cardActive : styles.card, card.offset)}
    >
      <img
        src={card.image || "/placeholder.svg"}
        alt={card.alt}
        className={styles.cardImage}
        loading="lazy"
        width={400}
        height={300}
      />
      <div className={styles.cardBody}>
        <h3 className={styles.cardTitle}>{card.title}</h3>
        <p className={styles.cardSub}>{card.sub}</p>
      </div>
    </Link>
  );
}

export function Services() {
  return (
    <section id="services" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.centerCircle} aria-hidden="true" />

        <div className={styles.layout}>
          {/* Левая колонка */}
          <div className={styles.sideCol}>
            {LEFT_CARDS.map((card) => (
              <Card key={card.title} card={card} />
            ))}
          </div>

          {/* Центр */}
          <div className={styles.centerCol}>
            <span className={styles.kicker}>Ваша улыбка — наш приоритет</span>
            <h2 className={styles.title}>
              Стоматологические
              <br />
              услуги
            </h2>
            <Link to="/services" className={styles.btnSplit} aria-label="Все услуги">
              <span className={styles.btnSplitMain}>Все услуги</span>
              <span className={styles.btnSplitChip} aria-hidden="true">
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </Link>
          </div>

          {/* Правая колонка */}
          <div className={styles.sideColRight}>
            {RIGHT_CARDS.map((card) => (
              <Card key={card.title} card={card} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
