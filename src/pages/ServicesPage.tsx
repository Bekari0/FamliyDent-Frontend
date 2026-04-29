import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Stethoscope, Sparkles, Zap, Activity, Scissors, Sun, 
  CheckCircle2, ChevronRight, Home, Calendar, Phone 
} from 'lucide-react';

import * as styles from './services.styles';

interface CategoryService {
  _id: string;
  category: string;
  services: string[];
}

const CATEGORY_ICON_MAP: Record<string, any> = {
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

const CATEGORY_COLORS: Record<string, string> = {
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

export function ServicesPage() {
  const [categories, setCategories] = useState<CategoryService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/services`);
        setCategories(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Ошибка загрузки услуг:', err);
        setError('Не удалось загрузить услуги');
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.loaderWrapper}>
            <div className={styles.loader} />
            <p className={styles.loaderText}>Загрузка услуг...</p>
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
      {/* Хлебные крошки */}
      <div className={styles.container}>
        <div className={styles.breadcrumbWrapper}>
          <nav className={styles.breadcrumb}>
            <Link to="/" className={styles.breadcrumbLink}>
              <Home className="w-4 h-4" />
              <span>Главная</span>
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className={styles.breadcrumbActive}>Услуги</span>
          </nav>
        </div>
      </div>

      {/* Заголовок */}
      <div className={styles.container}>
        <div className={styles.headerSection}>
          <div className={styles.headerInner}>
            <Badge className={styles.headerBadge}>Наши возможности</Badge>
            <h1 className={styles.headerTitle}>
              Профессиональная забота о вашей <span className={styles.headerTitleSpan}>улыбке</span>
            </h1>
            <p className={styles.headerDesc}>
              Полный спектр стоматологических услуг: от профилактики до сложнейших операций
            </p>
          </div>
        </div>
      </div>

      {/* Сетка услуг */}
      <div className={styles.container}>
        <div className={styles.gridSection}>
          <div className={styles.grid}>
            {categories.map((category, index) => {
              const Icon = CATEGORY_ICON_MAP[category.category] || Activity;
              const gradient = CATEGORY_COLORS[category.category] || "from-primary to-accent";

              return (
                <motion.div
                  key={category._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="h-full"
                >
                  <Card className={styles.card}>
                    <div className={`${styles.cardGradient} ${gradient}`} />
                    <CardContent className={styles.cardContent}>
                      <div className={styles.cardHeader}>
                        <div className={`${styles.cardIconWrapper} ${gradient}`}>
                          <Icon className={styles.cardIcon} />
                        </div>
                        <h3 className={styles.cardTitle}>{category.category}</h3>
                      </div>

                      <ul className={styles.serviceList}>
                        {category.services.map((service, idx) => (
                          <li key={idx} className={styles.serviceItem}>
                            <CheckCircle2 className={styles.serviceIcon} />
                            <span className={styles.serviceText}>{service}</span>
                          </li>
                        ))}
                      </ul>

                      <Button className={styles.buttonFull}>
                        <Calendar className="w-4 h-4 mr-2" />
                        Записаться на прием
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* CTA секция */}
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
                  <span className={styles.ctaBadgeText}>Первый визит</span>
                </div>

                <h2 className={styles.ctaTitle}>
                  Не знаете, какая процедура <br />
                  <span className={styles.ctaTitleSpan}>вам нужна?</span>
                </h2>

                <p className={styles.ctaDesc}>
                  Запишитесь на бесплатную консультацию, и наши специалисты составят индивидуальный план лечения
                </p>

                <div className={styles.ctaButtons}>
                  <Button className={styles.buttonWhite}>
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