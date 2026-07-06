import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowRight, Plus, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import * as styles from './Services.styles';

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  'Терапевтическая стоматология (лечение)':
    'Диагностика, лечение кариеса и его осложнений, восстановление зубов. Основная цель — сохранить здоровые зубы и предотвратить их разрушение.',
  'Профессиональная гигиена и профилактика':
    'Регулярная профессиональная чистка, снятие налёта и зубного камня, укрепление эмали — основа здоровья зубов на годы вперёд.',
  'Ортопедия (протезирование)':
    'Восстановление разрушенных и утраченных зубов коронками, винирами и протезами — функционально и эстетично.',
  'Ортодонтия (выравнивание зубов)':
    'Исправление прикуса и выравнивание зубов брекетами и элайнерами для детей и взрослых.',
  'Хирургическая стоматология':
    'Удаление зубов любой сложности, зубосохраняющие операции и подготовка к имплантации — бережно и без боли.',
  'Имплантология':
    'Восстановление утраченных зубов имплантатами ведущих систем с пожизненной гарантией на имплантат.',
  'Детская стоматология':
    'Лечение молочных и постоянных зубов у детей в спокойной, дружелюбной атмосфере — без страха и слёз.',
  'Эстетическая стоматология':
    'Отбеливание, виниры и художественная реставрация — эстетика улыбки с сохранением здоровья зубов.',
  'Диагностика':
    'Компьютерная томография, прицельные снимки и подробный план лечения до начала любых процедур.',
};

export function Services() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [openIndex, setOpenIndex] = useState<number>(0);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get('/api/services');
        setServices(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  return (
    <section id="services" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <p className={styles.kicker}>
              <span className={styles.kickerLine} aria-hidden="true" />
              Наши услуги
            </p>
            <h2 className={styles.title}>
              Комплексное лечение зубов для всей семьи
            </h2>
          </div>
          <Link to="/services" className={styles.seeAllBtn}>
            Все услуги
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className={styles.list}>
            {services.map((cat, index) => {
              const isOpen = openIndex === index;
              const description =
                CATEGORY_DESCRIPTIONS[cat.category] ||
                'Подробную информацию об услугах направления и ценах уточняйте у администратора клиники.';
              return (
                <div key={cat._id || index} className={styles.row}>
                  <button
                    className={styles.rowButton}
                    onClick={() => setOpenIndex(isOpen ? -1 : index)}
                    aria-expanded={isOpen}
                  >
                    <span className={styles.rowNumber}>{String(index + 1).padStart(2, '0')}</span>
                    <span className={styles.rowTitle}>{cat.category}</span>
                    <span className={cn(styles.rowIcon, isOpen && styles.rowIconOpen)} aria-hidden="true">
                      <Plus className={cn('h-4 w-4 transition-transform duration-200', isOpen && 'rotate-45')} />
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className={styles.panel}
                      >
                        <div className={styles.panelInner}>
                          <div>
                            <p className={styles.panelDesc}>{description}</p>
                            <ul className={styles.panelServices}>
                              {cat.services.slice(0, 6).map((s: string) => (
                                <li key={s} className={styles.panelServiceItem}>
                                  {s}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className={styles.panelActions}>
                            <Link to="/book" className={styles.panelBookBtn}>
                              Записаться на приём
                            </Link>
                            <Link to="/pricing" className={styles.panelLink}>
                              Услуги и стоимость
                              <ArrowRight className="h-4 w-4" />
                            </Link>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
