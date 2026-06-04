
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { MOCK_ARTICLES } from '../data/mockData';
import { Calendar, User, Share2, Facebook, Twitter, Link2, ChevronLeft, Loader2 } from 'lucide-react';
import axios from 'axios';

export function ArticleDetailPage() {
 const { id } = useParams();
 const [post, setPost] = useState<any | null>(null);
 const [loading, setLoading] = useState(true);
 const [notFound, setNotFound] = useState(false);
 const [copied, setCopied] = useState(false);

 useEffect(() => {
 const fetchArticle = async () => {
 if (!id) {
 setNotFound(true);
 setLoading(false);
 return;
 }

 try {
 const response = await axios.get(`/api/articles/${id}`);
 setPost(response.data);
 setNotFound(false);
 } catch (error) {
 const fallback = MOCK_ARTICLES.find((article: any) => article.id === id || article._id === id);
 if (fallback) {
 setPost(fallback);
 setNotFound(false);
 } else {
 setNotFound(true);
 }
 } finally {
 setLoading(false);
 }
 };

 fetchArticle();
 }, [id]);

 if (loading) {
 return (
 <div className="py-20 text-center">
 <Loader2 className="mx-auto h-10 w-10 animate-spin text-primary" />
 </div>
 );
 }

 if (notFound || !post) return <div className="py-20 text-center">Статья не найдена</div>;

 const tags = Array.isArray(post.tags) ? post.tags : [];
 const articleDate = post.date ? new Date(post.date).toLocaleDateString('ru-RU') : '';
 const image = post.image || 'https://images.unsplash.com/photo-1559839734-2b71f1536780?q=80&w=2070';
 const content = post.content || post.excerpt || '';
 const articleUrl = window.location.href;
 const shareTitle = post.title || 'Статья FamilyDent';

 const openShareWindow = (url: string) => {
 window.open(url, '_blank', 'noopener,noreferrer,width=640,height=520');
 };

 const shareOnFacebook = () => {
 openShareWindow(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(articleUrl)}`);
 };

 const shareOnTwitter = () => {
 openShareWindow(
 `https://twitter.com/intent/tweet?url=${encodeURIComponent(articleUrl)}&text=${encodeURIComponent(shareTitle)}`,
 );
 };

 const copyArticleLink = async () => {
 try {
 if (navigator.clipboard && window.isSecureContext) {
 await navigator.clipboard.writeText(articleUrl);
 } else {
 const textarea = document.createElement('textarea');
 textarea.value = articleUrl;
 textarea.setAttribute('readonly', '');
 textarea.style.position = 'fixed';
 textarea.style.left = '-9999px';
 textarea.style.top = '-9999px';
 document.body.appendChild(textarea);
 textarea.focus();
 textarea.select();
 document.execCommand('copy');
 document.body.removeChild(textarea);
 }

 setCopied(true);
 window.setTimeout(() => setCopied(false), 2000);
 } catch (error) {
 console.error('Не удалось скопировать ссылку:', error);
 }
 };

 return (
 <div className="pt-24 pb-20">
 <div className="container mx-auto px-4 max-w-4xl">
 <Link 
 to="/blog" 
 className="inline-flex items-center gap-2 text-text-secondary hover:text-primary font-bold text-xs uppercase tracking-widest mb-10 transition-colors"
 >
 <ChevronLeft className="w-4 h-4" />
 Назад к блогу
 </Link>

 <header className="mb-12">
 <div className="flex gap-2 mb-6">
 {tags.map((t: string) => (
 <span key={t} className="px-4 py-1.5 bg-primary/5 text-primary rounded-full text-xs font-bold uppercase tracking-widest">
 #{t}
 </span>
 ))}
 </div>
 <motion.h1 
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 className="text-4xl lg:text-5xl font-display font-bold text-foreground mb-8 leading-tight"
 >
 {post.title}
 </motion.h1>
 
 <div className="flex items-center justify-between py-6 border-y border-border">
 <div className="flex items-center gap-6">
 <div className="flex items-center gap-2 text-sm text-text-secondary">
 <Calendar className="w-4 h-4" />
 {articleDate}
 </div>
 <div className="flex items-center gap-2 text-sm text-text-secondary font-bold">
 <User className="w-4 h-4 text-primary" />
 {post.author}
 </div>
 </div>
 <div className="flex items-center gap-3">
 <button className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-secondary transition-colors">
 <Share2 className="w-4 h-4 text-text-secondary" />
 </button>
 </div>
 </div>
 </header>

 <motion.div 
 initial={{ opacity: 0, scale: 0.98 }}
 animate={{ opacity: 1, scale: 1 }}
 className="aspect-[21/9] rounded-[40px] overflow-hidden mb-12 shadow-2xl"
 >
 <img src={image} alt={post.title} className="w-full h-full object-cover" loading="eager" decoding="async" />
 </motion.div>

 <div className="prose prose-stone prose-lg max-w-none">
 <p className="text-xl text-text-secondary font-medium italic mb-10 leading-relaxed border-l-4 border-primary pl-8 py-2">
 {post.excerpt}
 </p>
 <div className="text-foreground leading-relaxed space-y-8">
 <p>{content}</p>
 <h3 className="text-2xl font-bold">Почему это важно?</h3>
 <p>{content.slice(0, 1000)}</p>
 </div>
 </div>

 <div className="mt-20 pt-10 border-t border-border">
 <h3 className="text-xl font-bold text-foreground mb-6">Поделиться в соцсетях:</h3>
 <div className="flex flex-wrap gap-4">
 <button
 type="button"
 onClick={shareOnFacebook}
 className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-foreground text-card font-bold text-sm shadow-lg shadow-foreground/5 hover:opacity-90 active:scale-95 transition-all"
 >
 <Facebook className="w-5 h-5 fill-current" />
 Facebook
 </button>
 <button
 type="button"
 onClick={shareOnTwitter}
 className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-primary text-white font-bold text-sm shadow-lg shadow-primary/20 hover:opacity-90 active:scale-95 transition-all"
 >
 <Twitter className="w-5 h-5 fill-current" />
 Twitter
 </button>
 <button
 type="button"
 onClick={copyArticleLink}
 className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-card border border-border text-text-secondary font-bold text-sm hover:bg-secondary active:scale-95 transition-all"
 >
 <Link2 className="w-5 h-5" />
 {copied ? 'Ссылка скопирована' : 'Копировать ссылку'}
 </button>
 </div>
 </div>
 </div>
 </div>
 );
}

