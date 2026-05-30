import React, { createContext, useContext } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface BookingContextType {
 openBooking: (doctorId?: string) => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: React.ReactNode }) {
 const { user } = useAuth();
 const navigate = useNavigate();

 const openBooking = (doctorId?: string) => {
 if (!user) {
 toast.error('Войдите в систему, чтобы записаться на прием');
 navigate('/login');
 return;
 }

 navigate(doctorId ? `/book?doctorId=${doctorId}` : '/book');
 };

 return (
 <BookingContext.Provider value={{ openBooking }}>
 {children}
 </BookingContext.Provider>
 );
}

export function useBooking() {
 const context = useContext(BookingContext);
 if (context === undefined) {
 throw new Error('useBooking must be used within a BookingProvider');
 }
 return context;
}

