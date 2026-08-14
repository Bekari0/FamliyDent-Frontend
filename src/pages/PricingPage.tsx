import { Calendar, Check } from 'lucide-react';
import { EditorialPageHero } from '@/components/shared/editorial-page-hero';
import { ScrollAnimate } from '@/components/shared/scroll-animate';
import { useBooking } from '@/context/BookingContext';
import { MOCK_SERVICES } from '@/data/mockData';
import * as styles from './PricingPage.styles';

export function PricingPage() {
  const categories = Array.from(new Set(MOCK_SERVICES.map((service) => service.category)));
  const { openBooking } = useBooking();

  return (
    <main className={styles.page} data-ui="editorial-page">
      <EditorialPageHero
        badge="Прозрачная стоимость"
        title="Цены на лечение"
        description="Честный подход без скрытых платежей. Итоговую стоимость врач фиксирует в индивидуальном плане после осмотра."
      />

      <div className={styles.container}>
        <div className={styles.categories}>
          {categories.map((category, index) => {
            const services = MOCK_SERVICES.filter((service) => service.category === category);
            return (
              <ScrollAnimate key={category} as="section" delay={(index % 3) * 0.04} className={styles.categoryCard}>
                <div className={styles.categoryHeader}>
                  <h2 className={styles.categoryTitle}><span className={styles.categoryDot} />{category}</h2>
                  <span className={styles.categoryBadge}>{services.length} процедур</span>
                </div>
                <dl className={styles.listWrapper}>
                  {services.map((service) => (
                    <div key={service.id} className={styles.serviceItem}>
                      <div><dt className={styles.serviceTitle}>{service.title}</dt><dd className={styles.serviceMeta}>Длительность: {service.duration} мин · Гарантия FamilyDent</dd></div>
                      <dd className={styles.priceRow}><span className={styles.pricePrefix}>от</span><span className={styles.priceValue}>{service.price}</span><span className={styles.priceCurrency}>TJS</span></dd>
                    </div>
                  ))}
                </dl>
              </ScrollAnimate>
            );
          })}
        </div>

        <section className={styles.ctaCard} aria-labelledby="pricing-cta-title">
          <div className={styles.ctaContent}>
            <span className={styles.ctaLabel}>Персональный расчет</span>
            <h2 id="pricing-cta-title" className={styles.ctaTitle}>Нужна точная стоимость лечения?</h2>
            <p className={styles.ctaDesc}>На приеме врач составит план с учетом всех нюансов и заранее согласует каждый этап.</p>
          </div>
          <div className={styles.ctaActions}>
            <button type="button" onClick={() => openBooking()} className={styles.ctaBtn}><Calendar className="h-4 w-4" aria-hidden="true" />Записаться сейчас</button>
            <div className={styles.benefits}><span><Check className="h-4 w-4" />План лечения</span><span><Check className="h-4 w-4" />Без скрытых платежей</span></div>
          </div>
        </section>
      </div>
    </main>
  );
}
