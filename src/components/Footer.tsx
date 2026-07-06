import { Link } from 'react-router-dom';
import * as styles from './Footer.styles';
import { Logo } from '@/components/Logo';
import { Instagram, Facebook, Mail, MapPin, Phone } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.brandCol}>
            <Link to="/" className={styles.logo} aria-label="FamilyDent — на главную">
              <Logo className="h-9 w-auto" />
            </Link>
            <p className={styles.tagline}>
              Создаём здоровые и красивые улыбки с использованием передовых технологий
              и искренней заботой о каждом пациенте.
            </p>
            <div className={styles.socials}>
              <a href="https://www.instagram.com/familydent.tj/" target="_blank" rel="noreferrer" aria-label="Instagram FamilyDent" className={styles.socialBtn}>
                <Instagram className="h-4 w-4" />
              </a>
              <a href="https://www.facebook.com/familydentdushanbe" target="_blank" rel="noreferrer" aria-label="Facebook FamilyDent" className={styles.socialBtn}>
                <Facebook className="h-4 w-4" />
              </a>
              <a href="mailto:familydent.tj@gmail.com" aria-label="Email FamilyDent" className={styles.socialBtn}>
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className={styles.navTitle}>Навигация</h4>
            <ul className={styles.navList}>
              {[
                { label: 'Главная', href: '/' },
                { label: 'Услуги', href: '/services' },
                { label: 'Врачи', href: '/doctors' },
                { label: 'Цены', href: '/pricing' },
                { label: 'О нас', href: '/about' },
                { label: 'Блог', href: '/blog' },
                { label: 'Контакты', href: '/contact' }
              ].map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className={styles.navLink}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className={styles.navTitle}>Услуги</h4>
            <ul className={styles.navList}>
              {[
                'Терапия',
                'Имплантация',
                'Ортодонтия',
                'Гигиена',
                'Отбеливание',
                'Детский приём'
              ].map((item) => (
                <li key={item}>
                  <Link to="/services" className={styles.navLink}>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className={styles.navTitle}>Контакты</h4>
            <div>
              <div className={styles.contactItem}>
                <MapPin className={styles.contactIcon} />
                <div className={styles.contactText}>
                  г. Душанбе, <br />
                  Улица Айни, 45<br />
                  Улица Немат Карабаева, 29
                </div>
              </div>
              <a href="tel:+992446606600" className={styles.contactItem}>
                <Phone className={styles.contactIcon} />
                <span className={styles.contactPhone}>+992 446 60 66 00</span>
              </a>
              <div className={styles.contactItem}>
                <Mail className={styles.contactIcon} />
                <div className={styles.contactText}>familydent.tj@gmail.com</div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <div className={styles.copyright}>
            © {currentYear} FamilyDent. Все права защищены.
          </div>
          <div className={styles.legal}>
            <span className={styles.legalLink}>Приватность</span>
            <span className={styles.legalLink}>Оферта</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
