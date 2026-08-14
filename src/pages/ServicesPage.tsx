import { useEffect, useState } from 'react';
import axios from 'axios';
import { Activity, Calendar, CheckCircle2, Loader2, Phone } from 'lucide-react';
import { EditorialPageHero } from '@/components/shared/editorial-page-hero';
import { ScrollAnimate } from '@/components/shared/scroll-animate';
import { useBooking } from '@/context/BookingContext';
import { FALLBACK_SERVICES } from '@/fallbackData';
import { resolveFailedServices, resolveSuccessfulServices } from './public-pages-behavior';
import * as styles from './ServicesPage.styles';

interface CategoryService {
  _id: string;
  category: string;
  services: string[];
}

export function ServicesPage() {
  const [categories, setCategories] = useState<CategoryService[]>([]);
  const [loading, setLoading] = useState(true);
  const { openBooking } = useBooking();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get('/api/services');
        setCategories(resolveSuccessfulServices(response.data, FALLBACK_SERVICES));
      } catch (error) {
        console.error('Ошибка загрузки услуг, используем резервные данные:', error);
        setCategories(resolveFailedServices(FALLBACK_SERVICES));
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  return (
    <main className={styles.page} data-ui="editorial-page">
      <EditorialPageHero
        badge="Наши направления"
        title="Услуги и направления лечения"
        description="Комплексная семейная стоматология: от профилактики и бережного лечения до имплантации и восстановления улыбки."
      />

      <div className={styles.container}>
        {loading ? (
          <div className={styles.state} role="status"><Loader2 className={styles.loader} aria-hidden="true" />Загрузка услуг...</div>
        ) : categories.length === 0 ? (
          <div className={styles.state}>Список услуг пока не опубликован.</div>
        ) : (
          <section className={styles.grid} aria-label="Направления лечения">
            {categories.map((category, index) => (
              <ScrollAnimate key={category._id} as="article" delay={(index % 3) * 0.04} className={styles.card}>
                <div className={styles.cardHeader}>
                  <div className={styles.iconWrapper}><Activity className="h-5 w-5" aria-hidden="true" /></div>
                  <div>
                    <span className={styles.cardIndex}>Направление {String(index + 1).padStart(2, '0')}</span>
                    <h2 className={styles.cardTitle}>{category.category}</h2>
                  </div>
                </div>
                <ul className={styles.serviceList}>
                  {category.services.map((service, serviceIndex) => (
                    <li key={serviceIndex} className={styles.serviceItem}><CheckCircle2 className={styles.serviceIcon} aria-hidden="true" /><span>{service}</span></li>
                  ))}
                </ul>
                <button type="button" onClick={() => openBooking()} className={styles.bookBtn}><Calendar className="h-4 w-4" aria-hidden="true" />Записаться на прием</button>
              </ScrollAnimate>
            ))}
          </section>
        )}

        <section className={styles.ctaSection} aria-labelledby="service-cta-title">
          <div><span className={styles.ctaLabel}>Поможем выбрать</span><h2 id="service-cta-title" className={styles.ctaTitle}>Не знаете, какая процедура вам нужна?</h2><p className={styles.ctaDesc}>На консультации врач проведет осмотр и составит индивидуальный план лечения.</p></div>
          <div className={styles.ctaActions}>
            <button type="button" onClick={() => openBooking()} className={styles.ctaBtn}><Calendar className="h-4 w-4" aria-hidden="true" />Записаться онлайн</button>
            <a href="tel:+992446606600" className={styles.ctaPhone}><Phone className="h-4 w-4" aria-hidden="true" />+992 446 60 66 00</a>
          </div>
        </section>
      </div>
    </main>
  );
}
