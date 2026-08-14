import { motion, useReducedMotion } from 'motion/react';
import { YMaps, Map, Placemark } from '@pbe/react-yandex-maps';
import { MapPin, Phone, Mail, Sparkles } from 'lucide-react';
import * as styles from './Contact.styles';
import { getHomeMotionProps } from './home/home-behavior';

const CLINIC_LOCATIONS = [
  { center: [38.567086, 68.808892], address: 'ул. Айни, 45', title: 'FamilyDent - Айни', phone: '+992 446 60 66 00' },
  { center: [38.539265, 68.773539], address: 'ул. Немат Карабаева, 29', title: 'FamilyDent - Карабаева', phone: '+992 446 60 66 00' },
];

const contactInfo = [
  { icon: Phone, title: 'Телефоны', value: '+992 446 60 66 00', description: 'Пн - Сб с 7:30 до 19:00', href: 'tel:+992446606600' },
  { icon: Mail, title: 'Email', value: 'familydent.tj@gmail.com', description: 'Для общих вопросов', href: 'mailto:familydent.tj@gmail.com' },
  { icon: MapPin, title: 'Филиалы', value: 'ул. Айни, 45 / ул. Н. Карабаева, 29', description: 'г. Душанбе', href: 'https://yandex.tj/maps/?text=FamilyDent%20%D0%94%D1%83%D1%88%D0%B0%D0%BD%D0%B1%D0%B5' },
];

export function Contact() {
  const shouldReduceMotion = Boolean(useReducedMotion());

  return (
    <section id="contacts" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.flexWrapper}>
          <div className={styles.contentContainer}>
            <div className={styles.badgeLine}>
              <div className={styles.badgeLineInner} />
              <span className={styles.badgeText}>Мир FamilyDent</span>
            </div>
            <motion.h2 {...getHomeMotionProps(shouldReduceMotion, { opacity: 0, y: 20 }, {})} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className={styles.title}>
              Ждем вас в наших <br /><span className={styles.titleSpan}>филиалах</span>
            </motion.h2>
            <motion.p {...getHomeMotionProps(shouldReduceMotion, { opacity: 0, y: 20 }, { delay: 0.1 })} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className={styles.desc}>
              Мы всегда на связи, чтобы помочь вам. Выберите удобный филиал и запишитесь на прием — ваша идеальная улыбка начинается за этими дверями.
            </motion.p>

            <div className={styles.infoGrid}>
              {contactInfo.map((info, index) => (
                <motion.a key={info.title} href={info.href} {...getHomeMotionProps(shouldReduceMotion, { opacity: 0, y: 20 }, { delay: index * 0.1 })} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className={styles.infoCard}>
                  <div className={styles.infoIconBox}><info.icon className="h-6 w-6" /></div>
                  <span className={styles.infoLabel}>{info.title}</span>
                  <span className={styles.infoValue}>{info.value}</span>
                  <span className={styles.infoSmall}>{info.description}</span>
                </motion.a>
              ))}
              <motion.div {...getHomeMotionProps(shouldReduceMotion, { opacity: 0, y: 20 }, { delay: 0.3 })} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className={styles.helperCard}>
                <div className="mb-4 flex items-center gap-3 text-primary">
                  <Sparkles className="h-5 w-5" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-white">Онлайн-помощник</span>
                </div>
                <p className="mb-6 max-w-[400px] text-sm leading-relaxed text-slate-400">Онлайн-консультант доступен 24/7 и готов ответить на вопросы о лечении, ценах и графике работы специалистов.</p>
                <a href="tel:+992446606600" className="inline-flex h-12 items-center justify-center rounded-xl bg-accent px-8 text-sm font-bold text-accent-ink shadow-lg transition-colors hover:bg-accent-2">Позвонить в клинику</a>
              </motion.div>
            </div>
          </div>

          <div className={styles.mapWrapper}>
            <YMaps query={{ lang: 'ru_RU' }}>
              <Map defaultState={{ center: [38.553205, 68.791215], zoom: 12, controls: [] }} width="100%" height="100%" options={{ autoFitToViewport: 'always', suppressMapOpenBlock: true, yandexMapDisablePoiInteractivity: true }}>
                {CLINIC_LOCATIONS.map((location) => (
                  <Placemark
                    key={location.title}
                    geometry={location.center}
                    properties={{
                      balloonContentHeader: `<div class="font-bold text-primary p-1">${location.title}</div>`,
                      balloonContentBody: `<div class="text-slate-600 text-sm px-1 pb-1">${location.address}</div>`,
                      balloonContentFooter: `<div class="font-bold text-slate-900 px-1 pb-1">${location.phone}</div>`,
                      hintContent: location.title,
                    }}
                    options={{ preset: 'islands#blueMedicalIcon', iconColor: '#C6A15B', hideIconOnBalloonOpen: false, balloonOffset: [3, -40] }}
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
