const SITE_NAME = "FamilyDent";
const DEFAULT_SITE_URL = "https://familydent.tj";
const DEFAULT_DESCRIPTION =
  "FamilyDent - современная стоматологическая клиника в Душанбе: лечение, имплантация, ортодонтия, гигиена и онлайн-запись.";
const DEFAULT_IMAGE = "/offerImage.jpg";

type SeoConfig = {
  title: string;
  description?: string;
  image?: string;
  noindex?: boolean;
};

const pageSeo: Record<string, SeoConfig> = {
  "/": {
    title: "FamilyDent - стоматология в Душанбе",
    description: DEFAULT_DESCRIPTION,
  },
  "/about": {
    title: "О клинике FamilyDent",
    description:
      "Узнайте больше о стоматологической клинике FamilyDent, врачах, технологиях и подходе к лечению.",
  },
  "/contact": {
    title: "Контакты FamilyDent",
    description:
      "Адреса филиалов FamilyDent в Душанбе, телефон, email и карта проезда.",
  },
  "/faq": {
    title: "Вопросы и ответы - FamilyDent",
    description:
      "Ответы на частые вопросы о лечении зубов, записи на прием, гарантиях и услугах FamilyDent.",
  },
  "/reviews": {
    title: "Отзывы пациентов FamilyDent",
    description:
      "Отзывы пациентов о врачах, лечении и сервисе стоматологической клиники FamilyDent.",
  },
  "/pricing": {
    title: "Цены на стоматологические услуги FamilyDent",
    description:
      "Актуальные цены на лечение, имплантацию, ортодонтию, гигиену и другие услуги FamilyDent.",
  },
  "/services": {
    title: "Стоматологические услуги FamilyDent",
    description:
      "Лечение зубов, имплантация, ортодонтия, профессиональная гигиена, отбеливание и детская стоматология.",
  },
  "/doctors": {
    title: "Врачи FamilyDent",
    description:
      "Команда стоматологов FamilyDent: опытные врачи, специализации, образование и запись на прием.",
  },
  "/blog": {
    title: "Блог FamilyDent",
    description:
      "Полезные статьи о здоровье зубов, профилактике, лечении и современных стоматологических технологиях.",
  },
  "/book": {
    title: "Онлайн-запись в FamilyDent",
    description:
      "Выберите услугу, врача и удобное время для записи на прием в стоматологию FamilyDent.",
    noindex: true,
  },
  "/login": {
    title: "Вход в личный кабинет FamilyDent",
    noindex: true,
  },
  "/register": {
    title: "Регистрация в FamilyDent",
    noindex: true,
  },
  "/profile": {
    title: "Личный кабинет FamilyDent",
    noindex: true,
  },
  "/admin": {
    title: "Админ-панель FamilyDent",
    noindex: true,
  },
  "/doctor": {
    title: "Кабинет врача FamilyDent",
    noindex: true,
  },
};

function normalizeBaseUrl(value?: string) {
  return (value || DEFAULT_SITE_URL).replace(/\/+$/, "");
}

export function getSiteUrl() {
  return normalizeBaseUrl(import.meta.env.VITE_SITE_URL);
}

export function getSeoForPath(pathname: string): SeoConfig {
  const cleanPath = pathname.replace(/\/+$/, "") || "/";

  if (cleanPath.startsWith("/services/")) {
    return {
      title: "Услуга FamilyDent",
      description:
        "Подробная информация о стоматологической услуге FamilyDent, стоимости, длительности и записи на прием.",
    };
  }

  if (cleanPath.startsWith("/doctors/")) {
    return {
      title: "Врач FamilyDent",
      description:
        "Профиль врача FamilyDent: специализация, опыт, образование и онлайн-запись на прием.",
    };
  }

  if (cleanPath.startsWith("/blog/")) {
    return {
      title: "Статья FamilyDent",
      description:
        "Полезная статья FamilyDent о здоровье зубов, профилактике и современной стоматологии.",
    };
  }

  if (cleanPath.startsWith("/profile/")) return pageSeo["/profile"];
  if (cleanPath.startsWith("/admin/")) return pageSeo["/admin"];
  if (cleanPath.startsWith("/doctor/")) return pageSeo["/doctor"];

  return pageSeo[cleanPath] || {
    title: "Страница не найдена - FamilyDent",
    description: DEFAULT_DESCRIPTION,
    noindex: true,
  };
}

export function buildCanonical(pathname: string) {
  const cleanPath = pathname === "/" ? "" : pathname.replace(/\/+$/, "");
  return `${getSiteUrl()}${cleanPath}`;
}

export function getAbsoluteImageUrl(image = DEFAULT_IMAGE) {
  if (/^https?:\/\//i.test(image)) return image;
  return `${getSiteUrl()}${image.startsWith("/") ? image : `/${image}`}`;
}

export { SITE_NAME, DEFAULT_DESCRIPTION, DEFAULT_IMAGE };
