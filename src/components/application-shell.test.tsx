import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import {
  buildBreadcrumbItems,
  getAccountNavigationItems,
  performMobileBooking,
  performMobileNavigation,
  performRouteChange,
  performShellLogout,
} from "./application-shell-model";

const header = readFileSync(new URL("./Header.tsx", import.meta.url), "utf8");
const app = readFileSync(new URL("../App.tsx", import.meta.url), "utf8");
const breadcrumbs = readFileSync(new URL("./Breadcrumbs.tsx", import.meta.url), "utf8");
const headerStyles = readFileSync(new URL("../styles/components/header.css", import.meta.url), "utf8");

test("header retains auth and role actions while adopting grouped navigation", () => {
  assert.match(header, /useAuth\(\)/);
  assert.match(header, /handleLogout/);
  assert.match(header, /isAdmin/);
  assert.match(header, /isDoctor/);
  assert.match(header, /ABOUT_NAV_ITEMS/);
  assert.match(header, /MORE_NAV_ITEMS/);
  assert.match(header, /data-ui="reference-header"/);
});

test("application shell retains providers and operational widgets", () => {
  for (const contract of ["AuthProvider", "BookingProvider", "Seo", "Analytics", "ChatWidget", "Toaster"]) {
    assert.match(app, new RegExp(contract));
  }
});

test("mobile navigation remains named, closable, and keyboard visible", () => {
  assert.match(header, /<SheetTitle[^>]*>Меню<\/SheetTitle>/);
  assert.match(header, /onFocusCapture=\{\(\) => setIsVisible\(true\)\}/);
  assert.match(headerStyles, /\.header-nav-group\[data-popup-open\] \.header-nav-group-icon/);
});

test("breadcrumbs expose only routed intermediate destinations", () => {
  assert.deepEqual(
    buildBreadcrumbItems("/doctor/dashboard").map(({ href, current }) => ({ href, current })),
    [
      { href: "/", current: false },
      { href: undefined, current: false },
      { href: undefined, current: true },
    ],
  );

  assert.deepEqual(
    buildBreadcrumbItems("/about/clinic-tour").map(({ href, current }) => ({ href, current })),
    [
      { href: "/", current: false },
      { href: "/about", current: false },
      { href: undefined, current: true },
    ],
  );
});

test("account navigation reflects patient, doctor, and admin access", () => {
  assert.deepEqual(
    getAccountNavigationItems({ isDoctor: false, isAdmin: false }).map((item) => item.href),
    ["/profile", "/profile/bookings"],
  );
  assert.deepEqual(
    getAccountNavigationItems({ isDoctor: true, isAdmin: false }).map((item) => item.href),
    ["/profile", "/doctor/dashboard"],
  );
  assert.deepEqual(
    getAccountNavigationItems({ isDoctor: false, isAdmin: true }).map((item) => item.href),
    ["/profile", "/profile/bookings", "/admin"],
  );
});

test("current breadcrumb is announced as the current page", () => {
  assert.match(breadcrumbs, /aria-current="page"/);
});

test("logout closes mobile navigation before auth and navigation effects", async () => {
  const effects: string[] = [];

  await performShellLogout({
    closeMenu: () => effects.push("close"),
    logout: async () => { effects.push("logout"); },
    navigateHome: () => effects.push("navigate"),
  });

  assert.deepEqual(effects, ["close", "logout", "navigate"]);
});

test("mobile booking closes navigation before opening booking", () => {
  const effects: string[] = [];

  performMobileBooking({
    closeMenu: () => effects.push("close"),
    openBooking: () => effects.push("booking"),
  });

  assert.deepEqual(effects, ["close", "booking"]);
});

test("mobile link selection closes navigation", () => {
  let menuOpen = true;

  performMobileNavigation({ closeMenu: () => { menuOpen = false; } });

  assert.equal(menuOpen, false);
});

test("route changes close mobile navigation", () => {
  let menuOpen = true;

  performRouteChange({ closeMenu: () => { menuOpen = false; } });

  assert.equal(menuOpen, false);
});
