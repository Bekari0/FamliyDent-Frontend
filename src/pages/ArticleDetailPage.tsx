
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { MOCK_ARTICLES } from '../data/mockData';
import { Calendar, User, Share2, Facebook, Twitter, Link2, ChevronLeft } from 'lucide-react';

export function ArticleDetailPage() {
 const { id } = useParams();
 const post = MOCK_ARTICLES.find(a => a.id === id);

 if (!post) return <div className="py-20 text-center">Статья не найдена</div>;

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
 {post.tags.map(t => (
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
 {post.date}
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
 <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
 </motion.div>

 <div className="prose prose-stone prose-lg max-w-none">
 <p className="text-xl text-text-secondary font-medium italic mb-10 leading-relaxed border-l-4 border-primary pl-8 py-2">
 {post.excerpt}
 </p>
 <div className="text-foreground leading-relaxed space-y-8">
 <p>{post.content}</p>
 <h3 className="text-2xl font-bold">Почему это важно?</h3>
 <p>{post.content.slice(0, 1000)}</p>
 </div>
 </div>

 <div className="mt-20 pt-10 border-t border-border">
 <h3 className="text-xl font-bold text-foreground mb-6">Поделиться в соцсетях:</h3>
 <div className="flex flex-wrap gap-4">
 <button className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-foreground text-card font-bold text-sm shadow-lg shadow-foreground/5">
 <Facebook className="w-5 h-5 fill-current" />
 Facebook
 </button>
 <button className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-primary text-white font-bold text-sm shadow-lg shadow-primary/20">
 <Twitter className="w-5 h-5 fill-current" />
 Twitter
 </button>
 <button className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-card border border-border text-text-secondary font-bold text-sm">
 <Link2 className="w-5 h-5" />
 Копировать ссылку
 </button>
 </div>
 </div>
 </div>
 </div>
 );
}

