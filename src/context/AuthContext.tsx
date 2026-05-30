
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { UserProfile, UserRole } from '../types';

interface AuthContextType {
 user: UserProfile | null;
 loading: boolean;
 login: (email: string, password: string) => Promise<UserProfile>;
 register: (email: string, password: string, displayName: string, phone?: string, birthDate?: string, gender?: string) => Promise<void>;
 verifyCode: (email: string, code: string) => Promise<void>;
 resendCode: (email: string) => Promise<void>;
 loginWithGoogle: () => Promise<void>;
 logout: () => Promise<void>;
 refreshUser: () => Promise<void>;
 isAdmin: boolean;
 isDoctor: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Set default base URL for axios
axios.defaults.baseURL = '';
axios.defaults.withCredentials = true;

// Interceptor can still be used for other headers, but we'll rely on cookies for the token
axios.interceptors.request.use((config) => {
 return config;
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
 const [user, setUser] = useState<UserProfile | null>(null);
 const [loading, setLoading] = useState(true);

 const initAuth = async () => {
 try {
 const response = await axios.get('/api/auth/me');
 const userData = response.data;
 setUser(userData);
 } catch (error) {
 setUser(null);
 } finally {
 setLoading(false);
 }
 };

 useEffect(() => {
 initAuth();
 }, []);

 const login = async (email: string, password: string) => {
 const response = await axios.post('/api/auth/login', { email, password });
 const { user } = response.data;
 setUser(user);
 return user;
 };

 const register = async (email: string, password: string, displayName: string, phone?: string, birthDate?: string, gender?: string) => {
 await axios.post('/api/auth/register', { email, password, displayName, phone, birthDate, gender });
 // Don't set user yet, email needs verification
 };

 const verifyCode = async (email: string, code: string) => {
 await axios.post('/api/auth/verify-code', { email, code });
 };

 const resendCode = async (email: string) => {
 await axios.post('/api/auth/resend-code', { email });
 };

 const loginWithGoogle = async () => {
 alert('Google login is temporarily disabled. Please use email registration.');
 throw new Error('Google login disabled');
 };

 const logout = async () => {
 await axios.post('/api/auth/logout');
 setUser(null);
 };

 const refreshUser = async () => {
 await initAuth();
 };

 const value = {
 user,
 loading,
 login,
 register,
 verifyCode,
 resendCode,
 loginWithGoogle,
 logout,
 refreshUser,
 isAdmin: user?.role === UserRole.ADMIN,
 isDoctor: user?.role === UserRole.DOCTOR,
 };

 return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
 const context = useContext(AuthContext);
 if (context === undefined) {
 throw new Error('useAuth must be used within an AuthProvider');
 }
 return context;
};

