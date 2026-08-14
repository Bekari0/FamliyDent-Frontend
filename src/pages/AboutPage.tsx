import { Award, CheckCircle2 } from 'lucide-react';
import { EditorialPageHero } from '@/components/shared/editorial-page-hero';
import { ScrollAnimate } from '@/components/shared/scroll-animate';
import * as styles from './AboutPage.styles';

const VALUES = [
  { title: 'Комфорт', desc: 'Создаем спокойную атмосферу и подбираем лечение так, чтобы пациенту было удобно на каждом этапе.' },
  { title: 'Точность', desc: 'Используем современную диагностику и внимательно контролируем все этапы лечения.' },
  { title: 'Честность', desc: 'Объясняем план лечения простым языком и не навязываем лишние услуги.' },
];

export function AboutPage() {
  return (
    <main className={styles.page} data-ui="editorial-page">
      <EditorialPageHero
        badge="Миссия клиники"
        title="О клинике FamilyDent"
        description="Современная семейная стоматология в Душанбе, где точная диагностика сочетается с внимательным и честным отношением к каждому пациенту."
      />

      <div className={styles.container}>
        <section className={styles.storyGrid} aria-labelledby="about-story-title">
          <ScrollAnimate className={styles.storyContent}>
            <span className={styles.eyebrow}>Забота на каждом этапе</span>
            <h2 id="about-story-title" className={styles.storyTitle}>Создаем улыбки, которым доверяют</h2>
            <p className={styles.description}>
              FamilyDent объединяет опыт врачей, современную диагностику и понятный план лечения, чтобы каждый визит был спокойным, комфортным и результативным.
            </p>
            <dl className={styles.statsGrid}>
              <div className={styles.statItem}><dt className={styles.statLabel}>Лет опыта</dt><dd className={styles.statValue}>12+</dd></div>
              <div className={styles.statItem}><dt className={styles.statLabel}>Довольных пациентов</dt><dd className={styles.statValue}>15к+</dd></div>
            </dl>
          </ScrollAnimate>

          <ScrollAnimate className={styles.imageBox}>
            <div className={styles.imageWrapper}>
              <img
                src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=1000"
                alt="Интерьер клиники FamilyDent"
                className={styles.image}
              />
            </div>
            <div className={styles.infoCard}>
              <div className={styles.iconBox}><Award className={styles.infoIcon} aria-hidden="true" /></div>
              <div><div className={styles.infoCardTitle}>Клиника FamilyDent</div><div className={styles.infoCardDescription}>Забота, точность и честный подход</div></div>
            </div>
          </ScrollAnimate>
        </section>

        <section className={styles.valuesSection} aria-labelledby="values-title">
          <h2 id="values-title" className={styles.valuesTitle}>Наши основные принципы</h2>
          <div className={styles.valuesGrid}>
            {VALUES.map((item) => (
              <article key={item.title} className={styles.valueItem}>
                <CheckCircle2 className={styles.valueIconInner} aria-hidden="true" />
                <h3 className={styles.valueTitle}>{item.title}</h3>
                <p className={styles.valueDescription}>{item.desc}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
