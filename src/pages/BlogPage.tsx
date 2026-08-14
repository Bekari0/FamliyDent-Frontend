import { useEffect, useState } from 'react';
import axios from 'axios';
import { ArrowRight, Calendar, Loader2, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { EditorialPageHero } from '@/components/shared/editorial-page-hero';
import { ScrollAnimate } from '@/components/shared/scroll-animate';
import { fetchPublicCollection, getCollectionRenderState } from './public-pages-behavior';
import * as styles from './BlogPage.styles';

export function BlogPage() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setError(null);
        const data = await fetchPublicCollection<unknown>('articles', (endpoint) => axios.get(endpoint));
        setArticles(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching articles:', error);
        setError('Не удалось загрузить статьи.');
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  const renderState = getCollectionRenderState({ loading, error: Boolean(error), items: articles });

  return (
    <main className={styles.page} data-ui="editorial-page">
      <EditorialPageHero
        badge="Полезные материалы"
        title="Блог и советы стоматологов"
        description="Экспертные статьи врачей FamilyDent о профилактике, лечении и ежедневной заботе о здоровье улыбки."
      />

      <div className={styles.container}>
        {renderState === 'loading' ? (
          <div className={styles.state} role="status"><Loader2 className={styles.loader} aria-hidden="true" />Загрузка статей...</div>
        ) : renderState === 'error' ? (
          <div className={styles.state} role="alert">{error}</div>
        ) : renderState === 'empty' ? (
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
