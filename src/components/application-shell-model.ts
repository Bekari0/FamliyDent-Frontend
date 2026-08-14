export interface BreadcrumbItem {
  label: string;
  href?: string;
  current: boolean;
}

export interface AccountNavigationItem {
  label: string;
  href: "/profile" | "/profile/bookings" | "/doctor/dashboard" | "/admin";
}

const routeLabels: Record<string, string> = {
  about: "О клинике",
  services: "Услуги",
  doctors: "Наши врачи",
  reviews: "Отзывы",
  pricing: "Цены",
  blog: "Блог",
  contact: "Контакты",
  contacts: "Контакты",
  faq: "Вопросы и ответы",
  people: "Команда FamilyDent",
  results: "Результаты лечения",
  tourism: "Стоматологический туризм",
  academy: "Академия FamilyDent",
  "clinic-tour": "Экскурсия по клинике",
  equipment: "Оборудование",
  profile: "Личный кабинет",
  bookings: "Мои записи",
  records: "Медицинская карта",
  book: "Запись на прием",
  admin: "Панель управления",
};

const routableIntermediatePaths = new Set([
  "/about",
  "/services",
  "/doctors",
  "/blog",
  "/profile",
  "/profile/records",
  "/admin",
]);

export function buildBreadcrumbItems(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split("/").filter(Boolean);

  return [
    { label: "Главная", href: "/", current: false },
    ...segments.map((segment, index) => {
      const current = index === segments.length - 1;
      const href = `/${segments.slice(0, index + 1).join("/")}`;

      return {
        label: routeLabels[segment] ?? segment,
        href: !current && routableIntermediatePaths.has(href) ? href : undefined,
        current,
      };
    }),
  ];
}

export function getAccountNavigationItems({
  isDoctor,
  isAdmin,
}: {
  isDoctor: boolean;
  isAdmin: boolean;
}): AccountNavigationItem[] {
  const items: AccountNavigationItem[] = [
    { label: "Профиль", href: "/profile" },
    isDoctor
      ? { label: "Кабинет врача", href: "/doctor/dashboard" }
      : { label: "Мои записи", href: "/profile/bookings" },
  ];

  if (isAdmin) items.push({ label: "Админ-панель", href: "/admin" });

  return items;
}

export async function performShellLogout({
  closeMenu,
  logout,
  navigateHome,
}: {
  closeMenu: () => void;
  logout: () => Promise<void>;
  navigateHome: () => void;
}): Promise<void> {
  closeMenu();
  await logout();
  navigateHome();
}

export function performMobileNavigation({
  closeMenu,
}: {
  closeMenu: () => void;
}): void {
  closeMenu();
}

export function performRouteChange({
  closeMenu,
}: {
  closeMenu: () => void;
}): void {
  closeMenu();
}

export function performMobileBooking({
  closeMenu,
  openBooking,
}: {
  closeMenu: () => void;
  openBooking: () => void;
}): void {
  performMobileNavigation({ closeMenu });
  openBooking();
}
