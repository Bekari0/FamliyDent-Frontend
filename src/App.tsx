import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { SiteHeader } from "./components/navigation/site-header";
import { SiteFooter } from "./components/navigation/site-footer";
import { BookingModal } from "./components/booking/booking-modal";
import { AuthDialog } from "./components/auth/auth-dialog";

import { HomePage } from "./pages/HomePage";
import { PeoplePage } from "./pages/PeoplePage";
import { DoctorsPage } from "./pages/DoctorsPage";
import { AboutPage } from "./pages/AboutPage";
import { ClinicTourPage } from "./pages/ClinicTourPage";
import { EquipmentPage } from "./pages/EquipmentPage";
import { ResultsPage } from "./pages/ResultsPage";
import { TourismPage } from "./pages/TourismPage";
import { AcademyPage } from "./pages/AcademyPage";
import { ServicesPage } from "./pages/ServicesPage";
import { PricingPage } from "./pages/PricingPage";
import { ReviewsPage } from "./pages/ReviewsPage";
import { BlogPage } from "./pages/BlogPage";
import { BlogPostPage } from "./pages/BlogPostPage";
import { ContactsPage } from "./pages/ContactsPage";
import { FaqPage } from "./pages/FaqPage";
import { OrbitalRings } from "./components/OrbitalRings";

export { OrbitalRings };

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
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

        <main className="flex-1 w-full">
          <Routes>
            <Route path="/" element={<HomePage onOpenBooking={() => handleOpenBooking()} />} />
            <Route path="/people" element={<PeoplePage onOpenBooking={handleOpenBooking} />} />
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
        </main>

        <SiteFooter />

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
