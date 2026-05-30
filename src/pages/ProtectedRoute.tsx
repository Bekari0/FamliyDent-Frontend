
import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { toast } from 'sonner';

interface ProtectedRouteProps {
 children?: React.ReactNode;
 requiredRole?: UserRole;
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
 const { user, loading, isAdmin } = useAuth();
 const location = useLocation();

 if (loading) {
 return (
 <div className="min-h-screen flex items-center justify-center">
 <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
 </div>
 );
 }

 if (!user) {
 // Only toast and navigate if we are on a route that is definitely protected
 // If it's a layout route, we check user first
 toast.error('Для доступа к этой странице необходимо войти в систему');
 return <Navigate to="/login" state={{ from: location }} replace />;
 }

 if (requiredRole === UserRole.ADMIN && !isAdmin) {
 toast.error('Доступ запрещен. Требуются права администратора.');
 return <Navigate to="/" replace />;
 }

 if (requiredRole === UserRole.DOCTOR && user.role !== UserRole.DOCTOR) {
 toast.error('Доступ запрещен. Требуются права врача.');
 return <Navigate to="/" replace />;
 }

 // Block unverified users from /book and /profile
 const restrictedPaths = ['/book', '/profile'];
 const isRestricted = restrictedPaths.some(path => location.pathname === path || location.pathname.startsWith(path + '/'));
 
 if (isRestricted && user.role === UserRole.PATIENT && !user.isEmailVerified) {
 toast.error('Пожалуйста, подтвердите ваш email для доступа к этой странице');
 return <Navigate to="/profile/bookings" state={{ from: location }} replace />;
 }

 return children ? <>{children}</> : <Outlet />;
}

