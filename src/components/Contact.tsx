import { motion } from "motion/react";
import { YMaps, Map, Placemark } from "@pbe/react-yandex-maps";
import { MapPin, Phone, Mail, Sparkles } from "lucide-react";
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
      title: "Телефоны",
      value: "+992 446 60 66 00",
      description: "Ежедневно с 08:00 до 20:00",
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
      {/* Фоновые элементы */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -mr-48 -mt-48" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-accent/5 rounded-full blur-[80px] -ml-36 -mb-36" />

      <div className={styles.container}>
        <div className={styles.flexWrapper}>
          <div className={styles.contentContainer}>
            <div className={styles.badgeLine}>
              <div className={styles.badgeLineInner} />
              <span className={styles.badgeText}>Мир FamilyDent</span>
            </div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={styles.title}
            >
              Ждем вас в наших <br />
              <span className={styles.titleSpan}>филиалах</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className={styles.desc}
            >
              Мы всегда на связи, чтобы помочь вам. Выберите удобный филиал и
              запишитесь на прием — ваша идеальная улыбка начинается за этими
              дверями.
            </motion.p>

            <div className={styles.infoGrid}>
              {contactInfo.map((info, index) => (
                <motion.a
                  key={index}
                  href={info.href}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={styles.infoCard}
                >
                  <div className={styles.infoIconBox}>
                    <info.icon className="w-6 h-6" />
                  </div>
                  <span className={styles.infoLabel}>{info.title}</span>
                  <span className={styles.infoValue}>{info.value}</span>
                  <span className={styles.infoSmall}>{info.description}</span>
                </motion.a>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className={styles.helperCard}
              >
                <div className="flex items-center gap-3 mb-4 text-primary">
                  <Sparkles className="w-5 h-5" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-white">
                    Онлайн-помощник
                  </span>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-[400px]">
                  Онлайн-консультант доступен 24/7 и готов ответить на вопросы о
                  лечении, ценах и графике работы специалистов.
                </p>
                <button className="h-12 px-8 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary/90 transition-all active:scale-95 shadow-lg shadow-primary/20">
                  Открыть чат
                </button>
              </motion.div>
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
                      iconColor: "#C6A15B",
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


