import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight, ChevronRight, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import axios from 'axios';
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
 <div className={styles.page}>
 <div className={styles.container}>
 <div className={styles.header}>
 <motion.div
 initial={{ opacity: 0, scale: 0.9 }}
 animate={{ opacity: 1, scale: 1 }}
 className={styles.badge}
 >
 Наш блог
 </motion.div>
 <motion.h1 
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 className={styles.title}
 >
 Полезные советы от <span className={styles.titleSpan}>FamilyDent</span>
 </motion.h1>
 <p className={styles.desc}>
 Интересные статьи о новинках стоматологии, секреты красивой улыбки и профессиональные советы наших врачей.
 </p>
 </div>

 {loading ? (
 <div className="flex justify-center py-20">
 <Loader2 className="w-12 h-12 animate-spin text-primary" />
 </div>
 ) : (
 <div className={styles.grid}>
 {articles.map((post, idx) => (
 <motion.article 
 key={post._id || post.id}
 initial={{ opacity: 0, y: 30 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ delay: (idx % 3) * 0.1 }}
 className={styles.card}
 >
 <div className={styles.imageWrapper}>
 <img 
 src={post.image || 'https://images.unsplash.com/photo-1559839734-2b71f1536780?q=80&w=2070'} 
 alt={post.title} 
 className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
 />
 </div>
 <div className={styles.cardContent}>
 <div className={styles.meta}>
 <div className="flex items-center gap-2">
 <Calendar className="w-3.5 h-3.5 text-primary" />
 {new Date(post.date).toLocaleDateString()}
 </div>
 <div className="flex items-center gap-2">
 <User className="w-3.5 h-3.5 text-primary" />
 {post.author}
 </div>
 </div>
 <h2 className={styles.cardTitle}>
 {post.title}
 </h2>
 <p className={styles.cardDesc}>
 {post.excerpt}
 </p>
 <Link 
 to={`/blog/${post._id || post.id}`}
 className={styles.link}
 >
 Читать статью
 <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
 </Link>
 </div>
 </motion.article>
 ))}
 </div>
 )}
 </div>
 </div>
 );
}


