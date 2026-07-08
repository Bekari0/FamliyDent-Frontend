
import React from 'react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';

export function NotFoundPage() {
 const navigate = useNavigate();

 return (
 <div className="pt-40 pb-20 flex flex-col items-center justify-center text-center px-4">
 <motion.div
 initial={{ opacity: 0, scale: 0.8 }}
 animate={{ opacity: 1, scale: 1 }}
 className="relative mb-12"
 >
 <div className="text-[200px] font-display font-semibold text-secondary leading-none select-none">404</div>
 <div className="absolute inset-0 flex items-center justify-center">
 <div className="w-32 h-32 bg-primary/10 rounded-[32px] flex items-center justify-center animate-pulse">
 <div className="w-20 h-20 bg-primary rounded-lg flex items-center justify-center text-primary-foreground text-4xl shadow-2xl shadow-primary/40">?</div>
 </div>
 </div>
 </motion.div>
 <h1 className="text-4xl font-display font-semibold text-foreground mb-4">Упс! Страница не найдена</h1>
 <p className="text-muted-foreground mb-12 max-w-md mx-auto">Похоже, эта страница была удалена или никогда не существовала. Давайте вернемся к началу.</p>
 <div className="flex gap-4">
 <Link to="/">
 <Button className="h-14 px-8 rounded-lg bg-primary text-primary-foreground font-semibold group shadow-xl shadow-primary/20 hover:scale-105 transition-all">
 <Home className="w-5 h-5 mr-3" />
 На главную
 </Button>
 </Link>
 <Button 
 variant="outline"
 onClick={() => {
 if (window.history.length > 1) {
 navigate(-1);
 } else {
 navigate('/');
 }
 }} 
 className="h-14 px-8 rounded-lg bg-card border border-border text-muted-foreground font-semibold hover:bg-secondary flex items-center justify-center gap-3 transition-all"
 >
 <ArrowLeft className="w-5 h-5" />
 Вернуться назад
 </Button>
 </div>
 </div>
 );
}

