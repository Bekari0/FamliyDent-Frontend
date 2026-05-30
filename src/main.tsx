import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { Toaster } from '@/components/ui/sonner';

// Register Service Worker for PWA only in production.
// In local dev it can cache stale bundles and hide runtime fixes behind a white screen.
if ('serviceWorker' in navigator && import.meta.env.PROD) {
 window.addEventListener('load', () => {
 navigator.serviceWorker.register('/sw.js').then(registration => {
 console.log('SW registered: ', registration);
 }).catch(registrationError => {
 console.log('SW registration failed: ', registrationError);
 });
 });
} else if ('serviceWorker' in navigator) {
 navigator.serviceWorker.getRegistrations().then((registrations) => {
 registrations.forEach((registration) => registration.unregister());
 });
}

createRoot(document.getElementById('root')!).render(
 <StrictMode>
 <App />
 <Toaster position="top-center" richColors />
 </StrictMode>,
);

