export interface NavigationItem {
  label: string;
  href: string;
}

export const PRIMARY_NAV_ITEMS = [
  { label: "\u0413\u043b\u0430\u0432\u043d\u0430\u044f", href: "/" },
  { label: "\u0423\u0441\u043b\u0443\u0433\u0438", href: "/services" },
  { label: "\u0412\u0440\u0430\u0447\u0438", href: "/doctors" },
  { label: "\u0420\u0435\u0437\u0443\u043b\u044c\u0442\u0430\u0442\u044b", href: "/results" },
  { label: "\u0426\u0435\u043d\u044b", href: "/pricing" },
  { label: "\u041a\u043e\u043d\u0442\u0430\u043a\u0442\u044b", href: "/contacts" },
] as const satisfies readonly NavigationItem[];

export const PEOPLE_NAV_ITEMS = [
  { label: "\u0412\u0440\u0430\u0447\u0438", href: "/doctors" },
  { label: "\u0412\u0441\u044f \u043a\u043e\u043c\u0430\u043d\u0434\u0430", href: "/people" },
] as const satisfies readonly NavigationItem[];

export const ABOUT_NAV_ITEMS = [
  { label: "\u041e \u043a\u043b\u0438\u043d\u0438\u043a\u0435", href: "/about" },
  { label: "\u042d\u043a\u0441\u043a\u0443\u0440\u0441\u0438\u044f \u043f\u043e \u043a\u043b\u0438\u043d\u0438\u043a\u0435", href: "/about/clinic-tour" },
  { label: "\u041e\u0431\u043e\u0440\u0443\u0434\u043e\u0432\u0430\u043d\u0438\u0435", href: "/about/equipment" },
] as const satisfies readonly NavigationItem[];

export const MORE_NAV_ITEMS = [
  { label: "\u041e\u0442\u0437\u044b\u0432\u044b", href: "/reviews" },
  { label: "\u0411\u043b\u043e\u0433", href: "/blog" },
  { label: "\u0422\u0443\u0440\u0438\u0437\u043c", href: "/tourism" },
  { label: "\u0410\u043a\u0430\u0434\u0435\u043c\u0438\u044f", href: "/academy" },
  { label: "FAQ", href: "/faq" },
] as const satisfies readonly NavigationItem[];

export const PUBLIC_ROUTE_PATHS = [
  "/", "/about", "/contact", "/contacts", "/faq", "/reviews",
  "/pricing", "/services", "/doctors", "/blog", "/people",
  "/about/clinic-tour", "/about/equipment", "/results", "/tourism",
  "/academy", "/profile", "/book", "/admin", "/doctor",
] as const;

const RENDERED_ROUTE_PATHS = [
  "/", "/about", "/contact", "/contacts", "/faq", "/reviews",
  "/pricing", "/services", "/doctors", "/blog", "/people",
  "/about/clinic-tour", "/about/equipment", "/results", "/tourism",
  "/academy", "/profile", "/book", "/admin", "/doctor",
] as const;

export function isKnownRoute(pathname: string): boolean {
  return PUBLIC_ROUTE_PATHS.some(
    (route) => pathname === route || (route !== "/" && pathname.startsWith(`${route}/`)),
  );
}

export function isRenderedRoute(pathname: string): boolean {
  return RENDERED_ROUTE_PATHS.some(
    (route) => pathname === route || (route !== "/" && pathname.startsWith(`${route}/`)),
  );
}
