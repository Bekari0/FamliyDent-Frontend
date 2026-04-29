import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Stethoscope, Sparkles, Zap, Activity, Scissors, Sun, ArrowRight } from 'lucide-react';

// Стили
const styles = {
  section: "section-padding bg-white scroll-mt-20",
  container: "container mx-auto px-4 sm:px-6 lg:px-8",
  header: "flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12",
  headerLeft: "max-w-2xl text-left",
  badge: "flex items-center gap-3 mb-4",
  badgeLine: "w-12 h-0.5 bg-primary",
  badgeText: "text-primary font-bold text-sm uppercase tracking-wider",
  title: "text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900",
  titleSpan: "text-primary",
  grid: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10",
  card: "service-card group h-full overflow-hidden hover:shadow-xl transition-all duration-300",
  cardGradient: "h-2 bg-gradient-to-r",
  cardHeader: "pt-6 pb-4",
  cardIconWrapper: "w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center",
  cardIcon: "w-6 h-6 text-white",
  cardTitle: "text-xl font-bold text-slate-900 group-hover:text-primary transition-colors",
  cardContent: "space-y-4",
  serviceList: "space-y-2",
  serviceItem: "text-sm text-slate-600 flex items-start gap-2",
  serviceBullet: "w-1.5 h-1.5 rounded-full bg-primary/60 mt-1.5 shrink-0",
  moreLink: "text-sm text-primary font-medium mt-2",
  buttonWrapper: "pt-4 border-t border-slate-100",
  button: "w-full justify-between group/btn rounded-xl hover:bg-primary/5",
  buttonText: "font-medium",
  buttonIcon: "w-4 h-4 group-hover/btn:translate-x-1 transition-transform",
};

// Интерфейс
interface CategoryService {
  _id: string;
  category: string;
  services: string[];
}

// Маппинг иконок
const ICON_MAP: Record<string, any> = {
  "Профессиональная гигиена и профилактика": Sparkles,
  "Ортопедия (протезирование)": Stethoscope,
  "Ортодонтия (выравнивание зубов)": Zap,
  "Хирургическая стоматология": Scissors,
  "Имплантология": Activity,
  "Детская стоматология": Sun,
  "Эстетическая стоматология": Sparkles,
  "Терапевтическая стоматология (лечение)": Stethoscope,
  "Диагностика": Activity,
};

const GRADIENTS: Record<string, string> = {
  "Профессиональная гигиена и профилактика": "from-cyan-500 to-blue-500",
  "Ортопедия (протезирование)": "from-purple-500 to-indigo-500",
  "Ортодонтия (выравнивание зубов)": "from-emerald-500 to-teal-500",
  "Хирургическая стоматология": "from-red-500 to-orange-500",
  "Имплантология": "from-violet-500 to-purple-500",
  "Детская стоматология": "from-pink-500 to-rose-500",
  "Эстетическая стоматология": "from-amber-500 to-yellow-500",
  "Терапевтическая стоматология (лечение)": "from-blue-500 to-cyan-500",
  "Диагностика": "from-slate-500 to-gray-500",
};

const API_URL = 'http://localhost:5000';

export function Services() {
  const [categories, setCategories] = useState<CategoryService[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API_URL}/api/services`)
      .then(res => setCategories(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className={styles.section}>
        <div className={styles.container}>
          <div className="flex justify-center items-center py-20">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="services" className={styles.section}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.badge}>
              <div className={styles.badgeLine} />
              <span className={styles.badgeText}>Наши услуги</span>
            </div>
            <h2 className={styles.title}>
              Полный спектр <br />
              <span className={styles.titleSpan}>стоматологической</span> помощи
            </h2>
          </div>
          <Link to="/services">
            <Button variant="outline" className="hero-btn-outline px-8 py-6 rounded-full">
              <span className="flex items-center gap-2">
                Все услуги <ArrowRight className="w-4 h-4" />
              </span>
            </Button>
          </Link>
        </div>

        {/* Grid */}
        <div className={styles.grid}>
          {categories.slice(0, 6).map((category, index) => {
            const Icon = ICON_MAP[category.category] || Activity;
            const gradient = GRADIENTS[category.category] || "from-primary to-accent";

            return (
              <motion.div
                key={category._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="h-full"
              >
                <Card className={styles.card}>
                  <div className={cn(styles.cardGradient, gradient)} />
                  <CardHeader className={styles.cardHeader}>
                    <div className="flex items-center gap-4">
                      <div className={cn(styles.cardIconWrapper, gradient)}>
                        <Icon className={styles.cardIcon} />
                      </div>
                      <CardTitle className={styles.cardTitle}>
                        {category.category}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className={styles.cardContent}>
                    <ul className={styles.serviceList}>
                      {category.services.slice(0, 3).map((service, idx) => (
                        <li key={idx} className={styles.serviceItem}>
                          <span className={styles.serviceBullet} />
                          <span>{service}</span>
                        </li>
                      ))}
                      {category.services.length > 3 && (
                        <li className={styles.moreLink}>
                          +{category.services.length - 3} других услуг
                        </li>
                      )}
                    </ul>
                    <div className={styles.buttonWrapper}>
                      <Link to="/services">
                        <Button variant="ghost" className={styles.button}>
                          <span className={styles.buttonText}>Подробнее</span>
                          <ArrowRight className={styles.buttonIcon} />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}