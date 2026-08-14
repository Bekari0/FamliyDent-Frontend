import { useEffect, useState } from 'react';
import axios from 'axios';
import { ArrowRight, Calendar, Loader2, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { EditorialPageHero } from '@/components/shared/editorial-page-hero';
import { ScrollAnimate } from '@/components/shared/scroll-animate';
import * as styles from './BlogPage.styles';

export function BlogPage() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get('/api/articles');
        setArticles(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error('Error fetching articles:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  return (
    <main className={styles.page} data-ui="editorial-page">
      <EditorialPageHero
        badge="Полезные материалы"
        title="Блог и советы стоматологов"
        description="Экспертные статьи врачей FamilyDent о профилактике, лечении и ежедневной заботе о здоровье улыбки."
      />

      <div className={styles.container}>
        {loading ? (
          <div className={styles.state} role="status"><Loader2 className={styles.loader} aria-hidden="true" />Загрузка статей...</div>
        ) : articles.length === 0 ? (
          <div className={styles.state}>Статьи пока не опубликованы.</div>
        ) : (
          <section className={styles.grid} aria-label="Статьи FamilyDent">
            {articles.map((post, index) => (
              <ScrollAnimate key={post._id || post.id} as="article" delay={(index % 2) * 0.05} className={styles.card}>
                <Link to={`/blog/${post.slug || post._id || post.id}`} className={styles.cardLink}>
                  <div className={styles.imageWrapper}>
                    <img src={post.image || 'https://images.unsplash.com/photo-1559839734-2b71f1536780?q=80&w=2070'} alt={post.title} className={styles.image} loading="lazy" decoding="async" />
                  </div>
                  <div className={styles.cardContent}>
                    {post.category && <span className={styles.category}>{post.category}</span>}
                    <h2 className={styles.cardTitle}>{post.title}</h2>
                    <p className={styles.cardDesc}>{post.excerpt}</p>
                    <div className={styles.meta}>
                      <div className={styles.metaItems}><span><Calendar className="h-3.5 w-3.5" />{post.date ? new Date(post.date).toLocaleDateString('ru-RU') : 'Дата не указана'}</span><span><User className="h-3.5 w-3.5" />{post.author}</span></div>
                      <ArrowRight className={styles.arrow} aria-hidden="true" />
                    </div>
                  </div>
                </Link>
              </ScrollAnimate>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}
