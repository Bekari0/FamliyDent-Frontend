import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Header } from "./components/Header";
import { Breadcrumbs } from "./components/Breadcrumbs";
import { Footer } from "./components/Footer";
import { ChatWidget } from "./components/ChatWidget";
import { Toaster } from "sonner";
import { Analytics } from "./components/Analytics";
import { Seo } from "./components/Seo";

// Провайдеры контекста
import { BookingProvider } from "./context/BookingContext";
import { AuthProvider } from "./context/AuthContext";

const HomePage = lazy(() => import("./pages/HomePage").then((m) => ({ default: m.HomePage })));
const DoctorsPage = lazy(() => import("./pages/DoctorsPage").then((m) => ({ default: m.DoctorsPage })));
const DoctorDetailPage = lazy(() => import("./pages/DoctorDetailPage").then((m) => ({ default: m.DoctorDetailPage })));
const ServicesPage = lazy(() => import("./pages/ServicesPage").then((m) => ({ default: m.ServicesPage })));
const ServiceDetailPage = lazy(() => import("./pages/ServiceDetailPage").then((m) => ({ default: m.ServiceDetailPage })));
const PricingPage = lazy(() => import("./pages/PricingPage").then((m) => ({ default: m.PricingPage })));
const AboutPage = lazy(() => import("./pages/AboutPage").then((m) => ({ default: m.AboutPage })));
const ReviewsPage = lazy(() => import("./pages/ReviewsPage").then((m) => ({ default: m.ReviewsPage })));
const BlogPage = lazy(() => import("./pages/BlogPage").then((m) => ({ default: m.BlogPage })));
const ArticleDetailPage = lazy(() => import("./pages/ArticleDetailPage").then((m) => ({ default: m.ArticleDetailPage })));
const FAQPage = lazy(() => import("./pages/FAQPage").then((m) => ({ default: m.FAQPage })));
const ContactPage = lazy(() => import("./pages/ContactPage").then((m) => ({ default: m.ContactPage })));
const LoginPage = lazy(() => import("./pages/LoginPage").then((m) => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import("./pages/RegisterPage").then((m) => ({ default: m.RegisterPage })));
const ProfilePage = lazy(() => import("./pages/ProfilePage").then((m) => ({ default: m.ProfilePage })));
const MyBookingsPage = lazy(() => import("./pages/MyBookingsPage").then((m) => ({ default: m.MyBookingsPage })));
const BookingWizardPage = lazy(() => import("./pages/BookingWizardPage").then((m) => ({ default: m.BookingWizardPage })));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard").then((m) => ({ default: m.AdminDashboard })));
const AdminBookings = lazy(() => import("./pages/AdminBookings").then((m) => ({ default: m.AdminBookings })));
const AdminDoctors = lazy(() => import("./pages/AdminDoctors").then((m) => ({ default: m.AdminDoctors })));
const AdminPatients = lazy(() => import("./pages/AdminPatients").then((m) => ({ default: m.AdminPatients })));
const AdminBlog = lazy(() => import("./pages/AdminBlog").then((m) => ({ default: m.AdminBlog })));
const AdminReviews = lazy(() => import("./pages/AdminReviews").then((m) => ({ default: m.AdminReviews })));
const PatientRecordsPage = lazy(() => import("./pages/PatientRecordsPage").then((m) => ({ default: m.PatientRecordsPage })));
const DoctorDashboard = lazy(() => import("./pages/DoctorDashboard").then((m) => ({ default: m.DoctorDashboard })));
const VerifyEmailPage = lazy(() => import("./pages/VerifyEmailPage").then((m) => ({ default: m.VerifyEmailPage })));
const ForgotPasswordPage = lazy(() => import("./pages/ForgotPasswordPage").then((m) => ({ default: m.ForgotPasswordPage })));
const ResetPasswordPage = lazy(() => import("./pages/ResetPasswordPage").then((m) => ({ default: m.ResetPasswordPage })));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage").then((m) => ({ default: m.NotFoundPage })));

// Компоненты
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

function PageFallback() {
  return (
    <div className="min-h-[55vh] flex items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <BookingProvider>
          <ScrollToTop />
          <Seo />
          <Analytics />
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

  // Список рабочих маршрутов для определения страницы 404
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
        <Suspense fallback={<PageFallback />}>
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

          {/* Маршруты авторизации */}
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
        </Suspense>
      </main>
      {!shouldHideFooter && <Footer />}
      <ChatWidget />
    </div>
  );
}

