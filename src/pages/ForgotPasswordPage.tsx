
import React, { useState } from 'react';
import axios from 'axios';
import { Mail, ArrowLeft, Loader2, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

export function ForgotPasswordPage() {
 const [email, setEmail] = useState('');
 const [loading, setLoading] = useState(false);
 const [sent, setSent] = useState(false);

 const handleSubmit = async (e: React.FormEvent) => {
 e.preventDefault();
 setLoading(true);
 try {
 await axios.post('/api/auth/forgot-password', { email });
 setSent(true);
 toast.success('Инструкции отправлены');
 } catch (error: any) {
 toast.error(error.response?.data?.error || 'Ошибка');
 } finally {
 setLoading(false);
 }
 };

 return (
 <div className="min-h-screen flex items-center justify-center bg-background p-4 pt-24">
 <div className="max-w-md w-full bg-white rounded-[40px] shadow-2xl p-12">
 <Link to="/login" className="inline-flex items-center gap-2 text-text-secondary font-bold text-xs uppercase tracking-widest mb-8 hover:text-primary transition-colors">
 <ArrowLeft className="w-4 h-4" /> Назад
 </Link>

 {sent ? (
 <div className="text-center space-y-6">
 <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
 <h1 className="text-2xl font-bold">Проверьте почту</h1>
 <p className="text-text-secondary">Мы отправили ссылку для сброса пароля на <b>{email}</b></p>
 <Button asChild variant="outline" className="w-full h-14 rounded-2xl">
 <Link to="/login">Вернуться ко входу</Link>
 </Button>
 </div>
 ) : (
 <>
 <h1 className="text-3xl font-black text-foreground mb-2">Забыли пароль?</h1>
 <p className="text-text-secondary mb-8 font-medium">Введите ваш email, и мы пришлем ссылку для восстановления доступа.</p>

 <form onSubmit={handleSubmit} className="space-y-6">
 <div>
 <label className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-3 block ml-1">Email</label>
 <div className="relative">
 <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary/30" />
 <input 
 type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
 className="w-full h-14 pl-14 pr-6 rounded-2xl bg-secondary border-2 border-transparent focus:border-primary focus:bg-card transition-all outline-none font-medium"
 placeholder="example@mail.com"
 />
 </div>
 </div>
 <Button disabled={loading} type="submit" className="w-full h-14 rounded-2xl bg-primary text-white font-bold text-sm uppercase tracking-widest shadow-lg shadow-primary/20">
 {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Отправить ссылку'}
 </Button>
 </form>
 </>
 )}
 </div>
 </div>
 );
}

