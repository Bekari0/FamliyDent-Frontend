
import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle, XCircle, Loader2, Home } from 'lucide-react';
import { Button } from '../components/ui/button';

export function VerifyEmailPage() {
 const [searchParams] = useSearchParams();
 const token = searchParams.get('token');
 const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
 const [message, setMessage] = useState('');

 useEffect(() => {
 if (!token) {
 setStatus('error');
 setMessage('Токен отсутствует');
 return;
 }

 const verify = async () => {
 try {
 await axios.get(`/api/auth/verify-email/${token}`);
 setStatus('success');
 } catch (error: any) {
 setStatus('error');
 setMessage(error.response?.data?.error || 'Ошибка подтверждения');
 }
 };
 verify();
 }, [token]);

 return (
 <div className="min-h-screen flex items-center justify-center bg-background p-4 pt-24">
 <div className="max-w-md w-full bg-card rounded-[40px] shadow-2xl p-12 text-center">
 {status === 'loading' && (
 <div className="space-y-6">
 <Loader2 className="w-16 h-16 animate-spin text-primary mx-auto" />
 <h1 className="text-2xl font-bold">Проверка email...</h1>
 </div>
 )}

 {status === 'success' && (
 <div className="space-y-6">
 <CheckCircle className="w-16 h-16 text-accent mx-auto" />
 <h1 className="text-2xl font-bold">Email подтвержден!</h1>
 <p className="text-text-secondary">Теперь вы можете пользоваться всеми функциями клиники.</p>
 <Button asChild className="w-full h-14 rounded-2xl bg-primary text-white font-bold">
 <Link to="/login">Войти в кабинет</Link>
 </Button>
 </div>
 )}

 {status === 'error' && (
 <div className="space-y-6">
 <XCircle className="w-16 h-16 text-red-500 mx-auto" />
 <h1 className="text-2xl font-bold">Ошибка</h1>
 <p className="text-text-secondary">{message}</p>
 <Button asChild variant="outline" className="w-full h-14 rounded-2xl border-border">
 <Link to="/"><Home className="w-4 h-4 mr-2" /> На главную</Link>
 </Button>
 </div>
 )}
 </div>
 </div>
 );
}

