import { YMaps, Map, Placemark } from "@pbe/react-yandex-maps";
import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Calendar } from "lucide-react";
import * as styles from './Contact.styles';

export function Contact() {
  const CLINIC_LOCATIONS = [
    {
      center: [38.567086, 68.808892],
      address: "ул. Айни, 45",
      title: "FamilyDent - Айни",
      phone: "+992 446 60 66 00",
    },
    {
      center: [38.539265, 68.773539],
      address: "ул. Немат Карабаева, 29",
      title: "FamilyDent - Карабаева",
      phone: "+992 446 60 66 00",
    },
  ];

  const contactInfo = [
    {
      icon: Phone,
      title: "Телефон",
      value: "+992 446 60 66 00",
      description: "Пн – Сб с 7:30 до 19:00",
      href: "tel:+992446606600",
    },
    {
      icon: Mail,
      title: "Email",
      value: "familydent.tj@gmail.com",
      description: "Для общих вопросов",
      href: "mailto:familydent.tj@gmail.com",
    },
    {
      icon: MapPin,
      title: "Филиалы",
      value: "ул. Айни, 45 / ул. Н. Карабаева, 29",
      description: "г. Душанбе",
      href: "https://yandex.tj/maps/?text=FamilyDent%20%D0%94%D1%83%D1%88%D0%B0%D0%BD%D0%B1%D0%B5",
    },
  ];

  return (
    <section id="contacts" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.flexWrapper}>
          <div className={styles.contentContainer}>
            <p className={styles.kicker}>
              <span className={styles.kickerLine} aria-hidden="true" />
              Контакты
            </p>
            <h2 className={styles.title}>
              Ждём вас в наших филиалах
            </h2>
            <p className={styles.desc}>
              Мы всегда на связи, чтобы помочь вам. Выберите удобный филиал и
              запишитесь на приём — администратор подтвердит время в течение часа.
            </p>

            <div className={styles.infoList}>
              {contactInfo.map((info, index) => (
                <a key={index} href={info.href} className={styles.infoItem}>
                  <span className={styles.infoIconBox}>
                    <info.icon className="h-4 w-4" />
                  </span>
                  <span>
                    <span className={styles.infoLabel}>{info.title}</span>
                    <span className={styles.infoValue}>{info.value}</span>
                    <span className={styles.infoSmall}>{info.description}</span>
                  </span>
                </a>
              ))}
            </div>

            <div className={styles.ctaRow}>
              <Link to="/book" className={styles.ctaPrimary}>
                <Calendar className="h-4 w-4" />
                Записаться на приём
              </Link>
            </div>
          </div>

          <div className={styles.mapWrapper}>
            <YMaps query={{ lang: "ru_RU" }}>
              <Map
                defaultState={{
                  center: [38.553205, 68.791215],
                  zoom: 12,
                  controls: [],
                }}
                width="100%"
                height="100%"
                options={{
                  autoFitToViewport: "always",
                  suppressMapOpenBlock: true,
                  yandexMapDisablePoiInteractivity: true,
                }}
              >
                {CLINIC_LOCATIONS.map((loc, i) => (
                  <Placemark
                    key={i}
                    geometry={loc.center}
                    properties={{
                      balloonContentHeader: `<div class="font-bold text-primary p-1">${loc.title}</div>`,
                      balloonContentBody: `<div class="text-slate-600 text-sm px-1 pb-1">${loc.address}</div>`,
                      balloonContentFooter: `<div class="font-bold text-slate-900 px-1 pb-1">${loc.phone}</div>`,
                      hintContent: loc.title,
                    }}
                    options={{
                      preset: "islands#blueMedicalIcon",
                      iconColor: "#A97F4F",
                      hideIconOnBalloonOpen: false,
                      balloonOffset: [3, -40],
                    }}
                  />
                ))}
              </Map>
            </YMaps>
          </div>
        </div>
      </div>
    </section>
  );
}
