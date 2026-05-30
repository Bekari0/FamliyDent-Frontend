/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Header } from "./components/Header";
import { Breadcrumbs } from "./components/Breadcrumbs";
import { Footer } from "./components/Footer";
import { ChatWidget } from "./components/ChatWidget";
import { Toaster } from "sonner";

// Context Providers
import { BookingProvider } from "./context/BookingContext";
import { AuthProvider } from "./context/AuthContext";

// Pages
import { HomePage } from "./pages/HomePage";
import { DoctorsPage } from "./pages/DoctorsPage";
import { DoctorDetailPage } from "./pages/DoctorDetailPage";
import { ServicesPage } from "./pages/ServicesPage";
import { ServiceDetailPage } from "./pages/ServiceDetailPage";
import { PricingPage } from "./pages/PricingPage";
import { AboutPage } from "./pages/AboutPage";
import { ReviewsPage } from "./pages/ReviewsPage";
import { BlogPage } from "./pages/BlogPage";
import { ArticleDetailPage } from "./pages/ArticleDetailPage";
import { FAQPage } from "./pages/FAQPage";
import { ContactPage } from "./pages/ContactPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { ProfilePage } from "./pages/ProfilePage";
import { MyBookingsPage } from "./pages/MyBookingsPage";
import { BookingWizardPage } from "./pages/BookingWizardPage";
import { AdminDashboard } from "./pages/AdminDashboard";
import { AdminBookings } from "./pages/AdminBookings";
import { AdminDoctors } from "./pages/AdminDoctors";
import { AdminPatients } from "./pages/AdminPatients";
import { AdminBlog } from "./pages/AdminBlog";
import { AdminReviews } from "./pages/AdminReviews";
import { PatientRecordsPage } from "./pages/PatientRecordsPage";
import { DoctorDashboard } from "./pages/DoctorDashboard";
import { VerifyEmailPage } from "./pages/VerifyEmailPage";
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage";
import { ResetPasswordPage } from "./pages/ResetPasswordPage";
import { NotFoundPage } from "./pages/NotFoundPage";

// Components
import { ProtectedRoute } from "./components/ProtectedRoute";
import { UserRole } from "./types";

function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.replace("#", ""));
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <BookingProvider>
          <ScrollToTop />
          <AppContent />
          <Toaster position="top-center" expand={true} richColors />
        </BookingProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

function AppContent() {
  const location = useLocation();
  const noHeaderFooterPages = ["/login", "/register"];
  const isAuthPage = noHeaderFooterPages.includes(location.pathname);

  // List of valid routes to detect 404 state for layout purposes
  const validRoutes = [
    "/",
    "/about",
    "/contact",
    "/faq",
    "/reviews",
    "/pricing",
    "/services",
    "/doctors",
    "/blog",
    "/profile",
    "/book",
    "/admin",
    "/doctor",
  ];

  const isNotFound =
    !validRoutes.some(
      (route) =>
        location.pathname === route ||
        location.pathname.startsWith(route + "/"),
    ) && !isAuthPage;

  const shouldHideFooter = isAuthPage || isNotFound;
  const shouldHideBreadcrumbs = isAuthPage || isNotFound;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {!isAuthPage && <Header />}
      {!shouldHideBreadcrumbs && <Breadcrumbs />}
      <main className="flex-1">
        <Routes>
          {/* Публичные маршруты */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/reviews" element={<ReviewsPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/services/:id" element={<ServiceDetailPage />} />
          <Route path="/doctors" element={<DoctorsPage />} />
          <Route path="/doctors/:id" element={<DoctorDetailPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:id" element={<ArticleDetailPage />} />

          {/* Auth routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          {/* Защищённые маршруты для авторизованных пользователей */}
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/profile/bookings" element={<MyBookingsPage />} />
            <Route path="/profile/records" element={<PatientRecordsPage />} />
            <Route
              path="/profile/records/:patientId"
              element={<PatientRecordsPage />}
            />
            <Route path="/book" element={<BookingWizardPage />} />
          </Route>

          {/* Защищённые маршруты только для администратора */}
          <Route element={<ProtectedRoute requiredRole={UserRole.ADMIN} />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/bookings" element={<AdminBookings />} />
            <Route path="/admin/patients" element={<AdminPatients />} />
            <Route path="/admin/doctors" element={<AdminDoctors />} />
            <Route path="/admin/blog" element={<AdminBlog />} />
            <Route path="/admin/reviews" element={<AdminReviews />} />
          </Route>

          {/* Защищённые маршруты только для доктора */}
          <Route element={<ProtectedRoute requiredRole={UserRole.DOCTOR} />}>
            <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
          </Route>

          {/* 404 - всегда в конце, не защищён */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      {!shouldHideFooter && <Footer />}
      <ChatWidget />
    </div>
  );
}

