import React, { Suspense, lazy, useState, useEffect } from "react";
import { BrowserRouter, Navigate, Routes, Route, useLocation } from "react-router-dom";
import { SiteHeader } from "./components/navigation/site-header";
import { SiteFooter } from "./components/navigation/site-footer";
import { BookingModal } from "./components/booking/booking-modal";
import { AuthDialog } from "./components/auth/auth-dialog";
import { SocialContactLauncher } from "./components/shared/social-contact-launcher";
import { OrbitalRings } from "./components/OrbitalRings";

const HomePage = lazy(() => import("./pages/HomePage").then((m) => ({ default: m.HomePage })));
const DoctorsPage = lazy(() => import("./pages/DoctorsPage").then((m) => ({ default: m.DoctorsPage })));
const AboutPage = lazy(() => import("./pages/AboutPage").then((m) => ({ default: m.AboutPage })));
const ClinicTourPage = lazy(() => import("./pages/ClinicTourPage").then((m) => ({ default: m.ClinicTourPage })));
const EquipmentPage = lazy(() => import("./pages/EquipmentPage").then((m) => ({ default: m.EquipmentPage })));
const ResultsPage = lazy(() => import("./pages/ResultsPage").then((m) => ({ default: m.ResultsPage })));
const TourismPage = lazy(() => import("./pages/TourismPage").then((m) => ({ default: m.TourismPage })));
const AcademyPage = lazy(() => import("./pages/AcademyPage").then((m) => ({ default: m.AcademyPage })));
const ServicesPage = lazy(() => import("./pages/ServicesPage").then((m) => ({ default: m.ServicesPage })));
const ReviewsPage = lazy(() => import("./pages/ReviewsPage").then((m) => ({ default: m.ReviewsPage })));
const BlogPage = lazy(() => import("./pages/BlogPage").then((m) => ({ default: m.BlogPage })));
const BlogPostPage = lazy(() => import("./pages/BlogPostPage").then((m) => ({ default: m.BlogPostPage })));
const ContactsPage = lazy(() => import("./pages/ContactsPage").then((m) => ({ default: m.ContactsPage })));
const FaqPage = lazy(() => import("./pages/FaqPage").then((m) => ({ default: m.FaqPage })));

export { OrbitalRings };

function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
      requestAnimationFrame(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
      });
    }
  }, [pathname, hash]);

  return null;
}

export default function App() {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<string | undefined>(undefined);
  const [authOpen, setAuthOpen] = useState(false);

  const handleOpenBooking = (doctorName?: string) => {
    setSelectedDoctor(doctorName);
    setBookingOpen(true);
  };

  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen bg-paper text-ink font-body selection:bg-accent selection:text-accent-ink">
        <SiteHeader
          onOpenBooking={() => handleOpenBooking()}
          onOpenAuth={() => setAuthOpen(true)}
        />

        <main className="flex-1 w-full pt-16 sm:pt-18">
          <Suspense fallback={<div className="min-h-screen bg-paper" /> }>
            <Routes>
              <Route path="/" element={<HomePage onOpenBooking={() => handleOpenBooking()} />} />
              <Route path="/people" element={<Navigate to="/doctors" replace />} />
              <Route path="/doctors" element={<DoctorsPage onOpenBooking={handleOpenBooking} />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/about/clinic-tour" element={<ClinicTourPage />} />
              <Route path="/about/equipment" element={<EquipmentPage />} />
              <Route path="/results" element={<ResultsPage />} />
              <Route path="/tourism" element={<TourismPage />} />
              <Route path="/academy" element={<AcademyPage />} />
              <Route path="/services" element={<ServicesPage onOpenBooking={() => handleOpenBooking()} />} />
              <Route path="/pricing" element={<ServicesPage onOpenBooking={() => handleOpenBooking()} />} />
              <Route path="/reviews" element={<ReviewsPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/:slug" element={<BlogPostPage />} />
              <Route path="/contacts" element={<ContactsPage />} />
              <Route path="/faq" element={<FaqPage />} />
            </Routes>
          </Suspense>
        </main>

        <SiteFooter />

        <SocialContactLauncher />

        <BookingModal
          isOpen={bookingOpen}
          onClose={() => setBookingOpen(false)}
          preselectedDoctor={selectedDoctor}
        />

        <AuthDialog
          isOpen={authOpen}
          onClose={() => setAuthOpen(false)}
        />
      </div>
    </BrowserRouter>
  );
}
