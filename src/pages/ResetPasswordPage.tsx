
import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Lock, Loader2, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';

export function ResetPasswordPage() {
 const [searchParams] = useSearchParams();
 const token = searchParams.get('token');
 const navigate = useNavigate();
 
 const [password, setPassword] = useState('');
 const [confirmPassword, setConfirmPassword] = useState('');
 const [loading, setLoading] = useState(false);
 const [success, setSuccess] = useState(false);

 const handleSubmit = async (e: React.FormEvent) => {
 e.preventDefault();
 if (password !== confirmPassword) {
 toast.error('Пароли не совпадают');
 return;
 }
 if (password.length < 8) {
 toast.error('Пароль должен быть не менее 8 символов');
 return;
 }

 setLoading(true);
 try {
 await axios.post('/api/auth/reset-password', { token, newPassword: password });
 setSuccess(true);
 toast.success('Пароль успешно изменен');
 setTimeout(() => navigate('/login'), 3000);
 } catch (error: any) {
 toast.error(error.response?.data?.error || 'Ошибка');
 } finally {
 setLoading(false);
 }
 };

 if (!token) return <div className="pt-24 text-center">Токен отсутствует</div>;

 return (
 <div className="min-h-screen flex items-center justify-center bg-background p-4 pt-24">
 <div className="max-w-md w-full bg-card rounded-[40px] shadow-2xl p-12">
 {success ? (
 <div className="text-center space-y-6">
 <CheckCircle className="w-16 h-16 text-success mx-auto" />
 <h1 className="text-2xl font-semibold">Пароль изменен</h1>
 <p className="text-muted-foreground">Вы будете перенаправлены на страницу входа через несколько секунд.</p>
 <Button onClick={() => navigate('/login')} className="w-full h-14 rounded-lg bg-primary text-primary-foreground">
 Войти сейчас
 </Button>
 </div>
 ) : (
 <>
 <h1 className="text-3xl font-semibold text-foreground mb-2">Новый пароль</h1>
 <p className="text-muted-foreground mb-8 font-medium">Придумайте надежный пароль.</p>

 <form onSubmit={handleSubmit} className="space-y-6">
 <div>
 <label className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.18em] mb-3 block ml-1">Пароль</label>
 <div className="relative">
 <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/30" />
 <input 
 type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
 className="w-full h-14 pl-14 pr-6 rounded-lg bg-secondary border-2 border-transparent focus:border-primary focus:bg-card transition-all outline-none font-medium"
 placeholder="••••••••"
 />
 </div>
 </div>

 <div>
 <label className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.18em] mb-3 block ml-1">Подтверждение</label>
 <div className="relative">
 <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/30" />
 <input 
 type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
 className="w-full h-14 pl-14 pr-6 rounded-lg bg-secondary border-2 border-transparent focus:border-primary focus:bg-card transition-all outline-none font-medium"
 placeholder="••••••••"
 />
 </div>
 </div>

 <Button disabled={loading} type="submit" className="w-full h-14 rounded-lg bg-primary text-primary-foreground font-semibold text-sm uppercase tracking-[0.18em] shadow-lg shadow-primary/20">
 {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Сбросить пароль'}
 </Button>
 </form>
 </>
 )}
 </div>
 </div>
 );
}

