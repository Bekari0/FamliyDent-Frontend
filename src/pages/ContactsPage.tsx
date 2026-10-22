import { Container, Heading, Reveal, Text } from "@/ui-kit";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { useEffect } from "react";
import { EditorialPageHero } from "../components/shared/editorial-page-hero";

export function ContactsPage() {
  useEffect(() => {
    document.title = "Контакты — Family Dent Душанбе";
  }, []);

  return (
    <div
      className="w-full flex flex-col min-h-screen bg-paper text-ink"
      data-ui-scheme="default"
    >
      <EditorialPageHero
        badge="Связь с нами"
        title="Контакты клиники Family Dent"
        description="Мы находимся в самом центре Душанбе. Запишитесь на прием удобным для вас способом."
      />

      <Container
        width="content"
        className="my-8 grid grid-cols-1 gap-8 tablet:grid-cols-2"
      >
        {/* Contact info cards */}
        <Reveal
          className="bg-surface border border-rule rounded-3xl p-8 shadow-card flex flex-col gap-6"
          data-ui-scheme="default"
        >
          <Heading level={2} variant="heading-4" className="text-ink mb-2">
            Наш адрес и часы работы
          </Heading>

          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-accent/15 text-brand-text flex items-center justify-center flex-shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="type-overline uppercase text-brand-text block">
                Адреса филиалов
              </span>
              <Text variant="body-sm" className="text-ink">
                Улица Айни, 45
              </Text>
              <Text variant="body-sm" className="text-ink mt-1">
                Улица Немат Карабаева, 29
              </Text>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-accent/15 text-brand-text flex items-center justify-center flex-shrink-0">
              <Phone className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="type-overline uppercase text-brand-text block">
                Телефон
              </span>
              <a
                href="tel:+992446606600"
                className="type-body-sm break-words text-ink hover:text-brand-text"
              >
                +992 446 60 66 00
              </a>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-accent/15 text-brand-text flex items-center justify-center flex-shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="type-overline uppercase text-brand-text block">
                График работы
              </span>
              <Text variant="body-sm" className="text-ink">
                Понедельник – Суббота: 08:00 – 20:00
              </Text>
              <Text variant="body-sm" className="text-muted">
                Воскресенье: по предварительной записи
              </Text>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-accent/15 text-brand-text flex items-center justify-center flex-shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="type-overline uppercase text-brand-text block">
                Email
              </span>
              <a
                href="mailto:info@familydent.tj"
                className="type-body-sm break-words text-ink hover:text-brand-text"
              >
                info@familydent.tj
              </a>
            </div>
          </div>
        </Reveal>

        {/* Interactive Map Placeholder */}
        <Reveal
          className="bg-surface border border-rule rounded-3xl p-6 shadow-card flex flex-col items-center justify-center text-center relative overflow-hidden min-h-[300px]"
          data-ui-scheme="default"
        >
          <MapPin className="w-12 h-12 text-brand-text mb-3 animate-bounce" />
          <Heading level={3} variant="heading-5" className="text-ink mb-1">
            Клиника на карте Душанбе
          </Heading>
          <Text variant="body-sm" className="text-muted max-w-xs">
            Удобный подъезд и собственная бесплатная парковка для пациентов
            клиники.
          </Text>
        </Reveal>
      </Container>
    </div>
  );
}
