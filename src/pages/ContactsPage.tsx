import React, { useEffect } from "react";
import { EditorialPageHero } from "../components/shared/editorial-page-hero";
import { MapPin, Phone, Mail, Clock, MessageSquare } from "lucide-react";

export function ContactsPage() {
  useEffect(() => {
    document.title = "Контакты — Family Dent Душанбе";
  }, []);

  return (
    <div className="w-full flex flex-col min-h-screen bg-paper text-ink">
      <EditorialPageHero
        badge="Связь с нами"
        title="Контакты клиники Family Dent"
        description="Мы находимся в самом центре Душанбе. Запишитесь на прием удобным для вас способом."
      />

      <div className="max-w-5xl mx-auto px-5 my-8 w-full grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Contact info cards */}
        <div className="bg-surface border border-rule rounded-3xl p-8 shadow-card flex flex-col gap-6">
          <h2 className="font-display text-xl font-bold text-ink mb-2">Наш адрес и часы работы</h2>

          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-accent/15 text-accent flex items-center justify-center flex-shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs uppercase text-accent font-semibold block font-mono">Адреса филиалов</span>
              <p className="text-sm text-ink font-medium">Улица Айни, 45</p>
              <p className="text-sm text-ink font-medium mt-1">Улица Немат Карабаева, 29</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-accent/15 text-accent flex items-center justify-center flex-shrink-0">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs uppercase text-accent font-semibold block font-mono">Телефон</span>
              <a href="tel:+992446606600" className="text-sm text-ink hover:text-accent font-medium">
                +992 446 60 66 00
              </a>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-accent/15 text-accent flex items-center justify-center flex-shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs uppercase text-accent font-semibold block font-mono">График работы</span>
              <p className="text-sm text-ink font-normal">Понедельник – Суббота: 08:00 – 20:00</p>
              <p className="text-xs text-muted">Воскресенье: по предварительной записи</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-accent/15 text-accent flex items-center justify-center flex-shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs uppercase text-accent font-semibold block font-mono">Email</span>
              <a href="mailto:familydent.tj@gmail.com" className="text-sm text-ink hover:text-accent font-medium">
                familydent.tj@gmail.com
              </a>
            </div>
          </div>
        </div>

        {/* Interactive Map Placeholder */}
        <div className="bg-surface border border-rule rounded-3xl p-6 shadow-card flex flex-col items-center justify-center text-center relative overflow-hidden min-h-[300px]">
          <MapPin className="w-12 h-12 text-accent mb-3 animate-bounce" />
          <h3 className="font-display text-lg font-bold text-ink mb-1">Клиника на карте Душанбе</h3>
          <p className="text-xs text-muted max-w-xs font-normal">
            Удобный подъезд и собственная бесплатная парковка для пациентов клиники.
          </p>
        </div>
      </div>
    </div>
  );
}
