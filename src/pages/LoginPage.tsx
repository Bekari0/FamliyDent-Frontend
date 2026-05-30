import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { Button } from '../components/ui/button';
import { LogIn, UserPlus, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import * as styles from './LoginPage.styles';

export function LoginPage() {
 const [email, setEmail] = useState('');
 const [password, setPassword] = useState('');
 const { login, user } = useAuth();
 const navigate = useNavigate();

 React.useEffect(() => {
 if (user) {
 if (user.role === UserRole.ADMIN) navigate('/admin');
 else if (user.role === UserRole.DOCTOR) navigate('/doctor/dashboard');
 else navigate('/profile');
 }
 }, [user, navigate]);

 const handleLogin = async (event: React.FormEvent) => {
 event.preventDefault();
 try {
 const loggedUser = await login(email, password);
 toast.success('Вы успешно вошли');
 if (loggedUser.role === UserRole.ADMIN) navigate('/admin');
 else if (loggedUser.role === UserRole.DOCTOR) navigate('/doctor/dashboard');
 else navigate('/profile');
 } catch (err: any) {
 toast.error(err.response?.data?.error || 'Ошибка входа. Проверьте данные.');
 }
 };

 return (
 <div className={styles.page}>
 <div className={styles.backWrapper}>
 <Button variant="ghost" asChild>
 <Link to="/">
 <ArrowLeft className={styles.backIcon} />
 На главную
 </Link>
 </Button>
 </div>
 <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className={styles.card}>
 <div className={styles.header}>
 <div className={styles.iconBox}>
 <LogIn className={styles.headerIcon} />
 </div>
 <h1 className={styles.title}>С возвращением</h1>
 <p className={styles.subtitle}>Войдите в личный кабинет для управления записями</p>
 </div>

 <form onSubmit={handleLogin} className={styles.form}>
 <label className={styles.label}>
 <span className={styles.labelTextWithIndent}>Email</span>
 <input type="email" required autoComplete="email" maxLength={100} value={email} onChange={(e) => setEmail(e.target.value)} className={styles.input} placeholder="example@mail.com" />
 </label>

 <label className={styles.label}>
 <div className={styles.labelRow}>
 <span className={styles.labelText}>Пароль</span>
 <Link to="/forgot-password" className={styles.forgotLink}>
 Забыли?
 </Link>
 </div>
 <input type="password" required autoComplete="current-password" maxLength={100} value={password} onChange={(e) => setPassword(e.target.value)} className={styles.input} placeholder="Пароль" />
 </label>

 <Button type="submit" className={styles.submitButton}>
 Войти
 </Button>
 </form>

 <div className={styles.registerSection}>
 <p className={styles.registerText}>Еще нет аккаунта?</p>
 <Button asChild variant="outline" className={styles.registerButton}>
 <Link to="/register">
 <UserPlus className={styles.registerIcon} />
 Зарегистрироваться
 </Link>
 </Button>
 </div>
 </motion.div>
 </div>
 );
}


