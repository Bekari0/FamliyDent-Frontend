import { Link } from "react-router-dom";
import { Clock, Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";
import * as styles from "./Footer.styles";

const siteLinks = [
  { label: "Услуги клиники", href: "/services" },
  { label: "Наши врачи", href: "/doctors" },
  { label: "Цены", href: "/pricing" },
  { label: "О клинике", href: "/about" },
  { label: "Результаты лечения", href: "/results" },
  { label: "Экскурсия по клинике", href: "/about/clinic-tour" },
  { label: "Оборудование", href: "/about/equipment" },
] as const;

const patientLinks = [
  { label: "Стоматологический туризм", href: "/tourism" },
  { label: "Академия FamilyDent", href: "/academy" },
  { label: "Отзывы пациентов", href: "/reviews" },
  { label: "Полезные статьи", href: "/blog" },
  { label: "Частые вопросы", href: "/faq" },
] as const;

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.brandCol}>
            <Link to="/" className={styles.logo} aria-label="FamilyDent — на главную">
              <img src="/Logo.svg" alt="FamilyDent" className={styles.logoImage} />
            </Link>
            <p className={styles.tagline}>
              Современная семейная стоматология в Душанбе. Цифровая диагностика,
              передовые технологии и бережная забота о каждом пациенте.
            </p>
            <div className={styles.socials}>
              <a href="https://www.instagram.com/familydent.tj/" target="_blank" rel="noreferrer" aria-label="FamilyDent в Instagram" className={styles.socialBtn}><Instagram /></a>
              <a href="https://www.facebook.com/familydentdushanbe" target="_blank" rel="noreferrer" aria-label="FamilyDent в Facebook" className={styles.socialBtn}><Facebook /></a>
              <a href="mailto:familydent.tj@gmail.com" aria-label="Написать FamilyDent" className={styles.socialBtn}><Mail /></a>
            </div>
          </div>

          <div>
            <h2 className={styles.navTitle}>Разделы сайта</h2>
            <ul className={styles.navList}>
              {siteLinks.map((link) => <li key={link.href}><Link to={link.href} className={styles.navLink}>{link.label}</Link></li>)}
            </ul>
          </div>

          <div>
            <h2 className={styles.navTitle}>Пациентам</h2>
            <ul className={styles.navList}>
              {patientLinks.map((link) => <li key={link.href}><Link to={link.href} className={styles.navLink}>{link.label}</Link></li>)}
            </ul>
          </div>

          <div>
            <h2 className={styles.navTitle}>Адреса и контакты</h2>
            <div className={styles.contactList}>
              <div className={styles.contactItem}>
                <MapPin />
                <span>Улица Айни, 45<br />Улица Немат Карабаева, 29</span>
              </div>
              <a href="tel:+992446606600" className={styles.contactItem}><Phone /><span>+992 446 60 66 00</span></a>
              <a href="mailto:familydent.tj@gmail.com" className={styles.contactItem}><Mail /><span>familydent.tj@gmail.com</span></a>
              <div className={styles.contactItem}><Clock /><span>Пн–Сб: 7:30–19:00</span></div>
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <span>© {currentYear} FamilyDent. Все права защищены.</span>
          <div className={styles.legal}>
            <span>Политика конфиденциальности</span>
            <span aria-hidden="true">•</span>
            <span>Лицензия №12834-ТМ</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
