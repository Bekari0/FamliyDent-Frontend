import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import * as styles from './Hero.styles';

export function Hero() {
  return (
    <section className={styles.section} aria-labelledby="hero-title">
      <div className={styles.container}>
        <motion.div
          className={styles.leftColumn}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: 'easeOut' }}
        >
          <h1 id="hero-title" className={styles.mainTitle}>
            Не просто
            <br />
            лечим
            <br />
            зубы.
            <br />
            Заботимся о
            <br />
            семье.
          </h1>
          <p className={styles.description}>
            Современная семейная стоматология в Душанбе, где каждый этап лечения
            объясняют спокойно и понятно.
          </p>
        </motion.div>

        <motion.img
          src="/icon.svg"
          alt=""
          aria-hidden="true"
          className={styles.familyMark}
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.75, delay: 0.1, ease: 'easeOut' }}
        />

        <motion.div
          className={styles.rightColumn}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.14, ease: 'easeOut' }}
        >
          <p className={styles.sideTitle}>
            Точная
            <br />
            стоматология
            <br />
            — лично и
            <br />
            бережно
          </p>
          <div className={styles.actions}>
            <Link to="/book" className={styles.primaryAction}>
              Записаться на приём
            </Link>
            <Link to="/register" className={styles.secondaryAction}>
              Регистрация
            </Link>
          </div>
        </motion.div>

        <p className={styles.watermark} aria-hidden="true">
          Family Dent · Душанбе
        </p>
      </div>
    </section>
  );
}
