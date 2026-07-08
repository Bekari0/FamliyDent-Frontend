import { motion } from 'motion/react';
import { ArrowUpRight, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import * as styles from './WhyChooseUs.styles';

const CARDS = [
  {
    number: '01',
    title: 'Современные технологии и оборудование',
    image: '/images/tech-implant.png',
    alt: 'Керамическая коронка с имплантом',
    active: true,
  },
  {
    number: '02',
    title: 'Персональный подход к каждому пациенту',
    image: '/images/tech-aligner.png',
    alt: 'Прозрачные элайнеры',
    active: false,
  },
  {
    number: '03',
    title: 'Полный спектр стоматологических услуг',
    image: '/images/tech-teeth.png',
    alt: 'Зубы с брекетами',
    active: false,
  },
];

const CHECKS = [
  'Удобная запись и минимальное ожидание',
  'Строгие стандарты гигиены и безопасности',
  'Комфортное лечение без стресса',
  'Эстетическая стоматология и отбеливание',
];

export function WhyChooseUs() {
  return (
    <>
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.header}>
            <p className={styles.kicker}>Ваша улыбка — наш приоритет</p>
            <h2 className={styles.title}>
              Где современные технологии встречаются с экспертной стоматологией
            </h2>
          </div>

          <div className={styles.cardsGrid}>
            {CARDS.map((card, index) => (
              <motion.div
                key={card.number}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: index * 0.08, duration: 0.45 }}
                className={card.active ? styles.cardActive : styles.card}
              >
                <span className={styles.cardNumber}>{card.number}</span>
                <h3 className={styles.cardTitle}>{card.title}</h3>
                <div className={styles.cardImageWrap}>
                  <img
                    src={card.image || "/placeholder.svg"}
                    alt={card.alt}
                    className={styles.cardImage}
                    loading="lazy"
                    width={280}
                    height={144}
                  />
                  <Link to="/services" className={styles.cardArrow} aria-label="Подробнее об услугах">
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Тёмная секция с маркизой */}
      <section className={styles.darkSection}>
        <div className={styles.marquee} aria-hidden="true">
          <p className={styles.marqueeText}>
            Ваша улыбка, <span className={styles.marqueeAccent}>наш приоритет.</span>{' '}
            Ваша улыбка, <span className={styles.marqueeAccent}>наш приоритет.</span>
          </p>
        </div>

        <div className={styles.darkLayout}>
          <div>
            <p className={styles.darkKicker}>Пациенты на первом месте</p>
            <h2 className={styles.darkTitle}>
              Технологии в сочетании с высоким качеством лечения
            </h2>

            <div className={styles.checkGrid}>
              {CHECKS.map((check) => (
                <div key={check} className={styles.checkItem}>
                  <span className={styles.checkIcon}>
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  <span className={styles.checkText}>{check}</span>
                </div>
              ))}
            </div>

            <p className={styles.darkDesc}>
              Мы объединяем клинический опыт с новейшими технологиями, чтобы
              обеспечить точную диагностику, эффективное лечение и долговременный результат.
            </p>
          </div>

          <div className={styles.darkImageWrap}>
            <img
              src="/images/xray-implants.png"
              alt="Рентген-визуализация челюсти с дентальными имплантами"
              className={styles.darkImage}
              loading="lazy"
              width={640}
              height={480}
            />
          </div>
        </div>
      </section>
    </>
  );
}
